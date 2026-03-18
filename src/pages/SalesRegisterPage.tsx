import { useState, useEffect } from "react";
import { salesApi, customersApi, productsApi } from "@/lib/api";
import { 
  Search, Plus, Loader2, FileText, ShoppingCart, 
  Calendar, Download, User as UserIcon, DollarSign,
  PlusCircle, Trash2, Tag, Percent, Save
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const SalesRegisterPage = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data for selectors
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    invoice_no: `INV-${Date.now().toString().slice(-6)}`,
    customer_id: "",
    customer_name: "",
    items: [{ product_id: "", name: "", qty: 1, price: 0, gst: 18 }],
    payment_mode: "Cash",
    status: "Paid"
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await salesApi.list({ search });
      setSales(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load sales register", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([customersApi.list(), productsApi.list()]);
      setCustomers(cRes.data);
      setProducts(pRes.data);
    } catch {}
  };

  useEffect(() => { fetchSales(); }, [search]);
  useEffect(() => { if (isDialogOpen) fetchData(); }, [isDialogOpen]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: "", name: "", qty: 1, price: 0, gst: 18 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    if (field === "product_id") {
      const p = products.find(x => x.id === value);
      newItems[index] = { ...newItems[index], product_id: value, name: p?.name || "", price: p?.price || 0, gst: p?.gst || 18 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((acc, it) => acc + (it.qty * it.price), 0);
    const gstTotal = formData.items.reduce((acc, it) => acc + (it.qty * it.price * it.gst / 100), 0);
    return { subtotal, gst_amount: gstTotal, total_amount: subtotal + gstTotal };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) return toast({ title: "Missing Info", description: "Please select a customer" });
    
    setSubmitting(true);
    try {
      const totals = calculateTotals();
      const customer = customers.find(c => c.id === formData.customer_id);
      const payload = {
        ...formData,
        customer_name: customer?.name || "",
        ...totals,
        date: new Date().toISOString()
      };
      
      await salesApi.create(payload);
      setIsDialogOpen(false);
      setFormData({
        invoice_no: `INV-${Date.now().toString().slice(-6)}`,
        customer_id: "",
        customer_name: "",
        items: [{ product_id: "", name: "", qty: 1, price: 0, gst: 18 }],
        payment_mode: "Cash",
        status: "Paid"
      });
      toast({ title: "✅ Sale Recorded", description: "Inventory and balances updated" });
      fetchSales();
    } catch {
      toast({ title: "Error", description: "Failed to save sale", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" /> Sales Register
          </h1>
          <p className="text-sm text-muted-foreground">Log transactions and monitor revenue</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> New Sale (Invoice)
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>🛒 Record New Sale</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Invoice #</label>
                  <input readOnly value={formData.invoice_no} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm opacity-70" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Customer *</label>
                  <select required value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Line Items</label>
                  <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 text-primary hover:underline font-bold">
                    <PlusCircle className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-muted/30 p-2 rounded-lg border border-border/50">
                      <div className="col-span-4 space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase">Product</label>
                        <select required value={item.product_id} onChange={e => updateItem(idx, "product_id", e.target.value)} className="w-full px-2 py-1.5 rounded-md bg-secondary border border-border text-xs">
                          <option value="">Select Item</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase">Qty</label>
                        <input type="number" min="1" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} className="w-full px-2 py-1.5 rounded-md bg-secondary border border-border text-xs text-center" />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase">Rate (₹)</label>
                        <input type="number" value={item.price} onChange={e => updateItem(idx, "price", Number(e.target.value))} className="w-full px-2 py-1.5 rounded-md bg-secondary border border-border text-xs text-right" />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase">Total</label>
                        <div className="bg-muted px-2 py-1.5 rounded-md text-xs text-right font-mono">₹{item.qty * item.price}</div>
                      </div>
                      <div className="col-span-1 pb-1 flex justify-center">
                        <button type="button" onClick={() => removeItem(idx)} className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Payment Mode</label>
                    <div className="flex gap-2">
                      {["Cash", "Bank", "UPI", "Credit"].map(mode => (
                        <button key={mode} type="button" onClick={() => setFormData({...formData, payment_mode: mode})} 
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${formData.payment_mode === mode ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-muted"}`}>
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Subtotal</span> <span className="font-mono">₹{calculateTotals().subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-muted-foreground"><span>GST Total</span> <span className="font-mono">₹{calculateTotals().gst_amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-primary/20"><span>Total Amount</span> <span className="font-mono text-primary">₹{calculateTotals().total_amount.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {submitting ? "Saving..." : "Generate Invoice"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice or customer..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary border border-border">Total: {sales.length} records found</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Invoice #</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase">Amount (₹)</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Payment</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading sales journal...</td></tr>
              ) : sales.length === 0 ? (
                <tr><td colSpan={7} className="p-20 text-center"><FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" /><p className="text-muted-foreground">No sales recorded yet. Click "New Sale" to begin.</p></td></tr>
              ) : sales.map((s, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors group">
                  <td className="p-4 text-muted-foreground"><div className="flex flex-col"><span className="text-foreground font-medium">{new Date(s.date).toLocaleDateString()}</span><span className="text-[10px] uppercase font-bold">{new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div></td>
                  <td className="p-4 font-mono font-bold text-primary">{s.invoice_no}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{s.customer_name[0]}</div>
                      <span className="font-medium text-foreground">{s.customer_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold font-mono text-foreground">₹{s.total_amount.toLocaleString()}</td>
                  <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold uppercase">{s.payment_mode}</span></td>
                  <td className="p-4 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${s.status === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{s.status}</span></td>
                  <td className="p-4 text-center">
                    <button className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Print Invoice"><FileText className="w-4 h-4" /></button>
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

export default SalesRegisterPage;
