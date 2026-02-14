/**
 * Visualization Loader Utility
 *
 * This module provides type-safe functions for loading visualization data
 * into Erasor Clone, ensuring proper data structure validation.
 */

export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface ExcalidrawData {
  elements: ExcalidrawElement[];
  appState: {
    viewBackgroundColor: string;
    [key: string]: any;
  };
}

export interface EditorJSBlock {
  id: string;
  type: string;
  data: any;
}

export interface EditorJSData {
  blocks: EditorJSBlock[];
}

export interface VisualizationFile {
  _id: string;
  fileName: string;
  teamId: string;
  createdBy: string;
  archive: boolean;
  document: string; // JSON stringified EditorJSData
  whiteboard: string; // JSON stringified ExcalidrawData
  _creationTime: number;
}

/**
 * Validates Excalidraw data structure
 */
export function validateExcalidrawData(data: any): data is ExcalidrawData {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.elements)) return false;
  if (!data.appState || typeof data.appState !== 'object') return false;
  return true;
}

/**
 * Validates EditorJS data structure
 */
export function validateEditorJSData(data: any): data is EditorJSData {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.blocks)) return false;
  return true;
}

/**
 * Safely parse and validate Excalidraw whiteboard data
 */
export function parseWhiteboardData(whiteboardString: string): ExcalidrawData {
  try {
    const parsed = JSON.parse(whiteboardString);

    if (validateExcalidrawData(parsed)) {
      return parsed;
    }

    // Handle legacy format where only elements array was stored
    if (Array.isArray(parsed)) {
      console.warn('Legacy whiteboard format detected, converting...');
      return {
        elements: parsed,
        appState: { viewBackgroundColor: "#ffffff" }
      };
    }

    // Invalid format
    throw new Error('Invalid Excalidraw data structure');
  } catch (error) {
    console.error('Failed to parse whiteboard data:', error);
    return {
      elements: [],
      appState: { viewBackgroundColor: "#ffffff" }
    };
  }
}

/**
 * Safely parse and validate EditorJS document data
 */
export function parseDocumentData(documentString: string): EditorJSData {
  try {
    const parsed = JSON.parse(documentString);

    if (validateEditorJSData(parsed)) {
      return parsed;
    }

    throw new Error('Invalid EditorJS data structure');
  } catch (error) {
    console.error('Failed to parse document data:', error);
    return { blocks: [] };
  }
}

/**
 * Create a properly formatted visualization file
 */
export function createVisualizationFile(
  fileName: string,
  documentBlocks: EditorJSBlock[],
  diagramElements: ExcalidrawElement[],
  teamId: string,
  createdBy: string
): VisualizationFile {
  const now = Date.now();
  const id = `${now}_${Math.random().toString(36).substr(2, 9)}`;

  const editorData: EditorJSData = {
    blocks: documentBlocks
  };

  const excalidrawData: ExcalidrawData = {
    elements: diagramElements,
    appState: { viewBackgroundColor: "#ffffff" }
  };

  return {
    _id: id,
    fileName,
    teamId,
    createdBy,
    archive: false,
    document: JSON.stringify(editorData),
    whiteboard: JSON.stringify(excalidrawData),
    _creationTime: now
  };
}

/**
 * Validate a complete visualization file
 */
export function validateVisualizationFile(file: any): file is VisualizationFile {
  if (!file || typeof file !== 'object') return false;

  const required = ['_id', 'fileName', 'teamId', 'createdBy', 'document', 'whiteboard'];
  for (const field of required) {
    if (!(field in file)) return false;
  }

  // Validate document can be parsed
  try {
    const doc = JSON.parse(file.document);
    if (!validateEditorJSData(doc)) return false;
  } catch {
    return false;
  }

  // Validate whiteboard can be parsed
  try {
    const wb = JSON.parse(file.whiteboard);
    if (!validateExcalidrawData(wb)) return false;
  } catch {
    return false;
  }

  return true;
}

/**
 * Load visualization files into localStorage with validation
 */
export function loadVisualizationFiles(files: VisualizationFile[]): {
  loaded: number;
  failed: number;
  errors: string[];
} {
  const errors: string[] = [];
  let loaded = 0;
  let failed = 0;

  const validFiles = files.filter(file => {
    if (validateVisualizationFile(file)) {
      loaded++;
      return true;
    } else {
      failed++;
      errors.push(`Invalid file: ${file.fileName || 'unknown'}`);
      return false;
    }
  });

  const existingFiles = JSON.parse(localStorage.getItem('erasor_files') || '[]');
  const allFiles = [...existingFiles, ...validFiles];
  localStorage.setItem('erasor_files', JSON.stringify(allFiles));

  return { loaded, failed, errors };
}
