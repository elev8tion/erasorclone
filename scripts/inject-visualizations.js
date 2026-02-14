#!/usr/bin/env node

/**
 * Server-side script to generate Pawns Plus visualization files
 * and create a JSON file that can be imported into Erasor Clone
 */

const fs = require('fs');
const path = require('path');

// Helper to generate IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default user and team for local storage
const defaultUser = {
  _id: generateId(),
  name: 'Local User',
  email: 'local@erasor.app',
  _creationTime: Date.now()
};

const defaultTeam = {
  _id: generateId(),
  teamName: 'My Workspace',
  createdBy: defaultUser._id,
  _creationTime: Date.now()
};

// EditorJS generators
const generators = {
  header: (text, level = 2) => ({
    id: generateId(),
    type: "header",
    data: { text, level }
  }),

  paragraph: (text) => ({
    id: generateId(),
    type: "paragraph",
    data: { text }
  }),

  list: (items, style = "unordered") => ({
    id: generateId(),
    type: "list",
    data: { style, items }
  }),

  checklist: (items) => ({
    id: generateId(),
    type: "checklist",
    data: {
      items: items.map(text => ({ text, checked: false }))
    }
  }),

  warning: (title, message) => ({
    id: generateId(),
    type: "warning",
    data: { title, message }
  })
};

// Excalidraw diagram generators
const diagramGenerators = {
  rectangle: (x, y, width, height, fillStyle = "hachure") => ({
    id: generateId(),
    type: "rectangle",
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
    locked: false
  }),

  text: (x, y, text, fontSize = 20) => ({
    id: generateId(),
    type: "text",
    x, y,
    width: text.length * fontSize * 0.6,
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
    text,
    fontSize,
    fontFamily: 1,
    textAlign: "left",
    verticalAlign: "top",
    baseline: fontSize,
    containerId: null,
    originalText: text,
    lineHeight: 1.25
  }),

  arrow: (startX, startY, endX, endY) => ({
    id: generateId(),
    type: "arrow",
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
    endArrowhead: "arrow"
  })
};

// Create file object
const createFileObject = (fileName, documentBlocks, diagramElements) => ({
  _id: generateId(),
  fileName,
  teamId: defaultTeam._id,
  createdBy: defaultUser._id,
  archive: false,
  document: JSON.stringify({ blocks: documentBlocks }),
  whiteboard: JSON.stringify({ elements: diagramElements, appState: { viewBackgroundColor: "#ffffff" } }),
  _creationTime: Date.now()
});

// Load all visualization generators
const visualizations = [];

// 1. Database ERD
console.log('📊 Generating Database ERD...');
const dbErdBlocks = require('./1-database-erd-data').documentBlocks(generators);
const dbErdElements = require('./1-database-erd-data').diagramElements(diagramGenerators);
visualizations.push(createFileObject("1. Database Schema ERD", dbErdBlocks, dbErdElements));

// Continue for all 8 files...
// (We'll need to create data files for each)

// Export to JSON file
const outputData = {
  users: [defaultUser],
  teams: [defaultTeam],
  files: visualizations,
  currentUser: defaultUser,
  currentTeam: defaultTeam
};

const outputPath = path.join(__dirname, 'pawns-plus-data.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log(`\n✅ Generated ${visualizations.length} visualization files`);
console.log(`📁 Saved to: ${outputPath}`);
console.log('\n📋 Next steps:');
console.log('1. Copy the contents of pawns-plus-data.json');
console.log('2. Open browser console at http://localhost:3001/dashboard');
console.log('3. Run this code:');
console.log('   const data = <paste JSON here>;');
console.log('   localStorage.setItem("erasor_users", JSON.stringify(data.users));');
console.log('   localStorage.setItem("erasor_teams", JSON.stringify(data.teams));');
console.log('   localStorage.setItem("erasor_files", JSON.stringify(data.files));');
console.log('   localStorage.setItem("erasor_current_user", JSON.stringify(data.currentUser));');
console.log('   localStorage.setItem("erasor_current_team", JSON.stringify(data.currentTeam));');
console.log('   location.reload();');
