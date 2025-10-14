import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Loader2,
  Trash2,
  Trash,
  BarChart3,
  FileText,
  DollarSign,
  Users,
  Building,
  CreditCard,
  Calendar,
  HandCoins,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function Admin2Page() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const seedDatabase = useAction(api.seedData.seedDatabase);
  const removeSeededData = useAction(api.seedData.removeSeededData);
  const clearAllData = useAction(api.seedData.clearAllData);

  // Get record counts for all modules
  const salesCount = useQuery(api.sales.getSalesCount);
  const expensesCount = useQuery(api.expenses.getExpensesCount);
  const liabilitiesCount = useQuery(api.liabilities.getLiabilitiesCount);
  const salariesCount = useQuery(api.salaries.getSalariesCount);
  const bankPdcCount = useQuery(api.bankPdc.getBankPdcCount);
  const futureNeedsCount = useQuery(api.futureNeeds.getFutureNeedsCount);
  const businessInHandCount = useQuery(api.businessInHand.getBusinessInHandCount);
  const cashflowCount = useQuery(api.cashflow.getCashflowCount);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      console.log("Adding sample data...");
      const result = await seedDatabase();
      console.log("Sample data added successfully:", result);
      toast.success("✅ Sample data added!");
    } catch (error) {
      console.log("Error adding sample data:", error);
      toast.error("Failed: " + String(error));
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      console.log("Removing sample data...");
      const result = await removeSeededData();
      console.log("Sample data removed successfully:", result);
      toast.success("✅ Sample data removed!");
    } catch (error) {
      console.log("Error removing sample data:", error);
      toast.error("Failed: " + String(error));
    } finally {
      setIsRemoving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("🚨 ATTENTION: Clear ALL data from ALL tables?\n\nThis will delete EVERYTHING including your own data!\n\nThis action CANNOT be undone.")) return;
    setIsClearing(true);
    try {
      console.log("Clearing all data...");
      const result = await clearAllData();
      console.log("All data cleared successfully:", result);
      toast.success("🧹 ALL data cleared from ALL tables!");
    } catch (error) {
      console.log("Error clearing data:", error);
      toast.error("Failed: " + String(error));
    } finally {
      setIsClearing(false);
    }
  };

  const totalRecords =
    (salesCount || 0) +
    (expensesCount || 0) +
    (liabilitiesCount || 0) +
    (salariesCount || 0) +
    (bankPdcCount || 0) +
    (futureNeedsCount || 0) +
    (businessInHandCount || 0) +
    (cashflowCount || 0);

  const moduleStats = [
    { name: "Sales", icon: TrendingUp, count: salesCount || 0, color: "text-green-600" },
    { name: "Expenses", icon: DollarSign, count: expensesCount || 0, color: "text-red-600" },
    { name: "Liabilities", icon: Building, count: liabilitiesCount || 0, color: "text-orange-600" },
    { name: "Salaries", icon: Users, count: salariesCount || 0, color: "text-blue-600" },
    { name: "Bank PDC", icon: CreditCard, count: bankPdcCount || 0, color: "text-purple-600" },
    { name: "Future Needs", icon: Calendar, count: futureNeedsCount || 0, color: "text-cyan-600" },
    { name: "Business in Hand", icon: HandCoins, count: businessInHandCount || 0, color: "text-indigo-600" },
    { name: "Cash Flow", icon: BarChart3, count: cashflowCount || 0, color: "text-emerald-600" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Actions Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Database Administration</h1>
              <p className="text-muted-foreground mt-2">
                Manage your Finance Tracker data - Add samples, remove samples, or clear everything
              </p>
            </div>

            {/* Add Sample Data Section */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Database className="h-5 w-5" />
                  📋 Add Sample Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-green-700">
                  Add comprehensive sample data across all modules to test the application.
                  Perfect for demos and development.
                </p>

                <div className="text-sm text-green-600 space-y-1">
                  <p>✓ Adds 5 Sales records</p>
                  <p>✓ Adds 4 Expense records</p>
                  <p>✓ Adds sample data to all 7 financial modules</p>
                  <p>✓ Safe - only adds sample data, preserves existing data</p>
                </div>

                <Button
                  onClick={handleSeed}
                  disabled={isSeeding || isRemoving || isClearing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Sample Data...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      🎯 Add Sample Data (All Modules)
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-green-600">
                  This is safe and will NOT overwrite or delete existing user data
                </p>
              </CardContent>
            </Card>

            {/* Remove Sample Data Section */}
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Trash2 className="h-5 w-5" />
                  🧹 Remove Sample Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-orange-700">
                  Remove all sample/test data from the application. Keeps your real data safe.
                </p>

                <div className="bg-orange-100 rounded-lg p-3">
                  <p className="text-sm font-medium text-orange-800 mb-2">This will remove:</p>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p>• Sample sales, expenses, salaries, etc.</p>
                    <p>• All auto-generated test records</p>
                    <p>• Cash flow entries created from sample data</p>
                    <p className="font-semibold">• YOUR real data stays 100% safe ✅</p>
                  </div>
                </div>

                <Button
                  onClick={handleRemove}
                  disabled={isRemoving || isSeeding || isClearing}
                  variant="secondary"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  size="lg"
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing Sample Data...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      🧹 Remove Sample Data Only
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-orange-600">
                  Removes only test/sample records, preserves all user data
                </p>
              </CardContent>
            </Card>

            {/* Clear ALL Data Section - DANGER ZONE */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  🚨 DANGER ZONE: Clear ALL Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ This will DELETE EVERYTHING from ALL tables including your own data!
                </p>

                <div className="bg-red-100 border border-red-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">This action will delete:</p>
                      <ul className="text-sm text-red-700 ml-4 mt-1 space-y-1">
                        <li>• All sales, expenses, salaries</li>
                        <li>• All bank PDC and liabilities</li>
                        <li>• All future needs and business records</li>
                        <li>• All cash flow records</li>
                        <li className="font-bold">• YOUR REAL DATA WILL BE GONE FOREVER!</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleClear}
                  disabled={isClearing || isSeeding || isRemoving}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ⚠️ Clearing ALL Data...
                    </>
                  ) : (
                    <>
                      <Trash className="mr-2 h-4 w-4" />
                      🚨 Clear ALL Data (Complete Reset)
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Use this only for complete reset - CANNOT be undone!</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Dashboard Column - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Database Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{totalRecords || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>

                <div className="space-y-1 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Sample Data Regions:</span>
                    <span className="font-medium">{totalRecords > 0 ? Math.min(Math.ceil(totalRecords / 20), 7) : 0}/7</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalRecords > 0 ? Math.min((totalRecords / 140) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    ~{Math.ceil((totalRecords || 0) / 20)} sample modules active
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Module-Specific Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Records by Module
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-2">Module</TableHead>
                      <TableHead className="py-2 text-right">Records</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moduleStats.map((module) => {
                      const Icon = module.icon;
                      return (
                        <TableRow key={module.name} className="hover:bg-muted/50">
                          <TableCell className="py-2 flex items-center gap-2">
                            <Icon className={`h-3 w-3 ${module.color}`} />
                            <span className="text-sm">{module.name}</span>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <Badge variant={module.count > 0 ? "default" : "secondary"} className="text-xs">
                              {module.count}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="py-2 font-medium flex items-center gap-2">
                        <BarChart3 className="h-3 w-3 text-primary" />
                        <span className="text-sm">Total</span>
                      </TableCell>
                      <TableCell className="py-2 text-right font-medium">
                        <Badge variant="default" className="bg-primary text-xs">
                          {totalRecords || 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-base">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Start with "Add Sample Data" to populate test records</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p>Use "Remove Sample Data" to clean up before going live</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p>The right panel shows real-time record counts</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-red-700 font-medium">
                      Clear ALL Data will delete everything - use carefully!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
