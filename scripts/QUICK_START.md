# Quick Start - Import Pawns Plus Visualizations

## 🎯 One-Command Import

Open **either** of these URLs in your browser:
- `http://localhost:3000/dashboard`
- `http://localhost:3001/dashboard`

Then follow these steps:

### Step 1: Open Browser Console
Press `F12` or `Cmd+Option+I` (Mac) to open DevTools, then go to **Console** tab.

### Step 2: Copy & Paste Scripts

**Copy the entire contents of each file below and paste into console, pressing Enter after each:**

#### 1️⃣ Load Base Generator (REQUIRED FIRST)
```javascript
// Copy ENTIRE contents of: scripts/create-pawns-plus-visualizations.js
// Paste in console → Enter
// Wait for: "🚀 Pawns Plus Visualization Generator Loaded"
```

#### 2️⃣ Load Each Visualization (in any order)
```javascript
// Copy contents of: scripts/1-database-erd.js
// Paste → Enter → See: "✅ Created: 1. Database Schema ERD"

// Copy contents of: scripts/2-api-architecture.js
// Paste → Enter → See: "✅ Created: 2. API Architecture"

// Copy contents of: scripts/3-auth-jwt-flow.js
// Paste → Enter → See: "✅ Created: 3. Authentication & JWT Flow"

// Copy contents of: scripts/4-pawn-ticket-flow.js
// Paste → Enter → See: "✅ Created: 4. Pawn Ticket Creation Flow"

// Copy contents of: scripts/5-customer-management.js
// Paste → Enter → See: "✅ Created: 5. Customer Management"

// Copy contents of: scripts/6-inventory-system.js
// Paste → Enter → See: "✅ Created: 6. Inventory System"

// Copy contents of: scripts/7-store-transactions.js
// Paste → Enter → See: "✅ Created: 7. Store Transactions"

// Copy contents of: scripts/8-use-case-layer.js
// Paste → Enter → See: "✅ Created: 8. Use Case Layer (CQRS)"
```

### Step 3: Refresh & View
Press `Cmd+R` (Mac) or `F5` (Windows/Linux) to refresh the page.

You'll see **8 new files** in your dashboard! 🎉

---

## 📋 What You Get

Each file contains:
- **Left Panel**: Professional documentation (EditorJS)
- **Right Panel**: Visual diagram (Excalidraw)

### Files Created:
1. **Database Schema ERD** - All 15 PostgreSQL tables with relationships
2. **API Architecture** - Clean Architecture layers visualization
3. **Authentication & JWT Flow** - Login, refresh, logout workflows
4. **Pawn Ticket Creation Flow** - Complete sequence diagram
5. **Customer Management** - CRUD operations and data model
6. **Inventory System** - Hierarchical categories + JSONB attributes
7. **Store Transactions** - Financial transaction types and flow
8. **Use Case Layer (CQRS)** - Commands and Queries by domain

---

## 🔧 Troubleshooting

### "User or team not found"
1. Make sure you're at `/dashboard` (not just `/`)
2. Refresh the page
3. Try running the base generator again

### Files not showing up
1. Refresh the page (`Cmd+R` or `F5`)
2. Check console for errors
3. Verify you ran the base generator first

### Script error
1. Make sure `create-pawns-plus-visualizations.js` was loaded FIRST
2. Each script should be copied COMPLETELY (scroll to bottom)
3. Check for any error messages in red

---

## 💡 Tips

- **Port doesn't matter**: Works on 3000, 3001, or any port
- **Edit anytime**: Click any file to open and edit diagrams
- **Export**: Use Excalidraw export for presentations
- **Delete**: Delete files from dashboard if needed
- **Re-import**: Run scripts again to recreate files

---

## 🚀 Next Steps

After importing:
1. Click any file to open workspace view
2. Edit diagrams in right panel (drag, resize, add shapes)
3. Edit documentation in left panel (add text, lists)
4. Use for presentations, onboarding, documentation

**Happy visualizing!** 🎨
