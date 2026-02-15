// localStorage CRUD for AI provider configuration
// Follows the same pattern as localdb.ts

export type AIProvider = 'deepseek' | 'openai';

export interface AISettings {
  provider: AIProvider;
  deepseekApiKey: string;
  openaiApiKey: string;
}

const STORAGE_KEY = 'erasor_ai_settings';

const DEFAULT_SETTINGS: AISettings = {
  provider: 'deepseek',
  deepseekApiKey: '',
  openaiApiKey: '',
};

export const getAISettings = (): AISettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveAISettings = (settings: AISettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const getActiveApiKey = (): { provider: AIProvider; apiKey: string } | null => {
  const settings = getAISettings();
  const apiKey = settings.provider === 'deepseek'
    ? settings.deepseekApiKey
    : settings.openaiApiKey;
  if (!apiKey) return null;
  return { provider: settings.provider, apiKey };
};
