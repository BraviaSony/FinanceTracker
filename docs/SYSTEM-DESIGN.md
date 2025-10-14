# System Design Document
## Finance Tracker Application

---

## 📋 Document Information

| Field | Value |
|-------|-------|
| **Application** | Finance Tracker |
| **Version** | 1.0.0 |
| **Last Updated** | January 2025 |
| **Document Type** | System Design |
| **Status** | Production Ready |

---

## 📖 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [System Overview](#-system-overview)
3. [Requirements Analysis](#-requirements-analysis)
4. [High-Level Architecture](#-high-level-architecture)
5. [Component Design](#-component-design)
6. [Database Design](#-database-design)
7. [API Design](#-api-design)
8. [Security Design](#-security-design)
9. [Scalability & Performance](#-scalability--performance)
10. [Deployment Architecture](#-deployment-architecture)
11. [Monitoring & Observability](#-monitoring--observability)
12. [Disaster Recovery](#-disaster-recovery)

---

## 🎯 Executive Summary

### Purpose
This document describes the complete system design for the Finance Tracker application, a comprehensive financial management system for small businesses with 2-10 employees.

### Scope
The system provides real-time financial tracking, multi-currency support, analytics, and reporting capabilities through a modern web application.

### Key Design Goals
1. **Real-time Data Synchronization**: Instant updates across all connected clients
2. **Scalability**: Support growth from 2 to 1000+ users
3. **Reliability**: 99.9% uptime with automatic failover
4. **Performance**: Sub-second response times for all operations
5. **Security**: Enterprise-grade security with RBAC and encryption
6. **Maintainability**: Clean architecture with separation of concerns

---

## 🌐 System Overview

### System Context

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SYSTEMS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │   Browser    │    │   Mobile     │    │   Tablet     │             │
│  │   (Chrome,   │    │   (Safari,   │    │   (iPad,     │             │
│  │   Firefox)   │    │   Chrome)    │    │   Android)   │             │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘             │
│         │                   │                    │                      │
│         └───────────────────┼────────────────────┘                      │
│                             │                                           │
└─────────────────────────────┼───────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              │
┌─────────────────────────────▼───────────────────────────────────────────┐
│                      FINANCE TRACKER SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION LAYER                            │  │
│  │  - React Frontend                                                │  │
│  │  - Responsive UI                                                 │  │
│  │  - Real-time Updates                                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                    APPLICATION LAYER                             │  │
│  │  - Business Logic                                                │  │
│  │  - Validation                                                    │  │
│  │  - Authentication & Authorization                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              │                                           │
│  ┌──────────────────────────▼───────────────────────────────────────┐  │
│  │                      DATA LAYER                                  │  │
│  │  - Convex Database                                               │  │
│  │  - Real-time Sync                                                │  │
│  │  - Data Persistence                                              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ External Services (Future)
                              │
┌─────────────────────────────▼───────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│  - Email Service (Planned)                                              │
│  - Payment Gateway (Planned)                                            │
│  - Accounting Software (Planned)                                        │
│  - Analytics Platform (Optional)                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend Stack
```
React 19.0.0
├── TypeScript 5.7.2 (Type Safety)
├── Vite 7.1.0 (Build Tool)
├── React Router DOM 7.7.1 (Routing)
├── Tailwind CSS 4.0.14 (Styling)
├── Shadcn UI (Component Library)
├── Recharts 2.12.7 (Data Visualization)
├── React Hook Form 7.53.0 (Form Management)
├── Zod 3.24.1 (Validation)
└── Date-fns 4.1.0 (Date Utilities)
```

#### Backend Stack
```
Convex (Serverless Backend)
├── Database (NoSQL Document Store)
├── Authentication (Convex Auth)
├── Real-time Sync (WebSocket)
├── Functions (Queries, Mutations, Actions)
└── File Storage (Built-in)
```

#### Development Tools
```
Development Environment
├── Bun (Package Manager & Runtime)
├── ESLint (Code Linting)
├── Prettier (Code Formatting)
├── TypeScript Compiler (Type Checking)
└── Git (Version Control)
```

---

## 📊 Requirements Analysis

### Functional Requirements

#### FR-1: User Management
- **FR-1.1**: Users can register with email and password
- **FR-1.2**: Users can login and logout
- **FR-1.3**: Users have roles (Admin, Editor, Viewer)
- **FR-1.4**: First user becomes admin automatically
- **FR-1.5**: Users can update their profile

#### FR-2: Sales Management
- **FR-2.1**: Record sales with cost, selling price, and expenses
- **FR-2.2**: Automatic calculation of gross and net profit
- **FR-2.3**: Automatic calculation of profit margins
- **FR-2.4**: Multi-currency support for sales
- **FR-2.5**: View, edit, and delete sales records

#### FR-3: Expense Management
- **FR-3.1**: Record expenses with category and vendor
- **FR-3.2**: Track payment status (paid/unpaid)
- **FR-3.3**: Categorize expenses
- **FR-3.4**: Multi-currency support for expenses
- **FR-3.5**: Filter expenses by category and status

#### FR-4: Liability Management
- **FR-4.1**: Track debts and loans
- **FR-4.2**: Monitor due dates
- **FR-4.3**: Track outstanding balances
- **FR-4.4**: Categorize liability types
- **FR-4.5**: Multi-currency support

#### FR-5: Salary Management
- **FR-5.1**: Record employee salaries
- **FR-5.2**: Track payment status
- **FR-5.3**: Organize by month
- **FR-5.4**: Multi-currency support
- **FR-5.5**: View salary history

#### FR-6: Cash Flow Tracking
- **FR-6.1**: Record all inflows and outflows
- **FR-6.2**: Categorize transactions
- **FR-6.3**: Calculate net cash flow
- **FR-6.4**: Link to related transactions
- **FR-6.5**: Multi-currency support

#### FR-7: Bank PDC Management
- **FR-7.1**: Track post-dated cheques
- **FR-7.2**: Monitor cheque status
- **FR-7.3**: Unique cheque numbers
- **FR-7.4**: Bank-wise organization
- **FR-7.5**: Multi-currency support

#### FR-8: Future Needs Planning
- **FR-8.1**: Plan future expenses
- **FR-8.2**: Distinguish recurring vs one-time
- **FR-8.3**: Organize by month
- **FR-8.4**: Multi-currency support
- **FR-8.5**: Track quantities and amounts

#### FR-9: Business in Hand
- **FR-9.1**: Track expected revenue
- **FR-9.2**: Monitor pending invoices
- **FR-9.3**: Track POs in hand
- **FR-9.4**: Status tracking
- **FR-9.5**: Multi-currency support

#### FR-10: Dashboard & Analytics
- **FR-10.1**: Display financial summary
- **FR-10.2**: Interactive charts
- **FR-10.3**: Recent activity feed
- **FR-10.4**: Real-time updates
- **FR-10.5**: Currency conversion

#### FR-11: Multi-Currency
- **FR-11.1**: Support USD, SAR, AED
- **FR-11.2**: Real-time conversion
- **FR-11.3**: Configurable exchange rates
- **FR-11.4**: Preserve original currency
- **FR-11.5**: Display in selected currency

### Non-Functional Requirements

#### NFR-1: Performance
- **NFR-1.1**: Page load time < 2 seconds
- **NFR-1.2**: API response time < 200ms
- **NFR-1.3**: Real-time updates < 100ms
- **NFR-1.4**: Chart rendering < 1 second
- **NFR-1.5**: Bundle size < 500KB (gzipped)

#### NFR-2: Scalability
- **NFR-2.1**: Support 1000+ concurrent users
- **NFR-2.2**: Handle 10,000+ transactions
- **NFR-2.3**: Database queries scale linearly
- **NFR-2.4**: Horizontal scaling capability
- **NFR-2.5**: Auto-scaling based on load

#### NFR-3: Reliability
- **NFR-3.1**: 99.9% uptime
- **NFR-3.2**: Automatic failover
- **NFR-3.3**: Data backup every 24 hours
- **NFR-3.4**: Point-in-time recovery
- **NFR-3.5**: Zero data loss

#### NFR-4: Security
- **NFR-4.1**: HTTPS encryption
- **NFR-4.2**: Password hashing (bcrypt)
- **NFR-4.3**: Role-based access control
- **NFR-4.4**: Input validation (client & server)
- **NFR-4.5**: XSS and CSRF protection

#### NFR-5: Usability
- **NFR-5.1**: Intuitive user interface
- **NFR-5.2**: Responsive design (mobile, tablet, desktop)
- **NFR-5.3**: Accessibility (WCAG 2.1 AA)
- **NFR-5.4**: Clear error messages
- **NFR-5.5**: Consistent design patterns

#### NFR-6: Maintainability
- **NFR-6.1**: Clean code architecture
- **NFR-6.2**: Comprehensive documentation
- **NFR-6.3**: Type safety (TypeScript)
- **NFR-6.4**: Automated testing capability
- **NFR-6.5**: Version control (Git)

---

## 🏗️ High-Level Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                                    │
│                      (Presentation Layer)                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    React Application                           │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │  Dashboard   │  │    Sales     │  │   Expenses   │        │    │
│  │  │    Page      │  │    Page      │  │     Page     │  ...   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              UI Components Layer                      │    │    │
│  │  │  - Forms, Tables, Charts, Dialogs, etc.              │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              State Management Layer                   │    │    │
│  │  │  - React Hooks (useState, useEffect)                 │    │    │
│  │  │  - Convex Hooks (useQuery, useMutation)              │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Routing Layer                            │    │    │
│  │  │  - React Router DOM                                   │    │    │
│  │  │  - Route Guards                                       │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ HTTPS / WebSocket
                               │ (Real-time Bidirectional)
                               │
┌──────────────────────────────▼───────────────────────────────────────────┐
│                         APPLICATION TIER                                 │
│                      (Business Logic Layer)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Convex Functions                            │    │
│  │                                                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │   Queries    │  │  Mutations   │  │   Actions    │        │    │
│  │  │   (Read)     │  │   (Write)    │  │  (Complex)   │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │           Authentication & Authorization             │    │    │
│  │  │  - Convex Auth                                       │    │    │
│  │  │  - Role-Based Access Control (RBAC)                  │    │    │
│  │  │  - Row-Level Security (RLS)                          │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Business Logic Layer                     │    │    │
│  │  │  - Profit Calculations                               │    │    │
│  │  │  - Currency Conversion                               │    │    │
│  │  │  - Data Aggregation                                  │    │    │
│  │  │  - Validation Rules                                  │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Validation Layer                         │    │    │
│  │  │  - Input Validation (Convex Validators)              │    │    │
│  │  │  - Business Rule Validation                          │    │    │
│  │  │  - Type Safety (TypeScript)                          │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ Database Queries
                               │
┌──────────────────────────────▼───────────────────────────────────────────┐
│                           DATA TIER                                      │
│                      (Persistence Layer)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Convex Database                             │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Document Collections                     │    │    │
│  │  │  - sales                                             │    │    │
│  │  │  - expenses                                          │    │    │
│  │  │  - liabilities                                       │    │    │
│  │  │  - salaries                                          │    │    │
│  │  │  - cashflow                                          │    │    │
│  │  │  - bankPdc                                           │    │    │
│  │  │  - futureNeeds                                       │    │    │
│  │  │  - businessInHand                                    │    │    │
│  │  │  - currencySettings                                  │    │    │
│  │  │  - users (auth)                                      │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Indexes                                  │    │    │
│  │  │  - by_date                                           │    │    │
│  │  │  - by_status                                         │    │    │
│  │  │  - by_category                                       │    │    │
│  │  │  - by_type                                           │    │    │
│  │  │  - by_month                                          │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  │                                                                │    │
│  │  ┌──────────────────────────────────────────────────────┐    │    │
│  │  │              Real-time Sync Engine                    │    │    │
│  │  │  - Change Detection                                  │    │    │
│  │  │  - WebSocket Push                                    │    │    │
│  │  │  - Conflict Resolution                               │    │    │
│  │  └──────────────────────────────────────────────────────┘    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Architectural Patterns

#### 1. Three-Tier Architecture
- **Presentation Tier**: React frontend
- **Application Tier**: Convex functions
- **Data Tier**: Convex database

#### 2. Serverless Architecture
- No server management required
- Auto-scaling based on demand
- Pay-per-use pricing model

#### 3. Real-time Architecture
- WebSocket connections for live updates
- Optimistic UI updates
- Automatic conflict resolution

#### 4. Microservices Pattern (Logical)
- Each module is independent
- Shared data layer
- Loose coupling between modules

---

## 🧩 Component Design

### Frontend Component Architecture

```
App (Root Component)
│
├── Providers
│   ├── ConvexAuthProvider (Authentication)
│   ├── TooltipProvider (UI Tooltips)
│   └── Toaster (Notifications)
│
├── Router (React Router)
│   │
│   ├── Public Routes
│   │   ├── LoginPage
│   │   └── SignupPage
│   │
│   └── Protected Routes (Require Authentication)
│       │
│       ├── Layout (Shared Layout)
│       │   ├── Sidebar Navigation
│       │   ├── Header
│       │   └── Main Content Area
│       │
│       ├── Dashboard (/)
│       │   ├── SummaryCards
│       │   │   ├── ExpensesCard
│       │   │   ├── LiabilitiesCard
│       │   │   ├── SalariesCard
│       │   │   └── CashFlowCard
│       │   ├── ChartsSection
│       │   │   ├── CashFlowTrendChart
│       │   │   ├── ExpensesPieChart
│       │   │   ├── SalesBarChart
│       │   │   └── LiabilitiesBarChart
│       │   └── RecentActivityFeed
│       │
│       ├── Sales (/sales)
│       │   ├── SalesTable
│       │   ├── AddSaleDialog
│       │   ├── EditSaleDialog
│       │   └── DeleteConfirmation
│       │
│       ├── Expenses (/expenses)
│       │   ├── ExpensesTable
│       │   ├── AddExpenseDialog
│       │   ├── EditExpenseDialog
│       │   ├── FilterControls
│       │   └── DeleteConfirmation
│       │
│       ├── Liabilities (/liabilities)
│       │   ├── LiabilitiesTable
│       │   ├── AddLiabilityDialog
│       │   ├── EditLiabilityDialog
│       │   └── DeleteConfirmation
│       │
│       ├── Salaries (/salaries)
│       │   ├── SalariesTable
│       │   ├── AddSalaryDialog
│       │   ├── EditSalaryDialog
│       │   └── DeleteConfirmation
│       │
│       ├── CashFlow (/cashflow)
│       │   ├── CashFlowTable
│       │   ├── AddCashFlowDialog
│       │   ├── EditCashFlowDialog
│       │   └── DeleteConfirmation
│       │
│       ├── BankPDC (/bank-pdc)
│       │   ├── BankPDCTable
│       │   ├── AddPDCDialog
│       │   ├── EditPDCDialog
│       │   └── DeleteConfirmation
│       │
│       ├── FutureNeeds (/future-needs)
│       │   ├── FutureNeedsTable
│       │   ├── AddNeedDialog
│       │   ├── EditNeedDialog
│       │   └── DeleteConfirmation
│       │
│       └── BusinessInHand (/business-in-hand)
│           ├── BusinessTable
│           ├── AddBusinessDialog
│           ├── EditBusinessDialog
│           └── DeleteConfirmation
│
└── Shared Components
    ├── UI Components (Shadcn)
    │   ├── Button
    │   ├── Input
    │   ├── Select
    │   ├── Dialog
    │   ├── Table
    │   ├── Card
    │   ├── Badge
    │   └── ... (50+ components)
    │
    ├── Form Components
    │   ├── FormField
    │   ├── FormLabel
    │   ├── FormError
    │   └── FormDescription
    │
    ├── Chart Components
    │   ├── LineChart
    │   ├── BarChart
    │   ├── PieChart
    │   └── ResponsiveContainer
    │
    └── Custom Components
        ├── CurrencySelector
        ├── DatePicker
        ├── LoadingSpinner
        └── EmptyState
```

### Backend Component Architecture

```
Convex Backend
│
├── Authentication Module (auth.ts)
│   ├── signIn
│   ├── signOut
│   ├── getLoggedInUser
│   ├── authenticatedQuery
│   ├── authenticatedMutation
│   ├── authenticatedAction
│   ├── adminQuery
│   ├── adminMutation
│   └── adminAction
│
├── User Management (users.ts)
│   ├── me (get current user)
│   ├── listUsers (admin only)
│   ├── searchUsers (admin only)
│   ├── updateRole (admin only)
│   ├── getUserCount (admin only)
│   ├── getRoleStats (admin only)
│   └── updateProfile
│
├── Sales Module (sales.ts)
│   ├── list (get all sales)
│   ├── get (get single sale)
│   ├── create (create sale)
│   ├── update (update sale)
│   ├── delete (delete sale)
│   └── getSummary (sales analytics)
│
├── Expenses Module (expenses.ts)
│   ├── list (get all expenses)
│   ├── get (get single expense)
│   ├── create (create expense)
│   ├── update (update expense)
│   ├── delete (delete expense)
│   ├── getByCategory (filter by category)
│   └── getSummary (expense analytics)
│
├── Liabilities Module (liabilities.ts)
│   ├── list (get all liabilities)
│   ├── get (get single liability)
│   ├── create (create liability)
│   ├── update (update liability)
│   ├── delete (delete liability)
│   └── getSummary (liability analytics)
│
├── Salaries Module (salaries.ts)
│   ├── list (get all salaries)
│   ├── get (get single salary)
│   ├── create (create salary)
│   ├── update (update salary)
│   ├── delete (delete salary)
│   ├── getByMonth (filter by month)
│   └── getSummary (salary analytics)
│
├── Cash Flow Module (cashflow.ts)
│   ├── list (get all cash flows)
│   ├── get (get single cash flow)
│   ├── create (create cash flow)
│   ├── update (update cash flow)
│   ├── delete (delete cash flow)
│   ├── getByType (filter by type)
│   └── getSummary (cash flow analytics)
│
├── Bank PDC Module (bankPdc.ts)
│   ├── list (get all PDCs)
│   ├── get (get single PDC)
│   ├── create (create PDC)
│   ├── update (update PDC)
│   ├── delete (delete PDC)
│   └── getSummary (PDC analytics)
│
├── Future Needs Module (futureNeeds.ts)
│   ├── list (get all future needs)
│   ├── get (get single need)
│   ├── create (create need)
│   ├── update (update need)
│   ├── delete (delete need)
│   └── getSummary (future needs analytics)
│
├── Business in Hand Module (businessInHand.ts)
│   ├── list (get all business)
│   ├── get (get single business)
│   ├── create (create business)
│   ├── update (update business)
│   ├── delete (delete business)
│   └── getSummary (business analytics)
│
├── Currency Module (currency.ts)
│   ├── getSettings (get currency settings)
│   ├── updateSettings (update settings)
│   ├── convert (convert amount)
│   └── getExchangeRates (get rates)
│
└── Dashboard Module (dashboard.ts)
    ├── getDashboardData (comprehensive data)
    ├── getSummary (financial summary)
    ├── getCharts (chart data)
    └── getRecentActivity (recent transactions)
```

---

## 💾 Database Design

### Entity-Relationship Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                                  │
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
│ description      │         │ exchangeRates    │         │ email (UNIQUE)   │
│ amount           │         │   USD_TO_SAR     │         │ image            │
│ expectedDate     │         │   USD_TO_AED     │         │ role             │
│ currency         │         │ updatedAt        │         │ phone            │
│ status           │         └──────────────────┘         │ emailVerified    │
│ createdAt        │                                      │ phoneVerified    │
│ updatedAt        │                                      │ isAnonymous      │
└──────────────────┘                                      │ _creationTime    │
                                                          └──────────────────┘
```

### Database Indexes

```
Sales Table:
├── by_date: [date]
└── by_created_at: [createdAt]

Expenses Table:
├── by_date: [date]
├── by_category: [category]
└── by_status: [status]

Liabilities Table:
├── by_due_date: [dueDate]
└── by_liability_type: [liabilityType]

Salaries Table:
├── by_month: [month]
├── by_employee: [employeeName]
└── by_status: [paymentStatus]

Cash Flow Table:
├── by_date: [date]
├── by_type: [type]
└── by_category: [category]

Bank PDC Table:
├── by_date: [date]
├── by_bank: [bank]
├── by_status: [status]
└── by_cheque_number: [chequeNumber]

Future Needs Table:
├── by_month: [month]
└── by_status: [status]

Business in Hand Table:
├── by_type: [type]
├── by_expected_date: [expectedDate]
└── by_status: [status]
```

### Data Consistency Rules

1. **Referential Integrity**:
   - Cash flow entries can reference sales, expenses, salaries, etc.
   - Soft references (no foreign key constraints)

2. **Data Validation**:
   - All amounts must be positive numbers
   - Dates must be valid ISO format
   - Currency must be USD, SAR, or AED
   - Status fields must match predefined values

3. **Calculated Fields**:
   - Sales: grossProfit, grossProfitMargin, netProfit, netProfitMargin
   - All calculated on write, not on read

4. **Timestamps**:
   - createdAt: Set on insert
   - updatedAt: Updated on every modification
   - _creationTime: System-generated (Convex)

---

## 🔌 API Design

### API Architecture

```
REST-like API over WebSocket
├── Queries (Read Operations)
│   ├── GET-like operations
│   ├── Real-time subscriptions
│   └── Automatic caching
│
├── Mutations (Write Operations)
│   ├── POST-like (Create)
│   ├── PUT-like (Update)
│   ├── DELETE-like (Delete)
│   └── Transactional
│
└── Actions (Complex Operations)
    ├── Multi-step operations
    ├── External API calls
    └── Background jobs
```

### API Endpoints

#### Authentication APIs

```typescript
// Sign in
api.auth.signIn({ email: string, password: string })
→ Returns: { userId: string, token: string }

// Sign out
api.auth.signOut()
→ Returns: null

// Get current user
api.users.me()
→ Returns: User | null
```

#### Sales APIs

```typescript
// List all sales
api.sales.list()
→ Returns: Sale[]

// Get single sale
api.sales.get({ id: Id<"sales"> })
→ Returns: Sale | null

// Create sale
api.sales.create({
  date: string,
  description: string,
  cost: number,
  sellingPrice: number,
  expenses: number,
  currency: "USD" | "SAR" | "AED"
})
→ Returns: Id<"sales">

// Update sale
api.sales.update({
  id: Id<"sales">,
  ...updates
})
→ Returns: null

// Delete sale
api.sales.delete({ id: Id<"sales"> })
→ Returns: null
```

#### Expenses APIs

```typescript
// List all expenses
api.expenses.list()
→ Returns: Expense[]

// Create expense
api.expenses.create({
  date: string,
  category: string,
  description: string,
  vendor: string,
  amount: number,
  status: "paid" | "unpaid",
  currency: "USD" | "SAR" | "AED"
})
→ Returns: Id<"expenses">

// Update expense
api.expenses.update({
  id: Id<"expenses">,
  ...updates
})
→ Returns: null

// Delete expense
api.expenses.delete({ id: Id<"expenses"> })
→ Returns: null
```

#### Dashboard APIs

```typescript
// Get dashboard data
api.dashboard.getDashboardData({
  dateRange?: {
    startDate: string,
    endDate: string
  }
})
→ Returns: {
  summary: {
    totalExpenses: number,
    outstandingLiabilities: number,
    salariesPaid: number,
    salariesPending: number,
    totalInflows: number,
    totalOutflows: number,
    netCashflow: number,
    businessInHandValue: number
  },
  charts: {
    cashflowTrend: Array<{month, inflows, outflows, netCashflow}>,
    expensesByCategory: Array<{category, amount, percentage}>,
    liabilitiesByDueDate: Array<{month, amount, count}>,
    salesTrend: Array<{month, sales, profit}>
  },
  recentActivity: Array<{type, description, amount, date}>
}
```

#### Currency APIs

```typescript
// Get currency settings
api.currency.getSettings()
→ Returns: {
  selectedCurrency: "USD" | "SAR" | "AED",
  exchangeRates: {
    USD_TO_SAR: number,
    USD_TO_AED: number
  }
}

// Update currency settings
api.currency.updateSettings({
  selectedCurrency?: "USD" | "SAR" | "AED",
  exchangeRates?: {
    USD_TO_SAR?: number,
    USD_TO_AED?: number
  }
})
→ Returns: null

// Convert amount
api.currency.convert({
  amount: number,
  from: "USD" | "SAR" | "AED",
  to: "USD" | "SAR" | "AED"
})
→ Returns: number
```

### API Response Format

```typescript
// Success Response
{
  success: true,
  data: T,
  timestamp: number
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: number
}
```

### API Error Codes

```
AUTH_001: Unauthorized - User not authenticated
AUTH_002: Forbidden - Insufficient permissions
AUTH_003: Invalid credentials

VAL_001: Validation error - Invalid input
VAL_002: Required field missing
VAL_003: Invalid data type

DB_001: Database error - Query failed
DB_002: Record not found
DB_003: Duplicate entry

SYS_001: Internal server error
SYS_002: Service unavailable
SYS_003: Timeout
```

---

## 🔐 Security Design

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├── HTTPS/TLS 1.3 Encryption
├── WebSocket Secure (WSS)
├── CORS Configuration
└── DDoS Protection

Layer 2: Authentication
├── Email/Password Authentication
├── Password Hashing (bcrypt)
├── Session Management
├── Token-based Auth
└── Automatic Session Expiry

Layer 3: Authorization
├── Role-Based Access Control (RBAC)
│   ├── Admin (Full Access)
│   ├── Editor (Create, Read, Update)
│   └── Viewer (Read Only)
├── Row-Level Security (RLS)
└── Function-Level Permissions

Layer 4: Input Validation
├── Client-Side Validation (Zod)
├── Server-Side Validation (Convex)
├── Type Safety (TypeScript)
├── SQL Injection Prevention
└── XSS Prevention

Layer 5: Data Security
├── Encryption at Rest
├── Encryption in Transit
├── Secure Data Storage
├── Audit Logging
└── Data Backup

Layer 6: Application Security
├── CSRF Protection
├── Rate Limiting
├── Error Handling
├── Secure Headers
└── Content Security Policy
```

### Authentication Flow

```
User Login Request
        │
        ▼
┌─────────────────────────┐
│  Client-Side Validation │
│  - Email format         │
│  - Password length      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Send to Server         │
│  - HTTPS encrypted      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Server Validation      │
│  - Check email exists   │
│  - Verify password      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Password Verification  │
│  - bcrypt compare       │
│  - Constant time        │
└───────────┬─────────────┘
            │
            ├─ Invalid ──► Return Error
            │
            ▼ Valid
┌─────────────────────────┐
│  Generate Session       │
│  - Create token         │
│  - Set expiry           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Return to Client       │
│  - HTTP-only cookie     │
│  - Secure flag          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  User Authenticated     │
│  - Access granted       │
└─────────────────────────┘
```

### Authorization Matrix

| Role | View Data | Create | Update | Delete | Admin Panel |
|------|-----------|--------|--------|--------|-------------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ | ❌ |

### Data Encryption

```
Data at Rest:
├── Database Encryption (AES-256)
├── Backup Encryption
└── File Storage Encryption

Data in Transit:
├── HTTPS/TLS 1.3
├── WebSocket Secure (WSS)
└── Certificate Pinning

Sensitive Data:
├── Passwords (bcrypt, salt rounds: 10)
├── Session Tokens (JWT)
└── API Keys (Environment Variables)
```

---

## 📈 Scalability & Performance

### Scalability Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCALABILITY LAYERS                               │
└─────────────────────────────────────────────────────────────────────────┘

Horizontal Scaling (Convex Auto-scales)
├── Frontend: CDN Distribution
│   ├── Edge caching
│   ├── Geographic distribution
│   └── Load balancing
│
├── Backend: Serverless Functions
│   ├── Auto-scaling based on load
│   ├── No server management
│   └── Pay-per-use
│
└── Database: Distributed Storage
    ├── Automatic sharding
    ├── Replication
    └── Load distribution

Vertical Scaling (Automatic)
├── CPU allocation
├── Memory allocation
└── Storage allocation

Caching Strategy
├── Browser Cache (Static assets)
├── CDN Cache (Global distribution)
├── Query Cache (Convex automatic)
└── Application Cache (React state)
```

### Performance Optimization

#### Frontend Optimization

```
Code Splitting
├── Route-based splitting
├── Component lazy loading
└── Dynamic imports

Bundle Optimization
├── Tree shaking
├── Minification
├── Compression (gzip/brotli)
└── Asset optimization

Rendering Optimization
├── React.memo (Prevent re-renders)
├── useMemo (Cache calculations)
├── useCallback (Stable functions)
├── Virtual scrolling
└── Debouncing/Throttling

Asset Optimization
├── Image optimization
├── Font subsetting
├── SVG optimization
└── CSS purging
```

#### Backend Optimization

```
Query Optimization
├── Index usage
├── Query planning
├── Pagination
└── Selective field loading

Database Optimization
├── Proper indexing
├── Query caching
├── Connection pooling
└── Read replicas

Function Optimization
├── Minimize cold starts
├── Efficient algorithms
├── Batch operations
└── Async processing
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Time to Interactive | < 3.0s | ~2.5s |
| Largest Contentful Paint | < 2.5s | ~2.0s |
| Cumulative Layout Shift | < 0.1 | ~0.05 |
| First Input Delay | < 100ms | ~50ms |
| API Response Time | < 200ms | ~150ms |
| Database Query Time | < 50ms | ~30ms |
| Real-time Update Latency | < 100ms | ~50ms |

---

## 🚀 Deployment Architecture

### Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         CDN / Edge Network                           │
│                    (Cloudflare / Vercel Edge)                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Static Assets (Cached)                            │ │
│  │  - HTML, CSS, JavaScript                                       │ │
│  │  - Images, Fonts                                               │ │
│  │  - Cache TTL: 1 year                                           │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌──────────────────────────────▼───────────────────────────────────────┐
│                      Hosting Platform                                │
│                   (Vercel / Netlify / Render)                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              React Application                                 │ │
│  │  - Server-side rendering (optional)                            │ │
│  │  - API routes (optional)                                       │ │
│  │  - Environment variables                                       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket + HTTPS
                              │
┌──────────────────────────────▼───────────────────────────────────────┐
│                         Convex Cloud                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Serverless Functions                              │ │
│  │  - Queries, Mutations, Actions                                 │ │
│  │  - Auto-scaling                                                │ │
│  │  - Global distribution                                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              │                                       │
│  ┌────────────────────────────▼─────────────────────────────────┐  │
│  │              Database Cluster                                 │  │
│  │  - Multi-region replication                                   │  │
│  │  - Automatic backups                                          │  │
│  │  - Point-in-time recovery                                     │  │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CI/CD PIPELINE                                   │
└─────────────────────────────────────────────────────────────────────────┘

Developer Push to Git
        │
        ▼
┌─────────────────────────┐
│  GitHub Actions         │
│  - Trigger on push      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Install Dependencies   │
│  - bun install          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Type Check             │
│  - tsc --noEmit         │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Lint Code              │
│  - eslint               │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Build Application      │
│  - bun run build        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Deploy Convex          │
│  - npx convex deploy    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Deploy Frontend        │
│  - Vercel/Netlify       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Run Smoke Tests        │
│  - Health checks        │
└───────────┬─────────────┘
            │
            ├─ Fail ──► Rollback
            │
            ▼ Pass
┌─────────────────────────┐
│  Production Live ✅     │
└─────────────────────────┘
```

### Environment Configuration

```
Development Environment
├── Local development server
├── Convex dev deployment
├── Hot module replacement
├── Debug mode enabled
└── Sample data

Staging Environment
├── Production-like setup
├── Convex staging deployment
├── Real data (anonymized)
├── Performance testing
└── UAT testing

Production Environment
├── Optimized build
├── Convex production deployment
├── Real user data
├── Monitoring enabled
└── Backup enabled
```

---

## 📊 Monitoring & Observability

### Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MONITORING LAYERS                                │
└─────────────────────────────────────────────────────────────────────────┘

Application Monitoring
├── Frontend Metrics
│   ├── Page load times
│   ├── User interactions
│   ├── Error rates
│   └── Performance metrics
│
├── Backend Metrics
│   ├── Function execution times
│   ├── Database query performance
│   ├── API response times
│   └── Error rates
│
└── Business Metrics
    ├── Active users
    ├── Transaction volume
    ├── Feature usage
    └── Conversion rates

Infrastructure Monitoring
├── Server Health (Convex managed)
├── Database Performance
├── Network Latency
└── Storage Usage

Error Tracking
├── JavaScript Errors
├── API Errors
├── Database Errors
└── Stack Traces

Logging
├── Application Logs
├── Access Logs
├── Error Logs
└── Audit Logs
```

### Monitoring Tools

```
Convex Dashboard
├── Function metrics
├── Database queries
├── Error rates
├── Active connections
└── Storage usage

Hosting Platform Analytics
├── Vercel Analytics
├── Netlify Analytics
└── Custom analytics

Error Tracking (Optional)
├── Sentry
├── LogRocket
└── Rollbar

Performance Monitoring
├── Lighthouse CI
├── Web Vitals
└── Custom metrics
```

### Alerting Strategy

```
Critical Alerts (Immediate)
├── Service down
├── Database unavailable
├── High error rate (> 5%)
└── Security breach

Warning Alerts (15 minutes)
├── Slow response times
├── High memory usage
├── Increased error rate
└── Failed deployments

Info Alerts (Daily digest)
├── Usage statistics
├── Performance trends
├── Feature adoption
└── User feedback
```

---

## 🔄 Disaster Recovery

### Backup Strategy

```
Database Backups
├── Automatic daily backups (Convex)
├── Point-in-time recovery
├── 30-day retention
└── Geographic replication

Code Backups
├── Git version control
├── GitHub repository
├── Branch protection
└── Release tags

Configuration Backups
├── Environment variables
├── Deployment configs
└── Infrastructure as code
```

### Recovery Procedures

```
Scenario 1: Database Corruption
├── 1. Identify corruption point
├── 2. Stop write operations
├── 3. Restore from backup
├── 4. Verify data integrity
└── 5. Resume operations

Scenario 2: Deployment Failure
├── 1. Detect failure
├── 2. Rollback to previous version
├── 3. Investigate issue
├── 4. Fix and redeploy
└── 5. Verify functionality

Scenario 3: Security Breach
├── 1. Isolate affected systems
├── 2. Revoke compromised credentials
├── 3. Patch vulnerabilities
├── 4. Restore from clean backup
└── 5. Audit and monitor

Scenario 4: Data Loss
├── 1. Assess extent of loss
├── 2. Restore from latest backup
├── 3. Recover missing data
├── 4. Verify completeness
└── 5. Implement prevention
```

### Business Continuity

```
Recovery Time Objective (RTO)
├── Critical: < 1 hour
├── High: < 4 hours
├── Medium: < 24 hours
└── Low: < 72 hours

Recovery Point Objective (RPO)
├── Critical: < 15 minutes
├── High: < 1 hour
├── Medium: < 24 hours
└── Low: < 7 days

Availability Target
├── Production: 99.9% (8.76 hours downtime/year)
├── Staging: 99% (3.65 days downtime/year)
└── Development: Best effort
```

---

## 📚 Design Patterns Used

### Frontend Patterns

1. **Component Composition**: Building complex UIs from simple components
2. **Container/Presenter**: Separating logic from presentation
3. **Custom Hooks**: Reusable stateful logic
4. **Render Props**: Sharing code between components
5. **Higher-Order Components**: Component enhancement
6. **Context API**: Global state management
7. **Optimistic Updates**: Instant UI feedback

### Backend Patterns

1. **Repository Pattern**: Data access abstraction
2. **Service Layer**: Business logic separation
3. **Validator Pattern**: Input validation
4. **Factory Pattern**: Object creation
5. **Observer Pattern**: Real-time updates
6. **Strategy Pattern**: Algorithm selection
7. **Decorator Pattern**: Function enhancement

### Architectural Patterns

1. **Three-Tier Architecture**: Separation of concerns
2. **Serverless Architecture**: No server management
3. **Event-Driven Architecture**: Real-time updates
4. **Microservices (Logical)**: Module independence
5. **CQRS (Light)**: Separate read/write operations

---

## 🎯 Design Trade-offs

### Technology Choices

#### Convex vs Traditional Backend
**Chosen**: Convex
**Reason**: Real-time by default, serverless, type-safe
**Trade-off**: Vendor lock-in, less control over infrastructure

#### React vs Other Frameworks
**Chosen**: React
**Reason**: Large ecosystem, mature, excellent tooling
**Trade-off**: Larger bundle size, more boilerplate

#### Tailwind vs CSS-in-JS
**Chosen**: Tailwind CSS
**Reason**: Rapid development, consistent design, small bundle
**Trade-off**: HTML verbosity, learning curve

#### TypeScript vs JavaScript
**Chosen**: TypeScript
**Reason**: Type safety, better IDE support, fewer bugs
**Trade-off**: Build step required, more verbose

### Architectural Decisions

#### Serverless vs Traditional Servers
**Chosen**: Serverless
**Pros**: Auto-scaling, no maintenance, pay-per-use
**Cons**: Cold starts, vendor lock-in, debugging complexity

#### NoSQL vs SQL
**Chosen**: NoSQL (Convex)
**Pros**: Flexible schema, real-time sync, scalability
**Cons**: No complex joins, eventual consistency

#### Monorepo vs Multi-repo
**Chosen**: Monorepo
**Pros**: Easier code sharing, consistent tooling
**Cons**: Larger repository, complex CI/CD

---

## 📝 Future Enhancements

### Phase 2 (Planned)
- Export to Excel/PDF
- Email notifications
- Recurring transactions
- Advanced filtering
- Custom date ranges
- Bulk operations

### Phase 3 (Planned)
- Mobile app (iOS/Android)
- Advanced reporting
- Budget vs Actual
- Forecasting
- Accounting software integration
- Third-party API

### Phase 4 (Future)
- AI-powered insights
- Automated categorization
- Invoice generation
- Payment gateway
- Advanced permissions
- Audit trail

---

## 📞 Document Maintenance

**Document Owner**: Development Team  
**Last Updated**: January 2025  
**Review Frequency**: Quarterly  
**Version**: 1.0.0

---

*This system design document is maintained alongside the codebase and updated with significant architectural changes.*
