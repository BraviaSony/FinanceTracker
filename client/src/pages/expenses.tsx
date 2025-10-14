import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, TrendingDown, Calendar, Building, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency-utils";

const exportExpensesToExcel = (expenses: any[]) => {
  // Dynamically import xlsx to fix the require issue
  import('xlsx').then((xlsx: any) => {
    try {
      // Clean tabular format - just columns and data for filtering
      const filterData = [
        ["Date", "Category", "Description", "Vendor", "Amount (PKR)", "Status"],
        ...expenses.map(expense => [
          format(new Date(expense.date), 'yyyy-MM-dd'),
          expense.category,
          expense.description,
          expense.vendor,
          expense.amount,
          expense.status,
        ])
      ];

      const ws = xlsx.utils.aoa_to_sheet(filterData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Expenses");

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `expenses-data-${timestamp}.xlsx`;

      // Save file
      xlsx.writeFile(wb, filename);

      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show an error toast here
    }
  }).catch((importError) => {
    console.error('Failed to import xlsx:', importError);
  });
};

interface ExpenseFormData {
  date: string;
  category: string;
  description: string;
  vendor: string;
  amount: number;
  status: "paid" | "unpaid";
}

const initialFormData: ExpenseFormData = {
  date: new Date().toISOString().split('T')[0],
  category: "",
  description: "",
  vendor: "",
  amount: 0,
  status: "unpaid",
};

export default function ExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Id<"expenses"> | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);

  const expenses = useQuery(api.expenses.getAllExpenses);
  const expenseSummary = useQuery(api.expenses.getExpenseSummary, {});
  const expenseCategories = useQuery(api.expenses.getExpenseCategories, {});
  
  const createExpense = useMutation(api.expenses.createExpense);
  const updateExpense = useMutation(api.expenses.updateExpense);
  const deleteExpense = useMutation(api.expenses.deleteExpense);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingExpense) {
        await updateExpense({
          id: editingExpense,
          ...formData,
        });
        toast.success("Expense updated successfully");
      } else {
        await createExpense(formData);
        toast.success("Expense created successfully");
      }
      
      setIsDialogOpen(false);
      setEditingExpense(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save expense");
      console.error(error);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense._id);
    setFormData({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      vendor: expense.vendor,
      amount: expense.amount,
      status: expense.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"expenses">) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense({ id });
        toast.success("Expense deleted successfully");
      } catch (error) {
        toast.error("Failed to delete expense");
        console.error(error);
      }
    }
  };

  const handleExport = () => {
    if (expenses && expenses.length > 0) {
      exportExpensesToExcel(expenses);
      toast.success("Expenses data exported successfully!");
    } else {
      toast.info("No expenses data available to export.");
    }
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage your business expenses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Office Supplies, Marketing, Utilities"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the expense"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="Vendor or supplier name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "paid" | "unpaid") => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingExpense ? "Update" : "Create"} Expense
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {expenseSummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatCurrency(expenseSummary.totalExpenses, 'PKR')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {expenseSummary.expenseCount} expense{expenseSummary.expenseCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">
                  {formatCurrency(expenseSummary.paidExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Expenses</CardTitle>
                <Calendar className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-red-600">
                  {formatCurrency(expenseSummary.unpaidExpenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unpaid expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{expenseCategories?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active categories
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Expense Records</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!expenses || expenses.length === 0}
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Expenses Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!expenses ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No expense records found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add Expense" to create your first expense record
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{expense.description}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={expense.status === "paid" ? "default" : "destructive"}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
