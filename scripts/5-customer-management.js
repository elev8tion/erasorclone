// 5. CUSTOMER MANAGEMENT FLOW
// Load create-pawns-plus-visualizations.js first

const createCustomerManagement = () => {
  const documentBlocks = [
    generators.header("Customer Management System", 1),
    generators.paragraph("Comprehensive customer data management with flexible search and compliance tracking."),

    generators.header("Customer Data Model", 2),
    generators.paragraph("The customer record contains 50+ fields organized into categories:"),

    generators.header("Personal Information", 3),
    generators.list([
      "first_name, last_name, middle_name",
      "date_of_birth, ssn (encrypted)",
      "gender, race, height, weight, eye_color, hair_color"
    ]),

    generators.header("Contact Information", 3),
    generators.list([
      "phone, email, fax",
      "address, city, state, zip",
      "Secondary contact info (optional)"
    ]),

    generators.header("Identification", 3),
    generators.list([
      "id_type (Driver's License, Passport, Military ID, etc.)",
      "id_number, id_state",
      "id_issue_date, id_expiration_date"
    ]),

    generators.header("Employer Information", 3),
    generators.list([
      "employer_name, employer_phone",
      "employer_address, city, state, zip",
      "occupation"
    ]),

    generators.header("Compliance & Flags", 3),
    generators.list([
      "thumbprint_submitted, signature_on_file",
      "ofac_check_completed (Office of Foreign Assets Control)",
      "pawn_license_number, state",
      "is_active, notes"
    ]),

    generators.header("API Endpoints", 2),

    generators.header("Search Customers", 3),
    generators.paragraph("<b>GET /api/customer</b> or <b>GET /api/customer/search</b>"),
    generators.paragraph("Flexible search with multiple criteria:"),
    generators.list([
      "By name: lastName, firstName + lastName",
      "By date of birth",
      "By ID document: idType + idNumber + idState",
      "Partial matches supported"
    ]),

    generators.header("Get Customer by ID", 3),
    generators.paragraph("<b>GET /api/customer/:id</b>"),
    generators.list(["Returns complete customer record", "Includes all 50+ fields"]),

    generators.header("Create Customer", 3),
    generators.paragraph("<b>POST /api/customer</b>"),
    generators.list([
      "Validates required fields: firstName, lastName, dateOfBirth, address",
      "Optional fields for compliance",
      "Auto-generates UUID",
      "Sets created_at, updated_at timestamps"
    ]),

    generators.header("Update Customer", 3),
    generators.paragraph("<b>PUT /api/customer/:id</b>"),
    generators.list([
      "Partial updates supported",
      "Validates changed fields",
      "Updates updated_at timestamp automatically"
    ]),

    generators.header("Delete Customer", 3),
    generators.paragraph("<b>DELETE /api/customer/:id</b>"),
    generators.list([
      "Requires admin or manager role",
      "Hard delete (permanent)",
      "Checks for active pawn tickets first (prevents deletion if active)"
    ]),

    generators.header("Search Examples", 2),
    generators.list([
      "Find by last name: <code>?lastName=Smith</code>",
      "Find by full name: <code>?firstName=John&lastName=Doe</code>",
      "Find by DOB: <code>?dateOfBirth=1985-06-15</code>",
      "Find by ID: <code>?idType=DL&idNumber=D1234567&idState=CA</code>"
    ]),

    generators.header("Validation Rules", 2),
    generators.checklist([
      "First name: required, 1-100 characters",
      "Last name: required, 1-100 characters",
      "Date of birth: required, valid date, customer must be 18+",
      "Address: required",
      "Phone: optional, valid format",
      "Email: optional, valid email format",
      "SSN: optional, encrypted at rest",
      "ID expiration: must be future date if provided"
    ]),

    generators.header("Security & Compliance", 2),
    generators.list([
      "<b>Data Encryption</b>: SSN encrypted using pgcrypto",
      "<b>OFAC Compliance</b>: Track OFAC screening status",
      "<b>Audit Trail</b>: created_at, updated_at timestamps",
      "<b>Access Control</b>: Role-based permissions for delete",
      "<b>PII Protection</b>: Sensitive data handled according to regulations"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(300, 20, "Customer Management - CRUD Operations", 28),

    // CREATE FLOW
    diagramGenerators.text(50, 80, "1. CREATE CUSTOMER", 18),

    diagramGenerators.rectangle(50, 110, 180, 100, "solid"),
    diagramGenerators.text(60, 120, "CLIENT", 16),
    diagramGenerators.text(60, 150, "POST /api/customer", 14),
    diagramGenerators.text(60, 170, "{ firstName, lastName,", 12),
    diagramGenerators.text(60, 185, "  dob, address, ... }", 12),

    diagramGenerators.arrow(230, 150, 350, 150),

    diagramGenerators.rectangle(350, 110, 200, 100, "solid"),
    diagramGenerators.text(360, 120, "CustomerController", 16),
    diagramGenerators.text(360, 150, "CreateCustomerUseCase", 14),
    diagramGenerators.text(360, 170, "• Validate input", 12),
    diagramGenerators.text(360, 185, "• Check duplicates", 12),

    diagramGenerators.arrow(550, 150, 670, 150),

    diagramGenerators.rectangle(670, 110, 200, 100, "solid"),
    diagramGenerators.text(680, 120, "PgCustomerRepo", 16),
    diagramGenerators.text(680, 150, "INSERT INTO customer", 14),
    diagramGenerators.text(680, 170, "VALUES (...)", 12),

    diagramGenerators.arrow(870, 150, 990, 150),

    diagramGenerators.rectangle(990, 110, 120, 100, "solid"),
    diagramGenerators.text(1000, 120, "PostgreSQL", 16),
    diagramGenerators.text(1000, 150, "customer", 14),
    diagramGenerators.text(1000, 170, "table", 14),

    // READ/SEARCH FLOW
    diagramGenerators.text(50, 260, "2. SEARCH CUSTOMERS", 18),

    diagramGenerators.rectangle(50, 290, 180, 120, "solid"),
    diagramGenerators.text(60, 300, "CLIENT", 16),
    diagramGenerators.text(60, 330, "GET /api/customer", 14),
    diagramGenerators.text(60, 350, "?lastName=Smith", 12),
    diagramGenerators.text(60, 370, "?dateOfBirth=...", 12),
    diagramGenerators.text(60, 390, "?idNumber=...", 12),

    diagramGenerators.arrow(230, 340, 350, 340),

    diagramGenerators.rectangle(350, 290, 200, 120, "solid"),
    diagramGenerators.text(360, 300, "CustomerController", 16),
    diagramGenerators.text(360, 330, "FindCustomerUseCase", 14),
    diagramGenerators.text(360, 350, "Build query based on", 12),
    diagramGenerators.text(360, 370, "provided criteria", 12),

    diagramGenerators.arrow(550, 340, 670, 340),

    diagramGenerators.rectangle(670, 290, 200, 120, "solid"),
    diagramGenerators.text(680, 300, "PgCustomerRepo", 16),
    diagramGenerators.text(680, 330, "SQL Queries:", 14),
    diagramGenerators.text(680, 350, "• findByLastName", 12),
    diagramGenerators.text(680, 370, "• findByDOB", 12),
    diagramGenerators.text(680, 390, "• findByIdDocument", 12),

    diagramGenerators.arrow(870, 340, 990, 340),
    diagramGenerators.rectangle(990, 290, 120, 120, "solid"),
    diagramGenerators.text(1000, 300, "PostgreSQL", 16),
    diagramGenerators.text(1000, 330, "SELECT *", 12),
    diagramGenerators.text(1000, 350, "WHERE ...", 12),

    diagramGenerators.arrow(990, 390, 870, 390),
    diagramGenerators.arrow(670, 390, 550, 390),
    diagramGenerators.arrow(350, 390, 230, 390),
    diagramGenerators.text(240, 400, "Customer[] array", 12),

    // UPDATE FLOW
    diagramGenerators.text(50, 460, "3. UPDATE CUSTOMER", 18),

    diagramGenerators.rectangle(50, 490, 180, 100, "solid"),
    diagramGenerators.text(60, 500, "CLIENT", 16),
    diagramGenerators.text(60, 530, "PUT /api/customer/:id", 14),
    diagramGenerators.text(60, 550, "{ phone: '555-1234',", 12),
    diagramGenerators.text(60, 565, "  email: 'new@...' }", 12),

    diagramGenerators.arrow(230, 530, 350, 530),

    diagramGenerators.rectangle(350, 490, 200, 100, "solid"),
    diagramGenerators.text(360, 500, "CustomerController", 16),
    diagramGenerators.text(360, 530, "UpdateCustomerUseCase", 14),
    diagramGenerators.text(360, 550, "• Validate changes", 12),
    diagramGenerators.text(360, 565, "• Merge with existing", 12),

    diagramGenerators.arrow(550, 530, 670, 530),

    diagramGenerators.rectangle(670, 490, 200, 100, "solid"),
    diagramGenerators.text(680, 500, "PgCustomerRepo", 16),
    diagramGenerators.text(680, 530, "UPDATE customer", 14),
    diagramGenerators.text(680, 550, "SET ... WHERE id=?", 12),

    // DELETE FLOW
    diagramGenerators.text(50, 640, "4. DELETE CUSTOMER (Admin/Manager Only)", 18),

    diagramGenerators.rectangle(50, 670, 180, 100, "solid"),
    diagramGenerators.text(60, 680, "CLIENT", 16),
    diagramGenerators.text(60, 710, "DELETE", 14),
    diagramGenerators.text(60, 730, "/api/customer/:id", 14),
    diagramGenerators.text(60, 750, "Auth: Bearer {admin}", 12),

    diagramGenerators.arrow(230, 710, 350, 710),

    diagramGenerators.rectangle(350, 670, 200, 100, "solid"),
    diagramGenerators.text(360, 680, "Middleware", 16),
    diagramGenerators.text(360, 710, "1. authMiddleware", 12),
    diagramGenerators.text(360, 730, "2. roleMiddleware", 12),
    diagramGenerators.text(360, 750, "   (admin/manager)", 11),

    diagramGenerators.arrow(550, 710, 670, 710),

    diagramGenerators.rectangle(670, 670, 200, 100, "solid"),
    diagramGenerators.text(680, 680, "DeleteCustomerUseCase", 14),
    diagramGenerators.text(680, 710, "Check:", 12),
    diagramGenerators.text(680, 730, "• No active tickets", 11),
    diagramGenerators.text(680, 750, "• Soft/Hard delete", 11),

    // CUSTOMER DATA FIELDS (Bottom)
    diagramGenerators.rectangle(50, 820, 1060, 180, "hachure"),
    diagramGenerators.text(60, 835, "Customer Table Fields (50+)", 18),

    diagramGenerators.text(60, 865, "Core:", 14),
    diagramGenerators.text(60, 885, "id, first_name, last_name, middle_name, suffix", 12),
    diagramGenerators.text(60, 905, "date_of_birth, ssn, gender, race", 12),

    diagramGenerators.text(400, 865, "Contact:", 14),
    diagramGenerators.text(400, 885, "phone, email, address, city, state, zip", 12),
    diagramGenerators.text(400, 905, "secondary_phone, secondary_email", 12),

    diagramGenerators.text(750, 865, "ID Info:", 14),
    diagramGenerators.text(750, 885, "id_type, id_number, id_state", 12),
    diagramGenerators.text(750, 905, "id_issue_date, id_expiration_date", 12),

    diagramGenerators.text(60, 935, "Employer:", 14),
    diagramGenerators.text(60, 955, "employer_name, employer_phone, employer_address, occupation", 12),

    diagramGenerators.text(400, 935, "Compliance:", 14),
    diagramGenerators.text(400, 955, "thumbprint_submitted, ofac_check_completed, pawn_license_number", 12),

    diagramGenerators.text(750, 935, "System:", 14),
    diagramGenerators.text(750, 955, "is_active, created_at, updated_at, notes", 12)
  ];

  return createFile("5. Customer Management", documentBlocks, diagramElements);
};

console.log('👤 Creating Customer Management...');
const customerFileId = createCustomerManagement();
console.log(`File ID: ${customerFileId}`);
