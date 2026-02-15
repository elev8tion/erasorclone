// GitHub API helper: URL parsing, repo tree fetching, file content reading

interface ParsedGitHubURL {
  owner: string;
  repo: string;
  branch?: string;
}

export function parseGitHubURL(url: string): ParsedGitHubURL {
  // Handle various GitHub URL formats:
  // https://github.com/user/repo
  // https://github.com/user/repo.git
  // https://github.com/user/repo/tree/branch
  // github.com/user/repo
  let cleaned = url.trim();

  // Remove protocol
  cleaned = cleaned.replace(/^https?:\/\//, '');

  // Remove github.com prefix
  if (!cleaned.startsWith('github.com/')) {
    throw new Error('Not a valid GitHub URL. Expected format: https://github.com/owner/repo');
  }
  cleaned = cleaned.replace('github.com/', '');

  // Remove trailing .git
  cleaned = cleaned.replace(/\.git$/, '');

  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '');

  const parts = cleaned.split('/');
  if (parts.length < 2 || !parts[0] || !parts[1]) {
    throw new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
  }

  const owner = parts[0];
  const repo = parts[1];
  let branch: string | undefined;

  // Check for /tree/branch pattern
  if (parts.length >= 4 && parts[2] === 'tree') {
    branch = parts.slice(3).join('/');
  }

  return { owner, repo, branch };
}

interface GitHubRepoInfo {
  defaultBranch: string;
  name: string;
}

interface GitHubTreeEntry {
  path: string;
  type: 'blob' | 'tree';
  size?: number;
}

export async function fetchRepoInfo(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoInfo> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'erasor-clone-analyzer',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

  if (response.status === 404) {
    throw new Error(
      `Repository not found: ${owner}/${repo}. ` +
      (token ? 'Check that the token has access to this repo.' : 'If this is a private repo, provide a GitHub token.')
    );
  }

  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      throw new Error('GitHub API rate limit exceeded. Provide a GitHub token to increase the limit.');
    }
    throw new Error('GitHub API access forbidden. Check your token permissions.');
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    defaultBranch: data.default_branch,
    name: data.name,
  };
}

export async function fetchRepoTree(
  owner: string,
  repo: string,
  branch: string,
  token?: string
): Promise<GitHubTreeEntry[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'erasor-clone-analyzer',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repo tree: ${response.status} ${response.statusText}`);
  }

  const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
  if (rateLimitRemaining && parseInt(rateLimitRemaining) < 10) {
    console.warn(`GitHub API rate limit low: ${rateLimitRemaining} remaining`);
  }

  const data = await response.json();

  if (data.truncated) {
    console.warn('GitHub tree response was truncated (repo is very large)');
  }

  return (data.tree || [])
    .filter((entry: any) => entry.type === 'blob')
    .map((entry: any) => ({
      path: entry.path,
      type: entry.type,
      size: entry.size,
    }));
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  branch: string,
  filePath: string,
  token?: string
): Promise<string> {
  // Use raw.githubusercontent.com — doesn't count against REST API rate limit
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  const headers: Record<string, string> = {
    'User-Agent': 'erasor-clone-analyzer',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    // Non-critical: some files may not be fetchable
    return `(failed to fetch: ${response.status})`;
  }

  return await response.text();
}
