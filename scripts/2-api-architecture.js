// 2. API ARCHITECTURE
// Load create-pawns-plus-visualizations.js first

const createAPIArchitecture = () => {
  const documentBlocks = [
    generators.header("Pawns Plus API Architecture", 1),
    generators.paragraph("Clean Architecture / Domain-Driven Design (DDD) implementation with clear separation of concerns."),

    generators.header("Architecture Layers", 2),

    generators.header("1. Domain Layer", 3),
    generators.paragraph("Core business entities and repository interfaces. No dependencies on other layers."),
    generators.list([
      "AppUser, Customer, InventoryItem, PawnTicket entities",
      "Repository interfaces (contracts)",
      "Value objects and domain logic",
      "Pure business rules"
    ]),

    generators.header("2. Application Layer", 3),
    generators.paragraph("Use cases and application services. Orchestrates domain logic."),
    generators.list([
      "Use Cases (CQRS pattern - Commands & Queries)",
      "AuthService for authentication",
      "DTOs (Data Transfer Objects)",
      "Application-specific errors"
    ]),

    generators.header("3. Infrastructure Layer", 3),
    generators.paragraph("External concerns like database, file system, external APIs."),
    generators.list([
      "PostgreSQL repository implementations",
      "SQL query files (organized by domain)",
      "Database connection pool",
      "Unit of Work pattern for transactions",
      "Logger utility"
    ]),

    generators.header("4. Interface/API Layer", 3),
    generators.paragraph("HTTP REST API with Express.js framework."),
    generators.list([
      "Controllers (handle HTTP requests)",
      "Routes (endpoint definitions)",
      "Middleware (auth, error handling, RBAC)",
      "Swagger/OpenAPI documentation"
    ]),

    generators.header("API Endpoints by Domain", 2),

    generators.header("Authentication", 3),
    generators.list([
      "POST /api/auth/login - User login",
      "POST /api/auth/refresh - Refresh access token",
      "POST /api/auth/logout - Revoke refresh token"
    ]),

    generators.header("App Users", 3),
    generators.list([
      "GET /api/app-users - List all users",
      "POST /api/app-users - Create user (admin/manager)",
      "PUT /api/app-users/:id - Update user",
      "DELETE /api/app-users/:id - Delete user"
    ]),

    generators.header("Customers", 3),
    generators.list([
      "GET /api/customer - Search customers",
      "GET /api/customer/:id - Get by ID",
      "POST /api/customer - Create customer",
      "PUT /api/customer/:id - Update customer",
      "DELETE /api/customer/:id - Delete (admin/manager)"
    ]),

    generators.header("Inventory", 3),
    generators.list([
      "POST /api/inventory-items - Create item",
      "GET /api/inventory-items/:id - Get by ID",
      "GET /api/inventory-items/by-serial-number/:serial",
      "PUT /api/inventory-items/:id - Update item",
      "GET /api/category/tree - Get category hierarchy"
    ]),

    generators.header("Pawn Tickets", 3),
    generators.list([
      "POST /api/pawn-ticket - Create ticket with items",
      "GET /api/pawn-ticket/control/:number - Get by control number",
      "GET /api/pawn-ticket/customer/:id - List by customer"
    ]),

    generators.header("Technical Features", 2),
    generators.checklist([
      "JWT authentication with refresh tokens",
      "Role-based access control (admin, manager, sales_associate)",
      "Request validation using Zod schemas",
      "Dependency injection container",
      "PostgreSQL transactions for data consistency",
      "Swagger UI at /api-docs",
      "CORS enabled",
      "Error handling middleware"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(350, 20, "Clean Architecture Layers", 32),

    // Layer 1 - Domain (Core - Center)
    diagramGenerators.rectangle(350, 250, 280, 200, "solid"),
    diagramGenerators.text(360, 260, "DOMAIN LAYER", 20),
    diagramGenerators.text(360, 290, "Entities & Interfaces", 16),
    diagramGenerators.text(360, 315, "• AppUser", 14),
    diagramGenerators.text(360, 335, "• Customer", 14),
    diagramGenerators.text(360, 355, "• InventoryItem", 14),
    diagramGenerators.text(360, 375, "• PawnTicket", 14),
    diagramGenerators.text(360, 395, "• StoreTransaction", 14),
    diagramGenerators.text(360, 415, "Repository Interfaces", 14),

    // Layer 2 - Application (Wraps Domain)
    diagramGenerators.rectangle(250, 150, 480, 400, "hachure"),
    diagramGenerators.text(260, 160, "APPLICATION LAYER", 20),
    diagramGenerators.text(260, 570, "Use Cases (CQRS)", 16),
    diagramGenerators.text(260, 595, "• Commands: Create, Update, Delete", 14),
    diagramGenerators.text(260, 615, "• Queries: List, Find, Get", 14),
    diagramGenerators.text(260, 635, "• AuthService", 14),

    // Layer 3 - Infrastructure (Left & Bottom)
    diagramGenerators.rectangle(50, 80, 150, 600, "hachure"),
    diagramGenerators.text(60, 90, "INFRASTRUCTURE", 18),
    diagramGenerators.text(60, 120, "PostgreSQL", 16),
    diagramGenerators.text(60, 145, "• PgAppUserRepo", 14),
    diagramGenerators.text(60, 165, "• PgCustomerRepo", 14),
    diagramGenerators.text(60, 185, "• PgInventoryRepo", 14),
    diagramGenerators.text(60, 205, "• PgPawnTicketRepo", 14),
    diagramGenerators.text(60, 245, "SQL Files", 16),
    diagramGenerators.text(60, 270, "• Commands", 14),
    diagramGenerators.text(60, 290, "• Queries", 14),
    diagramGenerators.text(60, 330, "Database", 16),
    diagramGenerators.text(60, 355, "• Connection Pool", 14),
    diagramGenerators.text(60, 375, "• Migrations", 14),
    diagramGenerators.text(60, 395, "• Unit of Work", 14),
    diagramGenerators.text(60, 435, "Utilities", 16),
    diagramGenerators.text(60, 460, "• Logger", 14),
    diagramGenerators.text(60, 480, "• SQL Loader", 14),

    // Layer 4 - API/Interface (Right side)
    diagramGenerators.rectangle(780, 80, 220, 600, "hachure"),
    diagramGenerators.text(790, 90, "API LAYER", 18),
    diagramGenerators.text(790, 120, "Controllers", 16),
    diagramGenerators.text(790, 145, "• AuthController", 14),
    diagramGenerators.text(790, 165, "• AppUserController", 14),
    diagramGenerators.text(790, 185, "• CustomerController", 14),
    diagramGenerators.text(790, 205, "• InventoryController", 14),
    diagramGenerators.text(790, 225, "• PawnTicketController", 14),
    diagramGenerators.text(790, 265, "Middleware", 16),
    diagramGenerators.text(790, 290, "• authMiddleware", 14),
    diagramGenerators.text(790, 310, "• roleMiddleware", 14),
    diagramGenerators.text(790, 330, "• errorMiddleware", 14),
    diagramGenerators.text(790, 370, "Routes", 16),
    diagramGenerators.text(790, 395, "• /api/auth", 14),
    diagramGenerators.text(790, 415, "• /api/app-users", 14),
    diagramGenerators.text(790, 435, "• /api/customer", 14),
    diagramGenerators.text(790, 455, "• /api/inventory-items", 14),
    diagramGenerators.text(790, 475, "• /api/pawn-ticket", 14),
    diagramGenerators.text(790, 515, "Documentation", 16),
    diagramGenerators.text(790, 540, "• Swagger UI", 14),
    diagramGenerators.text(790, 560, "• OpenAPI 3.0", 14),

    // Dependency arrows (show direction of dependencies)
    diagramGenerators.arrow(780, 350, 730, 350), // API → Application
    diagramGenerators.arrow(250, 350, 200, 350), // Application → Infrastructure
    diagramGenerators.text(240, 340, "implements", 12),
    diagramGenerators.text(735, 340, "uses", 12),

    // HTTP Client (external)
    diagramGenerators.rectangle(1050, 300, 150, 100, "solid"),
    diagramGenerators.text(1060, 310, "HTTP Client", 18),
    diagramGenerators.text(1060, 340, "• Browser", 14),
    diagramGenerators.text(1060, 360, "• Mobile App", 14),
    diagramGenerators.text(1060, 380, "• API Tools", 14),

    diagramGenerators.arrow(1050, 350, 1000, 350),

    // Database (external)
    diagramGenerators.rectangle(-200, 300, 150, 100, "solid"),
    diagramGenerators.text(-190, 310, "PostgreSQL", 18),
    diagramGenerators.text(-190, 340, "Database", 16),
    diagramGenerators.text(-190, 365, "pawns_plus_db", 14),

    diagramGenerators.arrow(50, 350, -50, 350),

    // Request Flow annotation
    diagramGenerators.text(350, 750, "← Request Flow: Client → API → Application → Domain ← Infrastructure →", 14),
    diagramGenerators.text(350, 770, "Dependencies point inward (Domain has no external dependencies)", 14)
  ];

  return createFile("2. API Architecture", documentBlocks, diagramElements);
};

console.log('🏗️ Creating API Architecture...');
const archFileId = createAPIArchitecture();
console.log(`File ID: ${archFileId}`);
