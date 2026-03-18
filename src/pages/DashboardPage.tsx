import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Wallet,
  CreditCard, Banknote, Landmark, IndianRupee, Loader2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardApi } from "@/lib/api";

const fmt = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");

const DashboardPage = () => {
  const { currentCompany } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{currentCompany?.name} — Real-time Overview</p>
        </div>
        <div className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full uppercase tracking-tighter">
          Live Sync Active
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={fmt(stats.totalSales)} icon={ShoppingCart} variant="success" />
        <StatCard title="Purchases" value={fmt(stats.totalPurchases)} icon={Package} variant="info" />
        <StatCard title="Receivables" value={fmt(stats.receivables)} icon={Wallet} variant="warning" />
        <StatCard title="Payables" value={fmt(stats.payables)} icon={CreditCard} variant="destructive" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 min-h-[300px] flex flex-col justify-center items-center">
          <TrendingUp className="w-12 h-12 text-primary/20 mb-4" />
          <h3 className="text-lg font-bold">₹{stats.netProfit?.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Estimated Net Profit</p>
          <div className="mt-4 text-[10px] uppercase font-bold text-success bg-success/10 px-2 py-1 rounded">Gross Margin Calculation Applied</div>
        </div>

        <div className="glass-card rounded-xl p-5 min-h-[300px] flex flex-col justify-center items-center">
          <Package className="w-12 h-12 text-info/20 mb-4" />
          <h3 className="text-lg font-bold">₹{stats.inventoryValue?.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Current Inventory Value</p>
          <div className="mt-4 text-[10px] uppercase font-bold text-info bg-info/10 px-2 py-1 rounded">Real-time Stock Valuation</div>
        </div>
      </div>

      {/* Placeholder for future Charts (connected to real data) */}
      <div className="glass-card rounded-xl p-8 text-center border-dashed border-2 border-border/50">
        <IndianRupee className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
        <h3 className="text-muted-foreground font-medium">Detailed Analytics & Charts</h3>
        <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto mt-1">Transaction history graphs will appear here once more data points are recorded in the Sales & Purchase registers.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
