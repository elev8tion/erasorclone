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
import { Loader2, Sparkles } from 'lucide-react'

interface AIGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  onOpenSettings: () => void;
}

const EXAMPLE_PROMPTS = [
  "Database schema for a blog with users, posts, comments, and tags",
  "Authentication flow with JWT tokens and refresh mechanism",
  "E-commerce microservices architecture",
  "CI/CD pipeline from code commit to production deployment",
  "REST API design for a task management app",
];

function AIGenerateDialog({ open, onOpenChange, fileId, onOpenSettings }: AIGenerateDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

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
    }
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
            Describe what you want to create. AI will generate both a document and diagram.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <textarea
            className="w-full min-h-[200px] max-h-[50vh] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y font-mono"
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

          {/* Example Prompts */}
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
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {getActiveApiKey()
              ? `Using ${getActiveApiKey()!.provider}`
              : 'No API key set'}
          </p>
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
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Generating...
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
