import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, ShoppingCart, Package, FileText, BookOpen,
  Landmark, CreditCard, FileMinus, FilePlus, Calendar, BookMarked,
  Wallet, Users, Truck, TrendingUp, BarChart3, PieChart,
  ClipboardList, ShoppingBag, Brain, LogOut, Building2, ChevronLeft, ChevronRight, Settings, FileUp
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ShoppingCart, label: "Sales Register", path: "/sales" },
  { icon: Package, label: "Purchase Register", path: "/purchases" },
  { icon: FileText, label: "Invoice / Billing", path: "/invoice" },
  { icon: CreditCard, label: "Bills Payable", path: "/bills-payable" },
  { icon: Wallet, label: "Bills Receivable", path: "/bills-receivable" },
  { icon: BookOpen, label: "Cash Book", path: "/cash-book" },
  { icon: Landmark, label: "Bank Book", path: "/bank-book" },
  { icon: FileMinus, label: "Credit Note", path: "/credit-note" },
  { icon: FilePlus, label: "Debit Note", path: "/debit-note" },
  { icon: Calendar, label: "Day Book", path: "/day-book" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: BookMarked, label: "Journal Register", path: "/journal" },
  { icon: Users, label: "Ledger", path: "/ledger" },
  { icon: Truck, label: "Delivery Note", path: "/delivery-note" },
  { icon: TrendingUp, label: "Funds Flow", path: "/funds-flow" },
  { icon: BarChart3, label: "Profit & Loss", path: "/profit-loss" },
  { icon: PieChart, label: "Balance Sheet", path: "/balance-sheet" },
  { icon: ClipboardList, label: "Ratio Analysis", path: "/ratios" },
  { icon: ShoppingBag, label: "Purchase Orders", path: "/purchase-orders" },
  { icon: ShoppingCart, label: "Sales Orders", path: "/sales-orders" },
  { icon: Users, label: "Customers", path: "/customers" },
  { icon: Building2, label: "Vendors", path: "/vendors" },
  { icon: Brain, label: "AI Insights", path: "/ai-insights" },
  { icon: FileUp, label: "Import Excel", path: "/import" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AppSidebar = ({ onNavigate, isMobile }: { onNavigate?: () => void; isMobile?: boolean }) => {
  const { currentCompany, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    onNavigate?.();
  };

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 sticky top-0`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-4 border-b border-sidebar-border`}>
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">{currentCompany?.name}</p>
              <p className="text-xs text-sidebar-muted truncate">{currentCompany?.adminEmail}</p>
            </div>
          </div>
        )}
        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors flex-shrink-0">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2 space-y-0.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "sidebar-item-active" : ""} ${collapsed ? "justify-center px-0" : ""}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full text-destructive hover:bg-destructive/10 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
