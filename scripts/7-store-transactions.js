// 7. STORE TRANSACTIONS
// Load create-pawns-plus-visualizations.js first

const createStoreTransactions = () => {
  const documentBlocks = [
    generators.header("Store Transaction System", 1),
    generators.paragraph("Financial transaction management with multiple tender types and line items."),

    generators.header("Transaction Types", 2),
    generators.list([
      "<b>1. RETAIL_SALE</b> - Selling inventory to customers",
      "<b>2. LAYAWAY_DEPOSIT</b> - Partial payment on layaway",
      "<b>3. PAWN_PAYMENT</b> - Interest payment on active pawn",
      "<b>4. PAWN_REDEMPTION_PAYMENT</b> - Customer paying to redeem pawned items",
      "<b>5. PAWN_DISBURSEMENT</b> - Loan amount given to customer",
      "<b>6. BUY_OUTRIGHT</b> - Purchasing items from customers",
      "... additional types for refunds, fees, etc."
    ], "ordered"),

    generators.header("Tender Types (Payment Methods)", 2),
    generators.list([
      "<b>1. CASH</b> - Cash payment",
      "<b>2. AMERICAN_EXPRESS</b> - Amex credit card",
      "<b>3. DEBIT</b> - Debit card",
      "<b>4. DISCOVER</b> - Discover credit card",
      "<b>5. MASTER_CARD</b> - MasterCard",
      "<b>6. VISA</b> - Visa card",
      "<b>7. CHECK</b> - Personal/business check",
      "<b>8. CASH_PASS</b> - Store credit/voucher"
    ], "ordered"),

    generators.header("Data Model Structure", 2),

    generators.header("store_transaction (Header)", 3),
    generators.list([
      "id - UUID primary key",
      "pawn_ticket_id - Optional link to pawn ticket",
      "customer_id - Customer making transaction",
      "type_id - Transaction type (1-8+)",
      "total_amount - Total transaction amount",
      "created_by - User who created transaction",
      "created_at, updated_at - Timestamps"
    ]),

    generators.header("store_transaction_tender (Payment)", 3),
    generators.list([
      "id - UUID primary key",
      "transaction_id - Links to store_transaction",
      "tender_type_id - Payment method (1-8)",
      "amount - Amount paid with this tender",
      "Can have multiple tenders per transaction (split payment)"
    ]),

    generators.header("store_transaction_item (Line Items)", 3),
    generators.list([
      "id - UUID primary key",
      "transaction_id - Links to store_transaction",
      "inventory_item_id - Item being transacted",
      "quantity - Usually 1 for pawn items",
      "unit_price - Price per unit",
      "total_price - Quantity × unit_price",
      "Can have multiple items per transaction"
    ]),

    generators.header("Transaction Examples", 2),

    generators.header("Example 1: Pawn Disbursement", 3),
    generators.paragraph("Customer pawns a laptop for $500 cash"),
    generators.list([
      "store_transaction: { type_id: 5 (PAWN_DISBURSEMENT), total: $500 }",
      "store_transaction_tender: { tender_type_id: 1 (CASH), amount: $500 }",
      "store_transaction_item: { inventory_item_id: laptop, unit_price: $500 }",
      "Linked to pawn_ticket via pawn_ticket_id"
    ]),

    generators.header("Example 2: Retail Sale (Split Payment)", 3),
    generators.paragraph("Customer buys ring for $800 with $200 cash + $600 Visa"),
    generators.list([
      "store_transaction: { type_id: 1 (RETAIL_SALE), total: $800 }",
      "store_transaction_tender #1: { tender_type_id: 1 (CASH), amount: $200 }",
      "store_transaction_tender #2: { tender_type_id: 6 (VISA), amount: $600 }",
      "store_transaction_item: { inventory_item_id: ring, unit_price: $800 }"
    ]),

    generators.header("API Endpoints", 2),

    generators.header("Query Transactions", 3),
    generators.list([
      "GET /api/store-transaction/by-customer/:customerId",
      "GET /api/store-transaction/by-date?from=MM/DD/YYYY&to=MM/DD/YYYY"
    ]),

    generators.header("Business Rules", 2),
    generators.checklist([
      "Transaction must have at least one tender",
      "Sum of tenders must equal total_amount",
      "Pawn disbursements must link to pawn_ticket",
      "Items must be in valid status for transaction type",
      "All operations within database transaction (atomic)",
      "Audit trail with timestamps and user tracking"
    ]),

    generators.header("Reporting Capabilities", 2),
    generators.list([
      "<b>Daily Sales Report</b>: Total by date range and type",
      "<b>Tender Report</b>: Breakdown by payment method",
      "<b>Customer History</b>: All transactions for a customer",
      "<b>Item History</b>: Transaction trail for inventory item",
      "<b>Employee Performance</b>: Transactions by created_by user"
    ])
  ];

  const diagramElements = [
    // Title
    diagramGenerators.text(250, 20, "Store Transaction Structure", 32),

    // Transaction Header
    diagramGenerators.rectangle(350, 80, 300, 180, "solid"),
    diagramGenerators.text(360, 95, "store_transaction", 20),
    diagramGenerators.text(360, 125, "id: uuid-abc123", 14),
    diagramGenerators.text(360, 145, "pawn_ticket_id: uuid-def456", 14),
    diagramGenerators.text(360, 165, "customer_id: uuid-cust001", 14),
    diagramGenerators.text(360, 185, "type_id: 5 (PAWN_DISBURSEMENT)", 14),
    diagramGenerators.text(360, 205, "total_amount: $500.00", 14),
    diagramGenerators.text(360, 225, "created_by: user_123", 14),
    diagramGenerators.text(360, 245, "created_at: 2025-12-19 10:30:00", 14),

    // Tender #1 (Left)
    diagramGenerators.rectangle(50, 350, 280, 140, "solid"),
    diagramGenerators.text(60, 365, "store_transaction_tender #1", 16),
    diagramGenerators.text(60, 395, "id: uuid-tender1", 14),
    diagramGenerators.text(60, 415, "transaction_id: uuid-abc123", 14),
    diagramGenerators.text(60, 435, "tender_type_id: 1 (CASH)", 14),
    diagramGenerators.text(60, 455, "amount: $500.00", 14),

    diagramGenerators.arrow(190, 350, 450, 260),
    diagramGenerators.text(200, 300, "belongs to", 12),

    // Tender #2 (for split payment example)
    diagramGenerators.rectangle(360, 350, 280, 140, "hachure"),
    diagramGenerators.text(370, 365, "store_transaction_tender #2", 16),
    diagramGenerators.text(370, 385, "(Split payment example)", 12),
    diagramGenerators.text(370, 410, "transaction_id: same", 14),
    diagramGenerators.text(370, 430, "tender_type_id: 6 (VISA)", 14),
    diagramGenerators.text(370, 450, "amount: $300.00", 14),
    diagramGenerators.text(370, 470, "Total tenders: $800", 14),

    // Transaction Items (Right)
    diagramGenerators.rectangle(720, 350, 300, 160, "solid"),
    diagramGenerators.text(730, 365, "store_transaction_item", 16),
    diagramGenerators.text(730, 395, "id: uuid-item1", 14),
    diagramGenerators.text(730, 415, "transaction_id: uuid-abc123", 14),
    diagramGenerators.text(730, 435, "inventory_item_id: laptop-001", 14),
    diagramGenerators.text(730, 455, "quantity: 1", 14),
    diagramGenerators.text(730, 475, "unit_price: $500.00", 14),
    diagramGenerators.text(730, 495, "total_price: $500.00", 14),

    diagramGenerators.arrow(720, 420, 650, 200),
    diagramGenerators.text(660, 300, "line items", 12),

    // Transaction Type Legend
    diagramGenerators.rectangle(50, 550, 450, 200, "hachure"),
    diagramGenerators.text(60, 565, "Transaction Types", 18),
    diagramGenerators.text(60, 595, "1. RETAIL_SALE - Selling to customer", 12),
    diagramGenerators.text(60, 615, "2. LAYAWAY_DEPOSIT - Partial payment", 12),
    diagramGenerators.text(60, 635, "3. PAWN_PAYMENT - Interest only", 12),
    diagramGenerators.text(60, 655, "4. PAWN_REDEMPTION - Redeem pawned items", 12),
    diagramGenerators.text(60, 675, "5. PAWN_DISBURSEMENT - Loan to customer", 12),
    diagramGenerators.text(60, 695, "6. BUY_OUTRIGHT - Purchase from customer", 12),
    diagramGenerators.text(60, 715, "... (additional types for refunds, fees)", 12),

    // Tender Type Legend
    diagramGenerators.rectangle(530, 550, 490, 200, "hachure"),
    diagramGenerators.text(540, 565, "Tender (Payment) Types", 18),
    diagramGenerators.text(540, 595, "1. CASH - Cash payment", 12),
    diagramGenerators.text(540, 615, "2. AMERICAN_EXPRESS - Amex card", 12),
    diagramGenerators.text(540, 635, "3. DEBIT - Debit card", 12),
    diagramGenerators.text(540, 655, "4. DISCOVER - Discover card", 12),
    diagramGenerators.text(540, 675, "5. MASTER_CARD - MasterCard", 12),
    diagramGenerators.text(540, 695, "6. VISA - Visa card", 12),
    diagramGenerators.text(540, 715, "7. CHECK - Personal/business check", 12),
    diagramGenerators.text(540, 735, "8. CASH_PASS - Store credit", 12),

    // Example Scenario
    diagramGenerators.rectangle(50, 790, 970, 180, "solid"),
    diagramGenerators.text(60, 805, "Complete Transaction Example", 18),

    diagramGenerators.text(60, 835, "Scenario: Customer pawns laptop + ring, receives $800 cash", 14),

    diagramGenerators.text(60, 865, "1. pawn_ticket created: { control_number: 10234, customer_id, amount: $800 }", 12),
    diagramGenerators.text(60, 885, "2. pawn_ticket_item: links laptop and ring to ticket", 12),
    diagramGenerators.text(60, 905, "3. store_transaction: { type: PAWN_DISBURSEMENT, total: $800, pawn_ticket_id }", 12),
    diagramGenerators.text(60, 925, "4. store_transaction_tender: { tender_type: CASH, amount: $800 }", 12),
    diagramGenerators.text(60, 945, "5. store_transaction_item: laptop ($500) + ring ($300)", 12),

    // Validation Rules
    diagramGenerators.text(60, 1010, "⚠️ Validation: Sum(tenders) = total_amount && items linked to valid inventory", 14)
  ];

  return createFile("7. Store Transactions", documentBlocks, diagramElements);
};

console.log('💰 Creating Store Transactions...');
const transFileId = createStoreTransactions();
console.log(`File ID: ${transFileId}`);
