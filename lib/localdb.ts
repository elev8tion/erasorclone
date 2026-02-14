// Local storage database replacement for Convex
export interface FileType {
  _id: string;
  fileName: string;
  teamId: string;
  createdBy: string;
  archive: boolean;
  document: string;
  whiteboard: string;
  _creationTime?: number;
}

export interface TeamType {
  _id: string;
  teamName: string;
  createdBy: string;
  _creationTime?: number;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  image?: string;
  _creationTime?: number;
}

const STORAGE_KEYS = {
  FILES: 'erasor_files',
  TEAMS: 'erasor_teams',
  USERS: 'erasor_users',
  CURRENT_USER: 'erasor_current_user',
  CURRENT_TEAM: 'erasor_current_team',
};

// Helper to generate IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Storage helpers
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize default data
export const initializeLocalDB = () => {
  if (typeof window === 'undefined') return;

  // Create default user if none exists
  const users = getFromStorage<UserType>(STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const defaultUser: UserType = {
      _id: generateId(),
      name: 'Local User',
      email: 'local@erasor.app',
      _creationTime: Date.now(),
    };
    saveToStorage(STORAGE_KEYS.USERS, [defaultUser]);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
  }

  // Create default team if none exists
  const teams = getFromStorage<TeamType>(STORAGE_KEYS.TEAMS);
  if (teams.length === 0) {
    const currentUser = getCurrentUser();
    const defaultTeam: TeamType = {
      _id: generateId(),
      teamName: 'My Workspace',
      createdBy: currentUser?._id || '',
      _creationTime: Date.now(),
    };
    saveToStorage(STORAGE_KEYS.TEAMS, [defaultTeam]);
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM, JSON.stringify(defaultTeam));
  }
};

// User operations
export const getCurrentUser = (): UserType | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const createUser = (user: Omit<UserType, '_id' | '_creationTime'>): UserType => {
  const users = getFromStorage<UserType>(STORAGE_KEYS.USERS);
  const newUser: UserType = {
    ...user,
    _id: generateId(),
    _creationTime: Date.now(),
  };
  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);
  return newUser;
};

// Team operations
export const getCurrentTeam = (): TeamType | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_TEAM);
  return data ? JSON.parse(data) : null;
};

export const getTeam = (teamId: string): TeamType | null => {
  const teams = getFromStorage<TeamType>(STORAGE_KEYS.TEAMS);
  return teams.find(t => t._id === teamId) || null;
};

export const createTeam = (team: Omit<TeamType, '_id' | '_creationTime'>): TeamType => {
  const teams = getFromStorage<TeamType>(STORAGE_KEYS.TEAMS);
  const newTeam: TeamType = {
    ...team,
    _id: generateId(),
    _creationTime: Date.now(),
  };
  teams.push(newTeam);
  saveToStorage(STORAGE_KEYS.TEAMS, teams);
  return newTeam;
};

export const setCurrentTeam = (team: TeamType) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_TEAM, JSON.stringify(team));
};

// File operations
export const createFile = (file: Omit<FileType, '_id' | '_creationTime'>): FileType => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  const newFile: FileType = {
    ...file,
    _id: generateId(),
    _creationTime: Date.now(),
  };
  files.push(newFile);
  saveToStorage(STORAGE_KEYS.FILES, files);
  return newFile;
};

export const getFiles = (teamId: string): FileType[] => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  return files
    .filter(f => f.teamId === teamId && !f.archive)
    .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0));
};

export const getFileById = (fileId: string): FileType | null => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  return files.find(f => f._id === fileId) || null;
};

export const updateDocument = (fileId: string, document: string): FileType | null => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].document = document;
  saveToStorage(STORAGE_KEYS.FILES, files);
  return files[fileIndex];
};

export const updateWhiteboard = (fileId: string, whiteboard: string): FileType | null => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].whiteboard = whiteboard;
  saveToStorage(STORAGE_KEYS.FILES, files);
  return files[fileIndex];
};

export const deleteFile = (fileId: string): boolean => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  const filteredFiles = files.filter(f => f._id !== fileId);
  saveToStorage(STORAGE_KEYS.FILES, filteredFiles);
  return true;
};

export const archiveFile = (fileId: string): FileType | null => {
  const files = getFromStorage<FileType>(STORAGE_KEYS.FILES);
  const fileIndex = files.findIndex(f => f._id === fileId);

  if (fileIndex === -1) return null;

  files[fileIndex].archive = true;
  saveToStorage(STORAGE_KEYS.FILES, files);
  return files[fileIndex];
};
