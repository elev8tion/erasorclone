// 4. PAWN TICKET CREATION FLOW
// Load create-pawns-plus-visualizations.js first

const createPawnTicketFlow = () => {
  const documentBlocks = [
    generators.header("Pawn Ticket Creation Flow", 1),
    generators.paragraph("Complete workflow for creating a pawn ticket with multiple items using the Unit of Work pattern."),

    generators.header("Business Process Overview", 2),
    generators.paragraph("A pawn ticket represents a pawn loan or purchase transaction where a customer brings items to the pawn shop."),
    generators.list([
      "<b>Pawn Transaction</b>: Customer receives loan, items held as collateral",
      "<b>Purchase Transaction</b>: Customer sells items outright to the shop",
      "Each ticket can contain multiple inventory items",
      "Generates unique control number from database sequence",
      "Creates financial transaction records automatically"
    ]),

    generators.header("Prerequisites", 2),
    generators.checklist([
      "Customer record must exist in database",
      "Inventory items must be created first",
      "User must be authenticated",
      "User must have 'sales_associate' role or higher"
    ]),

    generators.header("API Request", 2),
    generators.paragraph("Endpoint: <b>POST /api/pawn-ticket</b>"),
    generators.paragraph("Request body structure:"),
    generators.list([
      "customerId: UUID",
      "transactionType: 'PAWN' | 'PURCHASE'",
      "pawnAmount: decimal",
      "maturityDate: date (for pawn loans)",
      "items: array of { inventoryItemId, itemValue }"
    ]),

    generators.header("Processing Steps", 2),
    generators.list([
      "<b>1. Validate Request</b>: Zod schema validates all fields",
      "<b>2. Start Transaction</b>: PostgreSQL BEGIN",
      "<b>3. Get Control Number</b>: Auto-increment from app_settings",
      "<b>4. Create Pawn Ticket</b>: Insert into pawn_ticket table",
      "<b>5. Link Items</b>: Insert into pawn_ticket_item (junction table)",
      "<b>6. Create Transaction</b>: Insert into store_transaction",
      "<b>7. Update Inventory</b>: Mark items with ticket reference",
      "<b>8. Commit Transaction</b>: COMMIT or ROLLBACK on error"
    ], "ordered"),

    generators.header("Database Operations", 2),
    generators.paragraph("The Unit of Work pattern ensures all operations succeed or fail together:"),
    generators.list([
      "Single database transaction wraps all operations",
      "If any step fails, entire transaction is rolled back",
      "Control number increment is atomic (prevents duplicates)",
      "Foreign key constraints ensure referential integrity"
    ]),

    generators.header("Response", 2),
    generators.paragraph("On success, returns:"),
    generators.list([
      "Complete pawn ticket object with ID",
      "Control number assigned",
      "List of linked items with values",
      "Creation timestamp and user info"
    ]),

    generators.header("Error Scenarios", 2),
    generators.list([
      "<b>Customer not found</b>: 404 Not Found",
      "<b>Item already pawned</b>: 400 Bad Request",
      "<b>Unauthorized user</b>: 401 Unauthorized",
      "<b>Validation failure</b>: 400 with Zod errors",
      "<b>Database error</b>: 500 with rollback"
    ]),

    generators.header("Post-Creation Actions", 2),
    generators.checklist([
      "Print pawn ticket receipt",
      "Update customer transaction history",
      "Log compliance data (if firearms involved)",
      "Send automated notifications (optional)",
      "Update inventory status to 'pawned' or 'purchased'"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(300, 20, "Pawn Ticket Creation - Sequence Diagram", 28),

    // Actors/Systems
    diagramGenerators.text(50, 70, "CLIENT", 16),
    diagramGenerators.text(250, 70, "API LAYER", 16),
    diagramGenerators.text(450, 70, "USE CASE", 16),
    diagramGenerators.text(680, 70, "REPOSITORIES", 16),
    diagramGenerators.text(930, 70, "DATABASE", 16),

    // Vertical lifelines
    diagramGenerators.rectangle(85, 90, 3, 850, "solid"),
    diagramGenerators.rectangle(305, 90, 3, 850, "solid"),
    diagramGenerators.rectangle(500, 90, 3, 850, "solid"),
    diagramGenerators.rectangle(730, 90, 3, 850, "solid"),
    diagramGenerators.rectangle(975, 90, 3, 850, "solid"),

    // Step 1: Client request
    diagramGenerators.arrow(88, 120, 303, 120),
    diagramGenerators.text(95, 110, "POST /api/pawn-ticket", 12),
    diagramGenerators.text(95, 130, "{ customerId, items[], amount }", 11),

    // Step 2: Controller validates auth
    diagramGenerators.rectangle(280, 140, 55, 30, "solid"),
    diagramGenerators.text(285, 155, "Auth check", 11),

    // Step 3: Call use case
    diagramGenerators.arrow(308, 180, 498, 180),
    diagramGenerators.text(320, 170, "CreatePawnTicketWithItemsUseCase", 11),

    // Step 4: Validate input
    diagramGenerators.rectangle(475, 200, 55, 30, "solid"),
    diagramGenerators.text(480, 215, "Validate", 11),

    // Step 5: Begin transaction
    diagramGenerators.arrow(503, 250, 728, 250),
    diagramGenerators.text(510, 240, "beginTransaction()", 11),
    diagramGenerators.arrow(730, 270, 973, 270),
    diagramGenerators.text(740, 260, "BEGIN", 11),

    // Step 6: Get control number
    diagramGenerators.arrow(503, 300, 728, 300),
    diagramGenerators.text(510, 290, "getNextControlNumber()", 11),
    diagramGenerators.arrow(730, 320, 973, 320),
    diagramGenerators.text(740, 310, "SELECT & UPDATE app_settings", 10),
    diagramGenerators.arrow(973, 340, 730, 340),
    diagramGenerators.text(740, 350, "control_number: 10234", 10),

    // Step 7: Create pawn ticket
    diagramGenerators.arrow(503, 380, 728, 380),
    diagramGenerators.text(510, 370, "createPawnTicket()", 11),
    diagramGenerators.arrow(730, 400, 973, 400),
    diagramGenerators.text(740, 390, "INSERT INTO pawn_ticket", 10),
    diagramGenerators.arrow(973, 420, 730, 420),
    diagramGenerators.text(740, 430, "pawn_ticket_id", 10),

    // Step 8: Link items (loop)
    diagramGenerators.rectangle(460, 450, 560, 120, "hachure"),
    diagramGenerators.text(470, 460, "LOOP [for each item]", 12),
    diagramGenerators.arrow(503, 490, 728, 490),
    diagramGenerators.text(510, 480, "linkItemToTicket(item)", 11),
    diagramGenerators.arrow(730, 510, 973, 510),
    diagramGenerators.text(740, 500, "INSERT INTO pawn_ticket_item", 10),
    diagramGenerators.arrow(730, 540, 973, 540),
    diagramGenerators.text(740, 530, "UPDATE inventory_item status", 10),

    // Step 9: Create store transaction
    diagramGenerators.arrow(503, 600, 728, 600),
    diagramGenerators.text(510, 590, "createStoreTransaction()", 11),
    diagramGenerators.arrow(730, 620, 973, 620),
    diagramGenerators.text(740, 610, "INSERT INTO store_transaction", 10),
    diagramGenerators.arrow(730, 650, 973, 650),
    diagramGenerators.text(740, 640, "INSERT INTO store_transaction_item", 9),

    // Step 10: Commit
    diagramGenerators.arrow(503, 690, 728, 690),
    diagramGenerators.text(510, 680, "commit()", 11),
    diagramGenerators.arrow(730, 710, 973, 710),
    diagramGenerators.text(740, 700, "COMMIT", 11),

    // Step 11: Return response
    diagramGenerators.arrow(498, 750, 308, 750),
    diagramGenerators.text(320, 740, "PawnTicket object", 11),
    diagramGenerators.arrow(303, 770, 88, 770),
    diagramGenerators.text(95, 760, "201 Created", 11),
    diagramGenerators.text(95, 780, "{ id, controlNumber, items }", 11),

    // Success path
    diagramGenerators.rectangle(50, 820, 960, 60, "solid"),
    diagramGenerators.text(60, 835, "✓ Success: Pawn ticket created with control number 10234", 14),
    diagramGenerators.text(60, 855, "All items linked, inventory updated, financial transaction recorded", 12),

    // Error path (alternative)
    diagramGenerators.rectangle(50, 900, 960, 60, "hachure"),
    diagramGenerators.text(60, 915, "✗ Error: If any step fails → ROLLBACK transaction", 14),
    diagramGenerators.text(60, 935, "Return 400/500 error, no partial data saved", 12),

    // Data structures
    diagramGenerators.text(50, 1000, "Data Structures:", 16),
    diagramGenerators.text(50, 1025, "PawnTicket: { id, customerId, controlNumber, type, status, amount, maturityDate }", 12),
    diagramGenerators.text(50, 1045, "PawnTicketItem: { pawnTicketId, inventoryItemId, itemValue }", 12),
    diagramGenerators.text(50, 1065, "StoreTransaction: { pawnTicketId, customerId, typeId, totalAmount }", 12)
  ];

  return createFile("4. Pawn Ticket Creation Flow", documentBlocks, diagramElements);
};

console.log('🎫 Creating Pawn Ticket Flow...');
const ticketFileId = createPawnTicketFlow();
console.log(`File ID: ${ticketFileId}`);
