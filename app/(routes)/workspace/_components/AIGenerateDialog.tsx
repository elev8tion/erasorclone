"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getActiveApiKey } from '@/lib/ai-settings'
import { updateDocument, updateWhiteboard } from '@/lib/localdb'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Loader2, Sparkles, Github, FolderOpen, MessageSquare } from 'lucide-react'

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  onOpenSettings: () => void;
}

type TabId = 'prompt' | 'github' | 'local';

const EXAMPLE_PROMPTS = [
  "Database schema for a blog with users, posts, comments, and tags",
  "Authentication flow with JWT tokens and refresh mechanism",
  "E-commerce microservices architecture",
  "CI/CD pipeline from code commit to production deployment",
  "REST API design for a task management app",
];

const DIAGRAM_QUESTIONS = [
  "architecture overview",
  "data model / ERD",
  "API map",
  "component tree",
];

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'prompt', label: 'Prompt', icon: <MessageSquare className="h-3.5 w-3.5" /> },
  { id: 'github', label: 'GitHub Repo', icon: <Github className="h-3.5 w-3.5" /> },
  { id: 'local', label: 'Local Folder', icon: <FolderOpen className="h-3.5 w-3.5" /> },
];

function AIGenerateDialog({ open, onOpenChange, fileId, onOpenSettings }: AIGenerateDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>('prompt');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // GitHub tab state
  const [githubUrl, setGithubUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [diagramQuestion, setDiagramQuestion] = useState('');

  // Local folder tab state
  const [localPath, setLocalPath] = useState('');
  const [localDiagramQuestion, setLocalDiagramQuestion] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const activeKey = getActiveApiKey();
    if (!activeKey) {
      toast.error('No API key configured. Please set up your AI settings first.');
      onOpenChange(false);
      onOpenSettings();
      return;
    }

    setLoading(true);
    setLoadingStatus('Generating...');

    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider: activeKey.provider,
          apiKey: activeKey.apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // Save to localStorage
      updateDocument(fileId, data.document);
      updateWhiteboard(fileId, data.whiteboard);

      toast.success('Generated! Reloading to display...');
      onOpenChange(false);

      // Reload to re-render EditorJS and Excalidraw with new data
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleProjectGenerate = async () => {
    const isGithub = activeTab === 'github';
    const question = isGithub ? diagramQuestion : localDiagramQuestion;
    const source = isGithub ? githubUrl : localPath;

    if (!source.trim()) {
      toast.error(isGithub ? 'Please enter a GitHub URL' : 'Please enter a folder path');
      return;
    }
    if (!question.trim()) {
      toast.error('Please specify what kind of diagram to generate');
      return;
    }

    const activeKey = getActiveApiKey();
    if (!activeKey) {
      toast.error('No API key configured. Please set up your AI settings first.');
      onOpenChange(false);
      onOpenSettings();
      return;
    }

    setLoading(true);
    setLoadingStatus('Fetching project files...');

    try {
      const requestBody: Record<string, string> = {
        diagramQuestion: question.trim(),
        provider: activeKey.provider,
        apiKey: activeKey.apiKey,
      };

      if (isGithub) {
        requestBody.githubUrl = githubUrl.trim();
        if (githubBranch.trim()) requestBody.branch = githubBranch.trim();
        if (githubToken.trim()) requestBody.githubToken = githubToken.trim();
      } else {
        requestBody.localPath = localPath.trim();
      }

      setLoadingStatus('Analyzing project...');

      const response = await fetch('/api/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      setLoadingStatus('Generating diagram...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Save to localStorage
      updateDocument(fileId, data.document);
      updateWhiteboard(fileId, data.whiteboard);

      const meta = data.meta;
      toast.success(
        `Generated from ${meta?.projectName || 'project'}! ` +
        `${meta?.filesAnalyzed || 0} files analyzed. Reloading...`
      );
      onOpenChange(false);

      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze project. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'prompt') {
      handleGenerate();
    } else {
      handleProjectGenerate();
    }
  };

  const isGenerateDisabled = () => {
    if (loading) return true;
    if (activeTab === 'prompt') return !prompt.trim();
    if (activeTab === 'github') return !githubUrl.trim() || !diagramQuestion.trim();
    if (activeTab === 'local') return !localPath.trim() || !localDiagramQuestion.trim();
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            AI Generate
          </DialogTitle>
          <DialogDescription>
            Describe what you want, or point at a codebase to generate diagrams from real code.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !loading && setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              disabled={loading}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4 py-2">
          {/* Prompt Tab */}
          {activeTab === 'prompt' && (
            <>
              <textarea
                className="flex w-full min-h-[200px] max-h-[50vh] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-mono"
                placeholder={"Paste code, JSON, or describe what you want...\n\nExamples:\n• Paste a TypeScript file → \"Diagram the relationships between these types\"\n• Paste API routes → \"Map out this API architecture\"\n• Paste a SQL schema → \"Generate an ERD from this\""}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate();
                  }
                }}
              />
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Try an example:</p>
                <div className="flex flex-wrap gap-1.5">
                  {EXAMPLE_PROMPTS.map((example, i) => (
                    <button
                      key={i}
                      className="text-xs px-2 py-1 rounded-md border border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setPrompt(example)}
                      disabled={loading}
                    >
                      {example.length > 40 ? example.slice(0, 40) + '...' : example}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Repository URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://github.com/owner/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Branch (optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="main (default)"
                      value={githubBranch}
                      onChange={(e) => setGithubBranch(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      GitHub Token (optional)
                    </label>
                    <Input
                      type="password"
                      placeholder="For private repos"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    What to diagram?
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    placeholder="e.g. architecture overview, data model, API map..."
                    value={diagramQuestion}
                    onChange={(e) => setDiagramQuestion(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleProjectGenerate();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Diagram types:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DIAGRAM_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className="text-xs px-2 py-1 rounded-md border border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setDiagramQuestion(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Local Folder Tab */}
          {activeTab === 'local' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Folder Path
                  </label>
                  <Input
                    type="text"
                    className="font-mono"
                    placeholder="/Users/you/projects/my-app"
                    value={localPath}
                    onChange={(e) => setLocalPath(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Absolute path to a project on this machine
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    What to diagram?
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                    placeholder="e.g. architecture overview, data model, API map..."
                    value={localDiagramQuestion}
                    onChange={(e) => setLocalDiagramQuestion(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleProjectGenerate();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Diagram types:</p>
                <div className="flex flex-wrap gap-1.5">
                  {DIAGRAM_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className="text-xs px-2 py-1 rounded-md border border-input bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setLocalDiagramQuestion(q)}
                      disabled={loading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {loading && loadingStatus ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {loadingStatus}
              </span>
            ) : (
              getActiveApiKey()
                ? `Using ${getActiveApiKey()!.provider}`
                : 'No API key set'
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isGenerateDisabled()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  {activeTab === 'prompt' ? 'Generating...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIGenerateDialog
