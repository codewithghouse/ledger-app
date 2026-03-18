import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { 
  CreditCard, Search, Loader2, Calendar, 
  ArrowDownLeft, FileText, Building2, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BillsPayablePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<any[]>([]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.payables();
      setBills(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load payables", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  const totalPayable = bills.reduce((acc, b) => acc + (b.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" /> Bills Payable
          </h1>
          <p className="text-sm text-muted-foreground">Outstanding bills to be paid to vendors</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 px-4 py-2 rounded-xl">
          <p className="text-[10px] font-bold text-destructive uppercase">Total Outstanding Liability</p>
          <p className="text-xl font-black font-mono text-destructive">₹{totalPayable.toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Bill Date</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Purchase #</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Vendor</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Amount (₹)</th>
                <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Fetching pending bills...</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">All bills paid! No outstanding liabilities.</td></tr>
              ) : bills.map((b, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="p-4 font-mono font-bold text-primary">{b.purchase_no}</td>
                  <td className="p-4 font-medium">{b.vendor_name}</td>
                  <td className="p-4 text-right font-bold font-mono text-foreground">₹{b.total_amount?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase">
                      <AlertTriangle className="w-3 h-3" /> {b.status || 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillsPayablePage;
