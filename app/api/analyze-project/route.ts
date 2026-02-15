import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { PROJECT_ANALYSIS_PROMPT, parseAIResponse } from '@/lib/ai-prompt';
import { buildWhiteboardData } from '@/lib/diagram-layout';
import { buildDocumentData } from '@/lib/document-builder';
import {
  shouldSkipFile,
  shouldSkipDir,
  selectTopFiles,
  buildFileTree,
  detectTechStack,
  formatProjectSummary,
  truncateToLines,
  getLanguage,
  type ProjectSummary,
} from '@/lib/project-analyzer';
import {
  parseGitHubURL,
  fetchRepoInfo,
  fetchRepoTree,
  fetchFileContent,
} from './github';

interface AnalyzeRequest {
  githubUrl?: string;
  localPath?: string;
  branch?: string;
  githubToken?: string;
  diagramQuestion: string;
  provider: 'deepseek' | 'openai';
  apiKey: string;
}

const PROVIDER_CONFIG = {
  deepseek: {
    url: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
};

const MAX_FILE_ENTRIES = 5000;
const MAX_KEY_FILES = 20;
const MAX_LINES_PER_FILE = 100;

// --- Local Folder Reading ---

async function readLocalProject(dirPath: string): Promise<{ filePaths: string[]; fileContents: Map<string, string> }> {
  // Validate path
  try {
    const stat = await fs.stat(dirPath);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${dirPath}`);
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    throw err;
  }

  const filePaths: string[] = [];
  const fileContents = new Map<string, string>();

  async function walk(currentPath: string, relativePath: string) {
    if (filePaths.length >= MAX_FILE_ENTRIES) return;

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (filePaths.length >= MAX_FILE_ENTRIES) break;

      const entryRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (!shouldSkipDir(entry.name)) {
          await walk(path.join(currentPath, entry.name), entryRelative);
        }
      } else if (entry.isFile()) {
        if (!shouldSkipFile(entryRelative)) {
          filePaths.push(entryRelative);
        }
      }
    }
  }

  await walk(dirPath, '');

  // Select top files and read their contents
  const topFiles = selectTopFiles(filePaths, MAX_KEY_FILES);

  for (const file of topFiles) {
    try {
      const fullPath = path.join(dirPath, file.path);
      const content = await fs.readFile(fullPath, 'utf-8');
      fileContents.set(file.path, truncateToLines(content, MAX_LINES_PER_FILE));
    } catch {
      fileContents.set(file.path, '(unable to read file)');
    }
  }

  return { filePaths, fileContents };
}

// --- GitHub Repo Reading ---

async function readGitHubProject(
  url: string,
  branch?: string,
  token?: string
): Promise<{ name: string; filePaths: string[]; fileContents: Map<string, string> }> {
  const parsed = parseGitHubURL(url);
  const repoInfo = await fetchRepoInfo(parsed.owner, parsed.repo, token);
  const useBranch = branch || parsed.branch || repoInfo.defaultBranch;

  const treeEntries = await fetchRepoTree(parsed.owner, parsed.repo, useBranch, token);

  // Filter out skipped files/dirs
  const filePaths = treeEntries
    .map(e => e.path)
    .filter(p => {
      const parts = p.split('/');
      // Check if any directory in the path should be skipped
      for (let i = 0; i < parts.length - 1; i++) {
        if (shouldSkipDir(parts[i])) return false;
      }
      return !shouldSkipFile(p);
    });

  const fileContents = new Map<string, string>();

  // Select top files and fetch their contents
  const topFiles = selectTopFiles(filePaths, MAX_KEY_FILES);

  // Fetch files in parallel (batches of 5 to be polite)
  const batchSize = 5;
  for (let i = 0; i < topFiles.length; i += batchSize) {
    const batch = topFiles.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (file) => {
        const content = await fetchFileContent(
          parsed.owner, parsed.repo, useBranch, file.path, token
        );
        return { path: file.path, content: truncateToLines(content, MAX_LINES_PER_FILE) };
      })
    );
    for (const result of results) {
      fileContents.set(result.path, result.content);
    }
  }

  return { name: repoInfo.name, filePaths, fileContents };
}

// --- API Route ---

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    // Validate inputs
    if (!body.githubUrl && !body.localPath) {
      return NextResponse.json(
        { error: 'Provide either a GitHub URL or a local folder path' },
        { status: 400 }
      );
    }
    if (!body.diagramQuestion?.trim()) {
      return NextResponse.json(
        { error: 'Please specify what kind of diagram to generate' },
        { status: 400 }
      );
    }
    if (!body.provider || !body.apiKey) {
      return NextResponse.json(
        { error: 'Missing AI provider or API key. Configure in AI Settings.' },
        { status: 400 }
      );
    }

    const config = PROVIDER_CONFIG[body.provider];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported provider: ${body.provider}` },
        { status: 400 }
      );
    }

    // Step 1: Fetch/read project files
    let projectName: string;
    let filePaths: string[];
    let fileContents: Map<string, string>;

    if (body.githubUrl) {
      const result = await readGitHubProject(body.githubUrl, body.branch, body.githubToken);
      projectName = result.name;
      filePaths = result.filePaths;
      fileContents = result.fileContents;
    } else {
      const localPath = body.localPath!;
      const result = await readLocalProject(localPath);
      projectName = path.basename(localPath);
      filePaths = result.filePaths;
      fileContents = result.fileContents;
    }

    if (filePaths.length === 0) {
      return NextResponse.json(
        { error: 'No files found in the project. Check the path or URL.' },
        { status: 400 }
      );
    }

    // Step 2: Build project summary
    const techStack = detectTechStack(fileContents);
    const fileTree = buildFileTree(filePaths);
    const keyFiles = Array.from(fileContents.entries()).map(([filePath, content]) => ({
      path: filePath,
      language: getLanguage(filePath),
      content,
    }));

    const summary: ProjectSummary = {
      name: projectName,
      techStack,
      fileTree,
      keyFiles,
    };

    const summaryText = formatProjectSummary(summary);

    // Step 3: Call LLM
    const userMessage = `${summaryText}\n\nDIAGRAM REQUEST: ${body.diagramQuestion.trim()}`;

    const llmResponse = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: PROJECT_ANALYSIS_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      let errorMessage = `${body.provider} API error (${llmResponse.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // Use default error message
      }
      return NextResponse.json({ error: errorMessage }, { status: llmResponse.status });
    }

    const llmData = await llmResponse.json();
    const rawContent = llmData.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'No content in LLM response' },
        { status: 502 }
      );
    }

    // Step 4: Parse and convert
    const aiResponse = parseAIResponse(rawContent);
    const document = buildDocumentData(aiResponse.document);
    const whiteboard = buildWhiteboardData(aiResponse.diagram);

    return NextResponse.json({
      success: true,
      document,
      whiteboard,
      meta: {
        projectName,
        techStack,
        filesAnalyzed: filePaths.length,
        keyFilesRead: keyFiles.length,
      },
    });
  } catch (error: any) {
    console.error('Project analysis error:', error);

    if (error instanceof SyntaxError || error.message?.includes('JSON')) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Try again or use a different diagram question.' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
