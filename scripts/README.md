# Pawns Plus Backend Visualization Scripts

This directory contains scripts to generate comprehensive visual documentation of the Pawns Plus pawn shop backend system using Erasor Clone.

## 📋 Files Overview

### Core Generator
- **`create-pawns-plus-visualizations.js`** - Base functions for creating EditorJS + Excalidraw content
  - Must be loaded FIRST before any visualization scripts
  - Provides helper functions: `generators`, `diagramGenerators`, `createFile`

### Visualization Scripts (Run in order)
1. **`1-database-erd.js`** - Database Schema ERD
   - 15 PostgreSQL tables with relationships
   - Entity Relationship Diagram
   - Key features: UUID PKs, ltree, JSONB

2. **`2-api-architecture.js`** - API Architecture
   - Clean Architecture / DDD layers
   - Domain → Application → Infrastructure → API
   - Dependency flow visualization

3. **`3-auth-jwt-flow.js`** - Authentication & JWT Flow
   - Login, refresh, logout flows
   - JWT structure and token rotation
   - Role-based access control

4. **`4-pawn-ticket-flow.js`** - Pawn Ticket Creation Flow
   - Sequence diagram showing all layers
   - Unit of Work pattern
   - Database transaction management

5. **`5-customer-management.js`** - Customer Management
   - CRUD operations for customers
   - 50+ customer fields
   - Search capabilities and validation

6. **`6-inventory-system.js`** - Inventory System
   - Hierarchical categories (ltree)
   - JSONB flexible attributes
   - Status lifecycle management

7. **`7-store-transactions.js`** - Store Transaction Flow
   - Transaction types and tender types
   - Multi-tender split payments
   - Line items and financial tracking

8. **`8-use-case-layer.js`** - Use Case Layer (CQRS)
   - Command Query Responsibility Segregation
   - All use cases organized by domain
   - Use case structure and patterns

### Master Import
- **`import-all-visualizations.js`** - Instructions for importing all visualizations
- **`README.md`** - This file

## 🚀 Quick Start

### Prerequisites
1. Erasor Clone running at `http://localhost:3000`
2. Navigate to `/dashboard` page
3. Open browser DevTools (F12 or Cmd+Option+I)
4. Go to Console tab

### Method 1: Import All (Recommended)

```javascript
// 1. Copy and paste the ENTIRE contents of create-pawns-plus-visualizations.js
// Wait for: "🚀 Pawns Plus Visualization Generator Loaded"

// 2. Copy and paste each numbered script (1-8) in order
// Each will log: "✅ Created: [Filename]"

// 3. Refresh the page - all 8 files will appear in your dashboard!
```

### Method 2: Import Individual Files

```javascript
// 1. Load base generator first
// Copy/paste: create-pawns-plus-visualizations.js

// 2. Load any specific visualization you want
// Example: Copy/paste 1-database-erd.js
// Output: "✅ Created: 1. Database Schema ERD"

// 3. Refresh to see the file
```

## 📊 What You Get

Each visualization file contains:

### Left Panel (Document)
- EditorJS formatted content
- Headers, paragraphs, lists, checklists
- Comprehensive documentation
- Code examples and explanations

### Right Panel (Diagram)
- Excalidraw canvas
- Rectangles, text, arrows
- Entity diagrams, flowcharts, sequence diagrams
- Architecture visualizations

## 📁 Generated Files in Erasor Clone

After importing, you'll see these files in your dashboard:

1. **1. Database Schema ERD** - Complete database structure
2. **2. API Architecture** - Clean Architecture layers
3. **3. Authentication & JWT Flow** - Auth workflow
4. **4. Pawn Ticket Creation Flow** - Transaction workflow
5. **5. Customer Management** - Customer CRUD operations
6. **6. Inventory System** - Hierarchical inventory
7. **7. Store Transactions** - Financial tracking
8. **8. Use Case Layer (CQRS)** - Application layer structure

## 🎨 Customizing Visualizations

All scripts are editable JavaScript. You can:

1. **Modify Content**: Edit `documentBlocks` arrays in each script
2. **Adjust Diagrams**: Change `diagramElements` coordinates and properties
3. **Add Elements**: Use `generators` and `diagramGenerators` functions
4. **Create New Files**: Follow the pattern in existing scripts

### Available Generators

#### Document (EditorJS)
```javascript
generators.header(text, level)          // h1, h2, h3
generators.paragraph(text)              // Paragraph
generators.list(items, 'ordered'|'unordered')
generators.checklist(items)             // Checkbox list
generators.warning(title, message)      // Warning box
```

#### Diagram (Excalidraw)
```javascript
diagramGenerators.rectangle(x, y, width, height, fillStyle)
diagramGenerators.text(x, y, text, fontSize)
diagramGenerators.arrow(startX, startY, endX, endY)
```

## 🔧 Troubleshooting

### "User or team not found"
- Reload the dashboard page
- Make sure you're at `/dashboard` (not `/workspace`)
- localStorage should have `erasor_current_user` and `erasor_current_team`

### Files not appearing
- Refresh the page after running scripts
- Check browser console for errors
- Verify localStorage: `localStorage.getItem('erasor_files')`

### Script errors
- Make sure `create-pawns-plus-visualizations.js` is loaded FIRST
- Scripts must be run in browser console (not Node.js)
- Check for syntax errors in console

## 💡 Use Cases

These visualizations are perfect for:

- **Documentation**: Professional backend documentation
- **Onboarding**: Help new developers understand the system
- **Presentations**: Visual aids for stakeholder meetings
- **Planning**: Reference for future development
- **Training**: Educational material for team members
- **Architecture Review**: Visual system analysis

## 🔗 Related Files

- **Pawns Plus Backend**: `/Users/kcdacre8tor/pawns_plus_backend/`
  - 125+ files extracted from original project
  - PostgreSQL database with 15 tables
  - Express.js REST API with JWT auth
  - Clean Architecture / DDD implementation

## 📝 Notes

- All scripts use browser localStorage (no server required)
- Files persist in browser until manually deleted
- Can export files from Erasor Clone workspace
- Diagrams are editable in Excalidraw canvas
- Documents are editable in EditorJS editor

## 🤝 Contributing

To add new visualizations:

1. Copy an existing numbered script as template
2. Modify `documentBlocks` for left panel content
3. Modify `diagramElements` for right panel diagram
4. Update filename and `createFile()` call
5. Add to this README

---

**Created for**: Pawns Plus Backend Documentation
**Compatible with**: Erasor Clone (Next.js 14, EditorJS, Excalidraw)
**Last Updated**: December 19, 2025
