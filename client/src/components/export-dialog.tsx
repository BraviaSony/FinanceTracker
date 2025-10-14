import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";

interface ExportDialogProps {
  children: React.ReactNode;
  title?: string;
  defaultModules?: string[];
}

const MODULES = [
  { id: "sales", label: "Sales Data" },
  { id: "expenses", label: "Expenses" },
  { id: "liabilities", label: "Liabilities" },
  { id: "salaries", label: "Salaries" },
  { id: "cashflow", label: "Cash Flow" },
  { id: "bankPdc", label: "Bank PDC" },
  { id: "businessInHand", label: "Business in Hand" },
  { id: "futureNeeds", label: "Future Needs" },
];

export function ExportDialog({ children, title, defaultModules }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");
  const [selectedModules, setSelectedModules] = useState<string[]>(
    defaultModules || MODULES.map(m => m.id)
  );
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const exportData = useQuery(api.export.getExportData, {
    dateRange: (dateRange.startDate && dateRange.endDate) ? {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    } : undefined,
    modules: selectedModules.length > 0 ? selectedModules : MODULES.map(m => m.id),
  });

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const generateExcel = () => {
    if (!exportData) return;

    const workbook = require('xlsx');
    const wb = workbook.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["Finance Tracker Export Summary"],
      ["Export Date", exportData.summary.exportDate],
      ["Currency", exportData.summary.currency],
      ["Date Range", exportData.summary.dateRange
        ? `${exportData.summary.dateRange.startDate} to ${exportData.summary.dateRange.endDate}`
        : "All Data"
      ],
      [""],
      ["Financial Totals"],
      ["Total Sales", formatCurrency(exportData.totals.totalSales)],
      ["Total Expenses", formatCurrency(exportData.totals.totalExpenses)],
      ["Total Profit", formatCurrency(exportData.totals.totalProfit)],
      ["Outstanding Liabilities", formatCurrency(exportData.totals.outstandingLiabilities)],
      ["Business in Hand", formatCurrency(exportData.totals.businessInHandValue)],
      ["Total Salaries", formatCurrency(exportData.totals.totalSalaries)],
      ["Paid Salaries", formatCurrency(exportData.totals.paidSalaries)],
      ["Pending Salaries", formatCurrency(exportData.totals.pendingSalaries)],
      ["Total Inflows", formatCurrency(exportData.totals.totalInflows)],
      ["Total Outflows", formatCurrency(exportData.totals.totalOutflows)],
      ["Net Cash Flow", formatCurrency(exportData.totals.netCashflow)],
    ];

    workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(summaryData), "Summary");

    // Data sheets for each module
    if (selectedModules.includes("sales")) {
      const salesData = [
        ["Date", "Description", "Cost (PKR)", "Selling Price (PKR)", "Gross Profit (PKR)", "Gross Margin (%)",
         "Expenses (PKR)", "Net Profit (PKR)", "Net Margin (%)"],
        ...exportData.data.sales.map(sale => [
          sale.date,
          sale.description,
          sale.cost,
          sale.sellingPrice,
          sale.grossProfit,
          sale.grossProfitMargin.toFixed(2),
          sale.expenses,
          sale.netProfit,
          sale.netProfitMargin.toFixed(2),
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(salesData), "Sales");
    }

    if (selectedModules.includes("expenses")) {
      const expensesData = [
        ["Date", "Description", "Amount (PKR)", "Category", "Vendor", "Status"],
        ...exportData.data.expenses.map(exp => [
          exp.date,
          exp.description,
          exp.amount,
          exp.category,
          exp.vendor,
          exp.status,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(expensesData), "Expenses");
    }

    if (selectedModules.includes("liabilities")) {
      const liabilitiesData = [
        ["Description", "Original Amount (PKR)", "Outstanding Balance", "Due Date", "Creditor", "Status"],
        ...exportData.data.liabilities.map(lib => [
          lib.description,
          lib.amount,
          lib.outstandingBalance,
          lib.dueDate,
          lib.creditor,
          lib.status,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(liabilitiesData), "Liabilities");
    }

    if (selectedModules.includes("salaries")) {
      const salariesData = [
        ["Employee Name", "Month", "Basic Salary (PKR)", "Allowances (PKR)", "Deductions (PKR)",
         "Net Salary (PKR)", "Payment Status", "Payment Date"],
        ...exportData.data.salaries.map(sal => [
          sal.employeeName,
          sal.month,
          sal.basicSalary,
          sal.allowances,
          sal.deductions,
          sal.netSalary,
          sal.paymentStatus,
          sal.paymentDate,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(salariesData), "Salaries");
    }

    if (selectedModules.includes("cashflow")) {
      const cashflowData = [
        ["Date", "Type", "Category", "Description", "Amount (PKR)"],
        ...exportData.data.cashflow.map(cf => [
          cf.date,
          cf.type,
          cf.category,
          cf.description,
          cf.amount,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(cashflowData), "Cash Flow");
    }

    if (selectedModules.includes("bankPdc")) {
      const bankPdcData = [
        ["Bank Name", "Supplier Code", "Amount (PKR)", "Status", "Due Date"],
        ...exportData.data.bankPdc.map(pdc => [
          pdc.bankName,
          pdc.supplierCode,
          pdc.amount,
          pdc.status,
          pdc.dueDate,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(bankPdcData), "Bank PDC");
    }

    if (selectedModules.includes("businessInHand")) {
      const businessInHandData = [
        ["PO Number", "Supplier", "Description", "Amount (PKR)", "Status", "Expected Date"],
        ...exportData.data.businessInHand.map(bih => [
          bih.poNumber,
          bih.supplier,
          bih.description,
          bih.amount,
          bih.status,
          bih.expectedDate,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(businessInHandData), "Business In Hand");
    }

    if (selectedModules.includes("futureNeeds")) {
      const futureNeedsData = [
        ["Description", "Category", "Month", "Total Amount (PKR)", "Type"],
        ...exportData.data.futureNeeds.map(fn => [
          fn.description,
          fn.category,
          fn.month,
          fn.amount,
          fn.type,
        ])
      ];
      workbook.utils.book_append_sheet(wb, workbook.utils.aoa_to_sheet(futureNeedsData), "Future Needs");
    }

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `finance-tracker-export-${timestamp}.xlsx`;

    // Save file
    workbook.writeFile(wb, filename);
    setIsOpen(false);
  };

  const generatePDF = () => {
    if (!exportData) return;

    // For now, generate Excel instead since PDF libraries are more complex
    // In a real implementation, you'd use jsPDF or similar
    alert("PDF export coming soon! Generating Excel instead.");
    generateExcel();
  };

  const handleExport = () => {
    if (exportFormat === "excel") {
      generateExcel();
    } else {
      generatePDF();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title || "Export Financial Data"}</DialogTitle>
          <DialogDescription>
            Export your financial data in Excel or PDF format. Select the modules and date range you want to include.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={exportFormat} onValueChange={(value: "excel" | "pdf") => setExportFormat(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      PDF (.pdf)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date Range Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Date Range (Optional)</CardTitle>
              <CardDescription>
                Leave empty to export all data, or specify a date range to filter the data.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Module Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Modules to Export</CardTitle>
              <CardDescription>
                Choose which financial modules you want to include in the export.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {MODULES.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <Label htmlFor={module.id} className="text-sm">
                      {module.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Stats */}
          {exportData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sales Records</p>
                    <p className="font-semibold">{exportData.data.sales.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expense Records</p>
                    <p className="font-semibold">{exportData.data.expenses.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Sales</p>
                    <p className="font-semibold">{formatCurrency(exportData.totals.totalSales)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Expenses</p>
                    <p className="font-semibold">{formatCurrency(exportData.totals.totalExpenses)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              disabled={!exportData || selectedModules.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {exportFormat === "excel" ? "Export to Excel" : "Export to PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
