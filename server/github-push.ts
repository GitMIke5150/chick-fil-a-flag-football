import { Octokit } from '@octokit/rest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const relativePath = relative(baseDir, fullPath);
    
    // Skip node_modules, .git, and other non-essential folders
    if (entry === 'node_modules' || entry === '.git' || entry === '.cache' || 
        entry === 'dist' || entry === '.replit' || entry === 'replit.nix' ||
        entry.startsWith('.') && entry !== '.gitignore') {
      continue;
    }
    
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }
  
  return files;
}

async function pushToGitHub(repoName: string) {
  console.log('Getting GitHub client...');
  const octokit = await getGitHubClient();
  
  // Get authenticated user
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  // Create new repository with README to initialize it
  console.log(`Creating repository: ${repoName}...`);
  let repo;
  try {
    const { data } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: 'Chick-Fil-A Flag Football Score Tracker - Voice-controlled play tracking with AI',
      private: false,
      auto_init: true, // This creates an initial commit with README
    });
    repo = data;
    console.log(`Repository created: ${repo.html_url}`);
    // Wait a moment for GitHub to initialize
    await new Promise(r => setTimeout(r, 2000));
  } catch (error: any) {
    if (error.status === 422) {
      console.log('Repository already exists, fetching it...');
      const { data } = await octokit.repos.get({
        owner: user.login,
        repo: repoName,
      });
      repo = data;
    } else {
      throw error;
    }
  }
  
  // Get all files
  const projectDir = process.cwd();
  const files = getAllFiles(projectDir);
  console.log(`Found ${files.length} files to push`);
  
  // Create tree entries
  const treeEntries: any[] = [];
  
  for (const filePath of files) {
    const fullPath = join(projectDir, filePath);
    try {
      const content = readFileSync(fullPath);
      const base64Content = content.toString('base64');
      
      // Create blob
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: repoName,
        content: base64Content,
        encoding: 'base64',
      });
      
      treeEntries.push({
        path: filePath,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
      
      console.log(`Uploaded: ${filePath}`);
    } catch (error) {
      console.log(`Skipped (binary/error): ${filePath}`);
    }
  }
  
  // Create tree
  console.log('Creating tree...');
  const { data: tree } = await octokit.git.createTree({
    owner: user.login,
    repo: repoName,
    tree: treeEntries,
  });
  
  // Create commit
  console.log('Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner: user.login,
    repo: repoName,
    message: 'Initial commit: Flag Football Score Tracker',
    tree: tree.sha,
  });
  
  // Update main branch reference
  console.log('Updating main branch...');
  try {
    await octokit.git.updateRef({
      owner: user.login,
      repo: repoName,
      ref: 'heads/main',
      sha: commit.sha,
      force: true,
    });
  } catch {
    // If main doesn't exist, create it
    await octokit.git.createRef({
      owner: user.login,
      repo: repoName,
      ref: 'refs/heads/main',
      sha: commit.sha,
    });
  }
  
  console.log(`\n✅ SUCCESS! Your code is now at: ${repo.html_url}`);
  return repo.html_url;
}

// Run it
const repoName = process.argv[2] || 'flag-football-tracker';
pushToGitHub(repoName)
  .then(url => console.log(`\nDone! Visit: ${url}`))
  .catch(err => console.error('Error:', err.message));
