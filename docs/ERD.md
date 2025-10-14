# Entity Relationship Diagram (ERD)
## Finance Tracker Application

---

## 📊 Database Schema Overview

This document provides a comprehensive view of the database schema, entity relationships, and data model for the Finance Tracker application.

---

## 🗂️ Database Architecture

### Database Platform
- **Platform**: Convex (Serverless Database)
- **Type**: Document-based (NoSQL)
- **Real-time**: Yes (Live queries and subscriptions)
- **Location**: Cloud-hosted
- **Backup**: Automatic

### Schema Definition
All schemas are defined in `/workspace/convex/schema.ts` using Convex's schema definition language.

---

## 📋 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FINANCE TRACKER DATABASE                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│     SALES        │         │    EXPENSES      │         │   LIABILITIES    │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ _id (PK)         │         │ _id (PK)         │         │ _id (PK)         │
│ date             │         │ date             │         │ lenderParty      │
│ description      │         │ category         │         │ liabilityType    │
│ cost             │         │ description      │         │ startDate        │
│ sellingPrice     │         │ vendor           │         │ dueDate          │
│ grossProfit      │◄────┐   │ amount           │◄────┐   │ originalAmount   │
│ grossProfitMargin│     │   │ status           │     │   │ outstandingBal   │
│ expenses         │     │   │ currency         │     │   │ currency         │
│ netProfit        │     │   │ createdAt        │     │   │ description      │
│ netProfitMargin  │     │   │ updatedAt        │     │   │ createdAt        │
│ currency         │     │   └──────────────────┘     │   │ updatedAt        │
│ createdAt        │     │                            │   └──────────────────┘
│ updatedAt        │     │                            │
└──────────────────┘     │                            │
                         │                            │
                         │   ┌──────────────────┐    │
                         │   │    CASHFLOW      │    │
                         │   ├──────────────────┤    │
                         │   │ _id (PK)         │    │
                         │   │ date             │    │
                         │   │ type             │    │
                         │   │ category         │    │
                         │   │ description      │    │
                         └───┤ amount           │    │
                             │ currency         │    │
                             │ referenceId (FK) │────┘
                             │ createdAt        │
                             │ updatedAt        │
                             └──────────────────┘
                                      │
                                      │ References
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│    SALARIES      │         │    BANK PDC      │         │  FUTURE NEEDS    │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ _id (PK)         │         │ _id (PK)         │         │ _id (PK)         │
│ employeeName     │         │ date             │         │ month            │
│ role             │         │ bank             │         │ description      │
│ netSalary        │         │ chequeNumber     │         │ quantity         │
│ paymentStatus    │         │ code             │         │ amount           │
│ paymentDate      │         │ supplier         │         │ status           │
│ month            │         │ description      │         │ currency         │
│ currency         │         │ amount           │         │ remarks          │
│ createdAt        │         │ status           │         │ createdAt        │
│ updatedAt        │         │ currency         │         │ updatedAt        │
└──────────────────┘         │ creationDate     │         └──────────────────┘
                             │ createdAt        │
                             │ updatedAt        │
                             └──────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ BUSINESS IN HAND │         │ CURRENCY SETTINGS│         │      USERS       │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ _id (PK)         │         │ _id (PK)         │         │ _id (PK)         │
│ type             │         │ selectedCurrency │         │ name             │
│ description      │         │ exchangeRates    │         │ email            │
│ amount           │         │   USD_TO_SAR     │         │ image            │
│ expectedDate     │         │   USD_TO_AED     │         │ role             │
│ currency         │         │ updatedAt        │         │ phone            │
│ status           │         └──────────────────┘         │ emailVerified    │
│ createdAt        │                                      │ phoneVerified    │
│ updatedAt        │                                      │ isAnonymous      │
└──────────────────┘                                      │ _creationTime    │
                                                          └──────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key
◄─ = Data flows into Cash Flow for tracking
```

---

## 📊 Detailed Entity Specifications

### 1. Sales Entity

**Table Name**: `sales`

**Purpose**: Track sales transactions with automatic profit calculations

**Indexes**:
- `by_date`: Index on `date` field for date-based queries
- `by_created_at`: Index on `createdAt` field for recent records

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `date` | String | Yes | Transaction date | ISO date format |
| `description` | String | Yes | Sale description | Min 1 char |
| `cost` | Number | Yes | Cost of goods/services | ≥ 0 |
| `sellingPrice` | Number | Yes | Selling price | > 0 |
| `grossProfit` | Number | Auto | Calculated: sellingPrice - cost | Calculated |
| `grossProfitMargin` | Number | Auto | Calculated: (grossProfit / sellingPrice) × 100 | Calculated |
| `expenses` | Number | Yes | Associated expenses | ≥ 0 |
| `netProfit` | Number | Auto | Calculated: grossProfit - expenses | Calculated |
| `netProfitMargin` | Number | Auto | Calculated: (netProfit / sellingPrice) × 100 | Calculated |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Business Rules**:
- Selling price must be greater than 0
- Cost and expenses must be non-negative
- All profit calculations are automatic
- Currency must be one of: USD, SAR, AED

---

### 2. Expenses Entity

**Table Name**: `expenses`

**Purpose**: Track and categorize business expenses

**Indexes**:
- `by_date`: Index on `date` field
- `by_category`: Index on `category` field
- `by_status`: Index on `status` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `date` | String | Yes | Expense date | ISO date format |
| `category` | String | Yes | Expense category | Predefined list |
| `description` | String | Yes | Expense description | Min 1 char |
| `vendor` | String | Yes | Vendor/supplier name | Min 1 char |
| `amount` | Number | Yes | Expense amount | > 0 |
| `status` | String | Yes | Payment status | "paid" or "unpaid" |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Categories**:
- Office Equipment
- Software Licenses
- Marketing
- Office Rent
- Utilities
- Travel
- Salaries
- Other

**Business Rules**:
- Amount must be greater than 0
- Status must be either "paid" or "unpaid"
- Category must be from predefined list

---

### 3. Liabilities Entity

**Table Name**: `liabilities`

**Purpose**: Track debts, loans, and payables

**Indexes**:
- `by_due_date`: Index on `dueDate` field
- `by_liability_type`: Index on `liabilityType` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `lenderParty` | String | Yes | Lender/creditor name | Min 1 char |
| `liabilityType` | String | Yes | Type of liability | Predefined list |
| `startDate` | String | Yes | Liability start date | ISO date format |
| `dueDate` | String | Yes | Payment due date | ISO date format |
| `originalAmount` | Number | Yes | Original liability amount | > 0 |
| `outstandingBalance` | Number | Yes | Current outstanding balance | ≥ 0 |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `description` | String | No | Additional description | Optional |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Liability Types**:
- Business Loan
- Equipment Loan
- Trade Payable
- Software License Payable
- Credit Line
- Other

**Business Rules**:
- Due date must be after start date
- Outstanding balance ≤ original amount
- Outstanding balance ≥ 0

---

### 4. Salaries Entity

**Table Name**: `salaries`

**Purpose**: Track employee salaries and payment status

**Indexes**:
- `by_month`: Index on `month` field
- `by_employee`: Index on `employeeName` field
- `by_status`: Index on `paymentStatus` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `employeeName` | String | Yes | Employee full name | Min 1 char |
| `role` | String | Yes | Job role/position | Min 1 char |
| `netSalary` | Number | Yes | Net salary amount | > 0 |
| `paymentStatus` | String | Yes | Payment status | "paid" or "pending" |
| `paymentDate` | String | No | Date of payment | ISO date format |
| `month` | String | Yes | Salary month | YYYY-MM format |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Business Rules**:
- Net salary must be greater than 0
- Payment date required if status is "paid"
- Month format must be YYYY-MM
- One salary record per employee per month

---

### 5. Cash Flow Entity

**Table Name**: `cashflow`

**Purpose**: Track all cash inflows and outflows

**Indexes**:
- `by_date`: Index on `date` field
- `by_type`: Index on `type` field
- `by_category`: Index on `category` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `date` | String | Yes | Transaction date | ISO date format |
| `type` | String | Yes | Flow type | "inflow" or "outflow" |
| `category` | String | Yes | Transaction category | Predefined list |
| `description` | String | Yes | Transaction description | Min 1 char |
| `amount` | Number | Yes | Transaction amount | > 0 |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `referenceId` | String | No | Reference to related transaction | Optional |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Categories**:
- **Inflows**: Sales, Capital Injection, Receivables, Loan Received
- **Outflows**: Expenses, Salaries, Liabilities, PDC, Purchases

**Business Rules**:
- Type must be "inflow" or "outflow"
- Amount must be greater than 0
- Reference ID can link to sales, expenses, salaries, etc.

---

### 6. Bank PDC Entity

**Table Name**: `bankPdc`

**Purpose**: Manage post-dated cheques

**Indexes**:
- `by_date`: Index on `date` field
- `by_bank`: Index on `bank` field
- `by_status`: Index on `status` field
- `by_cheque_number`: Index on `chequeNumber` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `date` | String | Yes | Cheque date | ISO date format |
| `bank` | String | Yes | Bank name | Min 1 char |
| `chequeNumber` | String | Yes | Unique cheque number | Unique |
| `code` | String | Yes | Internal reference code | Min 1 char |
| `supplier` | String | Yes | Supplier/payee name | Min 1 char |
| `description` | String | Yes | Cheque description | Min 1 char |
| `amount` | Number | Yes | Cheque amount | > 0 |
| `status` | String | Yes | Cheque status | "pending" or "cleared" |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `creationDate` | String | Yes | Record creation date | ISO date format |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Business Rules**:
- Cheque number must be unique
- Status must be "pending" or "cleared"
- Amount must be greater than 0

---

### 7. Future Needs Entity

**Table Name**: `futureNeeds`

**Purpose**: Plan and track future financial needs

**Indexes**:
- `by_month`: Index on `month` field
- `by_status`: Index on `status` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `month` | String | Yes | Planning month | YYYY-MM format |
| `description` | String | Yes | Need description | Min 1 char |
| `quantity` | Number | Yes | Quantity needed | > 0 |
| `amount` | Number | Yes | Estimated amount | > 0 |
| `status` | String | Yes | Need type | "recurring" or "one-time" |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `remarks` | String | No | Additional remarks | Optional |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Business Rules**:
- Month format must be YYYY-MM
- Status must be "recurring" or "one-time"
- Quantity and amount must be greater than 0

---

### 8. Business in Hand Entity

**Table Name**: `businessInHand`

**Purpose**: Track expected revenue and pending invoices

**Indexes**:
- `by_type`: Index on `type` field
- `by_expected_date`: Index on `expectedDate` field
- `by_status`: Index on `status` field

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `type` | String | Yes | Opportunity type | Predefined list |
| `description` | String | Yes | Opportunity description | Min 1 char |
| `amount` | Number | Yes | Expected amount | > 0 |
| `expectedDate` | String | Yes | Expected receipt date | ISO date format |
| `currency` | String | Yes | Currency code | USD/SAR/AED |
| `status` | String | Yes | Opportunity status | Predefined list |
| `createdAt` | Number | Auto | Creation timestamp | System generated |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Types**:
- `po_in_hand`: Purchase Order in Hand
- `pending_invoice`: Pending Invoice
- `expected_revenue`: Expected Revenue

**Statuses**:
- `confirmed`: Confirmed opportunity
- `pending`: Pending confirmation
- `received`: Payment received

**Business Rules**:
- Type must be one of: po_in_hand, pending_invoice, expected_revenue
- Status must be one of: confirmed, pending, received
- Amount must be greater than 0

---

### 9. Currency Settings Entity

**Table Name**: `currencySettings`

**Purpose**: Store currency preferences and exchange rates

**Indexes**: None (single document)

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `selectedCurrency` | String | Yes | Currently selected currency | USD/SAR/AED |
| `exchangeRates` | Object | Yes | Exchange rate object | See below |
| `exchangeRates.USD_TO_SAR` | Number | Yes | USD to SAR rate | > 0 |
| `exchangeRates.USD_TO_AED` | Number | Yes | USD to AED rate | > 0 |
| `updatedAt` | Number | Auto | Last update timestamp | System generated |

**Default Exchange Rates**:
- USD to SAR: 3.75
- USD to AED: 3.67

**Business Rules**:
- Only one currency settings document exists
- Exchange rates must be greater than 0
- Selected currency must be USD, SAR, or AED

### Currency Implementation Features

#### Multi-Currency Data Storage
- **Original Currency**: Each transaction stores its original currency
- **Real-time Conversion**: All amounts converted to selected currency on display
- **Exchange Rate Management**: Centralized exchange rate configuration
- **Symbol Display**: Proper currency symbols with custom font support

#### Currency Conversion Logic
```typescript
// Convert amount from one currency to another
convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number

// Format currency with proper symbol and custom font
formatCurrency(amount: number, currency: Currency, options: {
  useCustomFont?: boolean;
  showSymbol?: boolean;
}): string
```

#### Supported Currencies
- **USD**: US Dollar ($) - Base currency for conversions
- **SAR**: Saudi Riyal (ê) - Custom font with Arabic script
- **AED**: UAE Dirham (د.إ) - Arabic script with proper positioning

---

### 10. Users Entity (Authentication)

**Table Name**: `users`

**Purpose**: Store user authentication and profile data

**Indexes**: None (managed by Convex Auth)

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `_id` | ID | Auto | Unique identifier | System generated |
| `_creationTime` | Number | Auto | Record creation timestamp | System generated |
| `name` | String | No | User full name | Optional |
| `email` | String | No | User email address | Valid email |
| `image` | String | No | Profile image URL | Valid URL |
| `role` | String | No | User role | admin/editor/viewer |
| `phone` | String | No | Phone number | Optional |
| `emailVerificationTime` | Number | No | Email verification timestamp | Optional |
| `phoneVerificationTime` | Number | No | Phone verification timestamp | Optional |
| `isAnonymous` | Boolean | No | Anonymous user flag | Optional |

**Roles**:
- `admin`: Full access to all features
- `editor`: Can create, read, update (no delete)
- `viewer`: Read-only access

**Business Rules**:
- Email must be unique
- First user automatically becomes admin
- Role defaults to "viewer" for new users

---

## 🔗 Relationships & Data Flow

### Primary Relationships

1. **Cash Flow ← Sales**
   - When a sale is recorded, it can create a cash flow inflow entry
   - Reference ID links cash flow to sale

2. **Cash Flow ← Expenses**
   - When an expense is paid, it creates a cash flow outflow entry
   - Reference ID links cash flow to expense

3. **Cash Flow ← Salaries**
   - When a salary is paid, it creates a cash flow outflow entry
   - Reference ID links cash flow to salary

4. **Cash Flow ← Liabilities**
   - When a liability payment is made, it creates a cash flow outflow entry
   - Reference ID links cash flow to liability

5. **Cash Flow ← Bank PDC**
   - When a PDC is cleared, it creates a cash flow outflow entry
   - Reference ID links cash flow to PDC

### Data Aggregation

The **Dashboard** aggregates data from all entities:
- Total expenses from `expenses` table
- Outstanding liabilities from `liabilities` table
- Salary status from `salaries` table
- Cash flow from `cashflow` table
- Business pipeline from `businessInHand` table
- Sales trends from `sales` table

---

## 📈 Indexes & Query Optimization

### Index Strategy

All tables use strategic indexes for common query patterns:

1. **Date-based Indexes**: Most tables have `by_date` index for time-series queries
2. **Status Indexes**: Tables with status fields have `by_status` index for filtering
3. **Category Indexes**: Tables with categories have `by_category` index
4. **Composite Indexes**: Some tables use multi-field indexes for complex queries

### Query Patterns

**Common Queries**:
- Get all records by date range
- Filter by status (paid/unpaid, pending/cleared)
- Group by category
- Sort by due date
- Aggregate totals by month

**Optimized Queries**:
```typescript
// Get expenses by date range (uses by_date index)
ctx.db.query("expenses")
  .withIndex("by_date", q => q.gte("date", startDate).lte("date", endDate))
  .collect()

// Get unpaid expenses (uses by_status index)
ctx.db.query("expenses")
  .withIndex("by_status", q => q.eq("status", "unpaid"))
  .collect()

// Get liabilities by due date (uses by_due_date index)
ctx.db.query("liabilities")
  .withIndex("by_due_date")
  .order("asc")
  .collect()
```

---

## 🔄 Data Lifecycle

### Create Operations
1. User submits form with data
2. Client-side validation (React Hook Form + Zod)
3. Server-side validation (Convex validators)
4. Data inserted into database
5. Real-time update to all connected clients
6. Success notification to user

### Read Operations
1. Component mounts or data changes
2. Convex query executes
3. Data retrieved from database
4. Data transformed/calculated if needed
5. Component re-renders with new data

### Update Operations
1. User edits existing record
2. Form pre-populated with current data
3. User submits changes
4. Validation on client and server
5. Database record updated
6. Real-time update to all clients
7. Success notification

### Delete Operations
1. User clicks delete button
2. Confirmation dialog appears
3. User confirms deletion
4. Record deleted from database
5. Real-time update to all clients
6. Success notification

---

## 🔐 Data Security

### Access Control
- All queries and mutations require authentication
- Role-based access control (RBAC) enforced
- Row-level security (RLS) for sensitive operations

### Data Validation
- Client-side validation with Zod schemas
- Server-side validation with Convex validators
- Type safety with TypeScript

### Data Integrity
- Required fields enforced
- Data type validation
- Business rule validation
- Referential integrity for related records

---

## 📊 Data Volume Estimates

### Expected Data Volume (per year)

| Entity | Records/Year | Storage/Record | Total Storage |
|--------|--------------|----------------|---------------|
| Sales | 500-1000 | ~500 bytes | 250-500 KB |
| Expenses | 1000-2000 | ~400 bytes | 400-800 KB |
| Liabilities | 50-100 | ~400 bytes | 20-40 KB |
| Salaries | 120-240 | ~300 bytes | 36-72 KB |
| Cash Flow | 2000-4000 | ~350 bytes | 700-1400 KB |
| Bank PDC | 200-400 | ~450 bytes | 90-180 KB |
| Future Needs | 100-200 | ~350 bytes | 35-70 KB |
| Business in Hand | 200-400 | ~350 bytes | 70-140 KB |

**Total Estimated Storage**: ~1.6-3.2 MB per year

### Scalability
- Convex handles millions of documents efficiently
- Indexes ensure fast queries even with large datasets
- Real-time updates scale to thousands of concurrent users

---

## 🔄 Data Migration & Backup

### Backup Strategy
- Automatic backups by Convex platform
- Point-in-time recovery available
- Export functionality for manual backups

### Data Export
- Export to Excel/CSV (planned feature)
- Export to PDF reports (planned feature)
- API access for data extraction

---

## 📝 Schema Version History

### Version 1.0.0 (Current)
- Initial schema with all 9 entities
- Multi-currency support
- Comprehensive indexes
- Real-time synchronization

### Future Enhancements
- Audit trail table for change tracking
- Attachments table for file uploads
- Notifications table for alerts
- Reports table for saved reports
- Templates table for recurring transactions

---

## 📞 Schema Maintenance

**Schema Owner**: Development Team  
**Last Updated**: January 2025  
**Review Frequency**: Quarterly  
**Change Process**: Version controlled in Git

---

*This ERD document is maintained alongside the codebase and updated with each schema change.*
