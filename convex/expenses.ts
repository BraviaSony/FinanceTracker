import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all expenses (PKR currency)
export const getAllExpenses = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("expenses"),
    _creationTime: v.number(),
    date: v.string(),
    category: v.string(),
    description: v.string(),
    vendor: v.string(),
    amount: v.number(),
    status: v.union(v.literal("paid"), v.literal("unpaid")),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("expenses")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});

// Get expenses count
export const getExpensesCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    return expenses.length;
  },
});

// Create a new expense
export const createExpense = mutation({
  args: {
    date: v.string(),
    category: v.string(),
    description: v.string(),
    vendor: v.string(),
    amount: v.number(),
    status: v.union(v.literal("paid"), v.literal("unpaid")),
  },
  returns: v.id("expenses"),
  handler: async (ctx, args) => {
    const now = Date.now();

    const expenseId = await ctx.db.insert("expenses", {
      date: args.date,
      category: args.category,
      description: args.description,
      vendor: args.vendor,
      amount: args.amount,
      status: args.status,
      createdAt: now,
      updatedAt: now,
    });

    // Create cashflow entry for expense outflow
    await ctx.db.insert("cashflow", {
      date: args.date,
      type: "outflow",
      category: "expenses",
      description: `Expense: ${args.description}`,
      amount: args.amount,
      referenceId: expenseId,
      createdAt: now,
      updatedAt: now,
    });

    return expenseId;
  },
});

// Update an expense
export const updateExpense = mutation({
  args: {
    id: v.id("expenses"),
    date: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    vendor: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(v.union(v.literal("paid"), v.literal("unpaid"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Partial<Doc<"expenses">> = {
      updatedAt: Date.now(),
    };

    if (args.date !== undefined) updates.date = args.date;
    if (args.category !== undefined) updates.category = args.category;
    if (args.description !== undefined) updates.description = args.description;
    if (args.vendor !== undefined) updates.vendor = args.vendor;
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

// Delete an expense
export const deleteExpense = mutation({
  args: {
    id: v.id("expenses"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get expense categories
export const getExpenseCategories = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    const categories = [...new Set(expenses.map(expense => expense.category))];
    return categories.sort();
  },
});

// Get expenses by category
export const getExpensesByCategory = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.array(v.object({
    category: v.string(),
    totalAmount: v.number(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    const expenses = await ctx.db.query("expenses").collect();
    
    // Filter by date range if provided
    const filteredExpenses = expenses.filter(expense => {
      if (args.startDate && expense.date < args.startDate) return false;
      if (args.endDate && expense.date > args.endDate) return false;
      return true;
    });

    const categoryMap = new Map<string, { totalAmount: number; count: number }>();
    
    filteredExpenses.forEach(expense => {
      const existing = categoryMap.get(expense.category) || { totalAmount: 0, count: 0 };
      categoryMap.set(expense.category, {
        totalAmount: existing.totalAmount + expense.amount,
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      totalAmount: data.totalAmount,
      count: data.count,
    }));
  },
});

// Get expense summary
export const getExpenseSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.object({
    totalExpenses: v.number(),
    paidExpenses: v.number(),
    unpaidExpenses: v.number(),
    expenseCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const expenses = await ctx.db.query("expenses").collect();
    
    // Filter by date range if provided
    const filteredExpenses = expenses.filter(expense => {
      if (args.startDate && expense.date < args.startDate) return false;
      if (args.endDate && expense.date > args.endDate) return false;
      return true;
    });

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const paidExpenses = filteredExpenses
      .filter(expense => expense.status === "paid")
      .reduce((sum, expense) => sum + expense.amount, 0);
    const unpaidExpenses = filteredExpenses
      .filter(expense => expense.status === "unpaid")
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalExpenses,
      paidExpenses,
      unpaidExpenses,
      expenseCount: filteredExpenses.length,
    };
  },
});
