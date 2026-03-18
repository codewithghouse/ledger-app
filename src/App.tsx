import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SalesRegisterPage from "./pages/SalesRegisterPage";
import InvoicePage from "./pages/InvoicePage";
import RatioAnalysisPage from "./pages/RatioAnalysisPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import LedgerPage from "./pages/LedgerPage";
import PurchasesPage from "./pages/PurchasesPage";
import SettingsPage from "./pages/SettingsPage";
import InventoryPage from "./pages/InventoryPage";
import CustomersPage from "./pages/CustomersPage";
import VendorsPage from "./pages/VendorsPage";
import AppLayout from "./components/AppLayout";
import PlaceholderPage from "./components/PlaceholderPage";
import DayBookPage from "./pages/DayBookPage";
import ProfitLossPage from "./pages/ProfitLossPage";
import BalanceSheetPage from "./pages/BalanceSheetPage";
import BillsReceivablePage from "./pages/BillsReceivablePage";
import BillsPayablePage from "./pages/BillsPayablePage";
import SalesOrdersPage from "./pages/SalesOrdersPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import CreditNotePage from "./pages/CreditNotePage";
import CashBookPage from "./pages/CashBookPage";
import BankBookPage from "./pages/BankBookPage";
import DeliveryNotePage from "./pages/DeliveryNotePage";
import JournalPage from "./pages/JournalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sales" element={<SalesRegisterPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/bills-receivable" element={<BillsReceivablePage />} />
        <Route path="/bills-payable" element={<BillsPayablePage />} />
        <Route path="/cash-book" element={<CashBookPage />} />
        <Route path="/bank-book" element={<BankBookPage />} />
        <Route path="/credit-note" element={<PlaceholderPage title="Credit Note Register" description="Manage credit notes" />} />
        <Route path="/debit-note" element={<PlaceholderPage title="Debit Note Register" description="Manage debit notes" />} />
        <Route path="/day-book" element={<DayBookPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/ledger" element={<LedgerPage />} />
        <Route path="/delivery-note" element={<DeliveryNotePage />} />
        <Route path="/funds-flow" element={<PlaceholderPage title="Funds Flow" description="Funds flow statement" />} />
        <Route path="/profit-loss" element={<ProfitLossPage />} />
        <Route path="/balance-sheet" element={<BalanceSheetPage />} />
        <Route path="/ratios" element={<RatioAnalysisPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/sales-orders" element={<SalesOrdersPage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
