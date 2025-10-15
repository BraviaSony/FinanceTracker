import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/currency-utils";
import { ExportDialog } from "@/components/export-dialog";

import {
  BarChart3,
  Receipt,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Expand,
  Download
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const dashboardData = useQuery(api.dashboard.getDashboardData, {});
  // const { convertedData, formatAmount, selectedCurrency } = useCurrencyConversion(); // Temporarily disabled during PKR conversion

  // Simple PKR formatting for dashboard
  const formatAmountWithCustomFont = (amount: number) => {
    return formatCurrency(amount);
  };

  if (!dashboardData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const { charts, recentActivity, summary } = dashboardData;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your financial performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ExportDialog>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </ExportDialog>
          </div>
        </div>

        {/* Summary Cards - First Row (4 cards) */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.netCashflow)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total revenue generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Current period expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Outstanding Liabilities</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.outstandingLiabilities)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total amount due
              </p>
            </CardContent>
          </Card>



          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Net Cash Flow</CardTitle>
              {summary.netCashflow >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.netCashflow)}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>In: {formatAmountWithCustomFont(summary.totalInflows)}</div>
                <div>Out: {formatAmountWithCustomFont(summary.totalOutflows)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Summary Cards - Second Row (4 cards) */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mobile-stack">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-blue-900">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.totalProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total profit generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Pending Salaries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.salariesPending)}
              </div>
              <p className="text-xs text-muted-foreground">
                Salaries awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Business in Hand</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatAmountWithCustomFont(summary.businessInHandValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Expected revenue pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-blue-900">Cash Flow Ratio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {summary.totalOutflows > 0 ? (summary.totalInflows / summary.totalOutflows).toFixed(2) : "∞"}
              </div>
              <p className="text-xs text-muted-foreground">
                Inflow to outflow ratio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Cash Flow Trend */}
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="mobile-text-sm">Cash Flow Trend</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 p-0 mobile-hidden">
                    <Expand className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-5/6 mobile-full-width">
                  <DialogHeader>
                    <DialogTitle>Cash Flow Trend - Full View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 mobile-full-width">
                    <ResponsiveContainer width="100%" height={400} className="mobile-full-width">
                      <LineChart data={charts.cashflowTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                        <Legend />
                        <Line type="monotone" dataKey="inflows" stroke="#00C49F" strokeWidth={3} name="Inflows" />
                        <Line type="monotone" dataKey="outflows" stroke="#FF8042" strokeWidth={3} name="Outflows" />
                        <Line type="monotone" dataKey="netCashflow" stroke="#0088FE" strokeWidth={3} name="Net Cash Flow" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="mobile-compact">
              <ResponsiveContainer width="100%" height={200} className="chart-responsive">
                <LineChart data={charts.cashflowTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" className="mobile-text-sm" />
                  <YAxis className="mobile-text-sm" />
                  <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="inflows" stroke="#00C49F" strokeWidth={2} name="Inflows" />
                  <Line type="monotone" dataKey="outflows" stroke="#FF8042" strokeWidth={2} name="Outflows" />
                  <Line type="monotone" dataKey="netCashflow" stroke="#0088FE" strokeWidth={2} name="Net Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expenses by Category</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 p-0">
                    <Expand className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-5/6">
                  <DialogHeader>
                    <DialogTitle>Expenses by Category - Full View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={600}>
                      <PieChart>
                        <Pie
                          data={charts.expensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                          outerRadius={200}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {charts.expensesByCategory.map((_, index) => (
                            <Cell key={`modal-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) =>
                      `${category.split(' ')[0]}\n${percentage.toFixed(1)}%`
                    }
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {charts.expensesByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatAmountWithCustomFont(Number(value))}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales Trend */}
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales & Profit Trend</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 p-0">
                    <Expand className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-5/6">
                  <DialogHeader>
                    <DialogTitle>Sales & Profit Trend - Full View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={600}>
                      <BarChart data={charts.salesTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                        <Legend />
                        <Bar dataKey="sales" fill="#0088FE" name="Sales" />
                        <Bar dataKey="profit" fill="#00C49F" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                  <Legend />
                  <Bar dataKey="sales" fill="#0088FE" name="Sales" />
                  <Bar dataKey="profit" fill="#00C49F" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Liabilities by Due Date */}
          <Card className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liabilities by Due Date</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute top-4 right-4 h-8 w-8 p-0">
                    <Expand className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-5/6">
                  <DialogHeader>
                    <DialogTitle>Liabilities by Due Date - Full View</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={600}>
                      <BarChart data={charts.liabilitiesByDueDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                        <Legend />
                        <Bar dataKey="amount" fill="#FF8042" name="Amount Due" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.liabilitiesByDueDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAmountWithCustomFont(Number(value))} />
                  <Bar dataKey="amount" fill="#FF8042" name="Amount Due" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'Sale' ? 'bg-green-500' : 
                        activity.type === 'Expense' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatAmountWithCustomFont(activity.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
