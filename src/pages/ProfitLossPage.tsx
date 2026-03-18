import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { 
  TrendingUp, TrendingDown, IndianRupee, Loader2, 
  BarChart3, ArrowRight, Wallet, PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfitLossPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await reportsApi.financials();
        setData(res.data.pnl);
      } catch {
        toast({ title: "Error", description: "Failed to load P&L statement", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchFinancials();
  }, []);

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Profit & Loss Account
          </h1>
          <p className="text-sm text-muted-foreground">Income Statement for the current period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Side */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-success uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Income / Revenue
          </h3>
          <div className="glass-card p-6 rounded-2xl flex justify-between items-center transition-all hover:border-success/30 group">
            <div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Sales Revenue</p>
              <p className="text-xs text-muted-foreground/60 italic">Total value of all sales invoices</p>
            </div>
            <p className="text-xl font-bold font-mono text-success">₹{(data.income || 0).toLocaleString()}</p>
          </div>
          <div className="bg-success/10 p-4 rounded-xl flex justify-between items-center border border-success/20">
            <p className="text-sm font-bold text-success">Total Earnings</p>
            <p className="text-xl font-black font-mono text-success">₹{(data.income || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Expense Side */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-destructive uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Expenses / Cost
          </h3>
          <div className="glass-card p-6 rounded-2xl flex justify-between items-center transition-all hover:border-destructive/30 group">
            <div>
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Purchase Cost</p>
              <p className="text-xs text-muted-foreground/60 italic">Total value of purchase bills</p>
            </div>
            <p className="text-xl font-bold font-mono text-destructive">₹{(data.expense || 0).toLocaleString()}</p>
          </div>
          <div className="bg-destructive/10 p-4 rounded-xl flex justify-between items-center border border-destructive/20">
            <p className="text-sm font-bold text-destructive">Total Expenses</p>
            <p className="text-xl font-black font-mono text-destructive">₹{(data.expense || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Net Result */}
      <div className="glass-card p-8 rounded-3xl border-2 border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="z-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-foreground">₹{(data.net_profit || 0).toLocaleString()}</h2>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{data.net_profit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
        </div>
        <div className="z-10 flex gap-4">
          <div className="text-center px-6 py-3 bg-background rounded-2xl border border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Profitability</p>
            <p className="text-lg font-bold text-primary">{data.income > 0 ? ((data.net_profit / data.income) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossPage;
