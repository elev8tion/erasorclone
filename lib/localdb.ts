// Local storage database — single-user, no teams
export interface FileType {
  _id: string;
  fileName: string;
  archive: boolean;
  document: string;
  whiteboard: string;
  _creationTime?: number;
}

const STORAGE_KEY = 'erasor_files';

// Helper to generate IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Storage helpers
const getFromStorage = (): FileType[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = (data: FileType[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// No-op — nothing to seed
export const initializeLocalDB = () => {};

// File operations
export const createFile = (file: Omit<FileType, '_id' | '_creationTime'>): FileType => {
  const files = getFromStorage();
  const newFile: FileType = {
    ...file,
    _id: generateId(),
    _creationTime: Date.now(),
  };
  files.push(newFile);
  saveToStorage(files);
  return newFile;
};

export const getFiles = (): FileType[] => {
  const files = getFromStorage();
  return files
    .filter(f => !f.archive)
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
};

export const getFileById = (fileId: string): FileType | null => {
  const files = getFromStorage();
  return files.find(f => f._id === fileId) || null;
};

export const updateDocument = (fileId: string, document: string): FileType | null => {
  const files = getFromStorage();
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].document = document;
  saveToStorage(files);
  return files[fileIndex];
};

export const updateWhiteboard = (fileId: string, whiteboard: string): FileType | null => {
  const files = getFromStorage();
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].whiteboard = whiteboard;
  saveToStorage(files);
  return files[fileIndex];
};

export const deleteFile = (fileId: string): boolean => {
  const files = getFromStorage();
  const filteredFiles = files.filter(f => f._id !== fileId);
  saveToStorage(filteredFiles);
  return true;
};

export const archiveFile = (fileId: string): FileType | null => {
  const files = getFromStorage();
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].archive = true;
  saveToStorage(files);
  return files[fileIndex];
};
