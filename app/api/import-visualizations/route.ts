import { NextResponse } from 'next/server';
import { createVisualizationFile } from '@/lib/visualization-loader';

export async function POST() {
  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

  const createFile = (fileName: string, documentBlocks: any[], diagramElements: any[]) => ({
    _id: generateId(),
    fileName,
    teamId: defaultTeam._id,
    createdBy: defaultUser._id,
    archive: false,
    document: JSON.stringify({ blocks: documentBlocks }),
    whiteboard: JSON.stringify({ elements: diagramElements, appState: { viewBackgroundColor: "#ffffff" } }),
    _creationTime: Date.now()
  });

  // Generate all 8 visualization files
  const files = [
    // 1. Database Schema ERD
    createFile(
      "1. Database Schema ERD",
      [
        generators.header("Pawns Plus Database Schema", 1),
        generators.paragraph("Complete Entity Relationship Diagram for the Pawns Plus pawn shop management system using PostgreSQL."),
        generators.header("Core Entities", 2),
        generators.list([
          "<b>role</b> - User roles (admin, manager, sales_associate)",
          "<b>app_user</b> - Application users with authentication",
          "<b>app_user_session</b> - JWT refresh token sessions",
          "<b>customer</b> - Customer records with 50+ fields",
          "<b>inventory_category</b> - Hierarchical categories (ltree)",
          "<b>inventory_item</b> - Product inventory with JSONB",
          "<b>pawn_ticket</b> - Pawn transaction records",
          "<b>pawn_ticket_item</b> - Junction table",
          "<b>store_transaction</b> - Financial transactions",
          "<b>store_transaction_tender</b> - Payment methods",
          "<b>store_transaction_item</b> - Line items",
          "<b>gunlog</b> - ATF compliance for firearms",
          "<b>app_settings</b> - System configuration"
        ]),
        generators.header("Key Features", 2),
        generators.checklist([
          "PostgreSQL with pgcrypto, uuid-ossp, ltree extensions",
          "UUID primary keys for all tables",
          "Automatic timestamps (created_at, updated_at)",
          "Hierarchical categories using ltree",
          "JSONB for flexible attributes",
          "Auto-increment control numbers",
          "Foreign key constraints"
        ])
      ],
      [
        diagramGenerators.text(400, 20, "Pawns Plus Database ERD", 32),
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
        diagramGenerators.arrow(150, 260, 150, 280),
        diagramGenerators.rectangle(300, 80, 220, 300, "solid"),
        diagramGenerators.text(310, 90, "customer", 18),
        diagramGenerators.text(310, 115, "• id (PK)", 14),
        diagramGenerators.text(310, 135, "• first_name", 14),
        diagramGenerators.text(310, 155, "• last_name", 14),
        diagramGenerators.text(310, 175, "• date_of_birth", 14),
        diagramGenerators.text(310, 195, "• phone", 14),
        diagramGenerators.text(310, 215, "• email", 14),
        diagramGenerators.text(310, 235, "• address", 14),
        diagramGenerators.text(310, 255, "• ... (50+ fields)", 14),
        diagramGenerators.rectangle(570, 80, 220, 180, "solid"),
        diagramGenerators.text(580, 90, "inventory_category", 18),
        diagramGenerators.text(580, 115, "• id (PK)", 14),
        diagramGenerators.text(580, 135, "• name", 14),
        diagramGenerators.text(580, 155, "• parent_id (FK)", 14),
        diagramGenerators.text(580, 175, "• path (ltree)", 14),
        diagramGenerators.rectangle(570, 300, 220, 200, "solid"),
        diagramGenerators.text(580, 310, "inventory_item", 18),
        diagramGenerators.text(580, 335, "• id (PK)", 14),
        diagramGenerators.text(580, 355, "• category_id (FK)", 14),
        diagramGenerators.text(580, 375, "• serial_number", 14),
        diagramGenerators.text(580, 395, "• status", 14),
        diagramGenerators.text(580, 415, "• attributes (JSONB)", 14),
        diagramGenerators.arrow(680, 260, 680, 300),
        diagramGenerators.rectangle(300, 420, 220, 180, "solid"),
        diagramGenerators.text(310, 430, "pawn_ticket", 18),
        diagramGenerators.text(310, 455, "• id (PK)", 14),
        diagramGenerators.text(310, 475, "• customer_id (FK)", 14),
        diagramGenerators.text(310, 495, "• control_number", 14),
        diagramGenerators.text(310, 515, "• amount", 14),
        diagramGenerators.arrow(410, 380, 410, 420)
      ]
    ),

    // 2. API Architecture
    createFile(
      "2. API Architecture",
      [
        generators.header("Pawns Plus API Architecture", 1),
        generators.paragraph("Clean Architecture / Domain-Driven Design (DDD) implementation with clear separation of concerns."),
        generators.header("Architecture Layers", 2),
        generators.list([
          "<b>Domain Layer</b>: Core entities, repository interfaces, business rules",
          "<b>Application Layer</b>: Use cases (CQRS), DTOs, application services",
          "<b>Infrastructure Layer</b>: PostgreSQL repositories, database, SQL files",
          "<b>API Layer</b>: Express controllers, routes, middleware"
        ], "ordered"),
        generators.header("API Endpoints", 2),
        generators.list([
          "POST /api/auth/login - User login",
          "POST /api/auth/refresh - Refresh tokens",
          "GET /api/customer - Search customers",
          "POST /api/pawn-ticket - Create pawn ticket",
          "GET /api/inventory-items/:id - Get item",
          "GET /api/store-transaction/by-customer/:id"
        ]),
        generators.header("Key Features", 2),
        generators.checklist([
          "JWT authentication with refresh tokens",
          "Role-based access control",
          "Request validation using Zod",
          "Dependency injection",
          "PostgreSQL transactions",
          "Swagger documentation at /api-docs"
        ])
      ],
      [
        diagramGenerators.text(350, 20, "Clean Architecture Layers", 32),
        diagramGenerators.rectangle(350, 250, 280, 200, "solid"),
        diagramGenerators.text(360, 260, "DOMAIN", 20),
        diagramGenerators.text(360, 290, "Entities & Interfaces", 14),
        diagramGenerators.text(360, 315, "• AppUser, Customer", 12),
        diagramGenerators.text(360, 335, "• InventoryItem", 12),
        diagramGenerators.text(360, 355, "• PawnTicket", 12),
        diagramGenerators.rectangle(250, 150, 480, 400, "hachure"),
        diagramGenerators.text(260, 160, "APPLICATION", 20),
        diagramGenerators.text(260, 570, "Use Cases (CQRS)", 14),
        diagramGenerators.rectangle(50, 80, 150, 600, "hachure"),
        diagramGenerators.text(60, 90, "INFRASTRUCTURE", 16),
        diagramGenerators.text(60, 120, "Repositories", 14),
        diagramGenerators.text(60, 145, "SQL Files", 14),
        diagramGenerators.rectangle(780, 80, 220, 600, "hachure"),
        diagramGenerators.text(790, 90, "API LAYER", 18),
        diagramGenerators.text(790, 120, "Controllers", 14),
        diagramGenerators.text(790, 145, "Routes", 14),
        diagramGenerators.text(790, 170, "Middleware", 14),
        diagramGenerators.arrow(780, 350, 730, 350),
        diagramGenerators.arrow(250, 350, 200, 350)
      ]
    ),

    // 3. Authentication & JWT Flow
    createFile(
      "3. Authentication & JWT Flow",
      [
        generators.header("Authentication & JWT Flow", 1),
        generators.paragraph("JWT-based authentication with refresh token rotation for secure session management."),
        generators.header("Token Strategy", 2),
        generators.list([
          "<b>Access Token</b>: JWT valid for 15 minutes",
          "<b>Refresh Token</b>: Stored as hash in database",
          "<b>Token Rotation</b>: New refresh token on each refresh"
        ]),
        generators.header("User Roles", 2),
        generators.list([
          "Admin (roleId: 1) - Full access",
          "Manager (roleId: 2) - Manage operations",
          "Sales Associate (roleId: 3) - Create tickets"
        ], "ordered"),
        generators.header("Login Flow", 2),
        generators.list([
          "User submits username + password",
          "System validates credentials",
          "Generate access_token (15min) + refresh_token",
          "Return both tokens to client",
          "Client stores tokens securely"
        ], "ordered"),
        generators.header("Security Features", 2),
        generators.checklist([
          "Passwords hashed with bcrypt (12 rounds)",
          "Refresh tokens stored as SHA-256 hashes",
          "JWT signed with HS256 algorithm",
          "Short-lived access tokens (15 min)",
          "Token rotation prevents replay attacks",
          "Session revocation support"
        ])
      ],
      [
        diagramGenerators.text(300, 20, "Authentication Flow", 28),
        diagramGenerators.rectangle(50, 80, 180, 100, "solid"),
        diagramGenerators.text(60, 90, "CLIENT", 20),
        diagramGenerators.text(60, 120, "Browser/Mobile", 14),
        diagramGenerators.arrow(230, 120, 400, 120),
        diagramGenerators.text(240, 110, "POST /api/auth/login", 12),
        diagramGenerators.rectangle(400, 80, 200, 100, "solid"),
        diagramGenerators.text(410, 90, "AuthController", 18),
        diagramGenerators.text(410, 120, "LoginUseCase", 14),
        diagramGenerators.arrow(600, 120, 750, 120),
        diagramGenerators.rectangle(750, 80, 220, 100, "solid"),
        diagramGenerators.text(760, 90, "AuthService", 18),
        diagramGenerators.text(760, 120, "• validateCredentials", 12),
        diagramGenerators.text(760, 140, "• generateTokens", 12),
        diagramGenerators.arrow(860, 180, 860, 280),
        diagramGenerators.rectangle(750, 280, 220, 100, "solid"),
        diagramGenerators.text(760, 290, "Database", 18),
        diagramGenerators.text(760, 320, "app_user", 14),
        diagramGenerators.text(760, 340, "app_user_session", 14),
        diagramGenerators.arrow(750, 140, 400, 140),
        diagramGenerators.arrow(230, 140, 50, 140),
        diagramGenerators.text(240, 150, "{access_token, refresh_token}", 11),
        diagramGenerators.rectangle(50, 450, 920, 80, "hachure"),
        diagramGenerators.text(60, 465, "JWT Structure", 16),
        diagramGenerators.text(60, 490, "Header: {alg: HS256, typ: JWT}", 12),
        diagramGenerators.text(400, 490, "Payload: {id, username, role, exp}", 12),
        diagramGenerators.text(700, 490, "Signature: HMAC-SHA256", 12)
      ]
    ),

    // 4. Pawn Ticket Creation Flow
    createFile(
      "4. Pawn Ticket Creation Flow",
      [
        generators.header("Pawn Ticket Creation Flow", 1),
        generators.paragraph("Complete workflow for creating a pawn ticket with multiple items using the Unit of Work pattern."),
        generators.header("Transaction Types", 2),
        generators.list([
          "<b>PAWN</b>: Customer receives loan, items held as collateral",
          "<b>PURCHASE</b>: Customer sells items outright"
        ]),
        generators.header("Processing Steps", 2),
        generators.list([
          "Validate request (Zod schema)",
          "Start PostgreSQL transaction (BEGIN)",
          "Get auto-increment control number",
          "Create pawn_ticket record",
          "Link items via pawn_ticket_item",
          "Create store_transaction record",
          "Update inventory item status",
          "Commit transaction (COMMIT)"
        ], "ordered"),
        generators.header("Unit of Work Pattern", 2),
        generators.paragraph("All operations wrapped in single database transaction - either all succeed or all fail (ROLLBACK)."),
        generators.checklist([
          "Atomic operations ensure data consistency",
          "Control number increment is thread-safe",
          "Foreign key constraints enforced",
          "Inventory status updated atomically"
        ])
      ],
      [
        diagramGenerators.text(250, 20, "Pawn Ticket Creation - Sequence", 28),
        diagramGenerators.text(50, 70, "CLIENT", 16),
        diagramGenerators.text(250, 70, "API", 16),
        diagramGenerators.text(450, 70, "USE CASE", 16),
        diagramGenerators.text(680, 70, "REPOSITORY", 16),
        diagramGenerators.text(930, 70, "DATABASE", 16),
        diagramGenerators.rectangle(85, 90, 3, 600, "solid"),
        diagramGenerators.rectangle(285, 90, 3, 600, "solid"),
        diagramGenerators.rectangle(485, 90, 3, 600, "solid"),
        diagramGenerators.rectangle(715, 90, 3, 600, "solid"),
        diagramGenerators.rectangle(965, 90, 3, 600, "solid"),
        diagramGenerators.arrow(88, 120, 283, 120),
        diagramGenerators.text(95, 110, "POST /api/pawn-ticket", 11),
        diagramGenerators.arrow(288, 150, 483, 150),
        diagramGenerators.text(295, 140, "CreatePawnTicketUseCase", 11),
        diagramGenerators.arrow(488, 200, 713, 200),
        diagramGenerators.text(495, 190, "beginTransaction()", 11),
        diagramGenerators.arrow(715, 220, 963, 220),
        diagramGenerators.text(725, 210, "BEGIN", 11),
        diagramGenerators.arrow(488, 270, 713, 270),
        diagramGenerators.text(495, 260, "createPawnTicket()", 11),
        diagramGenerators.arrow(715, 290, 963, 290),
        diagramGenerators.text(725, 280, "INSERT pawn_ticket", 11),
        diagramGenerators.arrow(488, 340, 713, 340),
        diagramGenerators.text(495, 330, "linkItems()", 11),
        diagramGenerators.arrow(715, 360, 963, 360),
        diagramGenerators.text(725, 350, "INSERT pawn_ticket_item", 10),
        diagramGenerators.arrow(488, 410, 713, 410),
        diagramGenerators.text(495, 400, "createTransaction()", 11),
        diagramGenerators.arrow(715, 430, 963, 430),
        diagramGenerators.text(725, 420, "INSERT store_transaction", 10),
        diagramGenerators.arrow(488, 480, 713, 480),
        diagramGenerators.text(495, 470, "commit()", 11),
        diagramGenerators.arrow(715, 500, 963, 500),
        diagramGenerators.text(725, 490, "COMMIT", 11),
        diagramGenerators.arrow(483, 550, 288, 550),
        diagramGenerators.arrow(283, 570, 88, 570),
        diagramGenerators.text(95, 560, "201 Created", 11)
      ]
    ),

    // 5. Customer Management
    createFile(
      "5. Customer Management",
      [
        generators.header("Customer Management System", 1),
        generators.paragraph("Comprehensive customer data management with flexible search and compliance tracking."),
        generators.header("Customer Data Model (50+ Fields)", 2),
        generators.list([
          "<b>Personal</b>: first_name, last_name, date_of_birth, ssn, gender, race",
          "<b>Contact</b>: phone, email, address, city, state, zip",
          "<b>ID Info</b>: id_type, id_number, id_state, id_expiration_date",
          "<b>Employer</b>: employer_name, employer_phone, occupation",
          "<b>Compliance</b>: thumbprint, ofac_check, pawn_license"
        ]),
        generators.header("Search Capabilities", 2),
        generators.list([
          "By last name (partial match)",
          "By first + last name",
          "By date of birth",
          "By ID document (type + number + state)"
        ]),
        generators.header("API Endpoints", 2),
        generators.list([
          "GET /api/customer - Search with criteria",
          "GET /api/customer/:id - Get by ID",
          "POST /api/customer - Create new",
          "PUT /api/customer/:id - Update",
          "DELETE /api/customer/:id - Delete (admin/manager)"
        ]),
        generators.checklist([
          "SSN encrypted using pgcrypto",
          "OFAC compliance tracking",
          "Audit trail with timestamps",
          "Role-based delete permissions"
        ])
      ],
      [
        diagramGenerators.text(300, 20, "Customer Management - CRUD", 28),
        diagramGenerators.text(50, 80, "CREATE", 18),
        diagramGenerators.rectangle(50, 110, 180, 80, "solid"),
        diagramGenerators.text(60, 120, "POST /api/customer", 14),
        diagramGenerators.text(60, 145, "{firstName, lastName,", 12),
        diagramGenerators.text(60, 165, " dob, address...}", 12),
        diagramGenerators.arrow(230, 150, 350, 150),
        diagramGenerators.rectangle(350, 110, 200, 80, "solid"),
        diagramGenerators.text(360, 120, "CreateCustomerUseCase", 14),
        diagramGenerators.text(360, 145, "Validate input", 12),
        diagramGenerators.arrow(550, 150, 670, 150),
        diagramGenerators.rectangle(670, 110, 200, 80, "solid"),
        diagramGenerators.text(680, 120, "CustomerRepository", 14),
        diagramGenerators.text(680, 145, "INSERT INTO customer", 12),
        diagramGenerators.text(50, 240, "READ/SEARCH", 18),
        diagramGenerators.rectangle(50, 270, 180, 100, "solid"),
        diagramGenerators.text(60, 280, "GET /api/customer", 14),
        diagramGenerators.text(60, 305, "?lastName=Smith", 12),
        diagramGenerators.text(60, 325, "?dateOfBirth=...", 12),
        diagramGenerators.arrow(230, 310, 350, 310),
        diagramGenerators.rectangle(350, 270, 200, 100, "solid"),
        diagramGenerators.text(360, 280, "FindCustomerUseCase", 14),
        diagramGenerators.text(360, 305, "Build query", 12),
        diagramGenerators.arrow(550, 310, 670, 310),
        diagramGenerators.rectangle(670, 270, 200, 100, "solid"),
        diagramGenerators.text(680, 280, "SQL Queries:", 14),
        diagramGenerators.text(680, 305, "• findByLastName", 12),
        diagramGenerators.text(680, 325, "• findByDOB", 12),
        diagramGenerators.text(50, 430, "UPDATE", 18),
        diagramGenerators.rectangle(50, 460, 820, 80, "hachure"),
        diagramGenerators.text(60, 475, "PUT /api/customer/:id → UpdateCustomerUseCase → UPDATE customer SET...", 14),
        diagramGenerators.text(50, 590, "DELETE (Admin/Manager Only)", 18),
        diagramGenerators.rectangle(50, 620, 820, 80, "hachure"),
        diagramGenerators.text(60, 635, "DELETE /api/customer/:id → Check active tickets → DELETE FROM customer", 14)
      ]
    ),

    // 6. Inventory System
    createFile(
      "6. Inventory System",
      [
        generators.header("Inventory Management System", 1),
        generators.paragraph("Hierarchical product categorization with flexible JSONB attributes for different item types."),
        generators.header("Hierarchical Categories (ltree)", 2),
        generators.list([
          "Electronics → Computers → Laptops",
          "Electronics → Phones",
          "Jewelry → Rings",
          "Jewelry → Necklaces",
          "Firearms (ATF compliance required)",
          "Musical Instruments"
        ]),
        generators.paragraph("Unlimited depth, fast ancestor/descendant queries using PostgreSQL ltree extension."),
        generators.header("Inventory Items", 2),
        generators.list([
          "<b>Core Fields</b>: id, category_id, inventory_number, serial_number, status, cost, retail_price",
          "<b>JSONB Attributes</b>: Flexible category-specific properties",
          "<b>Status Codes</b>: I (In Stock), P (Pawned), S (Sold), L (Layaway), etc."
        ]),
        generators.header("JSONB Examples", 2),
        generators.list([
          "Electronics: {brand, model, storage, ram, condition}",
          "Jewelry: {material, karat, stone_type, weight_grams}",
          "Firearms: {make, model, caliber, serial} + gunlog table"
        ]),
        generators.checklist([
          "Fast tree queries using ltree",
          "Category-specific validation",
          "Serial number tracking",
          "Status lifecycle management",
          "Firearms compliance (ATF)"
        ])
      ],
      [
        diagramGenerators.text(250, 20, "Inventory System", 28),
        diagramGenerators.text(50, 70, "CATEGORY TREE", 16),
        diagramGenerators.rectangle(50, 100, 280, 400, "hachure"),
        diagramGenerators.rectangle(70, 120, 240, 40, "solid"),
        diagramGenerators.text(80, 135, "Electronics", 16),
        diagramGenerators.rectangle(90, 175, 220, 35, "solid"),
        diagramGenerators.text(100, 188, "Computers", 14),
        diagramGenerators.arrow(180, 160, 180, 175),
        diagramGenerators.rectangle(110, 225, 180, 30, "solid"),
        diagramGenerators.text(120, 238, "Laptops", 12),
        diagramGenerators.arrow(180, 210, 180, 225),
        diagramGenerators.rectangle(70, 280, 240, 40, "solid"),
        diagramGenerators.text(80, 295, "Jewelry", 16),
        diagramGenerators.rectangle(90, 335, 220, 30, "solid"),
        diagramGenerators.text(100, 348, "Rings", 14),
        diagramGenerators.arrow(180, 320, 180, 335),
        diagramGenerators.rectangle(70, 390, 240, 40, "solid"),
        diagramGenerators.text(80, 405, "Firearms ⚠️ ATF", 16),
        diagramGenerators.text(400, 70, "INVENTORY ITEMS", 16),
        diagramGenerators.rectangle(380, 100, 320, 150, "solid"),
        diagramGenerators.text(390, 115, "Item #1001 - Laptop", 16),
        diagramGenerators.text(390, 140, "• category: Laptops", 12),
        diagramGenerators.text(390, 160, "• serial: ABC123", 12),
        diagramGenerators.text(390, 180, "• status: I (In Stock)", 12),
        diagramGenerators.text(390, 200, 'attributes: {"brand": "Dell",', 11),
        diagramGenerators.text(390, 220, ' "ram": "16GB", "storage": "512GB"}', 11),
        diagramGenerators.arrow(330, 200, 380, 200),
        diagramGenerators.rectangle(380, 280, 320, 140, "solid"),
        diagramGenerators.text(390, 295, "Item #2005 - Ring", 16),
        diagramGenerators.text(390, 320, "• category: Rings", 12),
        diagramGenerators.text(390, 340, "• status: P (Pawned)", 12),
        diagramGenerators.text(390, 360, 'attributes: {"material": "Gold",', 11),
        diagramGenerators.text(390, 380, ' "karat": "14K", "stone": "Diamond"}', 11),
        diagramGenerators.arrow(330, 350, 380, 350)
      ]
    ),

    // 7. Store Transactions
    createFile(
      "7. Store Transactions",
      [
        generators.header("Store Transaction System", 1),
        generators.paragraph("Financial transaction management with multiple tender types and line items."),
        generators.header("Transaction Types", 2),
        generators.list([
          "1. RETAIL_SALE - Selling to customer",
          "2. LAYAWAY_DEPOSIT - Partial payment",
          "3. PAWN_PAYMENT - Interest only",
          "4. PAWN_REDEMPTION - Redeem items",
          "5. PAWN_DISBURSEMENT - Loan to customer",
          "6. BUY_OUTRIGHT - Purchase from customer"
        ], "ordered"),
        generators.header("Tender Types (Payment Methods)", 2),
        generators.list([
          "1. CASH", "2. AMERICAN_EXPRESS", "3. DEBIT",
          "4. DISCOVER", "5. MASTER_CARD", "6. VISA",
          "7. CHECK", "8. CASH_PASS (store credit)"
        ], "ordered"),
        generators.header("Data Structure", 2),
        generators.list([
          "<b>store_transaction</b>: Header with type, total, customer",
          "<b>store_transaction_tender</b>: Payment methods (can split)",
          "<b>store_transaction_item</b>: Line items with inventory"
        ]),
        generators.header("Split Payment Example", 2),
        generators.paragraph("Customer buys ring for $800: $200 cash + $600 Visa"),
        generators.checklist([
          "Transaction total must equal sum of tenders",
          "Multiple tenders allowed per transaction",
          "Items linked to valid inventory",
          "Audit trail with timestamps"
        ])
      ],
      [
        diagramGenerators.text(250, 20, "Store Transaction Structure", 28),
        diagramGenerators.rectangle(350, 80, 300, 150, "solid"),
        diagramGenerators.text(360, 95, "store_transaction", 18),
        diagramGenerators.text(360, 125, "id: uuid-abc123", 14),
        diagramGenerators.text(360, 145, "type_id: 5 (PAWN_DISBURSEMENT)", 12),
        diagramGenerators.text(360, 165, "total_amount: $500.00", 14),
        diagramGenerators.text(360, 185, "customer_id: uuid-cust001", 12),
        diagramGenerators.rectangle(50, 300, 280, 120, "solid"),
        diagramGenerators.text(60, 315, "store_transaction_tender", 14),
        diagramGenerators.text(60, 345, "tender_type_id: 1 (CASH)", 12),
        diagramGenerators.text(60, 365, "amount: $500.00", 14),
        diagramGenerators.arrow(190, 300, 450, 230),
        diagramGenerators.rectangle(720, 300, 280, 120, "solid"),
        diagramGenerators.text(730, 315, "store_transaction_item", 14),
        diagramGenerators.text(730, 345, "inventory_item_id: laptop-001", 12),
        diagramGenerators.text(730, 365, "unit_price: $500.00", 14),
        diagramGenerators.arrow(720, 360, 650, 200),
        diagramGenerators.rectangle(50, 480, 950, 150, "hachure"),
        diagramGenerators.text(60, 500, "Example: Customer pawns laptop for $500 cash", 16),
        diagramGenerators.text(60, 530, "1. store_transaction: {type: PAWN_DISBURSEMENT, total: $500}", 12),
        diagramGenerators.text(60, 555, "2. store_transaction_tender: {tender_type: CASH, amount: $500}", 12),
        diagramGenerators.text(60, 580, "3. store_transaction_item: {inventory_item_id: laptop, price: $500}", 12),
        diagramGenerators.text(60, 605, "4. Linked to pawn_ticket via pawn_ticket_id", 12)
      ]
    ),

    // 8. Use Case Layer (CQRS)
    createFile(
      "8. Use Case Layer (CQRS)",
      [
        generators.header("Use Case Layer - CQRS Pattern", 1),
        generators.paragraph("Command Query Responsibility Segregation separates read and write operations."),
        generators.header("CQRS Overview", 2),
        generators.list([
          "<b>Commands</b>: Modify state (Create, Update, Delete)",
          "<b>Queries</b>: Read state (List, Find, Get)",
          "Each use case has single responsibility",
          "Clear separation improves testability"
        ]),
        generators.header("Use Cases by Domain", 2),
        generators.list([
          "<b>App User</b>: Create, Update, Delete, List",
          "<b>Auth</b>: Login, Refresh, Logout",
          "<b>Customer</b>: Create, Update, Delete, Find, GetById",
          "<b>Inventory</b>: CreateCategory, CreateItem, Update, Delete, GetTree, GetById",
          "<b>Pawn Ticket</b>: Create, CreateWithItems, ListByControl, ListByCustomer",
          "<b>Store Transaction</b>: Create, ListByCustomer, ListByDateRange"
        ]),
        generators.header("Use Case Structure", 2),
        generators.list([
          "Input DTO with Zod validation",
          "Output DTO with result data",
          "execute() method with business logic",
          "Dependencies injected via constructor",
          "Repository interfaces (not implementations)"
        ], "ordered"),
        generators.checklist([
          "Single responsibility principle",
          "Easier to test with mocks",
          "Independent scaling possible",
          "Explicit contracts via DTOs",
          "Better code organization"
        ])
      ],
      [
        diagramGenerators.text(250, 20, "CQRS Pattern", 28),
        diagramGenerators.text(50, 70, "COMMANDS (Write)", 16),
        diagramGenerators.rectangle(50, 110, 380, 350, "solid"),
        diagramGenerators.text(60, 130, "Modify system state", 14),
        diagramGenerators.text(70, 160, "App User:", 12),
        diagramGenerators.text(80, 180, "• CreateAppUserUseCase", 11),
        diagramGenerators.text(80, 200, "• UpdateAppUserUseCase", 11),
        diagramGenerators.text(70, 230, "Customer:", 12),
        diagramGenerators.text(80, 250, "• CreateCustomerUseCase", 11),
        diagramGenerators.text(80, 270, "• UpdateCustomerUseCase", 11),
        diagramGenerators.text(70, 300, "Inventory:", 12),
        diagramGenerators.text(80, 320, "• CreateInventoryItemUseCase", 11),
        diagramGenerators.text(80, 340, "• UpdateInventoryItemUseCase", 11),
        diagramGenerators.text(70, 370, "Pawn Ticket:", 12),
        diagramGenerators.text(80, 390, "• CreatePawnTicketWithItemsUseCase", 11),
        diagramGenerators.text(480, 70, "QUERIES (Read)", 16),
        diagramGenerators.rectangle(480, 110, 420, 350, "solid"),
        diagramGenerators.text(490, 130, "Read system state (no modifications)", 14),
        diagramGenerators.text(500, 160, "App User:", 12),
        diagramGenerators.text(510, 180, "• ListAppUserUseCase", 11),
        diagramGenerators.text(500, 210, "Customer:", 12),
        diagramGenerators.text(510, 230, "• FindCustomerUseCase", 11),
        diagramGenerators.text(510, 250, "• GetCustomerByIdUseCase", 11),
        diagramGenerators.text(500, 280, "Inventory:", 12),
        diagramGenerators.text(510, 300, "• GetInventoryCategoryTreeUseCase", 11),
        diagramGenerators.text(510, 320, "• GetInventoryItemByIdUseCase", 11),
        diagramGenerators.text(500, 350, "Pawn Ticket:", 12),
        diagramGenerators.text(510, 370, "• ListPawnTicketsByCustomerUseCase", 11),
        diagramGenerators.text(510, 390, "• ListActivePawnTicketsUseCase", 11),
        diagramGenerators.arrow(455, 280, 465, 280),
        diagramGenerators.text(440, 260, "VS", 14),
        diagramGenerators.rectangle(50, 510, 850, 100, "hachure"),
        diagramGenerators.text(60, 530, "Request Flow:", 14),
        diagramGenerators.text(60, 555, "HTTP Controller → Use Case → Repository → Database", 12),
        diagramGenerators.text(60, 580, "Dependencies point inward (Clean Architecture)", 12)
      ]
    )
  ];

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
