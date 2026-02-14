// 6. INVENTORY SYSTEM
// Load create-pawns-plus-visualizations.js first

const createInventorySystem = () => {
  const documentBlocks = [
    generators.header("Inventory Management System", 1),
    generators.paragraph("Hierarchical product categorization with flexible JSONB attributes for different item types."),

    generators.header("System Overview", 2),
    generators.paragraph("The inventory system uses PostgreSQL's ltree extension for efficient hierarchical categories and JSONB for flexible product attributes."),

    generators.header("Inventory Categories (Hierarchical)", 2),
    generators.paragraph("Categories form a tree structure using ltree paths:"),
    generators.list([
      "<b>Electronics</b> (level 0)",
      "  └─ <b>Computers</b> (level 1)",
      "      └─ <b>Laptops</b> (level 2)",
      "      └─ <b>Desktops</b> (level 2)",
      "  └─ <b>Phones</b> (level 1)",
      "<b>Jewelry</b> (level 0)",
      "  └─ <b>Rings</b> (level 1)",
      "  └─ <b>Necklaces</b> (level 1)",
      "<b>Firearms</b> (level 0) - Special compliance",
      "<b>Musical Instruments</b> (level 0)"
    ]),

    generators.header("Category Features", 3),
    generators.list([
      "Unlimited depth supported",
      "Automatic path generation (e.g., 'Electronics.Computers.Laptops')",
      "Fast ancestor/descendant queries using ltree operators",
      "Self-referencing parent_id for tree structure"
    ]),

    generators.header("Inventory Items", 2),

    generators.header("Core Fields", 3),
    generators.list([
      "id (UUID)",
      "category_id - Links to category hierarchy",
      "inventory_number - Unique sequential number",
      "serial_number - Manufacturer serial (if applicable)",
      "description - Item description",
      "status - Status code (B,C,D,H,I,J,L,O,P,S,T,U,V)",
      "cost - Acquisition cost",
      "retail_price - Selling price"
    ]),

    generators.header("Flexible Attributes (JSONB)", 3),
    generators.paragraph("Two JSONB fields allow category-specific attributes:"),
    generators.list([
      "<b>extra</b> - General purpose metadata",
      "<b>attributes</b> - Category-specific properties"
    ]),

    generators.paragraph("Examples:"),
    generators.list([
      "Electronics: { brand, model, storage, ram, condition }",
      "Jewelry: { material, karat, stone_type, weight_grams }",
      "Firearms: { make, model, caliber, serial, type } - ATF compliance",
      "Musical: { brand, model, instrument_type, finish }"
    ]),

    generators.header("Status Codes", 2),
    generators.list([
      "B - ?", "C - ?", "D - ?", "H - On Hold",
      "I - In Inventory", "J - ?", "L - Layaway",
      "O - Out on Pawn", "P - Pledged/Pawned",
      "S - Sold", "T - ?", "U - ?", "V - Void"
    ]),

    generators.header("API Endpoints", 2),

    generators.header("Create Item", 3),
    generators.paragraph("<b>POST /api/inventory-items</b>"),
    generators.list([
      "Validates category exists",
      "Auto-generates inventory_number",
      "Stores JSONB attributes",
      "Returns complete item with ID"
    ]),

    generators.header("Get Item", 3),
    generators.list([
      "GET /api/inventory-items/:id - By UUID",
      "GET /api/inventory-items/by-inventory-number/:number",
      "GET /api/inventory-items/by-serial-number/:serial"
    ]),

    generators.header("Update Item", 3),
    generators.paragraph("<b>PUT /api/inventory-items/:id</b>"),
    generators.list([
      "Partial updates supported",
      "Can update JSONB attributes",
      "Status changes tracked"
    ]),

    generators.header("Delete Item", 3),
    generators.paragraph("<b>DELETE /api/inventory-items/:id</b>"),
    generators.list([
      "Admin/Manager only",
      "Cannot delete if associated with active pawn ticket"
    ]),

    generators.header("Categories", 3),
    generators.list([
      "GET /api/category/tree - Full category tree",
      "POST /api/category - Create category (admin/manager)"
    ]),

    generators.header("Special Features", 2),
    generators.checklist([
      "Hierarchical categories with unlimited depth",
      "Fast tree queries using ltree",
      "Flexible attributes via JSONB",
      "Unique inventory numbering",
      "Serial number tracking",
      "Status lifecycle management",
      "Firearms compliance tracking (gunlog table)",
      "Category-specific validation"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(300, 20, "Inventory System - Categories & Items", 28),

    // Category Tree (Left)
    diagramGenerators.text(50, 70, "CATEGORY HIERARCHY (ltree)", 18),

    diagramGenerators.rectangle(50, 100, 280, 500, "hachure"),

    // Root categories
    diagramGenerators.rectangle(70, 120, 240, 40, "solid"),
    diagramGenerators.text(80, 135, "Electronics (id: 1)", 14),
    diagramGenerators.text(80, 150, "path: 'Electronics'", 12),

    // Level 1
    diagramGenerators.rectangle(90, 175, 220, 35, "solid"),
    diagramGenerators.text(100, 190, "Computers (id: 2, parent: 1)", 12),
    diagramGenerators.text(100, 203, "path: 'Electronics.Computers'", 11),

    diagramGenerators.arrow(180, 160, 180, 175),

    // Level 2
    diagramGenerators.rectangle(110, 225, 180, 30, "solid"),
    diagramGenerators.text(120, 238, "Laptops (id: 3, parent: 2)", 11),
    diagramGenerators.text(120, 250, "path: 'Electronics.Computers.Laptops'", 10),

    diagramGenerators.arrow(180, 210, 180, 225),

    // Another root
    diagramGenerators.rectangle(70, 280, 240, 40, "solid"),
    diagramGenerators.text(80, 295, "Jewelry (id: 10)", 14),
    diagramGenerators.text(80, 310, "path: 'Jewelry'", 12),

    // Level 1 under Jewelry
    diagramGenerators.rectangle(90, 335, 220, 30, "solid"),
    diagramGenerators.text(100, 348, "Rings (id: 11, parent: 10)", 12),
    diagramGenerators.text(100, 360, "path: 'Jewelry.Rings'", 11),

    diagramGenerators.arrow(180, 320, 180, 335),

    diagramGenerators.rectangle(90, 380, 220, 30, "solid"),
    diagramGenerators.text(100, 393, "Necklaces (id: 12, parent: 10)", 12),
    diagramGenerators.text(100, 405, "path: 'Jewelry.Necklaces'", 11),

    diagramGenerators.arrow(180, 320, 180, 380),

    // Firearms (special)
    diagramGenerators.rectangle(70, 435, 240, 40, "solid"),
    diagramGenerators.text(80, 450, "Firearms (id: 20)", 14),
    diagramGenerators.text(80, 465, "⚠️  ATF Compliance Required", 12),

    diagramGenerators.rectangle(90, 490, 220, 30, "solid"),
    diagramGenerators.text(100, 503, "Handguns (id: 21, parent: 20)", 12),

    diagramGenerators.arrow(180, 475, 180, 490),

    diagramGenerators.text(70, 550, "ltree Features:", 14),
    diagramGenerators.text(70, 570, "• Fast path queries", 12),
    diagramGenerators.text(70, 585, "• Ancestor/descendant search", 12),

    // Inventory Items (Right)
    diagramGenerators.text(400, 70, "INVENTORY ITEMS", 18),

    // Item 1 - Laptop
    diagramGenerators.rectangle(380, 100, 320, 180, "solid"),
    diagramGenerators.text(390, 115, "Inventory Item #1001", 16),
    diagramGenerators.text(390, 140, "Core Fields:", 14),
    diagramGenerators.text(390, 160, "• id: uuid-123", 12),
    diagramGenerators.text(390, 175, "• category_id: 3 (Laptops)", 12),
    diagramGenerators.text(390, 190, "• serial_number: ABC123XYZ", 12),
    diagramGenerators.text(390, 205, "• status: 'I' (In Inventory)", 12),
    diagramGenerators.text(390, 220, "• cost: $500.00", 12),
    diagramGenerators.text(390, 235, "• retail_price: $750.00", 12),
    diagramGenerators.text(390, 255, "attributes (JSONB):", 14),
    diagramGenerators.text(390, 270, '{ "brand": "Dell", "model": "XPS 13",', 11),
    diagramGenerators.text(390, 285, '  "ram": "16GB", "storage": "512GB SSD" }', 11),

    diagramGenerators.arrow(330, 200, 380, 200),
    diagramGenerators.text(335, 190, "belongs to", 10),

    // Item 2 - Ring
    diagramGenerators.rectangle(380, 310, 320, 160, "solid"),
    diagramGenerators.text(390, 325, "Inventory Item #2005", 16),
    diagramGenerators.text(390, 350, "Core Fields:", 14),
    diagramGenerators.text(390, 370, "• category_id: 11 (Rings)", 12),
    diagramGenerators.text(390, 385, "• status: 'P' (Pawned)", 12),
    diagramGenerators.text(390, 400, "• cost: $800.00", 12),
    diagramGenerators.text(390, 420, "attributes (JSONB):", 14),
    diagramGenerators.text(390, 435, '{ "material": "Gold", "karat": "14K",', 11),
    diagramGenerators.text(390, 450, '  "stone_type": "Diamond", "weight": "5.2g" }', 11),

    diagramGenerators.arrow(330, 360, 380, 360),

    // Item 3 - Firearm
    diagramGenerators.rectangle(380, 500, 320, 160, "solid"),
    diagramGenerators.text(390, 515, "Inventory Item #3010", 16),
    diagramGenerators.text(390, 540, "Core Fields:", 14),
    diagramGenerators.text(390, 560, "• category_id: 21 (Handguns)", 12),
    diagramGenerators.text(390, 575, "• status: 'O' (On Pawn)", 12),
    diagramGenerators.text(390, 595, "attributes (JSONB):", 14),
    diagramGenerators.text(390, 610, '{ "make": "Smith & Wesson",', 11),
    diagramGenerators.text(390, 625, '  "caliber": "9mm", "type": "Semi-Auto" }', 11),
    diagramGenerators.text(390, 645, "⚠️  Also in gunlog table (ATF)", 11),

    // JSONB Benefits
    diagramGenerators.rectangle(750, 100, 280, 200, "hachure"),
    diagramGenerators.text(760, 115, "JSONB Benefits", 16),
    diagramGenerators.text(760, 145, "✓ Schema flexibility", 14),
    diagramGenerators.text(760, 165, "Different attributes per", 12),
    diagramGenerators.text(760, 180, "category without ALTER TABLE", 12),
    diagramGenerators.text(760, 205, "✓ Indexable", 14),
    diagramGenerators.text(760, 225, "GIN indexes for fast queries", 12),
    diagramGenerators.text(760, 250, "✓ Queryable", 14),
    diagramGenerators.text(760, 270, "WHERE attributes->>'brand'", 12),
    diagramGenerators.text(760, 285, "  = 'Dell'", 12),

    // Status Lifecycle
    diagramGenerators.rectangle(750, 330, 280, 180, "hachure"),
    diagramGenerators.text(760, 345, "Status Lifecycle", 16),
    diagramGenerators.text(760, 375, "I (In Inventory)", 14),
    diagramGenerators.text(800, 395, "↓", 14),
    diagramGenerators.text(760, 410, "P (Pawned) or L (Layaway)", 14),
    diagramGenerators.text(800, 430, "↓", 14),
    diagramGenerators.text(760, 445, "S (Sold) or I (Back)", 14),
    diagramGenerators.text(800, 465, "↓", 14),
    diagramGenerators.text(760, 480, "V (Void) - cancelled", 14),

    // API Usage Example
    diagramGenerators.text(50, 690, "API Usage Examples:", 16),
    diagramGenerators.text(50, 715, "Create: POST /api/inventory-items { categoryId: 3, serialNumber: 'ABC123', attributes: {...} }", 12),
    diagramGenerators.text(50, 735, "Search: GET /api/inventory-items/by-serial-number/ABC123", 12),
    diagramGenerators.text(50, 755, "Tree: GET /api/category/tree → Returns full category hierarchy with counts", 12)
  ];

  return createFile("6. Inventory System", documentBlocks, diagramElements);
};

console.log('📦 Creating Inventory System...');
const inventoryFileId = createInventorySystem();
console.log(`File ID: ${inventoryFileId}`);
