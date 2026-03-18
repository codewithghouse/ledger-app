import { useState, useEffect } from "react";
import { journalsApi } from "@/lib/api";
import { 
  BookText, Plus, Loader2, Trash2, Save, PenTool, Hash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JournalPage = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    journal_no: `JV-${Date.now().toString().slice(-6)}`,
    particulars: "",
    debit_account: "",
    credit_account: "",
    amount: 0,
    note: ""
  });

  const fetchJournals = async () => {
    setLoading(true);
    try {
      const res = await journalsApi.list();
      setData(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load journal entries", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJournals(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await journalsApi.create({ ...form, date: new Date().toISOString() });
      toast({ title: "✅ Entry Recorded", description: "Journal adjustment saved" });
      setForm({
        journal_no: `JV-${Date.now().toString().slice(-6)}`,
        particulars: "",
        debit_account: "",
        credit_account: "",
        amount: 0,
        note: ""
      });
      fetchJournals();
    } catch {
      toast({ title: "Error", description: "Failed to save journal entry", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookText className="w-6 h-6 text-primary" /> Journal Register
          </h1>
          <p className="text-sm text-muted-foreground">Manual accounting entries and adjustments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 glass-card p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider">New Journal Voucher</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">JV #</label>
            <input readOnly value={form.journal_no} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Debit Account</label>
            <input required value={form.debit_account} onChange={e => setForm({...form, debit_account: e.target.value})} placeholder="e.g. Rent Account" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Credit Account</label>
            <input required value={form.credit_account} onChange={e => setForm({...form, credit_account: e.target.value})} placeholder="e.g. Cash Account" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</label>
            <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Narration</label>
            <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Reason for adjustment..." className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[80px]" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Record Entry
          </button>
        </form>

        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Adjustment Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Particulars</th>
                  <th className="p-4 text-right">Debit (₹)</th>
                  <th className="p-4 text-right">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Auditing entries...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">No entries found.</td></tr>
                ) : data.map((d, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="font-bold text-foreground">Dr. {d.debit_account}</div>
                      <div className="text-muted-foreground pl-4">To {d.credit_account}</div>
                      <div className="text-[10px] italic text-muted-foreground mt-1">({d.note})</div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold">₹{d.amount.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono font-bold">₹{d.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
