import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin2Page from "./pages/admin2";
import NotFound from "./pages/not-found";
import SalesPage from "./pages/sales";
import ExpensesPage from "./pages/expenses";
import LiabilitiesPage from "./pages/liabilities";
import CashflowPage from "./pages/cashflow";
import BankPdcPage from "./pages/bank-pdc";
import FutureNeedsPage from "./pages/future-needs";
import BusinessInHandPage from "./pages/business-in-hand";
import SalariesPage from "./pages/salaries";
import TestAllModulesPage from "./pages/test-all-modules";

export function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Main dashboard page */}
          <Route path="/" element={<Index />} />

          {/* Financial modules */}
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/liabilities" element={<LiabilitiesPage />} />
          <Route path="/cashflow" element={<CashflowPage />} />
          <Route path="/salaries" element={<SalariesPage />} />
          <Route path="/bank-pdc" element={<BankPdcPage />} />
          <Route path="/future-needs" element={<FutureNeedsPage />} />
          <Route path="/business-in-hand" element={<BusinessInHandPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin2Page />} />
          <Route path="/admin2" element={<Admin2Page />} />
          
          {/* Testing route */}
          <Route path="/test" element={<TestAllModulesPage />} />

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
