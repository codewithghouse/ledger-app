import { useState, useEffect } from "react";
import { vendorsApi, bulkApi } from "@/lib/api";
import { 
  Building2, Search, Plus, Loader2, Save, 
  Pencil, Trash2, X, Check, Truck, 
  TrendingDown, Download, Phone, MapPin, Mail, FileSpreadsheet
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const defaultForm = { id: "", name: "", phone: "", email: "", address: "", outstanding_balance: 0 };

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

const VendorsPage = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [summary, setSummary] = useState({ total_vendors: 0, total_payables: 0 });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await vendorsApi.list({ search });
      setVendors(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load vendors", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await vendorsApi.summary();
      setSummary(res.data);
    } catch {}
  };

  useEffect(() => { fetchVendors(); }, [search]);
  useEffect(() => { fetchSummary(); }, [vendors]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await vendorsApi.create(formData);
      setIsDialogOpen(false);
      setFormData({ ...defaultForm });
      toast({ title: "✅ Vendor Added", description: `${formData.name} added successfully` });
      fetchVendors();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Failed to add vendor", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (v: any) => { setEditingId(v.id); setEditForm({ ...v }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    try {
      await vendorsApi.update(editingId!, editForm);
      toast({ title: "✅ Updated", description: "Vendor details updated" });
      setEditingId(null);
      fetchVendors();
    } catch {
      toast({ title: "Error", description: "Failed to update vendor", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      await vendorsApi.delete(id);
      toast({ title: "🗑️ Deleted", description: "Vendor removed" });
      fetchVendors();
    } catch {
      toast({ title: "Error", description: "Failed to delete vendor", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await bulkApi.upload(file, "vendors");
      toast({ title: "✅ Success", description: "Vendors directory updated" });
      fetchVendors();
    } catch {
      toast({ title: "Error", description: "Failed to process Excel", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const exportCSV = () => {
    const headers = ["id", "name", "phone", "email", "address", "outstanding_balance"];
    const rows = vendors.map(v => [v.id, v.name, v.phone, v.email, v.address, v.outstanding_balance]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vendors_template.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> Vendors
          </h1>
          <p className="text-sm text-muted-foreground">Manage suppliers and payables</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors border border-success/20 cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" /> Import Excel
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleExcelUpload} />
          </label>
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-sm font-medium hover:text-foreground border border-border">
            <Download className="w-4 h-4" /> Template
          </button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> Add Vendor
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-[500px]">
              <DialogHeader><DialogTitle>➕ Add New Vendor</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Vendor ID *</label>
                    <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="VND-001" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phone *</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Vendor Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Supplier Name" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Payable Balance (₹)</label>
                  <input type="number" value={formData.outstanding_balance} onChange={e => setFormData({...formData, outstanding_balance: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Vendor
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={Building2} label="Total Vendors" value={summary.total_vendors} color="bg-primary/10 text-primary" />
        <StatCard icon={TrendingDown} label="Total Payables" value={`₹${summary.total_payables.toLocaleString("en-IN")}`} color="bg-warning/10 text-warning" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor name..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Vendor Name</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Contact</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Address</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Payable (₹)</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading vendors...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No vendors found</td></tr>
              ) : vendors.map((v) => {
                const isEditing = editingId === v.id;
                return (
                  <tr key={v.id} className={`border-b border-border/30 hover:bg-muted/30 ${isEditing ? "bg-primary/5" : ""}`}>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{v.id}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-sm" />
                      ) : (
                        <div className="font-medium text-foreground">{v.name}</div>
                      )}
                    </td>
                    <td className="p-3 space-y-1">
                      {isEditing ? (
                        <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-xs" />
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {v.phone}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-xs" />
                      ) : (
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground max-w-[200px] truncate"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {v.address || "N/A"}</div>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-warning">
                      {isEditing ? (
                        <input type="number" value={editForm.outstanding_balance} onChange={e => setEditForm({ ...editForm, outstanding_balance: Number(e.target.value) })} className="w-24 px-2 py-1 rounded bg-secondary border border-primary/50 text-sm text-right font-mono" />
                      ) : (
                        `₹${v.outstanding_balance?.toLocaleString("en-IN")}`
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button onClick={saveEdit} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-muted text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(v)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="w-3.5 h-3.5" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
