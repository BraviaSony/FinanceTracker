import { v } from "convex/values";
import { query } from "./_generated/server";

// Get comprehensive dashboard data
export const getDashboardData = query({
  args: {
    dateRange: v.optional(v.object({
      startDate: v.string(),
      endDate: v.string(),
    })),
  },
  returns: v.object({
    summary: v.object({
      totalExpenses: v.number(),
      outstandingLiabilities: v.number(),
      salariesPaid: v.number(),
      salariesPending: v.number(),
      totalInflows: v.number(),
      totalOutflows: v.number(),
      netCashflow: v.number(),
      businessInHandValue: v.number(),
      totalProfit: v.number(),
    }),
    charts: v.object({
      cashflowTrend: v.array(v.object({
        month: v.string(),
        inflows: v.number(),
        outflows: v.number(),
        netCashflow: v.number(),
      })),
      expensesByCategory: v.array(v.object({
        category: v.string(),
        amount: v.number(),
        percentage: v.number(),
      })),
      liabilitiesByDueDate: v.array(v.object({
        month: v.string(),
        amount: v.number(),
        count: v.number(),
      })),
      salesTrend: v.array(v.object({
        month: v.string(),
        sales: v.number(),
        profit: v.number(),
      })),
    }),
    recentActivity: v.array(v.object({
      type: v.string(),
      description: v.string(),
      amount: v.number(),
      date: v.string(),
      currency: v.string(),
    })),
  }),
  handler: async (ctx, args) => {
    const startDate = args.dateRange?.startDate;
    const endDate = args.dateRange?.endDate;

    // Get all data
    const [expenses, liabilities, salaries, cashflows, sales, businessInHand] = await Promise.all([
      ctx.db.query("expenses").collect(),
      ctx.db.query("liabilities").collect(),
      ctx.db.query("salaries").collect(),
      ctx.db.query("cashflow").collect(),
      ctx.db.query("sales").collect(),
      ctx.db.query("businessInHand").collect(),
    ]);

    // Filter by date range if provided
    const filterByDate = (items: any[], dateField: string = 'date') => {
      if (!startDate && !endDate) return items;
      return items.filter(item => {
        const itemDate = item[dateField];
        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    };

    const filteredExpenses = filterByDate(expenses);
    const filteredSalaries = filterByDate(salaries, 'month');
    const filteredCashflows = filterByDate(cashflows);
    // const filteredSales = filterByDate(sales);

    // Calculate summary metrics
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const outstandingLiabilities = liabilities.reduce((sum, lib) => sum + lib.outstandingBalance, 0);
    
    const salariesPaid = filteredSalaries
      .filter(sal => sal.paymentStatus === "paid")
      .reduce((sum, sal) => sum + sal.netSalary, 0);
    
    const salariesPending = filteredSalaries
      .filter(sal => sal.paymentStatus === "pending")
      .reduce((sum, sal) => sum + sal.netSalary, 0);

    const totalInflows = filteredCashflows
      .filter(cf => cf.type === "inflow")
      .reduce((sum, cf) => sum + cf.amount, 0);
    
    const totalOutflows = filteredCashflows
      .filter(cf => cf.type === "outflow")
      .reduce((sum, cf) => sum + cf.amount, 0);

    const businessInHandValue = businessInHand
      .filter(bih => bih.status !== "received")
      .reduce((sum, bih) => sum + bih.amount, 0);

    // Calculate total profit from all sales
    const totalProfit = sales.reduce((sum, sale) => sum + sale.netProfit, 0);

    // Generate cashflow trend (last 12 months)
    const cashflowTrend: Array<{
      month: string;
      inflows: number;
      outflows: number;
      netCashflow: number;
    }> = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthCashflows = cashflows.filter(cf => cf.date.startsWith(monthKey));
      const inflows = monthCashflows.filter(cf => cf.type === "inflow").reduce((sum, cf) => sum + cf.amount, 0);
      const outflows = monthCashflows.filter(cf => cf.type === "outflow").reduce((sum, cf) => sum + cf.amount, 0);
      
      cashflowTrend.push({
        month: monthKey,
        inflows,
        outflows,
        netCashflow: inflows - outflows,
      });
    }

    // Generate expenses by category
    const expenseCategoryMap = new Map<string, number>();
    filteredExpenses.forEach(exp => {
      expenseCategoryMap.set(exp.category, (expenseCategoryMap.get(exp.category) || 0) + exp.amount);
    });

    const expensesByCategory = Array.from(expenseCategoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));

    // Generate liabilities by due date (monthly grouping)
    const liabilityMonthMap = new Map<string, { amount: number; count: number }>();
    liabilities.forEach(lib => {
      if (lib.outstandingBalance > 0) {
        const monthKey = lib.dueDate.substring(0, 7); // YYYY-MM
        const existing = liabilityMonthMap.get(monthKey) || { amount: 0, count: 0 };
        liabilityMonthMap.set(monthKey, {
          amount: existing.amount + lib.outstandingBalance,
          count: existing.count + 1,
        });
      }
    });

    const liabilitiesByDueDate = Array.from(liabilityMonthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Generate sales trend (last 12 months)
    const salesTrend: Array<{
      month: string;
      sales: number;
      profit: number;
    }> = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthSales = sales.filter(sale => sale.date.startsWith(monthKey));
      const totalSales = monthSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
      const totalProfit = monthSales.reduce((sum, sale) => sum + sale.netProfit, 0);
      
      salesTrend.push({
        month: monthKey,
        sales: totalSales,
        profit: totalProfit,
      });
    }

    // Generate recent activity (last 10 transactions)
    const recentActivity: Array<{
      type: string;
      description: string;
      amount: number;
      date: string;
      currency: string;
    }> = [];
    
    // Add recent sales
    const recentSales = sales
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(sale => ({
        type: "Sale",
        description: sale.description,
        amount: sale.sellingPrice,
        date: sale.date,
        currency: "PKR",
      }));

    // Add recent expenses
    const recentExpenses = expenses
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(exp => ({
        type: "Expense",
        description: exp.description,
        amount: exp.amount,
        date: exp.date,
        currency: "PKR",
      }));

    // Add recent salary payments
    const recentSalaryPayments = salaries
      .filter(sal => sal.paymentStatus === "paid")
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 2)
      .map(sal => ({
        type: "Salary",
        description: `${sal.employeeName} - ${sal.month}`,
        amount: sal.netSalary,
        date: sal.paymentDate || sal.month,
        currency: "PKR",
      }));

    recentActivity.push(...recentSales, ...recentExpenses, ...recentSalaryPayments);
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      summary: {
        totalExpenses,
        outstandingLiabilities,
        salariesPaid,
        salariesPending,
        totalInflows,
        totalOutflows,
        netCashflow: totalInflows - totalOutflows,
        businessInHandValue,
        totalProfit,
      },
      charts: {
        cashflowTrend,
        expensesByCategory,
        liabilitiesByDueDate,
        salesTrend,
      },
      recentActivity: recentActivity.slice(0, 10),
    };
  },
});
