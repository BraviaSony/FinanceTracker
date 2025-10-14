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
import { Plus, Edit, Trash2, DollarSign, Users, Calendar, CheckCircle , Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { formatCurrency } from "@/lib/currency-utils";

const exportSalariesToExcel = (salaries: any[]) => {
  // Dynamically import xlsx to fix the require issue
  import('xlsx').then((xlsx: any) => {
    try {
      // Clean tabular format - just columns and data for filtering
      const filterData = [
        ["Employee Name", "Role", "Net Salary (PKR)", "Month", "Payment Date", "Status"],
        ...salaries.map(salary => [
          salary.employeeName,
          salary.role,
          salary.netSalary,
          salary.month,
          salary.paymentDate ? format(new Date(salary.paymentDate), 'yyyy-MM-dd') : 'Not set',
          salary.paymentStatus,
        ])
      ];

      const ws = xlsx.utils.aoa_to_sheet(filterData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Salaries");

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `salaries-data-${timestamp}.xlsx`;

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

interface SalaryFormData {
  employeeName: string;
  role: string;
  netSalary: number;
  paymentStatus: "paid" | "pending";
  paymentDate: string;
  month: string;
}

const initialFormData: SalaryFormData = {
  employeeName: "",
  role: "",
  netSalary: 0,
  paymentStatus: "pending",
  paymentDate: new Date().toISOString().split('T')[0],
  month: new Date().toISOString().slice(0, 7), // YYYY-MM format
};

export default function SalariesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Id<"salaries"> | null>(null);
  const [formData, setFormData] = useState<SalaryFormData>(initialFormData);

  const salaries = useQuery(api.salaries.getAllSalaries);
  const salarySummary = useQuery(api.salaries.getSalarySummary, {});
  const employees = useQuery(api.salaries.getEmployees, {});
  
  const createSalary = useMutation(api.salaries.createSalary);
  const updateSalary = useMutation(api.salaries.updateSalary);
  const deleteSalary = useMutation(api.salaries.deleteSalary);

  const formatAmount = (amount: number) => formatCurrency(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSalary) {
        await updateSalary({
          id: editingSalary,
          ...formData,
        });
        toast.success("Salary record updated successfully");
      } else {
        await createSalary(formData);
        toast.success("Salary record created successfully");
      }
      
      setIsDialogOpen(false);
      setEditingSalary(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save salary record");
      console.error(error);
    }
  };

  const handleEdit = (salary: any) => {
    setEditingSalary(salary._id);
    setFormData({
      employeeName: salary.employeeName,
      role: salary.role,
      netSalary: salary.netSalary,
      paymentStatus: salary.paymentStatus,
      paymentDate: salary.paymentDate || new Date().toISOString().split('T')[0],
      month: salary.month,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: Id<"salaries">) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      try {
        await deleteSalary({ id });
        toast.success("Salary record deleted successfully");
      } catch (error) {
        toast.error("Failed to delete salary record");
        console.error(error);
      }
    }
  };

  const handleExport = () => {
    if (salaries && salaries.length > 0) {
      exportSalariesToExcel(salaries);
      toast.success("Salaries data exported successfully!");
    } else {
      toast.info("No salaries data available to export.");
    }
  };

  const handleAddNew = () => {
    setEditingSalary(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Salaries</h1>
            <p className="text-muted-foreground">
              Manage employee salaries and payroll
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Salary
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSalary ? "Edit Salary Record" : "Add New Salary Record"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      placeholder="Employee full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Job role/title"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="netSalary">Net Salary</Label>
                    <Input
                      id="netSalary"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.netSalary}
                      onChange={(e) => setFormData({ ...formData, netSalary: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value: "paid" | "pending") => setFormData({ ...formData, paymentStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                {/* Salary Preview */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Salary:</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(formData.netSalary)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSalary ? "Update" : "Create"} Salary
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {salarySummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatAmount(salarySummary.totalSalaries)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {salarySummary.employeeCount} record{salarySummary.employeeCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Salaries</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-600">
                  {formatAmount(salarySummary.paidSalaries)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Salaries</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-orange-600">
                  {formatAmount(salarySummary.pendingSalaries)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{employees?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active employees
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Salaries Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Salary Records</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!salaries || salaries.length === 0}
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Salaries Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!salaries ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : salaries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No salary records found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add Salary" to create your first salary record
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaries.map((salary) => (
                      <TableRow key={salary._id}>
                        <TableCell className="font-medium">{salary.employeeName}</TableCell>
                        <TableCell>{salary.role}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(salary.netSalary)}
                        </TableCell>
                        <TableCell>{salary.month}</TableCell>
                        <TableCell>
                          {salary.paymentDate ? format(new Date(salary.paymentDate), 'MMM dd, yyyy') : 'Not set'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={salary.paymentStatus === "paid" ? "default" : "secondary"}>
                            {salary.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(salary)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(salary._id)}
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
