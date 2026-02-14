import { NextRequest, NextResponse } from 'next/server';
import { getFiles, createFile, getFileById, updateDocument } from '@/lib/localdb';

// GET all files or a specific file
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileId = searchParams.get('fileId');
  const teamId = searchParams.get('teamId');

  if (fileId) {
    const file = getFileById(fileId);
    return NextResponse.json(file);
  }

  if (teamId) {
    const files = getFiles(teamId);
    return NextResponse.json(files);
  }

  return NextResponse.json({ error: 'fileId or teamId required' }, { status: 400 });
}

// POST create a new file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, teamId, createdBy, document, whiteboard } = body;

    const newFile = createFile({
      fileName: fileName || 'Untitled',
      teamId: teamId || '',
      createdBy: createdBy || 'local@erasor.app',
      archive: false,
      document: document || '',
      whiteboard: whiteboard || ''
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}

// PUT update file document
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, document } = body;

    if (!fileId || !document) {
      return NextResponse.json({ error: 'fileId and document required' }, { status: 400 });
    }

    const updatedFile = updateDocument(fileId, document);

    if (!updatedFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(updatedFile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
