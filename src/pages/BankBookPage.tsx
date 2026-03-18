import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { 
  Landmark, Search, Loader2, Calendar, 
  ArrowUpRight, ArrowDownLeft, FileText, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BankBookPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  const fetchBankBook = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.bankBook();
      setData(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load bank book", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBankBook(); }, []);

  const totalIn = data.reduce((acc, cur) => acc + (cur.in || 0), 0);
  const totalOut = data.reduce((acc, cur) => acc + (cur.out || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Landmark className="w-6 h-6 text-primary" /> Bank Book
          </h1>
          <p className="text-sm text-muted-foreground">Digital payments and bank reconciliation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border-t-2 border-t-info">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Deposits</p>
          <p className="text-xl font-black font-mono text-info">₹{totalIn.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-t-2 border-t-destructive">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Withdrawals</p>
          <p className="text-xl font-black font-mono text-destructive">₹{totalOut.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border-t-2 border-t-primary">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Bank Balance</p>
          <p className="text-xl font-black font-mono text-primary">₹{(totalIn - totalOut).toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Ref #</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Entity</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Type</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Bank In (₹)</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Bank Out (₹)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Syncing with bank server...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-muted-foreground">No bank transactions found.</td></tr>
              ) : data.map((item, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4 font-mono font-bold text-primary">{item.invoice_no || item.purchase_no}</td>
                  <td className="p-4 font-medium">{item.customer_name || item.vendor_name}</td>
                  <td className="p-4 text-xs font-bold text-info uppercase">{item.type}</td>
                  <td className="p-4 text-right font-bold font-mono text-info">{item.in > 0 ? `₹${item.in.toLocaleString()}` : '-'}</td>
                  <td className="p-4 text-right font-bold font-mono text-destructive">{item.out > 0 ? `₹${item.out.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankBookPage;
