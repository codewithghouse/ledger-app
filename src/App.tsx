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
import AppLayout from "./components/AppLayout";
import PlaceholderPage from "./components/PlaceholderPage";
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
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sales" element={<SalesRegisterPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/purchases" element={<PlaceholderPage title="Purchase Register" description="Track all purchase transactions" />} />
        <Route path="/bills-payable" element={<PlaceholderPage title="Bills Payable" description="Manage outstanding payables" />} />
        <Route path="/bills-receivable" element={<PlaceholderPage title="Bills Receivable" description="Track outstanding receivables" />} />
        <Route path="/cash-book" element={<PlaceholderPage title="Cash Book" description="Cash transaction ledger" />} />
        <Route path="/bank-book" element={<PlaceholderPage title="Bank Book" description="Bank transaction records" />} />
        <Route path="/credit-note" element={<PlaceholderPage title="Credit Note Register" description="Manage credit notes" />} />
        <Route path="/debit-note" element={<PlaceholderPage title="Debit Note Register" description="Manage debit notes" />} />
        <Route path="/day-book" element={<PlaceholderPage title="Day Book" description="Daily transaction journal" />} />
        <Route path="/journal" element={<PlaceholderPage title="Journal Register" description="Journal entries" />} />
        <Route path="/ledger" element={<PlaceholderPage title="Ledger" description="General ledger accounts" />} />
        <Route path="/delivery-note" element={<PlaceholderPage title="Delivery Note" description="Delivery tracking" />} />
        <Route path="/funds-flow" element={<PlaceholderPage title="Funds Flow" description="Funds flow statement" />} />
        <Route path="/profit-loss" element={<PlaceholderPage title="Profit & Loss Account" description="Income statement" />} />
        <Route path="/balance-sheet" element={<PlaceholderPage title="Balance Sheet" description="Financial position statement" />} />
        <Route path="/ratios" element={<RatioAnalysisPage />} />
        <Route path="/purchase-orders" element={<PlaceholderPage title="Purchase Orders" description="Manage purchase orders" />} />
        <Route path="/sales-orders" element={<PlaceholderPage title="Sales Orders" description="Manage sales orders" />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
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
