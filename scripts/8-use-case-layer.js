// 8. USE CASE LAYER (CQRS Pattern)
// Load create-pawns-plus-visualizations.js first

const createUseCaseLayer = () => {
  const documentBlocks = [
    generators.header("Use Case Layer - CQRS Pattern", 1),
    generators.paragraph("Command Query Responsibility Segregation (CQRS) separates read and write operations for clarity and scalability."),

    generators.header("CQRS Overview", 2),
    generators.paragraph("The application layer is organized into Commands (writes) and Queries (reads):"),
    generators.list([
      "<b>Commands</b>: Modify state (Create, Update, Delete)",
      "<b>Queries</b>: Read state (List, Find, Get)",
      "Clear separation makes code easier to understand and test",
      "Each use case has single responsibility"
    ]),

    generators.header("Use Cases by Domain", 2),

    generators.header("App User Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "CreateAppUserUseCase - Register new user with role",
      "UpdateAppUserUseCase - Modify user details",
      "DeleteAppUserUseCase - Remove user (soft delete)"
    ]),
    generators.paragraph("<b>Queries:</b>"),
    generators.list([
      "ListAppUserUseCase - Get all users with filtering"
    ]),

    generators.header("Auth Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "LoginUseCase - Authenticate user, generate tokens",
      "RefreshTokenUseCase - Rotate tokens for extended session",
      "LogoutUseCase - Revoke refresh token, end session"
    ]),

    generators.header("Customer Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "CreateCustomerUseCase - Add new customer",
      "UpdateCustomerUseCase - Modify customer info",
      "DeleteCustomerUseCase - Remove customer (admin/manager)"
    ]),
    generators.paragraph("<b>Queries:</b>"),
    generators.list([
      "FindCustomerUseCase - Search with flexible criteria",
      "GetCustomerByIdUseCase - Retrieve single customer"
    ]),

    generators.header("Inventory Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "CreateInventoryCategoryUseCase - Add category to tree",
      "CreateInventoryItemUseCase - Add item with attributes",
      "UpdateInventoryItemUseCase - Modify item details/status",
      "DeleteInventoryItemUseCase - Remove item (if not pawned)"
    ]),
    generators.paragraph("<b>Queries:</b>"),
    generators.list([
      "GetInventoryCategoryTreeUseCase - Full hierarchy",
      "GetInventoryItemByIdUseCase - Single item by UUID",
      "GetInventoryItemByInventoryNumberUseCase - By inventory #",
      "GetInventoryItemBySerialNumberUseCase - By serial #"
    ]),

    generators.header("Pawn Ticket Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "CreatePawnTicketUseCase - Basic ticket creation",
      "CreatePawnTicketWithItemsUseCase - Ticket + items (Unit of Work)"
    ]),
    generators.paragraph("<b>Queries:</b>"),
    generators.list([
      "ListPawnTicketsByControlNumberUseCase - Find by control #",
      "ListPawnTicketsByCustomerUseCase - All tickets for customer",
      "ListActivePawnTicketsByCustomerUseCase - Only active tickets",
      "FindPawnTicketsByCustomerUseCase - Search with filters"
    ]),

    generators.header("Store Transaction Domain", 3),
    generators.paragraph("<b>Commands:</b>"),
    generators.list([
      "CreateStoreTransactionUseCase - Record financial transaction"
    ]),
    generators.paragraph("<b>Queries:</b>"),
    generators.list([
      "ListStoreTransactionsByCustomerUseCase - Customer history",
      "ListStoreTransactionsByDateRangeUseCase - Date-filtered report"
    ]),

    generators.header("Use Case Structure", 2),
    generators.paragraph("Each use case follows this pattern:"),
    generators.list([
      "Input DTO (Data Transfer Object) with Zod validation",
      "Output DTO with result data",
      "execute() method with business logic",
      "Dependencies injected via constructor",
      "Repository interfaces (not implementations)"
    ], "ordered"),

    generators.header("Example: CreateCustomerUseCase", 2),
    generators.paragraph("Input DTO validates required fields, output returns created customer with ID"),

    generators.header("Benefits of CQRS", 2),
    generators.checklist([
      "Clear separation of concerns",
      "Easier to test (single responsibility)",
      "Optimized queries vs commands",
      "Independent scaling (could use read replicas)",
      "Better code organization",
      "Explicit contracts via DTOs"
    ]),

    generators.header("Testing Strategy", 2),
    generators.list([
      "<b>Unit Tests</b>: Mock repositories, test use case logic",
      "<b>Integration Tests</b>: Test full flow through API",
      "Each use case has dedicated test file",
      "Test success paths and error scenarios"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(300, 20, "Use Case Layer - CQRS Pattern", 28),

    // CQRS Overview
    diagramGenerators.text(50, 70, "COMMAND QUERY RESPONSIBILITY SEGREGATION", 18),

    // Commands (Left)
    diagramGenerators.rectangle(50, 110, 380, 400, "solid"),
    diagramGenerators.text(60, 125, "COMMANDS (Write Operations)", 18),
    diagramGenerators.text(60, 150, "Modify system state", 14),

    diagramGenerators.text(70, 180, "App User:", 14),
    diagramGenerators.text(80, 200, "• CreateAppUserUseCase", 12),
    diagramGenerators.text(80, 220, "• UpdateAppUserUseCase", 12),
    diagramGenerators.text(80, 240, "• DeleteAppUserUseCase", 12),

    diagramGenerators.text(70, 270, "Customer:", 14),
    diagramGenerators.text(80, 290, "• CreateCustomerUseCase", 12),
    diagramGenerators.text(80, 310, "• UpdateCustomerUseCase", 12),
    diagramGenerators.text(80, 330, "• DeleteCustomerUseCase", 12),

    diagramGenerators.text(70, 360, "Inventory:", 14),
    diagramGenerators.text(80, 380, "• CreateInventoryCategoryUseCase", 12),
    diagramGenerators.text(80, 400, "• CreateInventoryItemUseCase", 12),
    diagramGenerators.text(80, 420, "• UpdateInventoryItemUseCase", 12),
    diagramGenerators.text(80, 440, "• DeleteInventoryItemUseCase", 12),

    diagramGenerators.text(70, 470, "Pawn Ticket:", 14),
    diagramGenerators.text(80, 490, "• CreatePawnTicketWithItemsUseCase", 12),

    // Queries (Right)
    diagramGenerators.rectangle(480, 110, 420, 400, "solid"),
    diagramGenerators.text(490, 125, "QUERIES (Read Operations)", 18),
    diagramGenerators.text(490, 150, "Read system state (no modifications)", 14),

    diagramGenerators.text(500, 180, "App User:", 14),
    diagramGenerators.text(510, 200, "• ListAppUserUseCase", 12),

    diagramGenerators.text(500, 230, "Customer:", 14),
    diagramGenerators.text(510, 250, "• FindCustomerUseCase", 12),
    diagramGenerators.text(510, 270, "• GetCustomerByIdUseCase", 12),

    diagramGenerators.text(500, 300, "Inventory:", 14),
    diagramGenerators.text(510, 320, "• GetInventoryCategoryTreeUseCase", 12),
    diagramGenerators.text(510, 340, "• GetInventoryItemByIdUseCase", 12),
    diagramGenerators.text(510, 360, "• GetInventoryItemByInventoryNumberUseCase", 12),
    diagramGenerators.text(510, 380, "• GetInventoryItemBySerialNumberUseCase", 12),

    diagramGenerators.text(500, 410, "Pawn Ticket:", 14),
    diagramGenerators.text(510, 430, "• ListPawnTicketsByControlNumberUseCase", 12),
    diagramGenerators.text(510, 450, "• ListPawnTicketsByCustomerUseCase", 12),
    diagramGenerators.text(510, 470, "• ListActivePawnTicketsByCustomerUseCase", 12),

    // Separator
    diagramGenerators.arrow(455, 300, 465, 300),
    diagramGenerators.text(430, 280, "VS", 16),

    // Use Case Structure Example
    diagramGenerators.text(50, 560, "Use Case Structure Example", 18),

    diagramGenerators.rectangle(50, 590, 850, 280, "hachure"),
    diagramGenerators.text(60, 605, "CreateCustomerUseCase", 16),

    diagramGenerators.text(60, 635, "Input DTO:", 14),
    diagramGenerators.text(70, 655, "interface CreateCustomerInput {", 12),
    diagramGenerators.text(70, 675, "  firstName: string; lastName: string; dateOfBirth: Date;", 12),
    diagramGenerators.text(70, 695, "  address: string; phone?: string; email?: string;", 12),
    diagramGenerators.text(70, 715, "  // ... additional fields", 12),
    diagramGenerators.text(70, 735, "}", 12),

    diagramGenerators.text(480, 635, "Execute Method:", 14),
    diagramGenerators.text(490, 655, "async execute(input: CreateCustomerInput) {", 12),
    diagramGenerators.text(490, 675, "  // 1. Validate input (Zod)", 12),
    diagramGenerators.text(490, 695, "  // 2. Check for duplicates", 12),
    diagramGenerators.text(490, 715, "  // 3. Create customer entity", 12),
    diagramGenerators.text(490, 735, "  // 4. Save via repository", 12),
    diagramGenerators.text(490, 755, "  // 5. Return output DTO", 12),
    diagramGenerators.text(490, 775, "}", 12),

    diagramGenerators.text(60, 805, "Dependencies (Constructor Injection):", 14),
    diagramGenerators.text(70, 825, "constructor(", 12),
    diagramGenerators.text(70, 845, "  private customerRepository: CustomerRepository", 12),
    diagramGenerators.text(70, 865, ")", 12),

    // Flow Diagram
    diagramGenerators.text(50, 920, "Request Flow Through Layers", 18),

    diagramGenerators.rectangle(50, 950, 140, 60, "solid"),
    diagramGenerators.text(60, 970, "HTTP Controller", 14),
    diagramGenerators.text(60, 990, "(API Layer)", 12),

    diagramGenerators.arrow(190, 980, 240, 980),
    diagramGenerators.text(195, 970, "calls", 10),

    diagramGenerators.rectangle(240, 950, 140, 60, "solid"),
    diagramGenerators.text(250, 970, "Use Case", 14),
    diagramGenerators.text(250, 990, "(Application)", 12),

    diagramGenerators.arrow(380, 980, 430, 980),
    diagramGenerators.text(385, 970, "uses", 10),

    diagramGenerators.rectangle(430, 950, 140, 60, "solid"),
    diagramGenerators.text(440, 970, "Repository", 14),
    diagramGenerators.text(440, 990, "(Infrastructure)", 12),

    diagramGenerators.arrow(570, 980, 620, 980),
    diagramGenerators.text(575, 970, "queries", 10),

    diagramGenerators.rectangle(620, 950, 140, 60, "solid"),
    diagramGenerators.text(630, 970, "Database", 14),
    diagramGenerators.text(630, 990, "(PostgreSQL)", 12),

    // Benefits
    diagramGenerators.rectangle(50, 1060, 850, 80, "hachure"),
    diagramGenerators.text(60, 1075, "✓ Benefits of CQRS in Pawns Plus:", 16),
    diagramGenerators.text(60, 1100, "• Clear separation makes codebase easier to navigate", 12),
    diagramGenerators.text(60, 1120, "• Each use case is independently testable with mocked repositories", 12)
  ];

  return createFile("8. Use Case Layer (CQRS)", documentBlocks, diagramElements);
};

console.log('🎯 Creating Use Case Layer...');
const useCaseFileId = createUseCaseLayer();
console.log(`File ID: ${useCaseFileId}`);
