import { useState, useEffect } from "react";
import { customersApi, bulkApi } from "@/lib/api";
import {
  Search, Plus, Loader2, Save, User, 
  Pencil, Trash2, X, Check, Users, 
  TrendingUp, Download, Phone, MapPin, Mail, CreditCard, FileSpreadsheet
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

const CustomersPage = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [summary, setSummary] = useState({ total_customers: 0, total_outstanding: 0 });

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customersApi.list({ search });
      setCustomers(res.data);
    } catch {
      toast({ title: "Error", description: "Failed to load customers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await customersApi.summary();
      setSummary(res.data);
    } catch {}
  };

  useEffect(() => { fetchCustomers(); }, [search]);
  useEffect(() => { fetchSummary(); }, [customers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await customersApi.create(formData);
      setIsDialogOpen(false);
      setFormData({ ...defaultForm });
      toast({ title: "✅ Customer Added", description: `${formData.name} added successfully` });
      fetchCustomers();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.detail || "Failed to add customer", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: any) => { setEditingId(c.id); setEditForm({ ...c }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async () => {
    try {
      await customersApi.update(editingId!, editForm);
      toast({ title: "✅ Updated", description: "Customer details updated" });
      setEditingId(null);
      fetchCustomers();
    } catch {
      toast({ title: "Error", description: "Failed to update customer", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the customer and their history.")) return;
    setDeletingId(id);
    try {
      await customersApi.delete(id);
      toast({ title: "🗑️ Deleted", description: "Customer removed" });
      fetchCustomers();
    } catch {
      toast({ title: "Error", description: "Failed to delete customer", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await bulkApi.upload(file, "customers");
      toast({ title: "✅ Success", description: "Customers directory updated" });
      fetchCustomers();
    } catch {
      toast({ title: "Error", description: "Failed to process Excel", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const exportCSV = () => {
    const headers = ["id", "name", "phone", "email", "address", "outstanding_balance"];
    const rows = customers.map(c => [c.id, c.name, c.phone, c.email, c.address, c.outstanding_balance]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers_template.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Customers
          </h1>
          <p className="text-sm text-muted-foreground">Manage your client directory and receivables</p>
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
                <Plus className="w-4 h-4" /> Add Customer
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50 bg-background/95 backdrop-blur-xl sm:max-w-[500px]">
              <DialogHeader><DialogTitle>➕ Add New Customer</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Customer ID *</label>
                    <input required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="CUST-001" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phone Number *</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Address</label>
                  <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address..." className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm min-h-[80px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Initial Outstanding (₹)</label>
                  <input type="number" value={formData.outstanding_balance} onChange={e => setFormData({...formData, outstanding_balance: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Customer
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={Users} label="Total Customers" value={summary.total_customers} color="bg-primary/10 text-primary" />
        <StatCard icon={TrendingUp} label="Total Receivables" value={`₹${summary.total_outstanding.toLocaleString("en-IN")}`} color="bg-destructive/10 text-destructive" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Customer Details</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Contact</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Address</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Outstanding (₹)</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" /> Loading directory...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No customers found</td></tr>
              ) : customers.map((c) => {
                const isEditing = editingId === c.id;
                return (
                  <tr key={c.id} className={`border-b border-border/30 hover:bg-muted/30 ${isEditing ? "bg-primary/5" : ""}`}>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-sm" />
                      ) : (
                        <div className="font-medium text-foreground">{c.name}</div>
                      )}
                    </td>
                    <td className="p-3 space-y-1">
                      {isEditing ? (
                        <>
                          <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-xs mb-1" placeholder="Phone" />
                          <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-xs" placeholder="Email" />
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {c.phone}</div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {c.email || "N/A"}</div>
                        </>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-2 py-1 rounded bg-secondary border border-primary/50 text-xs" />
                      ) : (
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground max-w-[200px] truncate"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {c.address}</div>
                      )}
                    </td>
                    <td className={`p-3 text-right font-mono font-bold ${c.outstanding_balance > 0 ? "text-destructive" : "text-success"}`}>
                      {isEditing ? (
                        <input type="number" value={editForm.outstanding_balance} onChange={e => setEditForm({ ...editForm, outstanding_balance: Number(e.target.value) })} className="w-24 px-2 py-1 rounded bg-secondary border border-primary/50 text-sm text-right font-mono" />
                      ) : (
                        `₹${c.outstanding_balance.toLocaleString("en-IN")}`
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
                            <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><Trash2 className="w-3.5 h-3.5" /></button>
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

export default CustomersPage;
