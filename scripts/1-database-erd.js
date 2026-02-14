// 1. DATABASE SCHEMA ERD
// Load create-pawns-plus-visualizations.js first

const createDatabaseERD = () => {
  const documentBlocks = [
    generators.header("Pawns Plus Database Schema", 1),
    generators.paragraph("Complete Entity Relationship Diagram for the Pawns Plus pawn shop management system."),

    generators.header("Core Entities", 2),

    generators.header("Authentication & Users", 3),
    generators.list([
      "<b>role</b> - User roles (admin, manager, sales_associate)",
      "<b>app_user</b> - Application users with authentication",
      "<b>app_user_session</b> - JWT refresh token sessions"
    ]),

    generators.header("Customer Management", 3),
    generators.list([
      "<b>customer</b> - Customer records with personal info, ID verification, employer details, compliance data"
    ]),

    generators.header("Inventory Management", 3),
    generators.list([
      "<b>inventory_category</b> - Hierarchical product categories (using ltree)",
      "<b>inventory_status</b> - Status codes (B,C,D,H,I,J,L,O,P,S,T,U,V)",
      "<b>inventory_item</b> - Product/item records with JSONB attributes"
    ]),

    generators.header("Pawn Operations", 3),
    generators.list([
      "<b>pawn_ticket</b> - Pawn/purchase transaction records",
      "<b>pawn_ticket_item</b> - Many-to-many relationship between tickets and items"
    ]),

    generators.header("Financial Transactions", 3),
    generators.list([
      "<b>store_transaction</b> - Transaction headers",
      "<b>store_transaction_tender</b> - Payment methods",
      "<b>store_transaction_item</b> - Line items in transactions"
    ]),

    generators.header("Compliance & Settings", 3),
    generators.list([
      "<b>gunlog</b> - ATF bound book for firearms compliance",
      "<b>app_settings</b> - Control numbers and system configuration"
    ]),

    generators.header("Key Relationships", 2),
    generators.list([
      "app_user → role (many-to-one)",
      "customer → pawn_ticket (one-to-many)",
      "pawn_ticket → pawn_ticket_item → inventory_item (many-to-many)",
      "pawn_ticket → store_transaction (one-to-many)",
      "store_transaction → store_transaction_item → inventory_item (many-to-many)",
      "inventory_item → inventory_category (many-to-one)"
    ], "ordered"),

    generators.header("Database Features", 2),
    generators.checklist([
      "PostgreSQL with extensions: pgcrypto, uuid-ossp, ltree",
      "UUID primary keys for all tables",
      "Automatic timestamps (created_at, updated_at)",
      "Hierarchical categories using ltree",
      "JSONB for flexible attributes",
      "Auto-increment control numbers",
      "Foreign key constraints for data integrity"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(400, 20, "Pawns Plus Database ERD", 32),

    // Authentication Layer (Top Left)
    diagramGenerators.rectangle(50, 80, 200, 180, "solid"),
    diagramGenerators.text(60, 90, "role", 18),
    diagramGenerators.text(60, 115, "• id (PK)", 14),
    diagramGenerators.text(60, 135, "• role_name", 14),

    diagramGenerators.rectangle(50, 280, 200, 220, "solid"),
    diagramGenerators.text(60, 290, "app_user", 18),
    diagramGenerators.text(60, 315, "• id (PK)", 14),
    diagramGenerators.text(60, 335, "• role_id (FK)", 14),
    diagramGenerators.text(60, 355, "• username", 14),
    diagramGenerators.text(60, 375, "• password_hash", 14),
    diagramGenerators.text(60, 395, "• first_name", 14),
    diagramGenerators.text(60, 415, "• last_name", 14),
    diagramGenerators.text(60, 435, "• is_active", 14),

    diagramGenerators.rectangle(50, 520, 200, 140, "solid"),
    diagramGenerators.text(60, 530, "app_user_session", 18),
    diagramGenerators.text(60, 555, "• id (PK)", 14),
    diagramGenerators.text(60, 575, "• user_id (FK)", 14),
    diagramGenerators.text(60, 595, "• token_hash", 14),
    diagramGenerators.text(60, 615, "• revoked_at", 14),

    // Arrows - Auth relationships
    diagramGenerators.arrow(150, 260, 150, 280), // role → app_user
    diagramGenerators.arrow(150, 500, 150, 520), // app_user → session

    // Customer (Top Center)
    diagramGenerators.rectangle(300, 80, 220, 300, "solid"),
    diagramGenerators.text(310, 90, "customer", 18),
    diagramGenerators.text(310, 115, "• id (PK)", 14),
    diagramGenerators.text(310, 135, "• first_name", 14),
    diagramGenerators.text(310, 155, "• last_name", 14),
    diagramGenerators.text(310, 175, "• date_of_birth", 14),
    diagramGenerators.text(310, 195, "• id_type", 14),
    diagramGenerators.text(310, 215, "• id_number", 14),
    diagramGenerators.text(310, 235, "• phone", 14),
    diagramGenerators.text(310, 255, "• email", 14),
    diagramGenerators.text(310, 275, "• address", 14),
    diagramGenerators.text(310, 295, "• employer_name", 14),
    diagramGenerators.text(310, 315, "• ... (50+ fields)", 14),

    // Pawn Ticket (Center)
    diagramGenerators.rectangle(300, 420, 220, 240, "solid"),
    diagramGenerators.text(310, 430, "pawn_ticket", 18),
    diagramGenerators.text(310, 455, "• id (PK)", 14),
    diagramGenerators.text(310, 475, "• customer_id (FK)", 14),
    diagramGenerators.text(310, 495, "• control_number", 14),
    diagramGenerators.text(310, 515, "• transaction_type", 14),
    diagramGenerators.text(310, 535, "• status", 14),
    diagramGenerators.text(310, 555, "• pawn_amount", 14),
    diagramGenerators.text(310, 575, "• maturity_date", 14),
    diagramGenerators.text(310, 595, "• created_by (FK)", 14),

    // Arrow - customer → pawn_ticket
    diagramGenerators.arrow(410, 380, 410, 420),

    // Inventory Category (Top Right)
    diagramGenerators.rectangle(570, 80, 220, 180, "solid"),
    diagramGenerators.text(580, 90, "inventory_category", 18),
    diagramGenerators.text(580, 115, "• id (PK)", 14),
    diagramGenerators.text(580, 135, "• name", 14),
    diagramGenerators.text(580, 155, "• parent_id (FK)", 14),
    diagramGenerators.text(580, 175, "• path (ltree)", 14),
    diagramGenerators.text(580, 195, "• level", 14),

    // Inventory Item (Right Center)
    diagramGenerators.rectangle(570, 300, 220, 260, "solid"),
    diagramGenerators.text(580, 310, "inventory_item", 18),
    diagramGenerators.text(580, 335, "• id (PK)", 14),
    diagramGenerators.text(580, 355, "• category_id (FK)", 14),
    diagramGenerators.text(580, 375, "• inventory_number", 14),
    diagramGenerators.text(580, 395, "• serial_number", 14),
    diagramGenerators.text(580, 415, "• description", 14),
    diagramGenerators.text(580, 435, "• status", 14),
    diagramGenerators.text(580, 455, "• cost", 14),
    diagramGenerators.text(580, 475, "• extra (JSONB)", 14),
    diagramGenerators.text(580, 495, "• attributes (JSONB)", 14),

    // Arrow - category → item
    diagramGenerators.arrow(680, 260, 680, 300),

    // Pawn Ticket Item (Junction - Center Right)
    diagramGenerators.rectangle(570, 600, 220, 140, "solid"),
    diagramGenerators.text(580, 610, "pawn_ticket_item", 18),
    diagramGenerators.text(580, 635, "• id (PK)", 14),
    diagramGenerators.text(580, 655, "• pawn_ticket_id (FK)", 14),
    diagramGenerators.text(580, 675, "• inventory_item_id (FK)", 14),
    diagramGenerators.text(580, 695, "• item_value", 14),

    // Arrows - pawn_ticket ← pawn_ticket_item → inventory_item
    diagramGenerators.arrow(520, 550, 570, 660),
    diagramGenerators.arrow(680, 560, 680, 600),

    // Store Transaction (Bottom Left)
    diagramGenerators.rectangle(50, 700, 200, 200, "solid"),
    diagramGenerators.text(60, 710, "store_transaction", 18),
    diagramGenerators.text(60, 735, "• id (PK)", 14),
    diagramGenerators.text(60, 755, "• pawn_ticket_id (FK)", 14),
    diagramGenerators.text(60, 775, "• customer_id (FK)", 14),
    diagramGenerators.text(60, 795, "• type_id", 14),
    diagramGenerators.text(60, 815, "• total_amount", 14),
    diagramGenerators.text(60, 835, "• created_by (FK)", 14),

    // Store Transaction Tender
    diagramGenerators.rectangle(280, 700, 200, 160, "solid"),
    diagramGenerators.text(290, 710, "store_trans_tender", 18),
    diagramGenerators.text(290, 735, "• id (PK)", 14),
    diagramGenerators.text(290, 755, "• transaction_id (FK)", 14),
    diagramGenerators.text(290, 775, "• tender_type_id", 14),
    diagramGenerators.text(290, 795, "• amount", 14),

    // Store Transaction Item
    diagramGenerators.rectangle(510, 780, 200, 140, "solid"),
    diagramGenerators.text(520, 790, "store_trans_item", 18),
    diagramGenerators.text(520, 815, "• id (PK)", 14),
    diagramGenerators.text(520, 835, "• transaction_id (FK)", 14),
    diagramGenerators.text(520, 855, "• inventory_item_id (FK)", 14),

    // Arrows - store transaction relationships
    diagramGenerators.arrow(410, 660, 150, 700), // pawn_ticket → transaction
    diagramGenerators.arrow(250, 800, 280, 800), // transaction → tender
    diagramGenerators.arrow(480, 850, 510, 850), // transaction → item
    diagramGenerators.arrow(680, 740, 710, 850), // item → inventory

    // System Tables (Far Right)
    diagramGenerators.rectangle(830, 300, 180, 120, "solid"),
    diagramGenerators.text(840, 310, "app_settings", 18),
    diagramGenerators.text(840, 335, "• id (PK)", 14),
    diagramGenerators.text(840, 355, "• key", 14),
    diagramGenerators.text(840, 375, "• value", 14),

    diagramGenerators.rectangle(830, 450, 180, 140, "solid"),
    diagramGenerators.text(840, 460, "gunlog", 18),
    diagramGenerators.text(840, 485, "• id (PK)", 14),
    diagramGenerators.text(840, 505, "• inventory_item_id", 14),
    diagramGenerators.text(840, 525, "• manufacturer", 14),
    diagramGenerators.text(840, 545, "• caliber", 14),

    // Legend
    diagramGenerators.rectangle(830, 650, 180, 100, "hachure"),
    diagramGenerators.text(840, 660, "Legend", 16),
    diagramGenerators.text(840, 685, "PK = Primary Key", 14),
    diagramGenerators.text(840, 705, "FK = Foreign Key", 14),
    diagramGenerators.text(840, 725, "Arrows = Relationships", 14)
  ];

  return createFile("1. Database Schema ERD", documentBlocks, diagramElements);
};

// Auto-run
console.log('📊 Creating Database ERD...');
const erdFileId = createDatabaseERD();
console.log(`File ID: ${erdFileId}`);
