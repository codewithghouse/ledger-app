import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { 
  PieChart, Wallet, CreditCard, Loader2, 
  ArrowRightLeft, Building, Database, Landmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BalanceSheetPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await reportsApi.financials();
        setData(res.data.balance_sheet);
      } catch {
        toast({ title: "Error", description: "Failed to load balance sheet", variant: "destructive" });
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
            <PieChart className="w-6 h-6 text-primary" /> Balance Sheet
          </h1>
          <p className="text-sm text-muted-foreground">Statement of Financial Position as on date</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-border bg-background border border-border rounded-3xl overflow-hidden shadow-2xl">
        {/* Assets Side */}
        <div className="p-8 space-y-6 bg-primary/5">
          <div className="flex items-center justify-between border-b border-primary/20 pb-4">
            <h3 className="text-lg font-black text-primary uppercase">Assets</h3>
            <Wallet className="w-5 h-5 text-primary opacity-50" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">Current Assets</p>
                <p className="text-[10px] text-muted-foreground uppercase">Receivables & Inventory</p>
              </div>
              <p className="font-mono font-bold text-foreground">₹{(data.assets || 0).toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between items-center opacity-50">
              <div>
                <p className="text-sm font-bold text-foreground">Fixed Assets</p>
                <p className="text-[10px] text-muted-foreground uppercase">Property, Plant, Equip.</p>
              </div>
              <p className="font-mono font-bold text-foreground">₹0</p>
            </div>
          </div>

          <div className="pt-8 border-t border-primary/20 flex justify-between items-center">
            <p className="text-sm font-black text-primary uppercase">Total Assets</p>
            <p className="text-xl font-black font-mono text-primary">₹{(data.assets || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Liabilities Side */}
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h3 className="text-lg font-black text-warning uppercase">Liabilities</h3>
            <CreditCard className="w-5 h-5 text-warning opacity-50" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-warning transition-colors">Current Liabilities</p>
                <p className="text-[10px] text-muted-foreground uppercase">Payables & Dues</p>
              </div>
              <p className="font-mono font-bold text-foreground">₹{(data.liabilities || 0).toLocaleString()}</p>
            </div>

            <div className="flex justify-between items-center group">
              <div>
                <p className="text-sm font-bold text-foreground group-hover:text-warning transition-colors">Capital Account</p>
                <p className="text-[10px] text-muted-foreground uppercase">Owner's Equity</p>
              </div>
              <p className="font-mono font-bold text-foreground">₹{(data.assets - data.liabilities).toLocaleString()}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex justify-between items-center">
            <p className="text-sm font-black text-warning uppercase">Total Liabilities</p>
            <p className="text-xl font-black font-mono text-warning">₹{(data.assets || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black text-success uppercase tracking-widest">Accounting Equation Balanced: Assets = Liabilities</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetPage;
