#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This script updates a file by making API calls to the running Next.js server

const API_BASE = 'http://localhost:3001/api/files';

async function updateFile(fileName, documentContent) {
  try {
    // First, we need to get the current team ID
    const getCurrentTeam = () => {
      // This will be handled client-side
      return 'default-team';
    };

    // Get all files to find the one we want
    const teamId = getCurrentTeam();
    const filesResponse = await fetch(`${API_BASE}?teamId=${teamId}`);
    const files = await filesResponse.json();

    const targetFile = files.find(f => f.fileName === fileName);

    if (!targetFile) {
      console.log(`File "${fileName}" not found. Creating new file...`);

      // Create new file
      const createResponse = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          teamId,
          document: documentContent
        })
      });

      const newFile = await createResponse.json();
      console.log('File created:', newFile);
      return newFile;
    }

    // Update existing file
    const updateResponse = await fetch(API_BASE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId: targetFile._id,
        document: documentContent
      })
    });

    const updatedFile = await updateResponse.json();
    console.log('File updated:', updatedFile);
    return updatedFile;

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Read document content from file
const contentFile = process.argv[2];
const fileName = process.argv[3] || 'test1';

if (!contentFile) {
  console.log('Usage: node update-file.js <content-file.json> [file-name]');
  process.exit(1);
}

const content = fs.readFileSync(contentFile, 'utf8');
updateFile(fileName, content);
