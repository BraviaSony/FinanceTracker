import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all business in hand records (PKR currency)
export const getAllBusinessInHand = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("businessInHand"),
    _creationTime: v.number(),
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    description: v.string(),
    amount: v.number(),
    expectedDate: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received")),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("businessInHand")
      .withIndex("by_expected_date")
      .order("asc")
      .collect();
  },
});

// Get business in hand count
export const getBusinessInHandCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const businessInHand = await ctx.db.query("businessInHand").collect();
    return businessInHand.length;
  },
});

// Create a new business in hand record (PKR currency)
export const createBusinessInHand = mutation({
  args: {
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    description: v.string(),
    amount: v.number(),
    expectedDate: v.string(),
    status: v.optional(v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received"))),
  },
  returns: v.id("businessInHand"),
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("businessInHand", {
      type: args.type,
      description: args.description,
      amount: args.amount,
      expectedDate: args.expectedDate,
      status: args.status || "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a business in hand record (PKR currency)
export const updateBusinessInHand = mutation({
  args: {
    id: v.id("businessInHand"),
    type: v.optional(v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue"))),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    expectedDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Business in hand record not found");
    }

    const updates: Partial<Doc<"businessInHand">> = {
      updatedAt: Date.now(),
    };

    if (args.type !== undefined) updates.type = args.type;
    if (args.description !== undefined) updates.description = args.description;
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.expectedDate !== undefined) updates.expectedDate = args.expectedDate;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.id, updates);

    // Create cashflow entry when status changes to received
    if (args.status === "received" && existing.status !== "received") {
      await ctx.db.insert("cashflow", {
        date: new Date().toISOString().split('T')[0],
        type: "inflow",
        category: "receivables",
        description: `Received: ${existing.description}`,
        amount: existing.amount,
        referenceId: args.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// Delete a business in hand record
export const deleteBusinessInHand = mutation({
  args: {
    id: v.id("businessInHand"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get business in hand summary
export const getBusinessInHandSummary = query({
  args: {},
  returns: v.object({
    totalAmount: v.number(),
    confirmedAmount: v.number(),
    pendingAmount: v.number(),
    receivedAmount: v.number(),
    totalCount: v.number(),
    confirmedCount: v.number(),
    pendingCount: v.number(),
    receivedCount: v.number(),
  }),
  handler: async (ctx) => {
    const businessInHand = await ctx.db.query("businessInHand").collect();

    const totalAmount = businessInHand.reduce((sum, bih) => sum + bih.amount, 0);
    const confirmedRecords = businessInHand.filter(bih => bih.status === "confirmed");
    const pendingRecords = businessInHand.filter(bih => bih.status === "pending");
    const receivedRecords = businessInHand.filter(bih => bih.status === "received");

    const confirmedAmount = confirmedRecords.reduce((sum, bih) => sum + bih.amount, 0);
    const pendingAmount = pendingRecords.reduce((sum, bih) => sum + bih.amount, 0);
    const receivedAmount = receivedRecords.reduce((sum, bih) => sum + bih.amount, 0);

    return {
      totalAmount,
      confirmedAmount,
      pendingAmount,
      receivedAmount,
      totalCount: businessInHand.length,
      confirmedCount: confirmedRecords.length,
      pendingCount: pendingRecords.length,
      receivedCount: receivedRecords.length,
    };
  },
});

// Get business in hand by type
export const getBusinessInHandByType = query({
  args: {},
  returns: v.array(v.object({
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    totalAmount: v.number(),
    confirmedAmount: v.number(),
    pendingAmount: v.number(),
    receivedAmount: v.number(),
    count: v.number(),
  })),
  handler: async (ctx) => {
    const businessInHand = await ctx.db.query("businessInHand").collect();
    const typeMap = new Map<string, {
      totalAmount: number;
      confirmedAmount: number;
      pendingAmount: number;
      receivedAmount: number;
      count: number;
    }>();
    
    businessInHand.forEach(bih => {
      const existing = typeMap.get(bih.type) || {
        totalAmount: 0,
        confirmedAmount: 0,
        pendingAmount: 0,
        receivedAmount: 0,
        count: 0,
      };
      
      typeMap.set(bih.type, {
        totalAmount: existing.totalAmount + bih.amount,
        confirmedAmount: existing.confirmedAmount + (bih.status === "confirmed" ? bih.amount : 0),
        pendingAmount: existing.pendingAmount + (bih.status === "pending" ? bih.amount : 0),
        receivedAmount: existing.receivedAmount + (bih.status === "received" ? bih.amount : 0),
        count: existing.count + 1,
      });
    });

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type: type as "po_in_hand" | "pending_invoice" | "expected_revenue",
      ...data,
    }));
  },
});

// Get upcoming business in hand (by expected date) (PKR currency)
export const getUpcomingBusinessInHand = query({
  args: {
    daysAhead: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("businessInHand"),
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    description: v.string(),
    amount: v.number(),
    expectedDate: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received")),
    daysUntilExpected: v.number(),
  })),
  handler: async (ctx, args) => {
    const businessInHand = await ctx.db.query("businessInHand").collect();
    const today = new Date();
    const daysAhead = args.daysAhead || 30;

    const upcomingBusiness = businessInHand
      .filter(bih => bih.status !== "received")
      .map(bih => {
        const expectedDate = new Date(bih.expectedDate);
        const daysUntilExpected = Math.ceil((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          _id: bih._id,
          type: bih.type,
          description: bih.description,
          amount: bih.amount,
          expectedDate: bih.expectedDate,
          status: bih.status,
          daysUntilExpected,
        };
      })
      .filter(bih => bih.daysUntilExpected <= daysAhead)
      .sort((a, b) => a.daysUntilExpected - b.daysUntilExpected);

    return upcomingBusiness;
  },
});

// Get overdue business in hand (PKR currency)
export const getOverdueBusinessInHand = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("businessInHand"),
    type: v.union(v.literal("po_in_hand"), v.literal("pending_invoice"), v.literal("expected_revenue")),
    description: v.string(),
    amount: v.number(),
    expectedDate: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("pending"), v.literal("received")),
    daysOverdue: v.number(),
  })),
  handler: async (ctx) => {
    const businessInHand = await ctx.db.query("businessInHand").collect();
    const today = new Date();

    const overdueBusiness = businessInHand
      .filter(bih => bih.status !== "received")
      .map(bih => {
        const expectedDate = new Date(bih.expectedDate);
        const daysOverdue = Math.ceil((today.getTime() - expectedDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          _id: bih._id,
          type: bih.type,
          description: bih.description,
          amount: bih.amount,
          expectedDate: bih.expectedDate,
          status: bih.status,
          daysOverdue,
        };
      })
      .filter(bih => bih.daysOverdue > 0)
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    return overdueBusiness;
  },
});
