import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all bank PDC records
export const getAllBankPdc = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("bankPdc"),
    _creationTime: v.number(),
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
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("bankPdc")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});

// Get bank PDC count
export const getBankPdcCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const bankPdcs = await ctx.db.query("bankPdc").collect();
    return bankPdcs.length;
  },
});

// Get unique banks (alias for getBanks)
export const getUniqueBanks = query({
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const bankPdcs = await ctx.db.query("bankPdc").collect();
    const banks = [...new Set(bankPdcs.map(pdc => pdc.bank))];
    return banks.sort();
  },
});

// Create a new bank PDC record (PKR currency)
export const createBankPdc = mutation({
  args: {
    date: v.string(),
    bank: v.string(),
    chequeNumber: v.string(),
    code: v.string(),
    supplier: v.string(),
    description: v.string(),
    amount: v.number(),
    status: v.optional(v.union(v.literal("cleared"), v.literal("pending"))),
  },
  returns: v.id("bankPdc"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const creationDate = new Date().toISOString().split('T')[0];

    const pdcId = await ctx.db.insert("bankPdc", {
      date: args.date,
      bank: args.bank,
      chequeNumber: args.chequeNumber,
      code: args.code,
      supplier: args.supplier,
      description: args.description,
      amount: args.amount,
      status: args.status || "pending",
      creationDate,
      createdAt: now,
      updatedAt: now,
    });

    // Create cashflow entry when PDC is cleared
    if (args.status === "cleared") {
      await ctx.db.insert("cashflow", {
        date: args.date,
        type: "outflow",
        category: "pdc",
        description: `PDC: ${args.supplier} - ${args.chequeNumber}`,
        amount: args.amount,
        referenceId: pdcId,
        createdAt: now,
        updatedAt: now,
      });
    }

    return pdcId;
  },
});

// Update a bank PDC record (PKR currency)
export const updateBankPdc = mutation({
  args: {
    id: v.id("bankPdc"),
    date: v.optional(v.string()),
    bank: v.optional(v.string()),
    chequeNumber: v.optional(v.string()),
    code: v.optional(v.string()),
    supplier: v.optional(v.string()),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    status: v.optional(v.union(v.literal("cleared"), v.literal("pending"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Bank PDC record not found");
    }

    const updates: Partial<Doc<"bankPdc">> = {
      updatedAt: Date.now(),
    };

    if (args.date !== undefined) updates.date = args.date;
    if (args.bank !== undefined) updates.bank = args.bank;
    if (args.chequeNumber !== undefined) updates.chequeNumber = args.chequeNumber;
    if (args.code !== undefined) updates.code = args.code;
    if (args.supplier !== undefined) updates.supplier = args.supplier;
    if (args.description !== undefined) updates.description = args.description;
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.status !== undefined) updates.status = args.status;

    await ctx.db.patch(args.id, updates);

    // Create cashflow entry if status changed to cleared
    if (args.status === "cleared" && existing.status === "pending") {
      await ctx.db.insert("cashflow", {
        date: existing.date,
        type: "outflow",
        category: "pdc",
        description: `PDC: ${existing.supplier} - ${existing.chequeNumber}`,
        amount: existing.amount,
        referenceId: args.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// Delete a bank PDC record
export const deleteBankPdc = mutation({
  args: {
    id: v.id("bankPdc"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get unique banks
export const getBanks = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const pdcs = await ctx.db.query("bankPdc").collect();
    const banks = [...new Set(pdcs.map(pdc => pdc.bank))];
    return banks.sort();
  },
});

// Get unique suppliers
export const getSuppliers = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const pdcs = await ctx.db.query("bankPdc").collect();
    const suppliers = [...new Set(pdcs.map(pdc => pdc.supplier))];
    return suppliers.sort();
  },
});

// Get bank PDC summary
export const getBankPdcSummary = query({
  args: {},
  returns: v.object({
    totalAmount: v.number(),
    clearedAmount: v.number(),
    pendingAmount: v.number(),
    totalCount: v.number(),
    clearedCount: v.number(),
    pendingCount: v.number(),
  }),
  handler: async (ctx) => {
    const pdcs = await ctx.db.query("bankPdc").collect();

    const totalAmount = pdcs.reduce((sum, pdc) => sum + pdc.amount, 0);
    const clearedPdcs = pdcs.filter(pdc => pdc.status === "cleared");
    const pendingPdcs = pdcs.filter(pdc => pdc.status === "pending");

    const clearedAmount = clearedPdcs.reduce((sum, pdc) => sum + pdc.amount, 0);
    const pendingAmount = pendingPdcs.reduce((sum, pdc) => sum + pdc.amount, 0);

    return {
      totalAmount,
      clearedAmount,
      pendingAmount,
      totalCount: pdcs.length,
      clearedCount: clearedPdcs.length,
      pendingCount: pendingPdcs.length,
    };
  },
});

// Get PDCs by bank
export const getPdcsByBank = query({
  args: {},
  returns: v.array(v.object({
    bank: v.string(),
    totalAmount: v.number(),
    clearedAmount: v.number(),
    pendingAmount: v.number(),
    count: v.number(),
  })),
  handler: async (ctx) => {
    const pdcs = await ctx.db.query("bankPdc").collect();
    const bankMap = new Map<string, {
      totalAmount: number;
      clearedAmount: number;
      pendingAmount: number;
      count: number;
    }>();
    
    pdcs.forEach(pdc => {
      const existing = bankMap.get(pdc.bank) || {
        totalAmount: 0,
        clearedAmount: 0,
        pendingAmount: 0,
        count: 0,
      };
      
      bankMap.set(pdc.bank, {
        totalAmount: existing.totalAmount + pdc.amount,
        clearedAmount: existing.clearedAmount + (pdc.status === "cleared" ? pdc.amount : 0),
        pendingAmount: existing.pendingAmount + (pdc.status === "pending" ? pdc.amount : 0),
        count: existing.count + 1,
      });
    });

    return Array.from(bankMap.entries()).map(([bank, data]) => ({
      bank,
      ...data,
    }));
  },
});

// Get upcoming PDCs (by date) (PKR currency)
export const getUpcomingPdcs = query({
  args: {
    daysAhead: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id("bankPdc"),
    date: v.string(),
    bank: v.string(),
    chequeNumber: v.string(),
    supplier: v.string(),
    amount: v.number(),
    daysUntilDue: v.number(),
  })),
  handler: async (ctx, args) => {
    const pdcs = await ctx.db.query("bankPdc").collect();
    const today = new Date();
    const daysAhead = args.daysAhead || 30;

    const upcomingPdcs = pdcs
      .filter(pdc => pdc.status === "pending")
      .map(pdc => {
        const pdcDate = new Date(pdc.date);
        const daysUntilDue = Math.ceil((pdcDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          _id: pdc._id,
          date: pdc.date,
          bank: pdc.bank,
          chequeNumber: pdc.chequeNumber,
          supplier: pdc.supplier,
          amount: pdc.amount,
          daysUntilDue,
        };
      })
      .filter(pdc => pdc.daysUntilDue <= daysAhead)
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    return upcomingPdcs;
  },
});
