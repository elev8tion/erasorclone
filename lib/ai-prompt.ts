// System prompt for the LLM and response parser
// Defines the semantic JSON schema the LLM must return

export const SYSTEM_PROMPT = `You are a technical diagram and document generator. Given a user's description, you generate a structured JSON response with two parts: a document (for a text editor) and a diagram (for a whiteboard).

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no explanation.

The JSON must follow this exact schema:

{
  "document": {
    "title": "string - main title",
    "sections": [
      {
        "heading": "string - section heading",
        "content": "string - paragraph text (optional)",
        "items": ["string array - list items (optional)"],
        "type": "paragraph | list | checklist | ordered-list"
      }
    ]
  },
  "diagram": {
    "type": "erd | flowchart | architecture | sequence | generic",
    "title": "string - diagram title",
    "entities": [
      {
        "id": "string - unique identifier (e.g. 'users', 'auth_service')",
        "name": "string - display name",
        "fields": ["string array - properties/fields/details"]
      }
    ],
    "relationships": [
      {
        "from": "entity_id",
        "to": "entity_id",
        "label": "string - relationship label"
      }
    ]
  }
}

Guidelines:
- Generate 3-8 entities for most diagrams
- Each entity should have 2-6 fields
- Relationships should connect existing entity IDs
- Document sections should explain the diagram content
- Include at least one checklist section with key features
- For ERD: entities are tables, fields are columns
- For flowchart: entities are steps, relationships show flow
- For architecture: entities are services/components
- For sequence: entities are actors/services, relationships are messages
- Keep field text short (under 30 characters each)
- Entity names should be short (under 20 characters)`;

export interface AIDocumentSection {
  heading: string;
  content?: string;
  items?: string[];
  type: 'paragraph' | 'list' | 'checklist' | 'ordered-list';
}

export interface AIDocument {
  title: string;
  sections: AIDocumentSection[];
}

export interface AIEntity {
  id: string;
  name: string;
  fields: string[];
}

export interface AIRelationship {
  from: string;
  to: string;
  label: string;
}

export interface AIDiagram {
  type: 'erd' | 'flowchart' | 'architecture' | 'sequence' | 'generic';
  title: string;
  entities: AIEntity[];
  relationships: AIRelationship[];
}

export interface AIResponse {
  document: AIDocument;
  diagram: AIDiagram;
}

export function parseAIResponse(raw: string): AIResponse {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  if (!parsed.document || !parsed.diagram) {
    throw new Error('Response missing document or diagram');
  }
  if (!parsed.document.title || !Array.isArray(parsed.document.sections)) {
    throw new Error('Invalid document structure');
  }
  if (!parsed.diagram.title || !Array.isArray(parsed.diagram.entities)) {
    throw new Error('Invalid diagram structure');
  }

  // Ensure relationships array exists
  if (!Array.isArray(parsed.diagram.relationships)) {
    parsed.diagram.relationships = [];
  }

  // Ensure each entity has fields array
  for (const entity of parsed.diagram.entities) {
    if (!Array.isArray(entity.fields)) {
      entity.fields = [];
    }
  }

  return parsed as AIResponse;
}
