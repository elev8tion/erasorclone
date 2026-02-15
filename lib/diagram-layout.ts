// Converts semantic diagram description into positioned Excalidraw elements
// Grid layout algorithm with auto-arrows between entities

import { AIDiagram } from './ai-prompt';

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Excalidraw element generators (extracted from import-visualizations/route.ts)
function rectangle(x: number, y: number, width: number, height: number, fillStyle: string = "solid") {
  return {
    id: generateId(),
    type: "rectangle" as const,
    x, y, width, height,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: fillStyle === "solid" ? "#a5d8ff" : "transparent",
    fillStyle,
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    roundness: { type: 3, value: 8 },
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    groupIds: [],
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
  };
}

function text(x: number, y: number, content: string, fontSize: number = 20) {
  return {
    id: generateId(),
    type: "text" as const,
    x, y,
    width: content.length * fontSize * 0.6,
    height: fontSize * 1.2,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    groupIds: [],
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    text: content,
    fontSize,
    fontFamily: 1,
    textAlign: "left",
    verticalAlign: "top",
    baseline: fontSize,
    containerId: null,
    originalText: content,
    lineHeight: 1.25,
  };
}

function arrow(startX: number, startY: number, endX: number, endY: number) {
  return {
    id: generateId(),
    type: "arrow" as const,
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "hachure",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    seed: Math.floor(Math.random() * 1000000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    groupIds: [],
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    points: [[0, 0], [endX - startX, endY - startY]],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
  };
}

// Layout constants
const ENTITY_PADDING = 20;
const FIELD_HEIGHT = 22;
const HEADER_HEIGHT = 35;
const ENTITY_WIDTH = 220;
const GAP_X = 80;
const GAP_Y = 60;
const TITLE_Y = 20;
const GRID_START_Y = 80;

export function layoutDiagram(diagram: AIDiagram): any[] {
  const elements: any[] = [];

  // Title
  elements.push(text(50, TITLE_Y, diagram.title, 28));

  const entityCount = diagram.entities.length;
  const cols = Math.ceil(Math.sqrt(entityCount));

  // Track entity positions for arrow drawing
  const entityPositions: Record<string, { x: number; y: number; width: number; height: number }> = {};

  diagram.entities.forEach((entity, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const entityHeight = HEADER_HEIGHT + entity.fields.length * FIELD_HEIGHT + ENTITY_PADDING;
    const x = 50 + col * (ENTITY_WIDTH + GAP_X);
    const y = GRID_START_Y + row * (200 + GAP_Y);

    entityPositions[entity.id] = { x, y, width: ENTITY_WIDTH, height: entityHeight };

    // Entity rectangle
    elements.push(rectangle(x, y, ENTITY_WIDTH, entityHeight));

    // Entity name (header)
    elements.push(text(x + 10, y + 8, entity.name, 18));

    // Fields
    entity.fields.forEach((field, fieldIndex) => {
      const fieldY = y + HEADER_HEIGHT + fieldIndex * FIELD_HEIGHT;
      elements.push(text(x + 10, fieldY, `• ${field}`, 13));
    });
  });

  // Draw arrows for relationships
  diagram.relationships.forEach((rel) => {
    const from = entityPositions[rel.from];
    const to = entityPositions[rel.to];
    if (!from || !to) return;

    // Arrow from center-right of source to center-left of target
    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    let endX = to.x;
    let endY = to.y + to.height / 2;

    // If entities are in the same column, draw from bottom to top
    if (Math.abs(from.x - to.x) < ENTITY_WIDTH) {
      const fromBelow = from.y < to.y;
      const sourceX = from.x + from.width / 2;
      const sourceY = fromBelow ? from.y + from.height : from.y;
      endX = to.x + to.width / 2;
      endY = fromBelow ? to.y : to.y + to.height;
      elements.push(arrow(sourceX, sourceY, endX, endY));
    } else {
      elements.push(arrow(startX, startY, endX, endY));
    }

    // Relationship label at midpoint
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 15;
    if (rel.label) {
      elements.push(text(midX, midY, rel.label, 12));
    }
  });

  return elements;
}

export function buildWhiteboardData(diagram: AIDiagram): string {
  const elements = layoutDiagram(diagram);
  return JSON.stringify({
    elements,
    appState: { viewBackgroundColor: "#ffffff" },
  });
}
