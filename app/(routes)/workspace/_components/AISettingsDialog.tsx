"use client"

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAISettings, saveAISettings, AIProvider } from '@/lib/ai-settings'
import { toast } from 'sonner'

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AISettingsDialog({ open, onOpenChange }: AISettingsDialogProps) {
  const [provider, setProvider] = useState<AIProvider>('deepseek');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  useEffect(() => {
    if (open) {
      const settings = getAISettings();
      setProvider(settings.provider);
      setDeepseekKey(settings.deepseekApiKey);
      setOpenaiKey(settings.openaiApiKey);
    }
  }, [open]);

  const handleSave = () => {
    saveAISettings({
      provider,
      deepseekApiKey: deepseekKey,
      openaiApiKey: openaiKey,
    });
    toast.success('AI settings saved');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider and API keys for diagram generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Provider</label>
            <div className="flex gap-2">
              <Button
                variant={provider === 'deepseek' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProvider('deepseek')}
                className={provider === 'deepseek' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                DeepSeek
              </Button>
              <Button
                variant={provider === 'openai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProvider('openai')}
                className={provider === 'openai' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                OpenAI
              </Button>
            </div>
          </div>

          {/* DeepSeek API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              DeepSeek API Key
              {provider === 'deepseek' && (
                <span className="ml-2 text-xs text-blue-400">(active)</span>
              )}
            </label>
            <Input
              type="password"
              placeholder="sk-..."
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Uses deepseek-chat model. Get a key at platform.deepseek.com
            </p>
          </div>

          {/* OpenAI API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              OpenAI API Key
              {provider === 'openai' && (
                <span className="ml-2 text-xs text-green-400">(active)</span>
              )}
            </label>
            <Input
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Uses gpt-4o-mini model. Get a key at platform.openai.com
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AISettingsDialog
