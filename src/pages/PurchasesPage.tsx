import { useState, useEffect } from "react";
import { purchasesApi, vendorsApi, productsApi } from "@/lib/api";
import { 
  Search, Plus, Loader2, FileText, ShoppingBag, 
  Calendar, Download, Truck, DollarSign,
  PlusCircle, Trash2, Save
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const PurchasesPage = () => {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    purchase_no: `PUR-${Date.now().toString().slice(-6)}`,
    vendor_id: "",
    vendor_name: "",
    items: [{ product_id: "", name: "", qty: 1, price: 0 }],
    payment_mode: "Cash",
    status: "Received"
  });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await purchasesApi.list({ search });
      setPurchases(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load purchases", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [vRes, pRes] = await Promise.all([vendorsApi.list(), productsApi.list()]);
      setVendors(vRes.data);
      setProducts(pRes.data);
    } catch {}
  };

  useEffect(() => { fetchPurchases(); }, [search]);
  useEffect(() => { if (isDialogOpen) fetchData(); }, [isDialogOpen]);

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    if (field === "product_id") {
      const p = products.find(x => x.id === value);
      newItems[index] = { ...newItems[index], product_id: value, name: p?.name || "", price: p?.price || 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor_id) return toast({ title: "Error", description: "Select a vendor" });
    
    setSubmitting(true);
    try {
      const total = formData.items.reduce((acc, it) => acc + (it.qty * it.price), 0);
      const vendor = vendors.find(v => v.id === formData.vendor_id);
      const payload = { ...formData, vendor_name: vendor?.name || "", total_amount: total, date: new Date().toISOString() };
      
      await purchasesApi.create(payload);
      setIsDialogOpen(false);
      setFormData({
        purchase_no: `PUR-${Date.now().toString().slice(-6)}`,
        vendor_id: "",
        vendor_name: "",
        items: [{ product_id: "", name: "", qty: 1, price: 0 }],
        payment_mode: "Cash",
        status: "Received"
      });
      toast({ title: "✅ Success", description: "Purchase recorded and stock increased" });
      fetchPurchases();
    } catch {
      toast({ title: "Error", description: "Failed to save purchase", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" /> Purchase Register
          </h1>
          <p className="text-sm text-muted-foreground">Track inventory intake and payables</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" /> Record Purchase
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>📥 Log Purchase Transaction</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Purchase #</label>
                  <input readOnly value={formData.purchase_no} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Vendor *</label>
                  <select required value={formData.vendor_id} onChange={e => setFormData({...formData, vendor_id: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                    <option value="">Select Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between"><label className="text-xs font-semibold text-muted-foreground uppercase">Items Purchased</label></div>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                    <select className="col-span-6 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.product_id} onChange={e => updateItem(idx, "product_id", e.target.value)}>
                      <option value="">Select Product to Refill</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" placeholder="Qty" className="col-span-2 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} />
                    <input type="number" placeholder="Rate" className="col-span-3 px-2 py-1.5 rounded bg-secondary border border-border text-xs" value={item.price} onChange={e => updateItem(idx, "price", Number(e.target.value))} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Record Entry
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Purchase #</th>
                <th className="text-left p-4 text-xs font-bold text-muted-foreground uppercase">Vendor</th>
                <th className="text-right p-4 text-xs font-bold text-muted-foreground uppercase">Amount (₹)</th>
                <th className="text-center p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading ledger...</td></tr>
              ) : purchases.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-muted-foreground">No purchases recorded.</td></tr>
              ) : purchases.map((p, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-4 font-mono font-bold text-primary">{p.purchase_no}</td>
                  <td className="p-4 font-medium">{p.vendor_name}</td>
                  <td className="p-4 text-right font-bold font-mono text-foreground">₹{p.total_amount?.toLocaleString()}</td>
                  <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasesPage;
