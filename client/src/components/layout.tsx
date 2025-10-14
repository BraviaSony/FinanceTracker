import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  DollarSign, 
  Receipt, 
  CreditCard, 
  Users, 
  TrendingUp, 
  CheckSquare, 
  Calendar, 
  Briefcase,
  Menu,
  X,
  TestTube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Sales", href: "/sales", icon: DollarSign },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Liabilities", href: "/liabilities", icon: CreditCard },
  { name: "Salaries", href: "/salaries", icon: Users },
  { name: "Cash Flow", href: "/cashflow", icon: TrendingUp },
  { name: "Bank PDC", href: "/bank-pdc", icon: CheckSquare },
  { name: "Future Needs", href: "/future-needs", icon: Calendar },
  { name: "Business in Hand", href: "/business-in-hand", icon: Briefcase },
  { name: "Test Suite", href: "/test", icon: TestTube },
];

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="size-6 text-primary" />
              <span className="text-lg font-semibold text-foreground tracking-tight">
                Finance Tracker
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation
              .filter(item => item.name !== "Test Suite") // Hide Test Suite for production
              .map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="mr-3 size-4" />
                    {item.name}
                  </button>
                );
              })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          
          <div className="flex items-center space-x-4 ml-auto">
            <p className="text-sm font-bold italic text-blue-900">
              Created by: Shaharyar Khalid
            </p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
