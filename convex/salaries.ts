import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get all salaries (PKR currency)
export const getAllSalaries = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("salaries"),
    _creationTime: v.number(),
    employeeName: v.string(),
    role: v.string(),
    netSalary: v.number(),
    paymentStatus: v.union(v.literal("paid"), v.literal("pending")),
    paymentDate: v.optional(v.string()),
    month: v.string(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db
      .query("salaries")
      .withIndex("by_month")
      .order("desc")
      .collect();
  },
});

// Get salaries count
export const getSalariesCount = query({
  returns: v.number(),
  handler: async (ctx) => {
    const salaries = await ctx.db.query("salaries").collect();
    return salaries.length;
  },
});

// Create a new salary record (PKR currency)
export const createSalary = mutation({
  args: {
    employeeName: v.string(),
    role: v.string(),
    netSalary: v.number(),
    month: v.string(),
    paymentStatus: v.optional(v.union(v.literal("paid"), v.literal("pending"))),
    paymentDate: v.optional(v.string()),
  },
  returns: v.id("salaries"),
  handler: async (ctx, args) => {
    const now = Date.now();

    const salaryId = await ctx.db.insert("salaries", {
      employeeName: args.employeeName,
      role: args.role,
      netSalary: args.netSalary,
      paymentStatus: args.paymentStatus || "pending",
      paymentDate: args.paymentDate,
      month: args.month,
      createdAt: now,
      updatedAt: now,
    });

    // Create cashflow entry if salary is paid
    if (args.paymentStatus === "paid" && args.paymentDate) {
      await ctx.db.insert("cashflow", {
        date: args.paymentDate,
        type: "outflow",
        category: "salaries",
        description: `Salary: ${args.employeeName} - ${args.month}`,
        amount: args.netSalary,
        referenceId: salaryId,
        createdAt: now,
        updatedAt: now,
      });
    }

    return salaryId;
  },
});

// Update a salary record (PKR currency)
export const updateSalary = mutation({
  args: {
    id: v.id("salaries"),
    employeeName: v.optional(v.string()),
    role: v.optional(v.string()),
    netSalary: v.optional(v.number()),
    paymentStatus: v.optional(v.union(v.literal("paid"), v.literal("pending"))),
    paymentDate: v.optional(v.string()),
    month: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Salary record not found");
    }

    const updates: Partial<Doc<"salaries">> = {
      updatedAt: Date.now(),
    };

    if (args.employeeName !== undefined) updates.employeeName = args.employeeName;
    if (args.role !== undefined) updates.role = args.role;
    if (args.netSalary !== undefined) updates.netSalary = args.netSalary;
    if (args.paymentStatus !== undefined) updates.paymentStatus = args.paymentStatus;
    if (args.paymentDate !== undefined) updates.paymentDate = args.paymentDate;
    if (args.month !== undefined) updates.month = args.month;

    await ctx.db.patch(args.id, updates);

    // Create cashflow entry if status changed to paid
    if (args.paymentStatus === "paid" && existing.paymentStatus === "pending" && args.paymentDate) {
      await ctx.db.insert("cashflow", {
        date: args.paymentDate,
        type: "outflow",
        category: "salaries",
        description: `Salary: ${existing.employeeName} - ${existing.month}`,
        amount: existing.netSalary,
        referenceId: args.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});

// Delete a salary record
export const deleteSalary = mutation({
  args: {
    id: v.id("salaries"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

// Get unique employees
export const getEmployees = query({
  args: {},
  returns: v.array(v.object({
    name: v.string(),
    role: v.string(),
  })),
  handler: async (ctx) => {
    const salaries = await ctx.db.query("salaries").collect();
    const employeeMap = new Map<string, string>();
    
    salaries.forEach(salary => {
      employeeMap.set(salary.employeeName, salary.role);
    });

    return Array.from(employeeMap.entries()).map(([name, role]) => ({
      name,
      role,
    }));
  },
});

// Get salary summary
export const getSalarySummary = query({
  args: {
    month: v.optional(v.string()),
  },
  returns: v.object({
    totalSalaries: v.number(),
    paidSalaries: v.number(),
    pendingSalaries: v.number(),
    employeeCount: v.number(),
    paidEmployeeCount: v.number(),
    pendingEmployeeCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const salaries = await ctx.db.query("salaries").collect();
    
    // Filter by month if provided
    const filteredSalaries = args.month 
      ? salaries.filter(salary => salary.month === args.month)
      : salaries;

    const totalSalaries = filteredSalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    const paidSalaries = filteredSalaries
      .filter(salary => salary.paymentStatus === "paid")
      .reduce((sum, salary) => sum + salary.netSalary, 0);
    const pendingSalaries = filteredSalaries
      .filter(salary => salary.paymentStatus === "pending")
      .reduce((sum, salary) => sum + salary.netSalary, 0);

    const paidEmployeeCount = filteredSalaries.filter(salary => salary.paymentStatus === "paid").length;
    const pendingEmployeeCount = filteredSalaries.filter(salary => salary.paymentStatus === "pending").length;

    return {
      totalSalaries,
      paidSalaries,
      pendingSalaries,
      employeeCount: filteredSalaries.length,
      paidEmployeeCount,
      pendingEmployeeCount,
    };
  },
});

// Get salaries by month
export const getSalariesByMonth = query({
  args: {
    startMonth: v.optional(v.string()),
    endMonth: v.optional(v.string()),
  },
  returns: v.array(v.object({
    month: v.string(),
    totalAmount: v.number(),
    paidAmount: v.number(),
    pendingAmount: v.number(),
    employeeCount: v.number(),
  })),
  handler: async (ctx, args) => {
    const salaries = await ctx.db.query("salaries").collect();
    
    // Filter by month range if provided
    const filteredSalaries = salaries.filter(salary => {
      if (args.startMonth && salary.month < args.startMonth) return false;
      if (args.endMonth && salary.month > args.endMonth) return false;
      return true;
    });

    const monthMap = new Map<string, {
      totalAmount: number;
      paidAmount: number;
      pendingAmount: number;
      employeeCount: number;
    }>();
    
    filteredSalaries.forEach(salary => {
      const existing = monthMap.get(salary.month) || {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        employeeCount: 0,
      };
      
      monthMap.set(salary.month, {
        totalAmount: existing.totalAmount + salary.netSalary,
        paidAmount: existing.paidAmount + (salary.paymentStatus === "paid" ? salary.netSalary : 0),
        pendingAmount: existing.pendingAmount + (salary.paymentStatus === "pending" ? salary.netSalary : 0),
        employeeCount: existing.employeeCount + 1,
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
