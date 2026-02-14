# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a local-only Eraser.io clone built with Next.js 14, TypeScript, and React. The app provides document editing and whiteboard features with browser localStorage for data persistence.

**Key Technologies:**
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Storage**: Browser localStorage (no authentication required)
- **Rich Text Editor**: EditorJS
- **Whiteboard**: Excalidraw
- **UI Components**: Radix UI primitives via shadcn/ui

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm lint
```

## Architecture

### App Structure (Next.js App Router)

The project uses Next.js 13+ App Router with route groups:

- **`app/(routes)/`** - Main application routes (requires authentication)
  - `dashboard/` - User dashboard with file management
  - `workspace/[fileId]/` - Individual file workspace (Editor + Canvas)
  - `teams/create/` - Team creation flow

- **`app/page.tsx`** - Landing page (public)
- **`app/layout.tsx`** - Root layout with providers
- **`app/_components/`** - Shared components (Hero, Header, AdBanner)
- **`app/_context/`** - React Context providers (FilesListContext)
- **`app/_constant/`** - App constants

### Local Storage System

All data is stored in browser localStorage with no authentication required.

**`lib/localdb.ts`** - Local storage operations:
- File operations: `createFile`, `getFiles`, `getFileById`, `updateDocument`, `updateWhiteboard`, `deleteFile`, `archiveFile`
- Team operations: `createTeam`, `getTeam`, `getCurrentTeam`, `setCurrentTeam`
- User operations: `createUser`, `getCurrentUser`
- Auto-initializes default user ("Local User") and team ("My Workspace") on first run

### Data Flow

1. **LocalDBProvider** initializes localStorage on app mount (in `app/layout.tsx`)
2. Components directly import and call localStorage functions from `lib/localdb.ts`
3. Data persists across page reloads via browser localStorage
4. No server-side state or real-time sync

### Workspace Components

The core editing experience (`app/(routes)/workspace/[fileId]/`):

**Editor.tsx** - EditorJS rich text editor:
- Plugins: Header, List, Checklist, Paragraph, Warning
- Auto-saves to Convex on trigger
- Loads initial document from `fileData.document` (JSON string)

**Canvas.tsx** - Excalidraw whiteboard:
- Collaborative drawing canvas
- Saves/loads from `fileData.whiteboard` (JSON string)
- Custom UI options to disable some default actions

**WorkspaceHeader.tsx** - Top bar with save triggers and file actions

Both components receive `onSaveTrigger`, `fileId`, and `fileData` props from the parent page.

### UI Components

Uses shadcn/ui components (in `components/ui/`):
- Button, Dialog, Dropdown Menu, Input, Popover, Separator, Sonner (toast)
- Built on Radix UI primitives
- Styled with Tailwind CSS and class-variance-authority
- Configuration in `components.json`

### Styling System

- **Tailwind CSS** - Utility-first CSS framework
- **`app/globals.css`** - Global styles and CSS variables
- **`tailwind.config.ts`** - Theme configuration
- **`next-themes`** - Dark mode support
- **`tailwindcss-animate`** - Animation utilities

## Environment Setup

No environment variables required. The app works completely offline using browser localStorage.

## Content Generation Workflow

**IMPORTANT: When user asks to create content, ALWAYS generate BOTH panels:**

1. **Left Panel (Document)** - EditorJS formatted text content
2. **Right Panel (Visual Diagram)** - Excalidraw canvas elements

**Workflow:**
1. User provides a prompt (e.g., "Create an API documentation" or "Build a database schema")
2. Claude generates BOTH:
   - EditorJS blocks array for the document
   - Excalidraw elements array for the visual diagram
3. Use the browser tool `/create-file-with-diagram.html` to inject both
4. Navigate to workspace to verify both panels render correctly

**Helper Functions Available:**

```javascript
// Document generators (EditorJS blocks)
generators.header(text, level)
generators.paragraph(text)
generators.list(items, style) // style: 'unordered' or 'ordered'
generators.checklist(items)
generators.warning(title, message)

// Diagram generators (Excalidraw elements)
diagramGenerators.rectangle(x, y, width, height, isHeader)
diagramGenerators.text(x, y, text, fontSize)
diagramGenerators.arrow(startX, startY, endX, endY)
```

**Browser Function:**
```javascript
// Call this in browser context via create-file-with-diagram.html
window.createCompleteFile(fileName, documentBlocks, diagramElements)
```

## Common Patterns

**Adding a new localStorage function:**
1. Add to `lib/localdb.ts`
2. Import directly in components: `import { functionName } from '@/lib/localdb'`
3. Call synchronously (no async/await needed for localStorage)

**Adding a shadcn/ui component:**
```bash
npx shadcn-ui@latest add [component-name]
```

**File data structure:**
```typescript
{
  _id: Id<"files">,
  fileName: string,
  teamId: string,
  createdBy: string,
  archive: boolean,
  document: string,      // JSON stringified EditorJS data
  whiteboard: string     // JSON stringified Excalidraw elements
}
```

## Testing Notes

The project currently has no test setup. When adding tests:
- Test localStorage operations by mocking `window.localStorage`
- No authentication or backend services to mock
- All data is local to the browser
