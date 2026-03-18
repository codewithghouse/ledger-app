import { useState, useEffect } from "react";
import { reportsApi } from "@/lib/api";
import { 
  Calendar, Search, Loader2, BookOpen, 
  ArrowUpRight, ArrowDownLeft, FileText, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DayBookPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDayBook = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.dayBook(date);
      setData(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load day book", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDayBook(); }, [date]);

  const totalIn = data.reduce((acc, cur) => acc + (cur.type === 'Sale' ? cur.amount : 0), 0);
  const totalOut = data.reduce((acc, cur) => acc + (cur.type === 'Purchase' ? cur.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Day Book
          </h1>
          <p className="text-sm text-muted-foreground">Daily record of all transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs font-bold text-muted-foreground uppercase">Cash In (Sales)</p>
          <p className="text-xl font-bold text-success font-mono">₹{totalIn.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs font-bold text-muted-foreground uppercase">Cash Out (Purchases)</p>
          <p className="text-xl font-bold text-destructive font-mono">₹{totalOut.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-xs font-bold text-muted-foreground uppercase">Net Daily Movement</p>
          <p className={`text-xl font-bold font-mono ${totalIn - totalOut >= 0 ? 'text-primary' : 'text-warning'}`}>₹{(totalIn - totalOut).toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Time</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Ref #</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Entity</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Type</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Syncing with daily journal...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">No entries for this date.</td></tr>
              ) : data.map((item, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-4 font-mono font-bold text-primary">{item.invoice_no || item.purchase_no}</td>
                  <td className="p-4 font-medium">{item.customer_name || item.vendor_name}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${item.type === 'Sale' ? 'text-success' : 'text-destructive'}`}>
                      {item.type === 'Sale' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold font-mono ${item.type === 'Sale' ? 'text-success' : 'text-destructive'}`}>₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DayBookPage;
