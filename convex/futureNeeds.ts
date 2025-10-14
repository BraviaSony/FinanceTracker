import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all future needs (PKR currency)
export const getAllFutureNeeds = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("futureNeeds"),
    _creationTime: v.number(),
    month: v.string(),
    description: v.string(),
    quantity: v.number(),
    amount: v.number(),
    status: v.union(v.literal("recurring"), v.literal("one-time")),
    remarks: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("futureNeeds")
      .withIndex("by_month")
      .order("asc")
      .collect();
  },
});

// Get future needs count
export const getFutureNeedsCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const futureNeeds = await ctx.db.query("futureNeeds").collect();
    return futureNeeds.length;
  },
});

// Create a new future need (PKR currency)
export const createFutureNeed = mutation({
  args: {
    month: v.string(),
    description: v.string(),
    quantity: v.number(),
    amount: v.number(),
    status: v.union(v.literal("recurring"), v.literal("one-time")),
    remarks: v.optional(v.string()),
  },
  returns: v.id("futureNeeds"),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("futureNeeds", {
      month: args.month,
      description: args.description,
      quantity: args.quantity,
      amount: args.amount,
      status: args.status,
      remarks: args.remarks,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a future need (PKR currency)
export const updateFutureNeed = mutation({
  args: {
    id: v.id("futureNeeds"),
    month: v.optional(v.string()),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
    amount: v.optional(v.number()),
    status: v.optional(v.union(v.literal("recurring"), v.literal("one-time"))),
    remarks: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const updates: Partial<Doc<"futureNeeds">> = {
      updatedAt: Date.now(),
    };

    if (args.month !== undefined) updates.month = args.month;
    if (args.description !== undefined) updates.description = args.description;
    if (args.quantity !== undefined) updates.quantity = args.quantity;
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.status !== undefined) updates.status = args.status;
    if (args.remarks !== undefined) updates.remarks = args.remarks;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

// Delete a future need
export const deleteFutureNeed = mutation({
  args: {
    id: v.id("futureNeeds"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get future needs summary
export const getFutureNeedsSummary = query({
  args: {
    startMonth: v.optional(v.string()),
    endMonth: v.optional(v.string()),
  },
  returns: v.object({
    totalAmount: v.number(),
    recurringAmount: v.number(),
    oneTimeAmount: v.number(),
    totalCount: v.number(),
    recurringCount: v.number(),
    oneTimeCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const futureNeeds = await ctx.db.query("futureNeeds").collect();
    
    // Filter by month range if provided
    const filteredNeeds = futureNeeds.filter(need => {
      if (args.startMonth && need.month < args.startMonth) return false;
      if (args.endMonth && need.month > args.endMonth) return false;
      return true;
    });

    const totalAmount = filteredNeeds.reduce((sum, need) => sum + (need.amount * need.quantity), 0);
    const recurringNeeds = filteredNeeds.filter(need => need.status === "recurring");
    const oneTimeNeeds = filteredNeeds.filter(need => need.status === "one-time");

    const recurringAmount = recurringNeeds.reduce((sum, need) => sum + (need.amount * need.quantity), 0);
    const oneTimeAmount = oneTimeNeeds.reduce((sum, need) => sum + (need.amount * need.quantity), 0);

    return {
      totalAmount,
      recurringAmount,
      oneTimeAmount,
      totalCount: filteredNeeds.length,
      recurringCount: recurringNeeds.length,
      oneTimeCount: oneTimeNeeds.length,
    };
  },
});

// Get future needs by month
export const getFutureNeedsByMonth = query({
  args: {
    startMonth: v.optional(v.string()),
    endMonth: v.optional(v.string()),
  },
  returns: v.array(v.object({
    month: v.string(),
    totalAmount: v.number(),
    recurringAmount: v.number(),
    oneTimeAmount: v.number(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    const futureNeeds = await ctx.db.query("futureNeeds").collect();
    
    // Filter by month range if provided
    const filteredNeeds = futureNeeds.filter(need => {
      if (args.startMonth && need.month < args.startMonth) return false;
      if (args.endMonth && need.month > args.endMonth) return false;
      return true;
    });

    const monthMap = new Map<string, {
      totalAmount: number;
      recurringAmount: number;
      oneTimeAmount: number;
      count: number;
    }>();
    
    filteredNeeds.forEach(need => {
      const existing = monthMap.get(need.month) || {
        totalAmount: 0,
        recurringAmount: 0,
        oneTimeAmount: 0,
        count: 0,
      };
      
      const needAmount = need.amount * need.quantity;
      
      monthMap.set(need.month, {
        totalAmount: existing.totalAmount + needAmount,
        recurringAmount: existing.recurringAmount + (need.status === "recurring" ? needAmount : 0),
        oneTimeAmount: existing.oneTimeAmount + (need.status === "one-time" ? needAmount : 0),
        count: existing.count + 1,
      });
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
});

// Get upcoming future needs (next N months) (PKR currency)
export const getUpcomingFutureNeeds = query({
  args: {
    monthsAhead: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("futureNeeds"),
    month: v.string(),
    description: v.string(),
    quantity: v.number(),
    amount: v.number(),
    totalAmount: v.number(),
    status: v.union(v.literal("recurring"), v.literal("one-time")),
    monthsUntil: v.number(),
  })),
  handler: async (ctx, args) => {
    const futureNeeds = await ctx.db.query("futureNeeds").collect();
    const monthsAhead = args.monthsAhead || 6;

    const today = new Date();

    const upcomingNeeds = futureNeeds
      .map(need => {
        const [year, month] = need.month.split('-').map(Number);
        const needDate = new Date(year, month - 1);
        const currentDate = new Date(today.getFullYear(), today.getMonth());

        const monthsUntil = (needDate.getFullYear() - currentDate.getFullYear()) * 12 +
                           (needDate.getMonth() - currentDate.getMonth());

        return {
          _id: need._id,
          month: need.month,
          description: need.description,
          quantity: need.quantity,
          amount: need.amount,
          totalAmount: need.amount * need.quantity,
          status: need.status,
          monthsUntil,
        };
      })
      .filter(need => need.monthsUntil >= 0 && need.monthsUntil <= monthsAhead)
      .sort((a, b) => a.monthsUntil - b.monthsUntil);

    return upcomingNeeds;
  },
});
