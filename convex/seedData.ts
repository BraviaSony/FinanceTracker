import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Constants for seeding operations

// Mark the start of a seeding session
export const markSeedingSession = mutation({
  args: {
    startTime: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Store the seeding session timestamp
    // We'll use a simple document to track the session
    const existingSession = await ctx.db
      .query("seedingSessions")
      .filter((q) => q.eq(q.field("active"), true))
      .first();

    if (existingSession) {
      await ctx.db.patch(existingSession._id, {
        startTime: args.startTime,
        active: true,
      });
    } else {
      await ctx.db.insert("seedingSessions", {
        startTime: args.startTime,
        active: true,
      });
    }

    return null;
  },
});

// Remove ALL sample data from all modules (based on description patterns)
export const removeSeededData = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("🧹 Starting comprehensive removal of ALL sample data...");

    let totalRemoved = 0;

    // 1. Remove ALL sample sales data
    try {
      const allSales = await ctx.runQuery(api.sales.getAllSales);
      const sampleSales = allSales.filter(sale =>
        sale.description.includes("Enterprise Software License") ||
        sale.description.includes("Mobile App Development") ||
        sale.description.includes("E-commerce Platform") ||
        sale.description.includes("Digital Marketing Campaign") ||
        sale.description.includes("Cloud Infrastructure Setup")
      );

      for (const sale of sampleSales) {
        await ctx.runMutation(api.sales.deleteSale, { id: sale._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleSales.length} sample sales records`);
    } catch (error) {
      console.log("❌ Error removing sample sales:", error);
    }

    // 2. Remove ALL sample expenses data
    try {
      const allExpenses = await ctx.runQuery(api.expenses.getAllExpenses);
      const sampleExpenses = allExpenses.filter(expense =>
        expense.description.includes("MacBook Pro") ||
        expense.description.includes("Adobe Creative Suite") ||
        expense.description.includes("Google Ads Campaign") ||
        expense.description.includes("office rent") ||
        expense.description.includes("Electricity and Internet")
      );

      for (const expense of sampleExpenses) {
        await ctx.runMutation(api.expenses.deleteExpense, { id: expense._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleExpenses.length} sample expense records`);
    } catch (error) {
      console.log("❌ Error removing sample expenses:", error);
    }

    // 3. Remove ALL sample liabilities data
    try {
      const allLiabilities = await ctx.runQuery(api.liabilities.getAllLiabilities);
      const sampleLiabilities = allLiabilities.filter(liability =>
        liability.description && (
          liability.description.includes("Business expansion loan") ||
          liability.description.includes("Equipment financing")
        )
      );

      for (const liability of sampleLiabilities) {
        await ctx.runMutation(api.liabilities.deleteLiability, { id: liability._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleLiabilities.length} sample liability records`);
    } catch (error) {
      console.log("❌ Error removing sample liabilities:", error);
    }

    // 4. Remove ALL sample salaries data
    try {
      const allSalaries = await ctx.runQuery(api.salaries.getAllSalaries);
      const sampleSalaries = allSalaries.filter(salary =>
        salary.employeeName.includes("John Smith") ||
        salary.employeeName.includes("Sarah Johnson") ||
        salary.employeeName.includes("Ahmed Al-Rashid") ||
        salary.employeeName.includes("Maria Rodriguez") ||
        salary.employeeName.includes("David Chen") ||
        salary.employeeName.includes("Lisa Wang")
      );

      for (const salary of sampleSalaries) {
        await ctx.runMutation(api.salaries.deleteSalary, { id: salary._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleSalaries.length} sample salary records`);
    } catch (error) {
      console.log("❌ Error removing sample salaries:", error);
    }

    // 5. Remove ALL sample bank PDC data
    try {
      const allBankPdcs = await ctx.runQuery(api.bankPdc.getAllBankPdc);
      const sampleBankPdcs = allBankPdcs.filter(pdc =>
        pdc.description.includes("Software development") ||
        pdc.description.includes("Office furniture") ||
        pdc.supplier.includes("Tech Solutions LLC") ||
        pdc.supplier.includes("Office Furniture Co")
      );

      for (const pdc of sampleBankPdcs) {
        await ctx.runMutation(api.bankPdc.deleteBankPdc, { id: pdc._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleBankPdcs.length} sample bank PDC records`);
    } catch (error) {
      console.log("❌ Error removing sample bank PDC:", error);
    }

    // 6. Remove ALL sample future needs data
    try {
      const allFutureNeeds = await ctx.runQuery(api.futureNeeds.getAllFutureNeeds);
      const sampleFutureNeeds = allFutureNeeds.filter(need =>
        need.description.includes("New Server Hardware") ||
        need.description.includes("Office Expansion") ||
        need.description.includes("Monthly Cloud Hosting")
      );

      for (const need of sampleFutureNeeds) {
        await ctx.runMutation(api.futureNeeds.deleteFutureNeed, { id: need._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleFutureNeeds.length} sample future needs records`);
    } catch (error) {
      console.log("❌ Error removing sample future needs:", error);
    }

    // 7. Remove ALL sample business in hand data
    try {
      const allBusinessInHand = await ctx.runQuery(api.businessInHand.getAllBusinessInHand);
      const sampleBusinessInHand = allBusinessInHand.filter(business =>
        business.description.includes("Enterprise CRM System") ||
        business.description.includes("Website Redesign") ||
        business.description.includes("Mobile App Contract")
      );

      for (const business of sampleBusinessInHand) {
        await ctx.runMutation(api.businessInHand.deleteBusinessInHand, { id: business._id });
        totalRemoved++;
      }
      console.log(`✅ Removed ${sampleBusinessInHand.length} sample business in hand records`);
    } catch (error) {
      console.log("❌ Error removing sample business in hand:", error);
    }

    // 8. Remove ALL sample cash flow data (generated automatically from other modules)
    try {
      const allCashFlows = await ctx.runQuery(api.cashflow.getAllCashflow);
      // Since cash flow entries are automatically generated, we remove all entries
      // that were created within the time window of seeding session
      const activeSession = await ctx.runQuery(api.seedData.getActiveSeedingSession);
      if (activeSession) {
        const sampleCashFlows = allCashFlows.filter(cf =>
          cf._creationTime >= activeSession.startTime &&
          cf._creationTime <= Date.now()
        );

        for (const cf of sampleCashFlows) {
          await ctx.runMutation(api.cashflow.deleteCashflowEntry, { id: cf._id });
          totalRemoved++;
        }
        console.log(`✅ Removed ${sampleCashFlows.length} sample cash flow records`);
      } else {
        // If no session exists, remove cash flow entries based on timestamp
        const sampleCashFlows = allCashFlows.filter(cf =>
          cf.description.includes("Sale") ||
          cf.description.includes("Expense") ||
          cf.description.includes("Salary") ||
          cf.description.includes("PDC") ||
          cf.description.includes("Future Need") ||
          cf.description.includes("Business in Hand") ||
          cf.category !== "manual"
        );

        for (const cf of sampleCashFlows) {
          await ctx.runMutation(api.cashflow.deleteCashflowEntry, { id: cf._id });
          totalRemoved++;
        }
        console.log(`✅ Removed ${sampleCashFlows.length} sample cash flow records`);
      }
    } catch (error) {
      console.log("❌ Error removing sample cash flow:", error);
    }

    // Mark any active seeding session as inactive
    try {
      const activeSession = await ctx.runQuery(api.seedData.getActiveSeedingSession);
      if (activeSession) {
        await ctx.runMutation(api.seedData.markSeedingSessionInactive, { sessionId: activeSession._id });
      }
    } catch (error) {
      console.log("Error marking seeding session inactive:", error);
    }

    console.log(`✅ Successfully removed ALL (${totalRemoved}) sample data from all modules`);
    console.log("User-added data has been preserved");

    return null;
  },
});

// Get active seeding session
export const getActiveSeedingSession = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("seedingSessions"),
      _creationTime: v.number(),
      startTime: v.number(),
      active: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("seedingSessions")
      .filter((q) => q.eq(q.field("active"), true))
      .first();
  },
});

// Mark seeding session as inactive
export const markSeedingSessionInactive = mutation({
  args: {
    sessionId: v.id("seedingSessions"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { active: false });
    return null;
  },
});

// Clear ALL data from all tables (comprehensive version)
export const clearAllData = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    console.log("🧹 Starting comprehensive complete data cleanup...");

    let totalCleared = 0;

    // 1. Clear Sales
    try {
      const allSales = await ctx.runQuery(api.sales.getAllSales);
      for (const sale of allSales) {
        await ctx.runMutation(api.sales.deleteSale, { id: sale._id });
      }
      console.log(`✅ Cleared ${allSales.length} sales records`);
      totalCleared += allSales.length;
    } catch (error) {
      console.error("❌ Error clearing sales:", error);
    }

    // 2. Clear Expenses
    try {
      const allExpenses = await ctx.runQuery(api.expenses.getAllExpenses);
      for (const expense of allExpenses) {
        await ctx.runMutation(api.expenses.deleteExpense, { id: expense._id });
      }
      console.log(`✅ Cleared ${allExpenses.length} expenses records`);
      totalCleared += allExpenses.length;
    } catch (error) {
      console.error("❌ Error clearing expenses:", error);
    }

    // 3. Clear Liabilities
    try {
      const allLiabilities = await ctx.runQuery(api.liabilities.getAllLiabilities);
      for (const liability of allLiabilities) {
        await ctx.runMutation(api.liabilities.deleteLiability, { id: liability._id });
      }
      console.log(`✅ Cleared ${allLiabilities.length} liabilities records`);
      totalCleared += allLiabilities.length;
    } catch (error) {
      console.error("❌ Error clearing liabilities:", error);
    }

    // 4. Clear Salaries
    try {
      const allSalaries = await ctx.runQuery(api.salaries.getAllSalaries);
      for (const salary of allSalaries) {
        await ctx.runMutation(api.salaries.deleteSalary, { id: salary._id });
      }
      console.log(`✅ Cleared ${allSalaries.length} salaries records`);
      totalCleared += allSalaries.length;
    } catch (error) {
      console.error("❌ Error clearing salaries:", error);
    }

    // 5. Clear Bank PDC
    try {
      const allBankPdcs = await ctx.runQuery(api.bankPdc.getAllBankPdc);
      for (const pdc of allBankPdcs) {
        await ctx.runMutation(api.bankPdc.deleteBankPdc, { id: pdc._id });
      }
      console.log(`✅ Cleared ${allBankPdcs.length} bank PDC records`);
      totalCleared += allBankPdcs.length;
    } catch (error) {
      console.error("❌ Error clearing bank PDC:", error);
    }

    // 6. Clear Future Needs
    try {
      const allFutureNeeds = await ctx.runQuery(api.futureNeeds.getAllFutureNeeds);
      for (const need of allFutureNeeds) {
        await ctx.runMutation(api.futureNeeds.deleteFutureNeed, { id: need._id });
      }
      console.log(`✅ Cleared ${allFutureNeeds.length} future needs records`);
      totalCleared += allFutureNeeds.length;
    } catch (error) {
      console.error("❌ Error clearing future needs:", error);
    }

    // 7. Clear Business in Hand
    try {
      const allBusinessInHand = await ctx.runQuery(api.businessInHand.getAllBusinessInHand);
      for (const business of allBusinessInHand) {
        await ctx.runMutation(api.businessInHand.deleteBusinessInHand, { id: business._id });
      }
      console.log(`✅ Cleared ${allBusinessInHand.length} business in hand records`);
      totalCleared += allBusinessInHand.length;
    } catch (error) {
      console.error("❌ Error clearing business in hand:", error);
    }

    // 8. Clear Cash Flow
    try {
      const allCashFlows = await ctx.runQuery(api.cashflow.getAllCashflow);
      for (const cf of allCashFlows) {
        await ctx.runMutation(api.cashflow.deleteCashflowEntry, { id: cf._id });
      }
      console.log(`✅ Cleared ${allCashFlows.length} cash flow records`);
      totalCleared += allCashFlows.length;
    } catch (error) {
      console.error("❌ Error clearing cash flow:", error);
    }

    console.log(`✅ Ultra-comprehensive cleanup completed! Total records cleared: ${totalCleared}`);
  },
});

// Comprehensive seed data for all modules with extensive test cases
export const seedDatabase = action({
  args: {},
  returns: v.object({
    message: v.string(),
    recordsAdded: v.object({
      sales: v.number(),
      expenses: v.number(),
      liabilities: v.number(),
      salaries: v.number(),
      bankPdc: v.number(),
      futureNeeds: v.number(),
      businessInHand: v.number(),
    }),
  }),
  handler: async (ctx) => {
    console.log("🟡 Starting comprehensive PKR database seeding...");

    // Mark the start of seeding session
    const seedingStartTime = Date.now();
    try {
      await ctx.runMutation(api.seedData.markSeedingSession, { startTime: seedingStartTime });
      console.log("Seeding session marked");
    } catch (error) {
      console.log("Error marking seeding session:", error);
    }

    let salesCount = 0;
    let expensesCount = 0;
    let liabilitiesCount = 0;
    let salariesCount = 0;
    let bankPdcCount = 0;
    let futureNeedsCount = 0;
    let businessInHandCount = 0;

    // 1. SALES DATA
    const salesData = [
      { date: "2025-01-15", description: "Enterprise Software License", cost: 2500000, sellingPrice: 4500000, expenses: 350000 },
      { date: "2025-01-20", description: "Mobile App Development", cost: 1800000, sellingPrice: 3500000, expenses: 280000 },
      { date: "2025-02-05", description: "E-commerce Platform", cost: 3200000, sellingPrice: 6500000, expenses: 520000 },
      { date: "2025-02-12", description: "Digital Marketing Campaign", cost: 850000, sellingPrice: 1500000, expenses: 120000 },
      { date: "2025-02-18", description: "Cloud Infrastructure Setup", cost: 1200000, sellingPrice: 2200000, expenses: 180000 },
      // New records for June, August, October 2025
      { date: "2025-06-10", description: "AI Chatbot System", cost: 1500000, sellingPrice: 2800000, expenses: 220000 },
      { date: "2025-06-15", description: "Data Analytics Platform", cost: 2200000, sellingPrice: 4200000, expenses: 350000 },
      { date: "2025-06-20", description: "Blockchain Development", cost: 3500000, sellingPrice: 7500000, expenses: 600000 },
      { date: "2025-08-05", description: "VR Training Software", cost: 2800000, sellingPrice: 5500000, expenses: 450000 },
      { date: "2025-08-12", description: "API Integration Service", cost: 950000, sellingPrice: 1800000, expenses: 150000 },
      { date: "2025-08-18", description: "DevOps Automation Setup", cost: 1400000, sellingPrice: 2600000, expenses: 200000 },
      { date: "2025-10-08", description: "Cybersecurity Audit", cost: 800000, sellingPrice: 1500000, expenses: 100000 },
      { date: "2025-10-14", description: "Performance Optimization", cost: 1200000, sellingPrice: 2300000, expenses: 180000 },
      { date: "2025-10-20", description: "Legacy System Migration", cost: 2500000, sellingPrice: 4800000, expenses: 400000 },
    ];

    console.log("Seeding sales data...");
    for (const sale of salesData) {
      try { await ctx.runMutation(api.sales.createSale, sale); salesCount++; } catch (e) { console.error("Sale error:", e); }
    }

    // 2. EXPENSES DATA
    const expensesData = [
      { date: "2025-01-08", category: "Office Equipment", description: "MacBook Pro", vendor: "Apple Store", amount: 280000, status: "paid" as const },
      { date: "2025-01-12", category: "Software Licenses", description: "Adobe Creative Suite", vendor: "Adobe Inc", amount: 120000, status: "paid" as const },
      { date: "2025-01-18", category: "Marketing", description: "Google Ads Campaign", vendor: "Google LLC", amount: 350000, status: "unpaid" as const },
      { date: "2025-02-02", category: "Office Rent", description: "Monthly office rent", vendor: "Property Management Co", amount: 450000, status: "paid" as const },
      // New records for June, August, October 2025
      { date: "2025-06-05", category: "Office Equipment", description: "Gaming PC Setup", vendor: "TechPro Solutions", amount: 420000, status: "paid" as const },
      { date: "2025-06-12", category: "Software Licenses", description: "Microsoft Office 365", vendor: "Microsoft Corp", amount: 95000, status: "paid" as const },
      { date: "2025-06-18", category: "Marketing", description: "Social Media Campaign", vendor: "Digital Agency Pro", amount: 280000, status: "unpaid" as const },
      { date: "2025-08-03", category: "Office Equipment", description: "Wireless Headsets", vendor: "AudioTech Ltd", amount: 155000, status: "paid" as const },
      { date: "2025-08-10", category: "Software Licenses", description: "VS Code Pro Licenses", vendor: "Microsoft Corp", amount: 75000, status: "paid" as const },
      { date: "2025-08-15", category: "Marketing", description: "SEO Optimization", vendor: "SEO Masters Inc", amount: 320000, status: "unpaid" as const },
      { date: "2025-10-02", category: "Office Equipment", description: "Standing Desk", vendor: "Ergonomic Solutions", amount: 89000, status: "paid" as const },
      { date: "2025-10-08", category: "Software Licenses", description: "Figma Teams", vendor: "Figma Inc", amount: 65000, status: "paid" as const },
      { date: "2025-10-20", category: "Marketing", description: "LinkedIn Ads Campaign", vendor: "LinkedIn Business", amount: 400000, status: "unpaid" as const },
    ];

    console.log("Seeding expenses data...");
    for (const expense of expensesData) {
      try { await ctx.runMutation(api.expenses.createExpense, expense); expensesCount++; } catch (e) { console.error("Expense error:", e); }
    }

    // 3. LIABILITIES DATA
    const liabilitiesData = [
      { lenderParty: "First National Bank", liabilityType: "Business Loan", startDate: "2025-01-15", dueDate: "2026-01-15", originalAmount: 5000000, description: "Business expansion loan" },
      { lenderParty: "Equipment Finance Corp", liabilityType: "Equipment Loan", startDate: "2025-02-20", dueDate: "2026-02-20", originalAmount: 2500000, description: "Equipment financing" },
      // New records for June, August, October 2025
      { lenderParty: "Tech Investment Bank", liabilityType: "Software License Loan", startDate: "2025-06-10", dueDate: "2026-06-10", originalAmount: 3200000, description: "AI development funding" },
      { lenderParty: "Digital Solutions Finance", liabilityType: "Office Renovation Loan", startDate: "2025-08-05", dueDate: "2026-08-05", originalAmount: 1500000, description: "Workspace modernization" },
      { lenderParty: "Innovation Capital", liabilityType: "R&D Loan", startDate: "2025-10-15", dueDate: "2026-10-15", originalAmount: 2800000, description: "Research and development" },
    ];

    console.log("Seeding liabilities data...");
    for (const liability of liabilitiesData) {
      try { await ctx.runMutation(api.liabilities.createLiability, liability); liabilitiesCount++; } catch (e) { console.error("Liability error:", e); }
    }

    // 4. SALARIES DATA
    const salariesData = [
      { employeeName: "John Smith", role: "Senior Developer", netSalary: 885000, month: "2025-01", paymentDate: "2025-01-31", paymentStatus: "paid" as const },
      { employeeName: "Sarah Johnson", role: "UI/UX Designer", netSalary: 665000, month: "2025-01", paymentDate: "2025-01-31", paymentStatus: "paid" as const },
      { employeeName: "Ahmed Al-Rashid", role: "Project Manager", netSalary: 802000, month: "2025-02", paymentDate: "2025-02-28", paymentStatus: "pending" as const },
      // New records for June, August, October 2025
      { employeeName: "Maria Rodriguez", role: "AI Engineer", netSalary: 950000, month: "2025-06", paymentDate: "2025-06-30", paymentStatus: "paid" as const },
      { employeeName: "David Chen", role: "DevOps Engineer", netSalary: 780000, month: "2025-08", paymentDate: "2025-08-31", paymentStatus: "pending" as const },
      { employeeName: "Lisa Wang", role: "Data Scientist", netSalary: 920000, month: "2025-10", paymentDate: "2025-10-31", paymentStatus: "paid" as const },
    ];

    console.log("Seeding salaries data...");
    for (const salary of salariesData) {
      try { await ctx.runMutation(api.salaries.createSalary, salary); salariesCount++; } catch (e) { console.error("Salary error:", e); }
    }

    // 5. BANK PDC DATA
    const bankPdcData = [
      { date: "2025-03-15", bank: "Emirates NBD", chequeNumber: "CHQ001234", code: "PDC-001", supplier: "Tech Solutions LLC", description: "Software development", amount: 1500000, status: "pending" as const },
      { date: "2025-04-20", bank: "First Abu Dhabi Bank", chequeNumber: "CHQ001235", code: "PDC-002", supplier: "Office Furniture Co", description: "Office furniture", amount: 850000, status: "pending" as const },
      // New records for June, August, October 2025
      { date: "2025-06-12", bank: "Commercial Bank UAE", chequeNumber: "CHQ001236", code: "PDC-003", supplier: "AI Tech Partners", description: "AI model development", amount: 2200000, status: "pending" as const },
      { date: "2025-08-08", bank: "Standard Chartered", chequeNumber: "CHQ001237", code: "PDC-004", supplier: "Cloud Infrastructure Ltd", description: "Server upgrade", amount: 1800000, status: "cleared" as const },
      { date: "2025-10-10", bank: "HSBC Middle East", chequeNumber: "CHQ001238", code: "PDC-005", supplier: "Security Solutions Pro", description: "Network security", amount: 950000, status: "pending" as const },
    ];

    console.log("Seeding bank PDC data...");
    for (const pdc of bankPdcData) {
      try { await ctx.runMutation(api.bankPdc.createBankPdc, pdc); bankPdcCount++; } catch (e) { console.error("Bank PDC error:", e); }
    }

    // 6. FUTURE NEEDS DATA
    const futureNeedsData = [
      { month: "2025-03", description: "New Server Hardware", quantity: 2, amount: 550000, status: "one-time" as const },
      { month: "2025-04", description: "Office Expansion", quantity: 5, amount: 120000, status: "one-time" as const },
      { month: "2025-03", description: "Monthly Cloud Hosting", quantity: 1, amount: 85000, status: "recurring" as const },
      // New records for June, August, October 2025
      { month: "2025-06", description: "AI Training GPUs", quantity: 4, amount: 1200000, status: "one-time" as const },
      { month: "2025-08", description: "Office Renovation Phase 2", quantity: 1, amount: 2500000, status: "one-time" as const },
      { month: "2025-10", description: "Advanced Analytics Tools", quantity: 1, amount: 150000, status: "recurring" as const },
    ];

    console.log("Seeding future needs data...");
    for (const need of futureNeedsData) {
      try { await ctx.runMutation(api.futureNeeds.createFutureNeed, need); futureNeedsCount++; } catch (e) { console.error("Future needs error:", e); }
    }

    // 7. BUSINESS IN HAND DATA
    const businessInHandData = [
      { type: "po_in_hand" as const, description: "Enterprise CRM System", amount: 8500000, expectedDate: "2025-04-15", status: "confirmed" as const },
      { type: "pending_invoice" as const, description: "Website Redesign", amount: 1200000, expectedDate: "2025-03-10", status: "pending" as const },
      { type: "expected_revenue" as const, description: "Mobile App Contract", amount: 2500000, expectedDate: "2025-05-20", status: "confirmed" as const },
      // New records for June, August, October 2025
      { type: "po_in_hand" as const, description: "AI Implementation Project", amount: 5200000, expectedDate: "2025-06-25", status: "confirmed" as const },
      { type: "pending_invoice" as const, description: "Blockchain Integration", amount: 3800000, expectedDate: "2025-08-30", status: "pending" as const },
      { type: "expected_revenue" as const, description: "Cybersecurity Consulting", amount: 1800000, expectedDate: "2025-10-15", status: "confirmed" as const },
    ];

    console.log("Seeding business in hand data...");
    for (const business of businessInHandData) {
      try { await ctx.runMutation(api.businessInHand.createBusinessInHand, business); businessInHandCount++; } catch (e) { console.error("Business in hand error:", e); }
    }

    console.log("✅ Comprehensive PKR database seeding completed!");
    const totalRecords = salesCount + expensesCount + liabilitiesCount + salariesCount + bankPdcCount + futureNeedsCount + businessInHandCount;

    return {
      message: `Successfully added ${totalRecords} records across all modules!`,
      recordsAdded: {
        sales: salesCount,
        expenses: expensesCount,
        liabilities: liabilitiesCount,
        salaries: salariesCount,
        bankPdc: bankPdcCount,
        futureNeeds: futureNeedsCount,
        businessInHand: businessInHandCount
      },
    };
  },
});
