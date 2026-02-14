// Pawns Plus Backend Visualization Generator
// Run this in browser console on localhost:3000/dashboard

// Helper to generate IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Get current user and team
const getCurrentUser = () => {
  const data = localStorage.getItem('erasor_current_user');
  return data ? JSON.parse(data) : null;
};

const getCurrentTeam = () => {
  const data = localStorage.getItem('erasor_current_team');
  return data ? JSON.parse(data) : null;
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

// Create file in localStorage
const createFile = (fileName, documentBlocks, diagramElements) => {
  const user = getCurrentUser();
  const team = getCurrentTeam();

  if (!user || !team) {
    console.error('User or team not found. Please reload the page.');
    return;
  }

  const files = JSON.parse(localStorage.getItem('erasor_files') || '[]');

  const newFile = {
    _id: generateId(),
    fileName,
    teamId: team._id,
    createdBy: user._id,
    archive: false,
    document: JSON.stringify({ blocks: documentBlocks }),
    whiteboard: JSON.stringify({ elements: diagramElements, appState: { viewBackgroundColor: "#ffffff" } }),
    _creationTime: Date.now()
  };

  files.push(newFile);
  localStorage.setItem('erasor_files', JSON.stringify(files));

  console.log(`✅ Created: ${fileName}`);
  return newFile._id;
};

console.log('🚀 Pawns Plus Visualization Generator Loaded');
console.log('Available functions: createFile, generators, diagramGenerators');
