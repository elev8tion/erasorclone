# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Local-only Eraser.io clone: a document editor (EditorJS) + whiteboard (Excalidraw) app built with Next.js 14 App Router, TypeScript, and Tailwind CSS. All data persists in browser localStorage — no backend, no auth.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on localhost:3001 (port 3001, not 3000)
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint via next lint
```

No environment variables required. No test framework is configured.

## Architecture

### Route Structure (Next.js App Router)

- `app/page.tsx` — Landing page (Header + Hero)
- `app/(routes)/dashboard/` — File management with sidebar navigation
- `app/(routes)/workspace/[fileId]/` — Split-pane editor: EditorJS (left) + Excalidraw (right)
- `app/(routes)/teams/create/` — Team creation
- `app/(routes)/import-pawns-plus/` — Imports pre-built visualization demo files
- `app/api/files/route.ts` — REST API for file CRUD (GET/POST/PUT)
- `app/api/import-visualizations/route.ts` — Generates demo visualization data server-side

### Data Layer

**`lib/localdb.ts`** — All localStorage CRUD. Exports: `createFile`, `getFiles`, `getFileById`, `updateDocument`, `updateWhiteboard`, `deleteFile`, `archiveFile`, `createTeam`, `getTeam`, `getCurrentTeam`, `setCurrentTeam`, `createUser`, `getCurrentUser`, `initializeLocalDB`. All operations are synchronous. Storage keys are prefixed `erasor_`.

**`lib/visualization-loader.ts`** — Type-safe parsing/validation for Excalidraw and EditorJS data. `parseWhiteboardData()` handles both legacy (array-only) and current (`{elements, appState}`) formats.

**`app/LocalDBProvider.tsx`** — Client component in root layout. Calls `initializeLocalDB()` on mount and seeds Pawns Plus demo files into localStorage on first run.

### Key Data Types

Two overlapping file interfaces exist:
- `FileType` in `lib/localdb.ts` — canonical type used by storage layer
- `FILE` in `app/(routes)/dashboard/_components/FileList.tsx` — used by UI components

Both have `_id: string`, `fileName`, `teamId`, `createdBy`, `archive`, `document` (JSON-stringified EditorJS data), `whiteboard` (JSON-stringified Excalidraw data).

### Component Wiring

**Root layout** (`app/layout.tsx`): wraps app in `ThemeProvider` (next-themes, dark default) → `LocalDBProvider` → `Toaster` (sonner).

**Dashboard layout** (`app/(routes)/dashboard/layout.tsx`): provides `FileListContext` (React Context). `SideNav` reads teams/files from localStorage, passes file list up via context. `FileList` reads from context to render the table.

**Workspace page** (`app/(routes)/workspace/[fileId]/page.tsx`): loads file via `getFileById()`, passes data to `Editor` and `Canvas`. Save is triggered by toggling a `triggerSave` boolean from `WorkspaceHeader`.

- **Editor.tsx**: Creates EditorJS instance, saves via `updateDocument()` from localdb
- **Canvas.tsx**: Renders Excalidraw, saves via `updateWhiteboard()` from localdb. Uses `parseWhiteboardData()` for safe loading.

### UI Stack

- shadcn/ui components in `components/ui/` (configured in `components.json`, base color: neutral, CSS variables enabled)
- Add new components: `npx shadcn-ui@latest add [component-name]`
- Icons: lucide-react
- Dates: moment.js
- Path alias: `@/*` maps to project root

## Content Generation Workflow

When creating content programmatically, generate BOTH panels:

1. **Document** — EditorJS blocks array (`{blocks: [...]}`)
2. **Diagram** — Excalidraw elements array (`{elements: [...], appState: {viewBackgroundColor: "#ffffff"}}`)

Helper generators and `window.createCompleteFile()` are available via `public/create-file-with-diagram.html` for browser-based injection. The API route at `/api/import-visualizations` demonstrates server-side generation of both formats.

## Gotchas

- `reactStrictMode` is `false` in `next.config.mjs` — EditorJS and Excalidraw don't handle double-mount well
- EditorJS plugins (`@editorjs/header`, etc.) lack TypeScript types — existing code uses `// @ts-ignore`
- `SideNavTopSection` has both `.tsx` and `.jsx` variants (the `.jsx` is referenced in `tsconfig.json` includes)
- The `FILE` interface in `FileList.tsx` has a typo: `createdBt` instead of `createdBy`
