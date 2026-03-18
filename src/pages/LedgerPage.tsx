import { useState, useEffect } from "react";
import { reportsApi, customersApi, vendorsApi } from "@/lib/api";
import { 
  Users, Search, Loader2, FileText, Calendar, 
  ArrowUpRight, ArrowDownLeft, Printer, Download,
  User as UserIcon, Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LedgerPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [summary, setSummary] = useState({ total_debit: 0, total_credit: 0, balance: 0 });

  const fetchAccounts = async () => {
    try {
      const [c, v] = await Promise.all([customersApi.list(), vendorsApi.list()]);
      const combined = [
        ...c.data.map((x:any) => ({ ...x, type: 'Customer' })),
        ...v.data.map((x:any) => ({ ...x, type: 'Vendor' }))
      ];
      setAccounts(combined);
    } catch {}
  };

  useEffect(() => { fetchAccounts(); }, []);

  const fetchLedger = async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      const res = await reportsApi.ledger(selectedAccount);
      setData(res.data);
      
      const debit = res.data.reduce((acc: number, cur: any) => acc + (cur.debit || 0), 0);
      const credit = res.data.reduce((acc: number, cur: any) => acc + (cur.credit || 0), 0);
      setSummary({ total_debit: debit, total_credit: credit, balance: debit - credit });
    } catch {
      toast({ title: "Error", description: "Failed to fetch ledger", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLedger(); }, [selectedAccount]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Account Ledger
          </h1>
          <p className="text-sm text-muted-foreground">Detailed transaction statements per entity</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="min-w-[250px] px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
            <option value="">Select Customer or Vendor</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedAccount ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-primary">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Debits</p>
              <p className="text-xl font-bold font-mono">₹{summary.total_debit.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4 rounded-xl border-l-4 border-l-warning">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Credits</p>
              <p className="text-xl font-bold font-mono">₹{summary.total_credit.toLocaleString()}</p>
            </div>
            <div className={`glass-card p-4 rounded-xl border-l-4 ${summary.balance >= 0 ? 'border-l-success' : 'border-l-destructive'}`}>
              <p className="text-xs font-bold text-muted-foreground uppercase">Closing Balance</p>
              <p className="text-xl font-bold font-mono">₹{Math.abs(summary.balance).toLocaleString()} {summary.balance >= 0 ? 'Dr' : 'Cr'}</p>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/50 bg-muted/30">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Reference #</th>
                    <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Type</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Debit (₹)</th>
                    <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading statement...</td></tr>
                  ) : data.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">No transactions found for this account.</td></tr>
                  ) : data.map((item, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="p-4 text-muted-foreground">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-4 font-mono font-bold text-primary">{item.invoice_no || item.purchase_no}</td>
                      <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'Sale' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>{item.type}</span></td>
                      <td className="p-4 text-right font-mono">{item.debit > 0 ? `₹${item.debit.toLocaleString()}` : '-'}</td>
                      <td className="p-4 text-right font-mono">{item.credit > 0 ? `₹${item.credit.toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center glass-card rounded-2xl border-dashed">
          <Users className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h2 className="text-lg font-bold text-muted-foreground">Select an Account to View Ledger</h2>
          <p className="text-sm text-muted-foreground/60">Choose a customer or vendor from the dropdown above to see their full transaction history.</p>
        </div>
      )}
    </div>
  );
};

export default LedgerPage;
