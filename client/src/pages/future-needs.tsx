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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Calendar, TrendingUp, Package, Repeat , Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency-utils";

const exportFutureNeedsToExcel = (needs: any[]) => {
  // Dynamically import xlsx to fix the require issue
  import('xlsx').then((xlsx: any) => {
    try {
      // Clean tabular format - just columns and data for filtering
      const filterData = [
        ["Description", "Month", "Type", "Quantity", "Unit Amount (PKR)", "Total Cost (PKR)", "Remarks"],
        ...needs.map(need => [
          need.description,
          need.month,
          need.status,
          need.quantity,
          need.amount,
          need.amount * need.quantity,
          need.remarks || "",
        ])
      ];

      const ws = xlsx.utils.aoa_to_sheet(filterData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Future Needs");

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `future-needs-data-${timestamp}.xlsx`;

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

interface FutureNeedFormData {
  description: string;
  amount: number;
  quantity: number;
  month: string;
  status: "recurring" | "one-time";
  remarks?: string;
}

const initialFormData: FutureNeedFormData = {
  description: "",
  amount: 0,
  quantity: 1,
  month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  status: "one-time",
  remarks: "",
};

export default function FutureNeedsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<any>(null);
  const [formData, setFormData] = useState<FutureNeedFormData>(initialFormData);

  // Queries
  const allNeeds = useQuery(api.futureNeeds.getAllFutureNeeds);
  const needsSummary = useQuery(api.futureNeeds.getFutureNeedsSummary, {});

  // Mutations
  const createNeed = useMutation(api.futureNeeds.createFutureNeed);
  const updateNeed = useMutation(api.futureNeeds.updateFutureNeed);
  const deleteNeed = useMutation(api.futureNeeds.deleteFutureNeed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNeed) {
        await updateNeed({
          id: editingNeed._id,
          description: formData.description,
          amount: formData.amount,
          quantity: formData.quantity,
          month: formData.month,
          status: formData.status,
          remarks: formData.remarks,
        });
        toast.success("Future need updated successfully");
      } else {
        await createNeed(formData);
        toast.success("Future need created successfully");
      }
      
      setIsDialogOpen(false);
      setEditingNeed(null);
      setFormData(initialFormData);
    } catch (error) {
      toast.error("Failed to save future need");
    }
  };

  const handleEdit = (need: any) => {
    setEditingNeed(need);
    setFormData({
      description: need.description,
      amount: need.amount,
      quantity: need.quantity,
      month: need.month,
      status: need.status,
      remarks: need.remarks || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this future need?")) {
      try {
        await deleteNeed({ id });
        toast.success("Future need deleted successfully");
      } catch (error) {
        toast.error("Failed to delete future need");
      }
    }
  };

  const handleExport = () => {
    if (allNeeds && allNeeds.length > 0) {
      exportFutureNeedsToExcel(allNeeds);
      toast.success("Future needs data exported successfully!");
    } else {
      toast.info("No future needs data available to export.");
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "recurring" ? "default" : "secondary"}>
        {status === "recurring" ? (
          <>
            <Repeat className="w-3 h-3 mr-1" />
            Recurring
          </>
        ) : (
          <>
            <Calendar className="w-3 h-3 mr-1" />
            One-time
          </>
        )}
      </Badge>
    );
  };



  const formatMonth = (month: string) => {
    return format(new Date(month + "-01"), 'MMM yyyy');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Future Needs Planning</h1>
            <p className="text-muted-foreground">
              Plan and track your future business requirements and expenses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingNeed(null);
                setFormData(initialFormData);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Future Need
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingNeed ? "Edit Future Need" : "Add New Future Need"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Office equipment upgrade"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month">Target Month</Label>
                    <Input
                      id="month"
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Type</Label>
                    <Select value={formData.status} onValueChange={(value: "recurring" | "one-time") => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Unit Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Additional notes or requirements"
                    rows={3}
                  />
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-medium">Total Cost: {formatCurrency(formData.amount * formData.quantity)}</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNeed ? "Update Need" : "Create Need"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        {needsSummary && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Needs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{needsSummary.totalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {formatCurrency(needsSummary.totalAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">One-time Needs</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{needsSummary.oneTimeCount}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(needsSummary.oneTimeAmount)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recurring Needs</CardTitle>
                <Repeat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{needsSummary.recurringCount}</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(needsSummary.recurringAmount)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}



        {/* Future Needs Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Future Needs</CardTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!allNeeds || allNeeds.length === 0}
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export Future Needs Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!allNeeds ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allNeeds.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No future needs found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start planning by adding your first future need.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Amount</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allNeeds.map((need) => (
                    <TableRow key={need._id}>
                      <TableCell className="font-medium">{need.description}</TableCell>
                      <TableCell>{formatMonth(need.month)}</TableCell>
                      <TableCell>{getStatusBadge(need.status)}</TableCell>
                      <TableCell>{need.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(need.amount)}
                        <span className="ml-1 text-muted-foreground">(PKR)</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(need.amount * need.quantity)}
                        <span className="ml-1 text-muted-foreground">(PKR)</span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{need.remarks || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(need)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(need._id)}
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
