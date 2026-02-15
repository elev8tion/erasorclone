// Core logic for analyzing project codebases
// Used by both GitHub repo and local folder analysis modes

import * as path from 'path';

// --- Skip Lists ---

export const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '__pycache__',
  'vendor', 'coverage', '.cache', 'target', 'venv', '.idea', '.vscode',
  '.turbo', '.nuxt', '.output', '.svelte-kit', '.parcel-cache',
]);

export const SKIP_FILES = new Set([
  '.DS_Store', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'Thumbs.db', '.gitattributes',
]);

const SKIP_FILE_PREFIXES = ['.env'];

const SKIP_EXTENSIONS = new Set([
  // images
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp', '.tiff',
  // fonts
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  // media
  '.mp3', '.mp4', '.avi', '.mov', '.wav', '.ogg', '.webm',
  // archives
  '.zip', '.tar', '.gz', '.rar', '.7z',
  // source maps & compiled
  '.map', '.min.js', '.min.css',
  // binary/data
  '.db', '.sqlite', '.bin', '.exe', '.dll', '.so', '.dylib',
  // pdf/office
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
]);

export function shouldSkipFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  if (SKIP_FILES.has(basename)) return true;
  if (SKIP_FILE_PREFIXES.some(p => basename.startsWith(p))) return true;
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP_EXTENSIONS.has(ext)) return true;
  return false;
}

export function shouldSkipDir(dirName: string): boolean {
  return SKIP_DIRS.has(dirName);
}

// --- File Importance Scoring ---

interface ScoredFile {
  path: string;
  score: number;
}

const CONFIG_FILES: Record<string, number> = {
  'package.json': 100,
  'tsconfig.json': 95,
  'Cargo.toml': 100,
  'go.mod': 100,
  'go.sum': 30,
  'pyproject.toml': 95,
  'requirements.txt': 85,
  'Gemfile': 95,
  'pom.xml': 95,
  'build.gradle': 95,
  'docker-compose.yml': 95,
  'docker-compose.yaml': 95,
  'Dockerfile': 90,
  'schema.prisma': 95,
  'prisma/schema.prisma': 95,
  '.env.example': 60,
  'next.config.js': 85,
  'next.config.mjs': 85,
  'next.config.ts': 85,
  'vite.config.ts': 80,
  'webpack.config.js': 75,
  'tailwind.config.ts': 70,
  'tailwind.config.js': 70,
};

const DIR_SCORES: Record<string, number> = {
  'types': 80,
  'models': 85,
  'entities': 80,
  'interfaces': 75,
  'schemas': 80,
  'controllers': 60,
  'routes': 55,
  'api': 55,
  'services': 60,
  'components': 45,
  'lib': 50,
  'utils': 40,
  'middleware': 55,
  'hooks': 45,
  'store': 50,
  'stores': 50,
  'pages': 50,
  'app': 50,
  'src': 40,
};

const ENTRY_POINTS = new Set([
  'index.ts', 'index.tsx', 'index.js', 'index.jsx',
  'main.ts', 'main.tsx', 'main.js', 'main.jsx',
  'app.ts', 'app.tsx', 'app.js', 'app.jsx',
  'server.ts', 'server.js',
]);

function scoreFile(filePath: string): number {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const parts = filePath.split('/').filter(Boolean);

  // Config files (check both basename and full path)
  if (CONFIG_FILES[basename] !== undefined) return CONFIG_FILES[basename];
  if (CONFIG_FILES[filePath] !== undefined) return CONFIG_FILES[filePath];

  // README
  if (basename.toLowerCase() === 'readme.md') return 75;

  // Test files
  if (basename.includes('.test.') || basename.includes('.spec.') || parts.includes('__tests__')) {
    return 20;
  }

  // CSS/style files
  if (['.css', '.scss', '.less', '.sass'].includes(ext)) return 15;

  // Config files (generic)
  if (basename.startsWith('.') && ['.js', '.json', '.yaml', '.yml'].includes(ext)) return 25;
  if (basename === '.eslintrc' || basename.startsWith('.eslintrc.')) return 15;
  if (basename === '.prettierrc' || basename.startsWith('.prettierrc.')) return 10;

  // Route/page/layout files (Next.js, etc.)
  if (['page.tsx', 'page.ts', 'page.jsx', 'page.js',
       'layout.tsx', 'layout.ts', 'layout.jsx', 'layout.js',
       'route.ts', 'route.js'].includes(basename)) {
    return 70;
  }

  // Entry points
  if (ENTRY_POINTS.has(basename)) {
    // Entry points in root or src are more important
    const depth = parts.length;
    return depth <= 2 ? 80 : 60;
  }

  // Score based on directory
  for (const part of parts) {
    if (DIR_SCORES[part] !== undefined) {
      return DIR_SCORES[part];
    }
  }

  // Default score for code files
  if (['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.rb', '.php'].includes(ext)) {
    return 35;
  }

  return 10;
}

export function selectTopFiles(filePaths: string[], limit: number = 20): ScoredFile[] {
  const scored: ScoredFile[] = filePaths
    .filter(p => !shouldSkipFile(p))
    .map(p => ({ path: p, score: scoreFile(p) }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// --- File Tree Formatting ---

export function buildFileTree(filePaths: string[], maxLines: number = 100): string {
  const lines: string[] = [];

  // Sort paths for consistent output
  const sorted = [...filePaths].sort();

  for (const filePath of sorted) {
    if (lines.length >= maxLines) {
      lines.push(`... and ${sorted.length - lines.length} more files`);
      break;
    }
    const depth = filePath.split('/').filter(Boolean).length - 1;
    const indent = '  '.repeat(depth);
    const basename = path.basename(filePath);
    lines.push(`${indent}${basename}`);
  }

  return lines.join('\n');
}

// --- Tech Stack Detection ---

export function detectTechStack(files: Map<string, string>): string[] {
  const stack: string[] = [];

  const pkgJson = files.get('package.json');
  if (pkgJson) {
    try {
      const pkg = JSON.parse(pkgJson);
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (allDeps['next']) stack.push('Next.js');
      else if (allDeps['react']) stack.push('React');
      if (allDeps['vue']) stack.push('Vue');
      if (allDeps['svelte'] || allDeps['@sveltejs/kit']) stack.push('Svelte');
      if (allDeps['express']) stack.push('Express');
      if (allDeps['fastify']) stack.push('Fastify');
      if (allDeps['nestjs'] || allDeps['@nestjs/core']) stack.push('NestJS');
      if (allDeps['prisma'] || allDeps['@prisma/client']) stack.push('Prisma');
      if (allDeps['drizzle-orm']) stack.push('Drizzle');
      if (allDeps['mongoose']) stack.push('MongoDB/Mongoose');
      if (allDeps['tailwindcss']) stack.push('Tailwind CSS');
      if (allDeps['graphql'] || allDeps['@apollo/server']) stack.push('GraphQL');
      if (allDeps['trpc'] || allDeps['@trpc/server']) stack.push('tRPC');
    } catch {
      // ignore parse errors
    }
  }

  // Detect from file existence
  const fileNames = Array.from(files.keys());
  if (fileNames.some(f => f === 'tsconfig.json' || f.endsWith('.ts') || f.endsWith('.tsx'))) {
    stack.push('TypeScript');
  }
  if (fileNames.some(f => f === 'Cargo.toml')) stack.push('Rust');
  if (fileNames.some(f => f === 'go.mod')) stack.push('Go');
  if (fileNames.some(f => f.endsWith('.py') || f === 'pyproject.toml' || f === 'requirements.txt')) {
    stack.push('Python');
  }
  if (fileNames.some(f => f.endsWith('.java') || f === 'pom.xml' || f === 'build.gradle')) {
    stack.push('Java');
  }
  if (fileNames.some(f => f === 'Dockerfile' || f === 'docker-compose.yml' || f === 'docker-compose.yaml')) {
    stack.push('Docker');
  }

  // Deduplicate
  return Array.from(new Set(stack));
}

// --- Project Summary Builder ---

export interface ProjectSummary {
  name: string;
  techStack: string[];
  fileTree: string;
  keyFiles: { path: string; language: string; content: string }[];
}

const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'typescript', '.tsx': 'typescript', '.js': 'javascript', '.jsx': 'javascript',
  '.py': 'python', '.go': 'go', '.rs': 'rust', '.java': 'java', '.rb': 'ruby',
  '.php': 'php', '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml',
  '.toml': 'toml', '.md': 'markdown', '.sql': 'sql', '.graphql': 'graphql',
  '.prisma': 'prisma', '.html': 'html', '.css': 'css', '.scss': 'scss',
};

export function formatProjectSummary(summary: ProjectSummary): string {
  const lines: string[] = [];

  lines.push(`PROJECT: ${summary.name}`);
  lines.push(`TECH STACK: ${summary.techStack.length > 0 ? summary.techStack.join(', ') : 'Unknown'}`);
  lines.push('');
  lines.push('FILE TREE:');
  lines.push(summary.fileTree);
  lines.push('');
  lines.push('KEY FILES:');

  for (const file of summary.keyFiles) {
    lines.push(`--- ${file.path} (${file.language}) ---`);
    lines.push(file.content);
    lines.push('--- end ---');
    lines.push('');
  }

  return lines.join('\n');
}

export function truncateToLines(content: string, maxLines: number = 100): string {
  const lines = content.split('\n');
  if (lines.length <= maxLines) return content;
  return lines.slice(0, maxLines).join('\n') + `\n... (truncated, ${lines.length - maxLines} more lines)`;
}

export function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return EXT_TO_LANG[ext] || 'text';
}
