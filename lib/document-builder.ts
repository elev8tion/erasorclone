// Converts semantic document description into EditorJS blocks
// Extracted from import-visualizations/route.ts generators

import { AIDocument } from './ai-prompt';

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// EditorJS block generators
function header(text: string, level: number = 2) {
  return {
    id: generateId(),
    type: "header",
    data: { text, level },
  };
}

function paragraph(text: string) {
  return {
    id: generateId(),
    type: "paragraph",
    data: { text },
  };
}

function list(items: string[], style: string = "unordered") {
  return {
    id: generateId(),
    type: "list",
    data: { style, items },
  };
}

function checklist(items: string[]) {
  return {
    id: generateId(),
    type: "checklist",
    data: {
      items: items.map((text) => ({ text, checked: false })),
    },
  };
}

export function buildDocumentBlocks(doc: AIDocument): any[] {
  const blocks: any[] = [];

  // Title
  blocks.push(header(doc.title, 1));

  for (const section of doc.sections) {
    // Section heading
    blocks.push(header(section.heading, 2));

    // Content paragraph (if provided)
    if (section.content) {
      blocks.push(paragraph(section.content));
    }

    // Items (if provided)
    if (section.items && section.items.length > 0) {
      switch (section.type) {
        case 'checklist':
          blocks.push(checklist(section.items));
          break;
        case 'ordered-list':
          blocks.push(list(section.items, 'ordered'));
          break;
        case 'list':
          blocks.push(list(section.items, 'unordered'));
          break;
        case 'paragraph':
        default:
          // If type is paragraph but items exist, render as list
          if (section.items.length > 1) {
            blocks.push(list(section.items, 'unordered'));
          } else {
            blocks.push(paragraph(section.items[0]));
          }
          break;
      }
    }
  }

  return blocks;
}

export function buildDocumentData(doc: AIDocument): string {
  const blocks = buildDocumentBlocks(doc);
  return JSON.stringify({ blocks });
}
