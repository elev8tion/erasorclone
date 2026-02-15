import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, parseAIResponse } from '@/lib/ai-prompt';
import { buildWhiteboardData } from '@/lib/diagram-layout';
import { buildDocumentData } from '@/lib/document-builder';

interface GenerateRequest {
  prompt: string;
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

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.prompt || !body.provider || !body.apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, provider, apiKey' },
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

    // Call LLM API
    const llmResponse = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: body.prompt },
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

    // Parse the semantic JSON from the LLM
    const aiResponse = parseAIResponse(rawContent);

    // Convert to EditorJS + Excalidraw formats
    const document = buildDocumentData(aiResponse.document);
    const whiteboard = buildWhiteboardData(aiResponse.diagram);

    return NextResponse.json({
      success: true,
      document,
      whiteboard,
    });
  } catch (error: any) {
    console.error('AI generate error:', error);

    if (error instanceof SyntaxError || error.message?.includes('JSON')) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Try again or rephrase your prompt.' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
