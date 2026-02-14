# Visualization Workflow Guide

## Overview

This guide documents the reusable workflow for creating automated visualization imports in Erasor Clone. Use this process to create comprehensive documentation visualizations for any project.

## ⚠️ Important: Data Structure Requirements

**Always use the `createVisualizationFile()` helper function** from `/lib/visualization-loader.ts` to ensure proper data structure:

```typescript
import { createVisualizationFile } from '@/lib/visualization-loader';

const file = createVisualizationFile(
  "File Name",
  documentBlocks,  // EditorJS blocks array
  diagramElements, // Excalidraw elements array
  teamId,
  createdBy
);
```

This prevents common errors:
- ✅ Ensures `whiteboard` contains `{ elements: [], appState: {} }`
- ✅ Ensures `document` contains `{ blocks: [] }`
- ✅ Validates data structure before saving
- ✅ Handles legacy format conversions automatically

## Architecture

The visualization system has two main components:

1. **API Endpoint** (`/app/api/import-visualizations/route.ts`) - Generates visualization data server-side
2. **Import Page** (`/app/(routes)/import-[project-name]/page.tsx`) - User interface for one-click import

## Quick Start Template

### Step 1: Create API Endpoint

Create a new file at `/app/api/import-[project-name]/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  // 1. Generate unique IDs
  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 2. Create default user and team
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

  // 3. Define content generators
  const generators = {
    header: (text: string, level: number = 2) => ({
      id: generateId(),
      type: "header",
      data: { text, level }
    }),

    paragraph: (text: string) => ({
      id: generateId(),
      type: "paragraph",
      data: { text }
    }),

    list: (items: string[], style: string = "unordered") => ({
      id: generateId(),
      type: "list",
      data: { style, items }
    }),

    checklist: (items: string[]) => ({
      id: generateId(),
      type: "checklist",
      data: {
        items: items.map(text => ({ text, checked: false }))
      }
    })
  };

  // 4. Define diagram generators
  const diagramGenerators = {
    rectangle: (x: number, y: number, width: number, height: number, fillStyle: string = "hachure") => ({
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

    text: (x: number, y: number, text: string, fontSize: number = 20) => ({
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

    arrow: (startX: number, startY: number, endX: number, endY: number) => ({
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

  // 5. Create file helper
  const createFile = (fileName: string, documentBlocks: any[], diagramElements: any[]) => ({
    _id: generateId(),
    fileName,
    teamId: defaultTeam._id,
    createdBy: defaultUser._id,
    archive: false,
    document: JSON.stringify({ blocks: documentBlocks }),
    whiteboard: JSON.stringify({
      elements: diagramElements,
      appState: { viewBackgroundColor: "#ffffff" }
    }),
    _creationTime: Date.now()
  });

  // 6. Create your visualization files
  const files = [
    createFile("1. Example Visualization", [
      generators.header("Title Here", 1),
      generators.paragraph("Description here..."),
      generators.list([
        "Item 1",
        "Item 2"
      ]),
      generators.checklist([
        "Task 1",
        "Task 2"
      ])
    ], [
      diagramGenerators.text(400, 20, "Diagram Title", 32),
      diagramGenerators.rectangle(50, 80, 200, 100, "solid"),
      diagramGenerators.text(60, 100, "Box Label", 18),
      diagramGenerators.arrow(250, 130, 350, 130)
    ])
  ];

  // 7. Return response
  return NextResponse.json({
    success: true,
    data: {
      users: [defaultUser],
      teams: [defaultTeam],
      files,
      currentUser: defaultUser,
      currentTeam: defaultTeam
    },
    message: `Successfully generated ${files.length} visualization files`
  });
}
```

### Step 2: Create Import Page

Create a new file at `/app/(routes)/import-[project-name]/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportProjectName() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleImport = async () => {
    setLoading(true);
    setStatus('Generating visualizations...');

    try {
      const response = await fetch('/api/import-[project-name]', {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Importing to localStorage...');

        // Import to localStorage
        localStorage.setItem('erasor_users', JSON.stringify(result.data.users));
        localStorage.setItem('erasor_teams', JSON.stringify(result.data.teams));

        // Merge with existing files
        const existingFiles = JSON.parse(localStorage.getItem('erasor_files') || '[]');
        const allFiles = [...existingFiles, ...result.data.files];
        localStorage.setItem('erasor_files', JSON.stringify(allFiles));

        // Set current user and team if not exists
        if (!localStorage.getItem('erasor_current_user')) {
          localStorage.setItem('erasor_current_user', JSON.stringify(result.data.currentUser));
        }
        if (!localStorage.getItem('erasor_current_team')) {
          localStorage.setItem('erasor_current_team', JSON.stringify(result.data.currentTeam));
        }

        setStatus(`✅ Successfully imported ${result.data.files.length} files!`);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setStatus('❌ Error importing files: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Import [Project Name] Visualizations
        </h1>
        <p className="text-gray-300 mb-8">
          This will import X comprehensive visualization files:
        </p>

        <ul className="text-left text-gray-400 mb-8 space-y-2">
          <li>📊 1. First Visualization</li>
          <li>🏗️ 2. Second Visualization</li>
          {/* Add all visualization names here */}
        </ul>

        {status && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg text-white">
            {status}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Importing...' : 'Import Visualizations'}
        </button>

        <p className="text-gray-500 mt-4 text-sm">
          Files will be added to your dashboard
        </p>
      </div>
    </div>
  );
}
```

### Step 3: Test the Workflow

```bash
# 1. Test API endpoint
curl -X POST http://localhost:3001/api/import-[project-name] | jq '.success, .message, (.data.files | length)'

# 2. Visit import page
open http://localhost:3001/import-[project-name]

# 3. Click "Import Visualizations" button

# 4. Verify files appear in dashboard
open http://localhost:3001/dashboard
```

## Content Creation Guidelines

### Document Panel (EditorJS)

Use these block types for the left panel:

```typescript
// Headers (levels 1-6)
generators.header("Main Title", 1)
generators.header("Section Title", 2)
generators.header("Subsection", 3)

// Paragraphs
generators.paragraph("Regular text content with <b>bold</b> and <i>italic</i> HTML tags")

// Lists
generators.list([
  "Unordered item 1",
  "Unordered item 2"
], "unordered")

generators.list([
  "Ordered step 1",
  "Ordered step 2"
], "ordered")

// Checklists
generators.checklist([
  "Task to complete",
  "Another task"
])
```

### Diagram Panel (Excalidraw)

Use these element types for the right panel:

```typescript
// Rectangles (for boxes, containers, entities)
diagramGenerators.rectangle(x, y, width, height, "solid")  // Filled box
diagramGenerators.rectangle(x, y, width, height, "hachure") // Outline only

// Text labels
diagramGenerators.text(x, y, "Label text", fontSize)

// Arrows (for relationships, flows)
diagramGenerators.arrow(startX, startY, endX, endY)
```

### Layout Best Practices

**Document Panel:**
- Start with a level 1 header for the title
- Use level 2 headers for major sections
- Use paragraphs for descriptions
- Use lists for feature/item enumeration
- Use checklists for key characteristics

**Diagram Panel:**
- Title at top center (y: 20-40)
- Main diagram elements starting at y: 80+
- Horizontal spacing: 250-300px between boxes
- Vertical spacing: 150-200px between layers
- Font sizes: 32 (title), 20 (headers), 16-18 (labels)

### Example Visualization Types

1. **Database ERD**: Rectangles for tables, text for fields, arrows for relationships
2. **Architecture Diagram**: Layered rectangles for system components, arrows for dependencies
3. **Flow Diagrams**: Sequential rectangles with arrows showing process flow
4. **API Documentation**: Rectangles for endpoints, text for parameters/responses
5. **Use Case Diagrams**: Rectangles for actors/systems, arrows for interactions

## Common Patterns

### Creating Entity Diagrams

```typescript
// Table 1
diagramGenerators.rectangle(50, 100, 200, 150, "solid"),
diagramGenerators.text(60, 110, "table_name", 20),
diagramGenerators.text(60, 140, "id: UUID", 16),
diagramGenerators.text(60, 160, "name: VARCHAR", 16),

// Relationship arrow
diagramGenerators.arrow(250, 175, 350, 175),

// Table 2
diagramGenerators.rectangle(350, 100, 200, 150, "solid"),
diagramGenerators.text(360, 110, "related_table", 20)
```

### Creating Layered Architecture

```typescript
// Layer 1 (Top)
diagramGenerators.rectangle(200, 100, 400, 80, "solid"),
diagramGenerators.text(350, 130, "Presentation Layer", 20),

// Arrow down
diagramGenerators.arrow(400, 180, 400, 250),

// Layer 2 (Middle)
diagramGenerators.rectangle(200, 250, 400, 80, "solid"),
diagramGenerators.text(350, 280, "Business Layer", 20),

// Arrow down
diagramGenerators.arrow(400, 330, 400, 400),

// Layer 3 (Bottom)
diagramGenerators.rectangle(200, 400, 400, 80, "solid"),
diagramGenerators.text(350, 430, "Data Layer", 20)
```

### Creating Sequence Flows

```typescript
// Actor 1
diagramGenerators.rectangle(50, 100, 150, 60, "hachure"),
diagramGenerators.text(80, 120, "Client", 18),

// Arrow to Actor 2
diagramGenerators.arrow(200, 130, 300, 130),
diagramGenerators.text(220, 115, "request", 14),

// Actor 2
diagramGenerators.rectangle(300, 100, 150, 60, "hachure"),
diagramGenerators.text(330, 120, "Server", 18),

// Return arrow
diagramGenerators.arrow(300, 150, 200, 150),
diagramGenerators.text(220, 165, "response", 14)
```

## Testing Checklist

Before deploying a new visualization import:

- [ ] API endpoint returns `success: true`
- [ ] API endpoint returns correct number of files
- [ ] All file names are descriptive
- [ ] Document blocks render correctly in EditorJS
- [ ] Diagram elements render correctly in Excalidraw
- [ ] Import page loads without errors
- [ ] Import button triggers successfully
- [ ] Files appear in dashboard after import
- [ ] Files can be opened in workspace
- [ ] Both document and diagram panels are populated

## Troubleshooting

### Files not appearing in dashboard
- Check browser console for errors
- Verify localStorage has `erasor_files` key
- Refresh the dashboard page

### Diagram not rendering
- Verify all required Excalidraw properties are present
- Check for valid coordinate values (no NaN or negative values)
- Ensure `appState` includes `viewBackgroundColor`

### API endpoint errors
- Check Next.js server console for errors
- Verify TypeScript types match expected interfaces
- Test API with curl before UI integration

## Reference Examples

See working implementations:
- **Pawns Plus Backend**: `/app/api/import-visualizations/route.ts` (8 visualizations)
- **Pawns Plus Import Page**: `/app/(routes)/import-pawns-plus/page.tsx`

## Future Enhancements

Potential improvements to the workflow:

1. **CLI Generator**: Script to scaffold new visualization endpoints
2. **Template Library**: Reusable diagram templates (ERD, architecture, flow)
3. **Batch Import**: Import multiple projects at once
4. **Export Functionality**: Export visualizations to PDF/PNG
5. **Version Control**: Track changes to visualization data
6. **Collaboration**: Share visualizations across teams

---

**Created**: December 19, 2025
**Last Updated**: December 19, 2025
**Maintained By**: KC Creator
