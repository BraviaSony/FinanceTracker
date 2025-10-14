import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all liabilities (PKR currency)
export const getAllLiabilities = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("liabilities"),
    _creationTime: v.number(),
    lenderParty: v.string(),
    liabilityType: v.string(),
    startDate: v.string(),
    dueDate: v.string(),
    originalAmount: v.number(),
    paidAmount: v.number(),
    outstandingBalance: v.number(),
    description: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    const liabilities = await ctx.db
      .query("liabilities")
      .withIndex("by_due_date")
      .order("asc")
      .collect();

    // Calculate paidAmount for frontend compatibility
    return liabilities.map(liability => ({
      ...liability,
      paidAmount: liability.originalAmount - liability.outstandingBalance,
    }));
  },
});

// Get liabilities count
export const getLiabilitiesCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const liabilities = await ctx.db.query("liabilities").collect();
    return liabilities.length;
  },
});

// Create a new liability (PKR currency)
export const createLiability = mutation({
  args: {
    lenderParty: v.string(),
    liabilityType: v.string(),
    startDate: v.string(),
    dueDate: v.string(),
    originalAmount: v.number(),
    description: v.optional(v.string()),
  },
  returns: v.id("liabilities"),
  handler: async (ctx, args) => {
    const now = Date.now();

    const liabilityId = await ctx.db.insert("liabilities", {
      lenderParty: args.lenderParty,
      liabilityType: args.liabilityType,
      startDate: args.startDate,
      dueDate: args.dueDate,
      originalAmount: args.originalAmount,
      outstandingBalance: args.originalAmount, // Initially equals original amount
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });

    // Create cashflow entry for liability inflow (when money is received)
    await ctx.db.insert("cashflow", {
      date: args.startDate,
      type: "inflow",
      category: "liabilities",
      description: `Liability: ${args.lenderParty} - ${args.liabilityType}`,
      amount: args.originalAmount,
      referenceId: liabilityId,
      createdAt: now,
      updatedAt: now,
    });

    return liabilityId;
  },
});

// Update a liability (PKR currency)
export const updateLiability = mutation({
  args: {
    id: v.id("liabilities"),
    lenderParty: v.optional(v.string()),
    liabilityType: v.optional(v.string()),
    startDate: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    originalAmount: v.optional(v.number()),
    outstandingBalance: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Partial<Doc<"liabilities">> = {
      updatedAt: Date.now(),
    };

    if (args.lenderParty !== undefined) updates.lenderParty = args.lenderParty;
    if (args.liabilityType !== undefined) updates.liabilityType = args.liabilityType;
    if (args.startDate !== undefined) updates.startDate = args.startDate;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.originalAmount !== undefined) updates.originalAmount = args.originalAmount;
    if (args.outstandingBalance !== undefined) updates.outstandingBalance = args.outstandingBalance;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

// Make payment towards liability (PKR currency)
export const makePayment = mutation({
  args: {
    id: v.id("liabilities"),
    paymentAmount: v.number(),
    paymentDate: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const liability = await ctx.db.get(args.id);
    if (!liability) {
      throw new Error("Liability not found");
    }

    const newOutstandingBalance = Math.max(0, liability.outstandingBalance - args.paymentAmount);

    await ctx.db.patch(args.id, {
      outstandingBalance: newOutstandingBalance,
      updatedAt: Date.now(),
    });

    // Create cashflow entry for liability payment (outflow)
    await ctx.db.insert("cashflow", {
      date: args.paymentDate,
      type: "outflow",
      category: "liabilities",
      description: `Payment to ${liability.lenderParty} - ${liability.liabilityType}`,
      amount: args.paymentAmount,
      referenceId: args.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Delete a liability
export const deleteLiability = mutation({
  args: {
    id: v.id("liabilities"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get liability types
export const getLiabilityTypes = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const liabilities = await ctx.db.query("liabilities").collect();
    const types = [...new Set(liabilities.map(liability => liability.liabilityType))];
    return types.sort();
  },
});

// Get liabilities summary
export const getLiabilitiesSummary = query({
  args: {},
  returns: v.object({
    totalOriginalAmount: v.number(),
    totalOutstandingBalance: v.number(),
    totalPaidAmount: v.number(),
    liabilityCount: v.number(),
    overdueLiabilities: v.number(),
  }),
  handler: async (ctx) => {
    const liabilities = await ctx.db.query("liabilities").collect();
    const today = new Date().toISOString().split('T')[0];

    const totalOriginalAmount = liabilities.reduce((sum, liability) => sum + liability.originalAmount, 0);
    const totalOutstandingBalance = liabilities.reduce((sum, liability) => sum + liability.outstandingBalance, 0);
    const totalPaidAmount = totalOriginalAmount - totalOutstandingBalance;
    const overdueLiabilities = liabilities.filter(liability => 
      liability.dueDate < today && liability.outstandingBalance > 0
    ).length;

    return {
      totalOriginalAmount,
      totalOutstandingBalance,
      totalPaidAmount,
      liabilityCount: liabilities.length,
      overdueLiabilities,
    };
  },
});

// Get liabilities by due date (PKR currency)
export const getLiabilitiesByDueDate = query({
  args: {
    daysAhead: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("liabilities"),
    lenderParty: v.string(),
    liabilityType: v.string(),
    dueDate: v.string(),
    outstandingBalance: v.number(),
    daysUntilDue: v.number(),
  })),
  handler: async (ctx, args) => {
    const liabilities = await ctx.db.query("liabilities").collect();
    const today = new Date();
    const daysAhead = args.daysAhead || 30;

    const upcomingLiabilities = liabilities
      .filter(liability => liability.outstandingBalance > 0)
      .map(liability => {
        const dueDate = new Date(liability.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          _id: liability._id,
          lenderParty: liability.lenderParty,
          liabilityType: liability.liabilityType,
          dueDate: liability.dueDate,
          outstandingBalance: liability.outstandingBalance,
          daysUntilDue,
        };
      })
      .filter(liability => liability.daysUntilDue <= daysAhead)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    return upcomingLiabilities;
  },
});
