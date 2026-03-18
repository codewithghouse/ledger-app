import { useState, useEffect, useRef } from "react";
import { productsApi } from "@/lib/api";
import {
  Search, Plus, Loader2, Save, AlertTriangle,
  Pencil, Trash2, X, Check, Package, BarChart3,
  TrendingDown, DollarSign, Upload, Download, FileSpreadsheet
} from "lucide-react";
import { bulkApi } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["General", "Electronics", "Furniture", "Stationery", "Hardware", "Software", "Clothing", "Food", "Raw Material", "Other"];
const GST_OPTIONS = [0, 5, 12, 18, 28];

const defaultForm = { id: "", name: "", category: "General", price: 0, gst: 18, stock: 0, reorder_level: 5 };

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="glass-card rounded-xl p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const InventoryPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [inlineStock, setInlineStock] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [summary, setSummary] = useState({ total_products: 0, low_stock_count: 0, total_inventory_value: 0 });
  const stockInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (categoryFilter !== "All") params.category = categoryFilter;
      const res = await productsApi.list(params);
      setProducts(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await productsApi.summary();
      setSummary(res.data);
    } catch {}
  };

  useEffect(() => { fetchProducts(); }, [search, categoryFilter]);
  useEffect(() => { fetchSummary(); }, [products]);

  // --- CREATE ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await productsApi.create(formData);
      setIsDialogOpen(false);
      setFormData({ ...defaultForm });
      toast({ title: "✅ Product Added", description: `${formData.name} added to inventory` });
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Failed to add product", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // --- INLINE EDIT ROW ---
  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    try {
      await productsApi.update(editingId!, editForm);
      toast({ title: "✅ Updated", description: "Product updated successfully" });
      setEditingId(null);
      fetchProducts();
    } catch {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  };

  // --- INLINE STOCK EDIT ---
  const startStockEdit = (p: any) => {
    setEditingStockId(p.id);
    setInlineStock(p.stock);
    setTimeout(() => stockInputRef.current?.select(), 50);
  };

  const saveStock = async (productId: string) => {
    try {
      await productsApi.updateStock(productId, inlineStock);
      toast({ title: "✅ Stock Updated" });
      setEditingStockId(null);
      fetchProducts();
    } catch {
      toast({ title: "Error", description: "Failed to update stock", variant: "destructive" });
    }
  };

  // --- DELETE ---
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await productsApi.delete(id);
      toast({ title: "🗑️ Deleted", description: "Product removed from inventory" });
      fetchProducts();
    } catch {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  // --- EXPORT CSV ---
  const exportCSV = () => {
    const headers = ["ID", "Name", "Category", "Price", "GST", "Stock", "reorder_level"];
    const rows = products.map(p => [p.id, p.name, p.category, p.price, p.gst, p.stock, p.reorder_level]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inventory_template.csv"; a.click();
    toast({ title: "📥 Template Downloaded", description: "Use this format for bulk upload" });
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      await bulkApi.upload(file, "products");
      toast({ title: "✅ Success", description: "Bulk inventory updated from Excel" });
      fetchProducts();
    } catch {
      toast({ title: "Error", description: "Invalid Excel format. Make sure columns match.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const allCategories = ["All", ...CATEGORIES];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" /> Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your products, stock levels, and pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors border border-success/20 cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Import Excel
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleExcelUpload} />
          </label>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-sm font-medium hover:text-foreground transition-colors border border-border">
            <Download className="w-4 h-4" /> Template
          </button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle className="text-foreground text-lg font-bold">➕ Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Item ID *</label>
                    <input required value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
                      placeholder="P-001" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category *</label>
                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Samsung TV 55&quot;" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unit Price (₹) *</label>
                    <input type="number" min="0" required value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">GST %</label>
                    <select value={formData.gst} onChange={e => setFormData({ ...formData, gst: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      {GST_OPTIONS.map(v => <option key={v} value={v}>{v}%</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Opening Stock</label>
                    <input type="number" min="0" value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reorder Level</label>
                    <input type="number" min="0" value={formData.reorder_level}
                      onChange={e => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {submitting ? "Adding..." : "Add to Inventory"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Total Products" value={summary.total_products} color="bg-primary/10 text-primary" />
        <StatCard icon={TrendingDown} label="Low Stock Alerts" value={summary.low_stock_count} color="bg-destructive/10 text-destructive" />
        <StatCard icon={DollarSign} label="Inventory Value" value={`₹${summary.total_inventory_value.toLocaleString("en-IN")}`} color="bg-success/10 text-success" />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Excel-style editable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Product Name</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price (₹)</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">GST</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stock</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p>Scanning warehouse...</p>
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8} className="p-12 text-center">
                  <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No products found. Add your first product!</p>
                </td></tr>
              ) : products.map((p) => {
                const lowStock = p.stock <= (p.reorder_level ?? 5);
                const isEditing = editingId === p.id;
                const isEditingStock = editingStockId === p.id;

                return (
                  <tr key={p.id} className={`border-b border-border/30 transition-colors ${isEditing ? "bg-primary/5" : "hover:bg-muted/30"}`}>
                    {/* ID */}
                    <td className="p-3 font-mono text-xs text-muted-foreground">{p.id}</td>

                    {/* Name — editable */}
                    <td className="p-3">
                      {isEditing ? (
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-foreground text-sm focus:outline-none" />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {lowStock && <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />}
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                      )}
                    </td>

                    {/* Category — editable */}
                    <td className="p-3">
                      {isEditing ? (
                        <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                          className="px-2 py-1 rounded bg-secondary border border-primary/50 text-foreground text-sm focus:outline-none">
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      ) : (
                        <span className="text-muted-foreground">{p.category}</span>
                      )}
                    </td>

                    {/* Price — editable */}
                    <td className="p-3 text-right font-mono">
                      {isEditing ? (
                        <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-28 px-2 py-1 rounded bg-secondary border border-primary/50 text-foreground text-sm text-right focus:outline-none" />
                      ) : (
                        <span className="text-foreground">₹{p.price.toLocaleString("en-IN")}</span>
                      )}
                    </td>

                    {/* GST — editable */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <select value={editForm.gst} onChange={e => setEditForm({ ...editForm, gst: Number(e.target.value) })}
                          className="px-2 py-1 rounded bg-secondary border border-primary/50 text-foreground text-sm focus:outline-none">
                          {GST_OPTIONS.map(v => <option key={v} value={v}>{v}%</option>)}
                        </select>
                      ) : (
                        <span className="text-muted-foreground font-mono">{p.gst}%</span>
                      )}
                    </td>

                    {/* Stock — inline click-to-edit */}
                    <td className="p-3 text-center">
                      {isEditingStock ? (
                        <div className="flex items-center justify-center gap-1">
                          <input ref={stockInputRef} type="number" value={inlineStock}
                            onChange={e => setInlineStock(Number(e.target.value))}
                            onKeyDown={e => { if (e.key === "Enter") saveStock(p.id); if (e.key === "Escape") setEditingStockId(null); }}
                            className="w-20 px-2 py-1 rounded bg-secondary border border-primary/50 text-foreground text-sm text-center focus:outline-none" />
                          <button onClick={() => saveStock(p.id)} className="text-success hover:text-success/80"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingStockId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startStockEdit(p)} title="Click to edit stock"
                          className={`font-bold font-mono cursor-pointer hover:underline transition-colors ${lowStock ? "text-destructive" : "text-success"}`}>
                          {p.stock}
                        </button>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${lowStock ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                        {lowStock ? "⚠ Low" : "✓ OK"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={saveEdit} title="Save" className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={cancelEdit} title="Cancel" className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => startEdit(p)} title="Edit" className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} title="Delete"
                            className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50">
                            {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && products.length > 0 && (
          <div className="p-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground bg-muted/10">
            <span>{products.length} products shown</span>
            <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Click stock number to edit inline • Click ✏️ to edit row</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
