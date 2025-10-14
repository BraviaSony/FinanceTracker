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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CreditCard, Calendar, Building2, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency-utils";

const exportBankPdcToExcel = (pdcs: any[]) => {
  // Dynamically import xlsx to fix the require issue
  import('xlsx').then((xlsx: any) => {
    try {
      // Clean tabular format - just columns and data for filtering
      const filterData = [
        ["Code", "PDC Date", "Description", "Amount (PKR)", "Status", "Bank", "Cheque Number", "Supplier", "Creation Date"],
        ...pdcs.map(pdc => [
          pdc.code,
          format(new Date(pdc.date), 'yyyy-MM-dd'),
          pdc.description,
          pdc.amount,
          pdc.status,
          pdc.bank,
          pdc.chequeNumber,
          pdc.supplier,
          format(new Date(pdc.creationDate), 'yyyy-MM-dd'),
        ])
      ];

      const ws = xlsx.utils.aoa_to_sheet(filterData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Bank PDC");

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `bank-pdc-data-${timestamp}.xlsx`;

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

interface PdcFormData {
  code: string;
  date: string;
  description: string;
  amount: number;
  status: "pending" | "cleared";
  bank: string;
  chequeNumber: string;
  supplier: string;
  creationDate: string;
}

const initialFormData: PdcFormData = {
  code: "",
  date: "",
  description: "",
  amount: 0,
  status: "pending",
  bank: "",
  chequeNumber: "",
  supplier: "",
  creationDate: new Date().toISOString().split('T')[0],
};

export default function BankPdcPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPdc, setEditingPdc] = useState<any>(null);
  const [formData, setFormData] = useState<PdcFormData>(initialFormData);

  // Queries
  const allPdcs = useQuery(api.bankPdc.getAllBankPdc);
  const pdcSummary = useQuery(api.bankPdc.getBankPdcSummary, {});
  const bankList = useQuery(api.bankPdc.getBanks, {});

  // Mutations
  const createPdc = useMutation(api.bankPdc.createBankPdc);
  const updatePdc = useMutation(api.bankPdc.updateBankPdc);
  const deletePdc = useMutation(api.bankPdc.deleteBankPdc);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPdc) {
        await updatePdc({
          id: editingPdc._id,
          code: formData.code,
          date: formData.date,
          description: formData.description,
          amount: formData.amount,
          status: formData.status,
          bank: formData.bank,
          chequeNumber: formData.chequeNumber,
          supplier: formData.supplier,
        });
        toast.success("PDC updated successfully");
      } else {
        await createPdc(formData);
        toast.success("PDC created successfully");
      }

      setIsDialogOpen(false);
      setEditingPdc(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save PDC");
    }
  };

  const handleEdit = (pdc: any) => {
    setEditingPdc(pdc);
    setFormData({
      code: pdc.code,
      date: pdc.date,
      description: pdc.description,
      amount: pdc.amount,
      status: pdc.status,
      bank: pdc.bank,
      chequeNumber: pdc.chequeNumber,
      supplier: pdc.supplier,
      creationDate: pdc.creationDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this PDC?")) {
      try {
        await deletePdc({ id });
        toast.success("PDC deleted successfully");
      } catch (error) {
        toast.error("Failed to delete PDC");
      }
    }
  };

  const handleExport = () => {
    if (allPdcs && allPdcs.length > 0) {
      exportBankPdcToExcel(allPdcs);
      toast.success("Bank PDC data exported successfully!");
    } else {
      toast.info("No Bank PDC data available to export.");
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "cleared" ? "default" : "secondary"}>
        {status === "cleared" ? "Cleared" : "Pending"}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Bank PDC Management</h1>
            <p className="text-muted-foreground">
              Manage post-dated cheques and bank transactions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPdc(null);
                setFormData(initialFormData);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add PDC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPdc ? "Edit PDC" : "Add New PDC"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">PDC Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="PDC-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chequeNumber">Cheque Number</Label>
                    <Input
                      id="chequeNumber"
                      value={formData.chequeNumber}
                      onChange={(e) => setFormData({ ...formData, chequeNumber: e.target.value })}
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">PDC Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creationDate">Creation Date</Label>
                    <Input
                      id="creationDate"
                      type="date"
                      value={formData.creationDate}
                      onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Payment for services"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      placeholder="Supplier name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank">Bank</Label>
                    <Input
                      id="bank"
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      placeholder="Bank name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: "pending" | "cleared") => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cleared">Cleared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPdc ? "Update PDC" : "Create PDC"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {pdcSummary && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total PDCs</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{pdcSummary.totalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <Calendar className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatCurrency(pdcSummary.pendingAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cleared Amount</CardTitle>
                <Building2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatCurrency(pdcSummary.clearedAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Banks</CardTitle>
                <Building2 className="h-4 w-4 text-blue-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{bankList?.length || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PDC Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>PDC Records</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!allPdcs || allPdcs.length === 0}
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Bank PDC Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!allPdcs ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allPdcs.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No PDCs found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by creating your first PDC record.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Cheque #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPdcs.map((pdc) => (
                    <TableRow key={pdc._id}>
                      <TableCell className="font-medium">{pdc.code}</TableCell>
                      <TableCell>{format(new Date(pdc.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{pdc.description}</TableCell>
                      <TableCell>{pdc.supplier}</TableCell>
                      <TableCell>{pdc.bank}</TableCell>
                      <TableCell>{pdc.chequeNumber}</TableCell>
                      <TableCell>
                        {formatCurrency(pdc.amount)}
                        <span className="ml-1 text-muted-foreground">(PKR)</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(pdc.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pdc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pdc._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
