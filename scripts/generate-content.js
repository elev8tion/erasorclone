#!/usr/bin/env node

/**
 * Content Generation Helper for Erasor Clone
 *
 * This script helps Claude generate both document and diagram content
 * from natural language prompts and inject them into the UI.
 *
 * Usage:
 *   node scripts/generate-content.js <fileName> "<prompt>"
 *
 * Example:
 *   node scripts/generate-content.js "my-project" "Create an API documentation with endpoints"
 */

const fs = require('fs');
const path = require('path');

// Helper functions to generate EditorJS blocks
const generators = {
  header: (text, level = 1) => ({
    id: `header_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'header',
    data: { text, level }
  }),

  paragraph: (text) => ({
    id: `para_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'paragraph',
    data: { text }
  }),

  list: (items, style = 'unordered') => ({
    id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'list',
    data: { style, items }
  }),

  checklist: (items) => ({
    id: `checklist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'checklist',
    data: {
      items: items.map(text => ({ text, checked: false }))
    }
  }),

  warning: (title, message) => ({
    id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'warning',
    data: { title, message }
  })
};

// Helper functions to generate Excalidraw elements
const diagramGenerators = {
  rectangle: (x, y, width, height, isHeader = false) => ({
    type: "rectangle",
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    id: `rect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    angle: 0,
    x, y,
    strokeColor: isHeader ? "#1971c2" : "#1e1e1e",
    backgroundColor: isHeader ? "#a5d8ff" : "#ffffff",
    width, height,
    seed: Math.floor(Math.random() * 1000000),
    groupIds: [],
    frameId: null,
    roundness: { type: 2 },
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false
  }),

  text: (x, y, text, fontSize = 16) => ({
    type: "text",
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    angle: 0,
    x, y,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    width: 200,
    height: fontSize + 10,
    seed: Math.floor(Math.random() * 1000000),
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    fontSize,
    fontFamily: 1,
    text,
    textAlign: "left",
    verticalAlign: "top",
    containerId: null,
    originalText: text,
    lineHeight: 1.25
  }),

  arrow: (startX, startY, endX, endY) => ({
    type: "arrow",
    version: 1,
    versionNonce: Math.floor(Math.random() * 1000000),
    isDeleted: false,
    id: `arrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    angle: 0,
    x: startX,
    y: startY,
    strokeColor: "#1971c2",
    backgroundColor: "transparent",
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
    seed: Math.floor(Math.random() * 1000000),
    groupIds: [],
    frameId: null,
    roundness: { type: 2 },
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    startBinding: null,
    endBinding: null,
    lastCommittedPoint: null,
    startArrowhead: null,
    endArrowhead: "arrow",
    points: [[0, 0], [endX - startX, endY - startY]]
  })
};

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generators,
    diagramGenerators
  };
}

// CLI usage
if (require.main === module) {
  const fileName = process.argv[2];
  const prompt = process.argv[3];

  if (!fileName || !prompt) {
    console.log('Usage: node generate-content.js <fileName> "<prompt>"');
    console.log('Example: node generate-content.js "my-api" "Create REST API documentation"');
    process.exit(1);
  }

  console.log(`Generating content for: ${fileName}`);
  console.log(`Prompt: ${prompt}`);
  console.log('\nGenerators available:');
  console.log('- generators.header(text, level)');
  console.log('- generators.paragraph(text)');
  console.log('- generators.list(items, style)');
  console.log('- generators.checklist(items)');
  console.log('- generators.warning(title, message)');
  console.log('\nDiagram generators available:');
  console.log('- diagramGenerators.rectangle(x, y, width, height, isHeader)');
  console.log('- diagramGenerators.text(x, y, text, fontSize)');
  console.log('- diagramGenerators.arrow(startX, startY, endX, endY)');
}
