import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { getInternalSchema } from "./lib/internal_schema";

export default defineSchema({
  /*
   * CAPITAL: DO NOT MODIFY THIS SECTION
   * INTERNAL AUTH SCHEMA
   */
  ...getInternalSchema(),

  /* APPLICATION TABLES */
  
  // Sales Management (PKR currency)
  sales: defineTable({
    date: v.string(),
    description: v.string(),
    cost: v.number(),
    sellingPrice: v.number(),
    grossProfit: v.number(), // calculated: sellingPrice - cost
    grossProfitMargin: v.number(), // calculated: (grossProfit / sellingPrice) * 100
    expenses: v.number(),
    netProfit: v.number(), // calculated: grossProfit - expenses
    netProfitMargin: v.number(), // calculated: (netProfit / sellingPrice) * 100
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
    .index("by_created_at", ["createdAt"]),

  // Expense Tracking
  expenses: defineTable({
    date: v.string(),
    category: v.string(),
    description: v.string(),
    vendor: v.string(),
    amount: v.number(),
    status: v.union(v.literal("paid"), v.literal("unpaid")),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    ,

  // Liabilities Management
  liabilities: defineTable({
    lenderParty: v.string(),
    liabilityType: v.string(),
    startDate: v.string(),
    dueDate: v.string(),
    originalAmount: v.number(),
    outstandingBalance: v.number(),
    description: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_due_date", ["dueDate"])
    .index("by_liability_type", ["liabilityType"])
    ,

  // Salary Management
  salaries: defineTable({
    employeeName: v.string(),
    role: v.string(),
    netSalary: v.number(),
    paymentStatus: v.union(v.literal("paid"), v.literal("pending")),
    paymentDate: v.optional(v.string()),
    month: v.string(), // format: YYYY-MM

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_month", ["month"])
    .index("by_employee", ["employeeName"])
    .index("by_status", ["paymentStatus"])
    ,

  // Cash Flow Tracking
  cashflow: defineTable({
    date: v.string(),
    type: v.union(v.literal("inflow"), v.literal("outflow")),
    category: v.string(), // sales, capital_injection, receivables, expenses, salaries, liabilities, pdc
    description: v.string(),
    amount: v.number(),
    referenceId: v.optional(v.string()), // reference to related transaction

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
    .index("by_type", ["type"])
    .index("by_category", ["category"])
    ,

  // Bank PDC Management
  bankPdc: defineTable({
    date: v.string(),
    bank: v.string(),
    chequeNumber: v.string(),
    code: v.string(),
    supplier: v.string(),
    description: v.string(),
    amount: v.number(),
    status: v.union(v.literal("cleared"), v.literal("pending")),
    creationDate: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
    .index("by_bank", ["bank"])
    .index("by_status", ["status"])
    .index("by_cheque_number", ["chequeNumber"])
    ,

  // Future Needs Planning
  futureNeeds: defineTable({
    month: v.string(), // format: YYYY-MM
    description: v.string(),
    quantity: v.number(),
    amount: v.number(),
    status: v.union(v.literal("recurring"), v.literal("one-time")),
    remarks: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_month", ["month"])
    .index("by_status", ["status"])
    ,

  // Business in Hand (PKR currency)
  businessInHand: defineTable({
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    description: v.string(),
    amount: v.number(),
    expectedDate: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received")),

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_type", ["type"])
    .index("by_expected_date", ["expectedDate"])
    .index("by_status", ["status"])
    ,

  // Seeding Sessions - Track sample data seeding for selective cleanup
  seedingSessions: defineTable({
    startTime: v.number(),
    active: v.boolean(),
  }),
});
