import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all cashflow records (PKR currency)
export const getAllCashflow = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("cashflow"),
    _creationTime: v.number(),
    date: v.string(),
    type: v.union(v.literal("inflow"), v.literal("outflow")),
    category: v.string(),
    description: v.string(),
    amount: v.number(),
    referenceId: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("cashflow")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});

// Get cashflow count
export const getCashflowCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const cashflows = await ctx.db.query("cashflow").collect();
    return cashflows.length;
  },
});

// Create a manual cashflow entry (PKR currency)
export const createCashflowEntry = mutation({
  args: {
    date: v.string(),
    type: v.union(v.literal("inflow"), v.literal("outflow")),
    category: v.string(),
    description: v.string(),
    amount: v.number(),
  },
  returns: v.id("cashflow"),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("cashflow", {
      date: args.date,
      type: args.type,
      category: args.category,
      description: args.description,
      amount: args.amount,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a cashflow entry (PKR currency)
export const updateCashflowEntry = mutation({
  args: {
    id: v.id("cashflow"),
    date: v.optional(v.string()),
    type: v.optional(v.union(v.literal("inflow"), v.literal("outflow"))),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Partial<Doc<"cashflow">> = {
      updatedAt: Date.now(),
    };

    if (args.date !== undefined) updates.date = args.date;
    if (args.type !== undefined) updates.type = args.type;
    if (args.category !== undefined) updates.category = args.category;
    if (args.description !== undefined) updates.description = args.description;
    if (args.amount !== undefined) updates.amount = args.amount;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

// Delete a cashflow entry
export const deleteCashflowEntry = mutation({
  args: {
    id: v.id("cashflow"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get cashflow summary
export const getCashflowSummary = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.object({
    totalInflows: v.number(),
    totalOutflows: v.number(),
    netCashflow: v.number(),
    inflowCount: v.number(),
    outflowCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const cashflows = await ctx.db.query("cashflow").collect();
    
    // Filter by date range if provided
    const filteredCashflows = cashflows.filter(cashflow => {
      if (args.startDate && cashflow.date < args.startDate) return false;
      if (args.endDate && cashflow.date > args.endDate) return false;
      return true;
    });

    const inflows = filteredCashflows.filter(cf => cf.type === "inflow");
    const outflows = filteredCashflows.filter(cf => cf.type === "outflow");

    const totalInflows = inflows.reduce((sum, cf) => sum + cf.amount, 0);
    const totalOutflows = outflows.reduce((sum, cf) => sum + cf.amount, 0);

    return {
      totalInflows,
      totalOutflows,
      netCashflow: totalInflows - totalOutflows,
      inflowCount: inflows.length,
      outflowCount: outflows.length,
    };
  },
});

// Get cashflow by category
export const getCashflowByCategory = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.array(v.object({
    category: v.string(),
    type: v.union(v.literal("inflow"), v.literal("outflow")),
    totalAmount: v.number(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    const cashflows = await ctx.db.query("cashflow").collect();
    
    // Filter by date range if provided
    const filteredCashflows = cashflows.filter(cashflow => {
      if (args.startDate && cashflow.date < args.startDate) return false;
      if (args.endDate && cashflow.date > args.endDate) return false;
      return true;
    });

    const categoryMap = new Map<string, { totalAmount: number; count: number; type: "inflow" | "outflow" }>();
    
    filteredCashflows.forEach(cashflow => {
      const key = `${cashflow.category}-${cashflow.type}`;
      const existing = categoryMap.get(key) || { totalAmount: 0, count: 0, type: cashflow.type };
      categoryMap.set(key, {
        totalAmount: existing.totalAmount + cashflow.amount,
        count: existing.count + 1,
        type: cashflow.type,
      });
    });

    return Array.from(categoryMap.entries()).map(([key, data]) => {
      const [category] = key.split('-');
      return {
        category,
        type: data.type,
        totalAmount: data.totalAmount,
        count: data.count,
      };
    });
  },
});

// Get cashflow trend (monthly)
export const getCashflowTrend = query({
  args: {
    months: v.optional(v.number()),
  },
  returns: v.array(v.object({
    month: v.string(),
    inflows: v.number(),
    outflows: v.number(),
    netCashflow: v.number(),
  })),
  handler: async (ctx, args) => {
    const cashflows = await ctx.db.query("cashflow").collect();
    const monthsToShow = args.months || 12;
    
    // Get the last N months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - monthsToShow);
    
    const monthMap = new Map<string, { inflows: number; outflows: number }>();
    
    cashflows.forEach(cashflow => {
      const cashflowDate = new Date(cashflow.date);
      if (cashflowDate >= startDate && cashflowDate <= endDate) {
        const monthKey = `${cashflowDate.getFullYear()}-${String(cashflowDate.getMonth() + 1).padStart(2, '0')}`;
        const existing = monthMap.get(monthKey) || { inflows: 0, outflows: 0 };
        
        if (cashflow.type === "inflow") {
          existing.inflows += cashflow.amount;
        } else {
          existing.outflows += cashflow.amount;
        }
        
        monthMap.set(monthKey, existing);
      }
    });

    // Fill in missing months with zero values
    const result: Array<{
      month: string;
      inflows: number;
      outflows: number;
      netCashflow: number;
    }> = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const data = monthMap.get(monthKey) || { inflows: 0, outflows: 0 };
      result.push({
        month: monthKey,
        inflows: data.inflows,
        outflows: data.outflows,
        netCashflow: data.inflows - data.outflows,
      });
    }

    return result;
  },
});

// Get cashflow categories
export const getCashflowCategories = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const cashflows = await ctx.db.query("cashflow").collect();
    const categories = [...new Set(cashflows.map(cf => cf.category))];
    return categories.sort();
  },
});
