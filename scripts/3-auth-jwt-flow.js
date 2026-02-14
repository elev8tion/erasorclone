// 3. AUTHENTICATION & JWT FLOW
// Load create-pawns-plus-visualizations.js first

const createAuthFlow = () => {
  const documentBlocks = [
    generators.header("Authentication & JWT Flow", 1),
    generators.paragraph("JWT-based authentication with refresh token rotation for secure session management."),

    generators.header("Authentication Strategy", 2),
    generators.paragraph("The system uses a dual-token approach with short-lived access tokens and long-lived refresh tokens."),
    generators.list([
      "<b>Access Token</b>: JWT valid for 15 minutes, used for API requests",
      "<b>Refresh Token</b>: Stored as hash in database, used to get new access tokens",
      "<b>Token Rotation</b>: New refresh token issued on each refresh for security"
    ]),

    generators.header("User Roles & Permissions", 2),
    generators.list([
      "<b>Admin</b> (roleId: 1): Full access to all resources",
      "<b>Manager</b> (roleId: 2): Can manage users, customers, and operations",
      "<b>Sales Associate</b> (roleId: 3): Can create/view pawn tickets, limited access"
    ], "ordered"),

    generators.header("Login Flow (Step-by-Step)", 2),
    generators.list([
      "User submits username + password to POST /api/auth/login",
      "LoginUseCase validates credentials against app_user table",
      "If valid, AuthService generates access_token (JWT, 15min expiry)",
      "AuthService generates refresh_token (random, hashed, stored in db)",
      "Both tokens returned to client in response",
      "Client stores tokens (access_token in memory, refresh_token in httpOnly cookie)"
    ], "ordered"),

    generators.header("Making Authenticated Requests", 2),
    generators.list([
      "Client sends: Authorization: Bearer {access_token}",
      "authMiddleware verifies JWT signature and expiry",
      "If valid, extracts user info (id, username, role, sessionId)",
      "Attaches req.user for use in controllers",
      "roleMiddleware checks if user has required role",
      "Request proceeds to controller if authorized"
    ], "ordered"),

    generators.header("Token Refresh Flow", 2),
    generators.list([
      "When access_token expires, client sends refresh_token to POST /api/auth/refresh",
      "RefreshTokenUseCase looks up session in app_user_session table",
      "Verifies token hash matches and session not revoked",
      "If valid, generates NEW access_token and NEW refresh_token",
      "Old refresh_token is invalidated, new one stored",
      "Returns both new tokens to client"
    ], "ordered"),

    generators.header("Logout Flow", 2),
    generators.list([
      "Client sends refresh_token to POST /api/auth/logout",
      "LogoutUseCase finds session in database",
      "Sets revoked_at timestamp on session",
      "Session can no longer be used for token refresh",
      "Client discards both tokens"
    ], "ordered"),

    generators.header("Security Features", 2),
    generators.checklist([
      "Passwords hashed with bcrypt (12 rounds)",
      "Refresh tokens stored as SHA-256 hashes",
      "JWT signed with secret key (HS256 algorithm)",
      "Short-lived access tokens (15 min)",
      "Token rotation prevents replay attacks",
      "Session tracking with last_seen_at timestamp",
      "Revocation support for logout/security events"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(350, 20, "Authentication & JWT Flow", 32),

    // CLIENT
    diagramGenerators.rectangle(50, 80, 180, 100, "solid"),
    diagramGenerators.text(60, 90, "CLIENT", 20),
    diagramGenerators.text(60, 120, "Browser / Mobile App", 14),
    diagramGenerators.text(60, 140, "Stores tokens:", 14),
    diagramGenerators.text(60, 160, "• access_token", 12),

    // LOGIN FLOW
    diagramGenerators.text(50, 220, "1. LOGIN FLOW", 18),

    // Step 1
    diagramGenerators.arrow(230, 120, 400, 120),
    diagramGenerators.text(240, 110, "POST /api/auth/login", 12),
    diagramGenerators.text(240, 130, "{username, password}", 11),

    // AUTH CONTROLLER
    diagramGenerators.rectangle(400, 80, 200, 100, "solid"),
    diagramGenerators.text(410, 90, "AuthController", 18),
    diagramGenerators.text(410, 120, "/api/auth/login", 14),
    diagramGenerators.text(410, 140, "/api/auth/refresh", 14),
    diagramGenerators.text(410, 160, "/api/auth/logout", 14),

    // Step 2
    diagramGenerators.arrow(600, 120, 750, 120),
    diagramGenerators.text(610, 110, "LoginUseCase", 12),

    // AUTH SERVICE
    diagramGenerators.rectangle(750, 80, 220, 100, "solid"),
    diagramGenerators.text(760, 90, "AuthService", 18),
    diagramGenerators.text(760, 120, "• validateCredentials()", 14),
    diagramGenerators.text(760, 140, "• generateTokens()", 14),
    diagramGenerators.text(760, 160, "• hashPassword()", 14),

    // Step 3
    diagramGenerators.arrow(860, 180, 860, 280),
    diagramGenerators.text(870, 220, "Query user", 12),

    // DATABASE
    diagramGenerators.rectangle(750, 280, 220, 140, "solid"),
    diagramGenerators.text(760, 290, "PostgreSQL", 18),
    diagramGenerators.text(760, 320, "Tables:", 14),
    diagramGenerators.text(760, 340, "• app_user", 14),
    diagramGenerators.text(760, 360, "• app_user_session", 14),
    diagramGenerators.text(760, 380, "• role", 14),

    // Step 4 - Return tokens
    diagramGenerators.arrow(750, 140, 600, 140),
    diagramGenerators.arrow(600, 140, 400, 140),
    diagramGenerators.arrow(230, 140, 50, 140),
    diagramGenerators.text(240, 150, "{ access_token, refresh_token }", 11),

    // AUTHENTICATED REQUEST FLOW
    diagramGenerators.text(50, 460, "2. AUTHENTICATED REQUEST", 18),

    // Step 1 - Request with token
    diagramGenerators.arrow(230, 520, 400, 520),
    diagramGenerators.text(240, 510, "GET /api/customer", 12),
    diagramGenerators.text(240, 530, "Authorization: Bearer {token}", 11),

    // MIDDLEWARE
    diagramGenerators.rectangle(400, 480, 200, 120, "solid"),
    diagramGenerators.text(410, 490, "Middleware", 18),
    diagramGenerators.text(410, 520, "1. authMiddleware", 14),
    diagramGenerators.text(410, 540, "   (verify JWT)", 12),
    diagramGenerators.text(410, 560, "2. roleMiddleware", 14),
    diagramGenerators.text(410, 580, "   (check permission)", 12),

    // Step 2 - Pass to controller
    diagramGenerators.arrow(600, 540, 750, 540),
    diagramGenerators.text(610, 530, "req.user attached", 11),

    // CONTROLLER
    diagramGenerators.rectangle(750, 480, 220, 120, "solid"),
    diagramGenerators.text(760, 490, "Controller", 18),
    diagramGenerators.text(760, 520, "Has access to:", 14),
    diagramGenerators.text(760, 540, "• req.user.id", 14),
    diagramGenerators.text(760, 560, "• req.user.username", 14),
    diagramGenerators.text(760, 580, "• req.user.role", 14),

    // CLIENT (bottom)
    diagramGenerators.rectangle(50, 480, 180, 120, "solid"),
    diagramGenerators.text(60, 490, "CLIENT", 20),
    diagramGenerators.text(60, 520, "Includes token in", 14),
    diagramGenerators.text(60, 540, "every request:", 14),
    diagramGenerators.text(60, 560, "Authorization header", 14),

    // REFRESH FLOW
    diagramGenerators.text(50, 660, "3. TOKEN REFRESH FLOW", 18),

    // Step 1
    diagramGenerators.rectangle(50, 700, 180, 80, "solid"),
    diagramGenerators.text(60, 710, "CLIENT", 20),
    diagramGenerators.text(60, 740, "access_token expired!", 14),

    diagramGenerators.arrow(230, 740, 400, 740),
    diagramGenerators.text(240, 730, "POST /api/auth/refresh", 12),
    diagramGenerators.text(240, 750, "{refresh_token}", 11),

    // Step 2
    diagramGenerators.rectangle(400, 700, 200, 80, "solid"),
    diagramGenerators.text(410, 710, "RefreshTokenUseCase", 16),
    diagramGenerators.text(410, 740, "Validate & rotate", 14),

    // Step 3
    diagramGenerators.arrow(600, 740, 750, 740),
    diagramGenerators.rectangle(750, 700, 220, 80, "solid"),
    diagramGenerators.text(760, 710, "Session DB", 18),
    diagramGenerators.text(760, 740, "Revoke old token,", 14),
    diagramGenerators.text(760, 760, "Store new token", 14),

    // Step 4 - Return new tokens
    diagramGenerators.arrow(750, 760, 600, 760),
    diagramGenerators.arrow(600, 760, 400, 760),
    diagramGenerators.arrow(230, 760, 50, 760),
    diagramGenerators.text(240, 770, "New tokens returned", 11),

    // JWT STRUCTURE (side panel)
    diagramGenerators.rectangle(50, 850, 920, 150, "hachure"),
    diagramGenerators.text(60, 860, "JWT Access Token Structure", 18),
    diagramGenerators.text(60, 890, "Header:", 14),
    diagramGenerators.text(60, 910, '{ "alg": "HS256", "typ": "JWT" }', 12),
    diagramGenerators.text(400, 890, "Payload:", 14),
    diagramGenerators.text(400, 910, '{ "id": "user_id", "username": "john", "role": "manager",', 12),
    diagramGenerators.text(400, 930, '  "sessionId": "session_123", "exp": 1234567890 }', 12),
    diagramGenerators.text(400, 970, "Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)", 12)
  ];

  return createFile("3. Authentication & JWT Flow", documentBlocks, diagramElements);
};

console.log('🔐 Creating Auth & JWT Flow...');
const authFileId = createAuthFlow();
console.log(`File ID: ${authFileId}`);
