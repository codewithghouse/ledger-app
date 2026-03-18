import { useState, useEffect } from "react";
import { returnsApi, customersApi, productsApi } from "@/lib/api";
import { 
  FileMinus, Plus, Loader2, Trash2, Save, User, ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreditNotePage = () => {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    note_no: `CN-${Date.now().toString().slice(-6)}`,
    entity_id: "",
    items: [{ product_id: "", qty: 1, price: 0 }],
    type: "Credit Note"
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, c, p] = await Promise.all([
        returnsApi.list("Credit Note"),
        customersApi.list(),
        productsApi.list()
      ]);
      setData(r.data);
      setCustomers(c.data);
      setProducts(p.data);
    } catch {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setForm({ ...form, items: [...form.items, { product_id: "", qty: 1, price: 0 }] });
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    if (field === "product_id") {
      const p = products.find(x => x.id === value);
      newItems[index] = { ...newItems[index], product_id: value, price: p?.price || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const total = form.items.reduce((acc, it) => acc + (it.qty * it.price), 0);
      await returnsApi.create({ ...form, total_amount: total, date: new Date().toISOString() });
      toast({ title: "✅ Credit Note Issued", description: "Stock increased and customer balance reduced" });
      setForm({
        note_no: `CN-${Date.now().toString().slice(-6)}`,
        entity_id: "",
        items: [{ product_id: "", qty: 1, price: 0 }],
        type: "Credit Note"
      });
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to issue credit note", variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileMinus className="w-6 h-6 text-primary" /> Credit Note (Sales Return)
          </h1>
          <p className="text-sm text-muted-foreground">Adjust sales returns and customer balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 glass-card p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider">New Credit Note</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Note #</label>
            <input readOnly value={form.note_no} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Customer</label>
            <select required value={form.entity_id} onChange={e => setForm({...form, entity_id: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground uppercase">Returned Items</label>
              <button type="button" onClick={addItem} className="text-primary hover:text-primary/80 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            {form.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                <select className="col-span-12 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.product_id} onChange={e => updateItem(idx, "product_id", e.target.value)}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input type="number" placeholder="Qty" className="col-span-6 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} />
                <input type="number" placeholder="Rate" className="col-span-6 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.price} onChange={e => updateItem(idx, "price", Number(e.target.value))} />
              </div>
            ))}
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Issue Credit Note
          </button>
        </form>

        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/10">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">Recent Credit Notes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Note #</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading history...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={3} className="p-12 text-center text-muted-foreground">No returns recorded.</td></tr>
                ) : data.map((d, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="p-4 font-mono font-bold text-primary">{d.note_no}</td>
                    <td className="p-4 text-right font-bold">₹{d.total_amount.toLocaleString()}</td>
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

export default CreditNotePage;
