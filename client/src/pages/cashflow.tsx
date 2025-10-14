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
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, BarChart3, Download } from "lucide-react";
import { ExportDialog } from "@/components/export-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
 // import { exportCashFlowData } from "@/lib/excel-export"; // Temporarily disabled during PKR conversion
import { formatCurrency } from "@/lib/currency-utils";

interface CashflowFormData {
  date: string;
  type: "inflow" | "outflow";
  category: string;
  description: string;
  amount: number;
}

const initialFormData: CashflowFormData = {
  date: new Date().toISOString().split('T')[0],
  type: "inflow",
  category: "",
  description: "",
  amount: 0,
};

export default function CashflowPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCashflow, setEditingCashflow] = useState<Id<"cashflow"> | null>(null);
  const [formData, setFormData] = useState<CashflowFormData>(initialFormData);

  const cashflow = useQuery(api.cashflow.getAllCashflow);
  const cashflowSummary = useQuery(api.cashflow.getCashflowSummary, {});
  const cashflowTrend = useQuery(api.cashflow.getCashflowTrend, {});
  const cashflowCategories = useQuery(api.cashflow.getCashflowCategories);
  
  const createCashflowEntry = useMutation(api.cashflow.createCashflowEntry);
  const updateCashflowEntry = useMutation(api.cashflow.updateCashflowEntry);
  const deleteCashflowEntry = useMutation(api.cashflow.deleteCashflowEntry);

  const formatAmount = (amount: number) => formatCurrency(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCashflow) {
        await updateCashflowEntry({
          id: editingCashflow,
          ...formData,
        });
        toast.success("Cashflow entry updated successfully");
      } else {
        await createCashflowEntry(formData);
        toast.success("Cashflow entry created successfully");
      }
      
      setIsDialogOpen(false);
      setEditingCashflow(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save cashflow entry");
      console.error(error);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingCashflow(entry._id);
    setFormData({
      date: entry.date,
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"cashflow">) => {
    if (window.confirm("Are you sure you want to delete this cashflow entry?")) {
      try {
        await deleteCashflowEntry({ id });
        toast.success("Cashflow entry deleted successfully");
      } catch (error) {
        toast.error("Failed to delete cashflow entry");
        console.error(error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingCashflow(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };


  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Cash Flow</h1>
            <p className="text-muted-foreground">
              Track your business cash inflows and outflows
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCashflow ? "Edit Cashflow Entry" : "Add New Cashflow Entry"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "inflow" | "outflow") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inflow">Inflow</SelectItem>
                        <SelectItem value="outflow">Outflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Sales, Expenses, Investment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the transaction"
                    required
                  />
                </div>

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

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCashflow ? "Update" : "Create"} Entry
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {cashflowSummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inflows</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">
                  {formatAmount(cashflowSummary.totalInflows)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Money coming in
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outflows</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-red-600">
                  {formatAmount(cashflowSummary.totalOutflows)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Money going out
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-semibold ${
                  cashflowSummary.netCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatAmount(cashflowSummary.netCashflow)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Net position
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{cashflowCategories?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active categories
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cashflow Trend Chart */}
        {cashflowTrend && cashflowTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [formatAmount(value), ""]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="inflows" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Inflows"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="outflows" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Outflows"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="netCashflow" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Net Cash Flow"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cashflow Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cash Flow Records</CardTitle>
              <ExportDialog>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!cashflow || cashflow.length === 0}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export to Excel
                </Button>
              </ExportDialog>
            </div>
          </CardHeader>
          <CardContent>
            {!cashflow ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : cashflow.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No cashflow records found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add Entry" to create your first cashflow record
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashflow.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant={entry.type === "inflow" ? "default" : "destructive"}>
                            {entry.type === "inflow" ? (
                              <><TrendingUp className="mr-1 h-3 w-3" />Inflow</>
                            ) : (
                              <><TrendingDown className="mr-1 h-3 w-3" />Outflow</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                        <TableCell className={`text-right ${
                          entry.type === "inflow" ? "text-green-600" : "text-red-600"
                        }`}>
                          {entry.type === "inflow" ? "+" : "-"}
                          {formatCurrency(entry.amount)}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          <Badge variant="secondary">PKR</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entry._id)}
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
