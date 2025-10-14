import { v } from "convex/values";
import { query } from "./_generated/server";

// Export all financial data for reports
export const getExportData = query({
  args: {
    dateRange: v.optional(v.object({
      startDate: v.string(),
      endDate: v.string(),
    })),
    modules: v.optional(v.array(v.string())), // What to include: sales, expenses, etc.
  },
  returns: v.object({
    summary: v.object({
      exportDate: v.string(),
      dateRange: v.optional(v.object({
        startDate: v.string(),
        endDate: v.string(),
      })),
      currency: v.string(),
    }),
    data: v.object({
      sales: v.array(v.object({
        date: v.string(),
        description: v.string(),
        cost: v.number(),
        sellingPrice: v.number(),
        grossProfit: v.number(),
        grossProfitMargin: v.number(),
        expenses: v.number(),
        netProfit: v.number(),
        netProfitMargin: v.number(),
      })),
      expenses: v.array(v.object({
        date: v.string(),
        description: v.string(),
        amount: v.number(),
        category: v.string(),
        vendor: v.string(),
        status: v.string(),
      })),
      liabilities: v.array(v.object({
        description: v.string(),
        amount: v.number(),
        outstandingBalance: v.number(),
        dueDate: v.string(),
        creditor: v.string(),
        status: v.string(),
      })),
      salaries: v.array(v.object({
        employeeName: v.string(),
        month: v.string(),
        basicSalary: v.number(),
        allowances: v.number(),
        deductions: v.number(),
        netSalary: v.number(),
        paymentStatus: v.string(),
        paymentDate: v.string(),
      })),
      cashflow: v.array(v.object({
        date: v.string(),
        type: v.string(),
        category: v.string(),
        description: v.string(),
        amount: v.number(),
      })),
      bankPdc: v.array(v.object({
        bankName: v.string(),
        supplierCode: v.string(),
        amount: v.number(),
        status: v.string(),
        dueDate: v.string(),
      })),
      businessInHand: v.array(v.object({
        poNumber: v.string(),
        supplier: v.string(),
        description: v.string(),
        amount: v.number(),
        status: v.string(),
        expectedDate: v.string(),
      })),
      futureNeeds: v.array(v.object({
        description: v.string(),
        category: v.string(),
        month: v.string(),
        amount: v.number(),
        type: v.string(),
      })),
    }),
    totals: v.object({
      totalSales: v.number(),
      totalExpenses: v.number(),
      totalLiabilities: v.number(),
      outstandingLiabilities: v.number(),
      totalSalaries: v.number(),
      paidSalaries: v.number(),
      pendingSalaries: v.number(),
      totalInflows: v.number(),
      totalOutflows: v.number(),
      netCashflow: v.number(),
      totalProfit: v.number(),
      businessInHandValue: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    const modules = args.modules || [
      "sales", "expenses", "liabilities", "salaries",
      "cashflow", "bankPdc", "businessInHand", "futureNeeds"
    ];

    // Get all data
    const [sales, expenses, liabilities, salaries, cashflows, bankPdcs, businessInHand, futureNeeds] = await Promise.all([
      modules.includes("sales") ? ctx.db.query("sales").collect() : [],
      modules.includes("expenses") ? ctx.db.query("expenses").collect() : [],
      modules.includes("liabilities") ? ctx.db.query("liabilities").collect() : [],
      modules.includes("salaries") ? ctx.db.query("salaries").collect() : [],
      modules.includes("cashflow") ? ctx.db.query("cashflow").collect() : [],
      modules.includes("bankPdc") ? ctx.db.query("bankPdc").collect() : [],
      modules.includes("businessInHand") ? ctx.db.query("businessInHand").collect() : [],
      modules.includes("futureNeeds") ? ctx.db.query("futureNeeds").collect() : [],
    ]);

    // Filter by date range if provided
    const filterByDate = (items: any[], dateField: string = 'date') => {
      if (!args.dateRange) return items;
      const { startDate, endDate } = args.dateRange;
      if (!startDate && !endDate) return items;
      return items.filter(item => {
        const itemDate = item[dateField];
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    };

    // Apply date filtering
    const filteredSales = filterByDate(sales);
    const filteredExpenses = filterByDate(expenses);
    const filteredSalaries = filterByDate(salaries, 'month');
    const filteredCashflows = filterByDate(cashflows);

    // Calculate totals
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, lib) => sum + lib.originalAmount, 0);
    const outstandingLiabilities = liabilities.reduce((sum, lib) => sum + lib.outstandingBalance, 0);

    const totalSalaries = filteredSalaries.reduce((sum, sal) => sum + sal.netSalary, 0);
    const paidSalaries = filteredSalaries
      .filter(sal => sal.paymentStatus === "paid")
      .reduce((sum, sal) => sum + sal.netSalary, 0);
    const pendingSalaries = totalSalaries - paidSalaries;

    const totalInflows = filteredCashflows
      .filter(cf => cf.type === "inflow")
      .reduce((sum, cf) => sum + cf.amount, 0);
    const totalOutflows = filteredCashflows
      .filter(cf => cf.type === "outflow")
      .reduce((sum, cf) => sum + cf.amount, 0);

    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.netProfit, 0);
    const businessInHandValue = businessInHand
      .filter(bih => bih.status !== "received")
      .reduce((sum, bih) => sum + bih.amount, 0);

    // Format data for export
    const exportData = {
      summary: {
        exportDate: new Date().toISOString().split('T')[0],
        dateRange: args.dateRange,
        currency: 'PKR',
      },
      data: {
        sales: filteredSales.map(sale => ({
          date: sale.date,
          description: sale.description,
          cost: sale.cost,
          sellingPrice: sale.sellingPrice,
          grossProfit: sale.grossProfit,
          grossProfitMargin: sale.grossProfitMargin,
          expenses: sale.expenses,
          netProfit: sale.netProfit,
          netProfitMargin: sale.netProfitMargin,
        })),
        expenses: filteredExpenses.map(exp => ({
          date: exp.date,
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          vendor: exp.vendor,
          status: exp.status,
        })),
        liabilities: liabilities.map(lib => ({
          description: lib.description || lib.lenderParty,
          amount: lib.originalAmount,
          outstandingBalance: lib.outstandingBalance,
          dueDate: lib.dueDate,
          creditor: lib.lenderParty,
          status: "active", // Default status since not in schema
        })),
        salaries: filteredSalaries.map(sal => ({
          employeeName: sal.employeeName,
          month: sal.month,
          basicSalary: sal.netSalary, // Schema doesn't have separate fields, using netSalary
          allowances: 0, // Default value
          deductions: 0, // Default value
          netSalary: sal.netSalary,
          paymentStatus: sal.paymentStatus,
          paymentDate: sal.paymentDate || '',
        })),
        cashflow: filteredCashflows.map(cf => ({
          date: cf.date,
          type: cf.type,
          category: cf.category,
          description: cf.description,
          amount: cf.amount,
        })),
        bankPdc: bankPdcs.map(pdc => ({
          bankName: pdc.bank,
          supplierCode: pdc.code,
          amount: pdc.amount,
          status: pdc.status,
          dueDate: pdc.date, // Use date field for due date
        })),
        businessInHand: businessInHand.map(bih => ({
          poNumber: bih.type === 'po_in_hand' ? bih.description : '',
          supplier: bih.type === 'pending_invoice' ? bih.description : '',
          description: bih.description,
          amount: bih.amount,
          status: bih.status,
          expectedDate: bih.expectedDate,
        })),
        futureNeeds: futureNeeds.map(fn => ({
          description: fn.description,
          category: '', // Default empty since not in schema, can derive from description if needed
          month: fn.month,
          amount: fn.amount * fn.quantity, // Total amount = unit amount * quantity
          type: fn.status, // Use status for type (recurring/one-time)
        })),
      },
      totals: {
        totalSales,
        totalExpenses,
        totalLiabilities,
        outstandingLiabilities,
        totalSalaries,
        paidSalaries,
        pendingSalaries,
        totalInflows,
        totalOutflows,
        netCashflow: totalInflows - totalOutflows,
        totalProfit,
        businessInHandValue,
      },
    };

    return exportData;
  },
});
