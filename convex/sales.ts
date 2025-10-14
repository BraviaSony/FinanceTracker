import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all sales records
export const getAllSales = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("sales"),
    _creationTime: v.number(),
    date: v.string(),
    description: v.string(),
    cost: v.number(),
    sellingPrice: v.number(),
    grossProfit: v.number(),
    grossProfitMargin: v.number(),
    expenses: v.number(),
    netProfit: v.number(),
    netProfitMargin: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    currency: v.string(), // Add currency field back for frontend compatibility
  })),
  handler: async (ctx) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    // Add currency field for frontend compatibility (all PKR)
    return sales.map(sale => ({
      ...sale,
      currency: "PKR",
    }));
  },
});

// Get sales count
export const getSalesCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const sales = await ctx.db.query("sales").collect();
    return sales.length;
  },
});

// Create a new sales record
export const createSale = mutation({
  args: {
    date: v.string(),
    description: v.string(),
    cost: v.number(),
    sellingPrice: v.number(),
    expenses: v.number(),
  },
  returns: v.id("sales"),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Calculate profits
    const grossProfit = args.sellingPrice - args.cost;
    const grossProfitMargin = args.sellingPrice > 0 ? (grossProfit / args.sellingPrice) * 100 : 0;
    const netProfit = grossProfit - args.expenses;
    const netProfitMargin = args.sellingPrice > 0 ? (netProfit / args.sellingPrice) * 100 : 0;

    const saleId = await ctx.db.insert("sales", {
      date: args.date,
      description: args.description,
      cost: args.cost,
      sellingPrice: args.sellingPrice,
      grossProfit,
      grossProfitMargin,
      expenses: args.expenses,
      netProfit,
      netProfitMargin,
      createdAt: now,
      updatedAt: now,
    });

    // Create cashflow entry for sales inflow
    await ctx.db.insert("cashflow", {
      date: args.date,
      type: "inflow",
      category: "sales",
      description: `Sale: ${args.description}`,
      amount: args.sellingPrice,
      referenceId: saleId,
      createdAt: now,
      updatedAt: now,
    });

    return saleId;
  },
});

// Update a sales record
export const updateSale = mutation({
  args: {
    id: v.id("sales"),
    date: v.optional(v.string()),
    description: v.optional(v.string()),
    cost: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    expenses: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Sale not found");
    }

    const updates: Partial<Doc<"sales">> = {
      updatedAt: Date.now(),
    };

    if (args.date !== undefined) updates.date = args.date;
    if (args.description !== undefined) updates.description = args.description;

    // Recalculate if financial values change
    const cost = args.cost !== undefined ? args.cost : existing.cost;
    const sellingPrice = args.sellingPrice !== undefined ? args.sellingPrice : existing.sellingPrice;
    const expenses = args.expenses !== undefined ? args.expenses : existing.expenses;

    if (args.cost !== undefined || args.sellingPrice !== undefined || args.expenses !== undefined) {
      const grossProfit = sellingPrice - cost;
      const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
      const netProfit = grossProfit - expenses;
      const netProfitMargin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;

      updates.cost = cost;
      updates.sellingPrice = sellingPrice;
      updates.expenses = expenses;
      updates.grossProfit = grossProfit;
      updates.grossProfitMargin = grossProfitMargin;
      updates.netProfit = netProfit;
      updates.netProfitMargin = netProfitMargin;
    }

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

// Delete a sales record
export const deleteSale = mutation({
  args: {
    id: v.id("sales"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get sales summary
export const getSalesSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.object({
    totalSales: v.number(),
    totalCost: v.number(),
    totalGrossProfit: v.number(),
    totalNetProfit: v.number(),
    averageGrossMargin: v.number(),
    averageNetMargin: v.number(),
    salesCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const sales = await ctx.db.query("sales").collect();
    
    // Filter by date range if provided
    const filteredSales = sales.filter(sale => {
      if (args.startDate && sale.date < args.startDate) return false;
      if (args.endDate && sale.date > args.endDate) return false;
      return true;
    });

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
    const totalCost = filteredSales.reduce((sum, sale) => sum + sale.cost, 0);
    const totalGrossProfit = filteredSales.reduce((sum, sale) => sum + sale.grossProfit, 0);
    const totalNetProfit = filteredSales.reduce((sum, sale) => sum + sale.netProfit, 0);
    
    const averageGrossMargin = filteredSales.length > 0 
      ? filteredSales.reduce((sum, sale) => sum + sale.grossProfitMargin, 0) / filteredSales.length 
      : 0;
    
    const averageNetMargin = filteredSales.length > 0 
      ? filteredSales.reduce((sum, sale) => sum + sale.netProfitMargin, 0) / filteredSales.length 
      : 0;

    return {
      totalSales,
      totalCost,
      totalGrossProfit,
      totalNetProfit,
      averageGrossMargin,
      averageNetMargin,
      salesCount: filteredSales.length,
    };
  },
});
