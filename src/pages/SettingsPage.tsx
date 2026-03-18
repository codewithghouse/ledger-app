import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import { Building2, Save, Loader2, UserCircle } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const { currentCompany, logout, updateCompanyName } = useAuth();
  const [name, setName] = useState(currentCompany?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;

    setLoading(true);
    try {
      await authApi.updateProfile({ 
        company_id: currentCompany.id, 
        name 
      });
      // Update sidebar & everywhere instantly (no refresh needed!)
      updateCompanyName(name);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary/10">
          <UserCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">Manage your business identity and settings</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-border/50 shadow-xl bg-card">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your company name"
                className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              />
              <p className="text-xs text-muted-foreground">
                This name will appear on all invoices and reports.
              </p>
            </div>

            <div className="grid gap-2 opacity-60">
              <label className="text-sm font-semibold">Admin Email</label>
              <input
                value={currentCompany?.adminEmail || ""}
                disabled
                className="w-full p-3 rounded-xl bg-secondary border border-border cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground italic">
                Email is linked to your Google Account and cannot be changed here.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>

            <button
              type="button"
              onClick={logout}
              className="text-destructive font-medium hover:underline px-4"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>

      <div className="p-6 rounded-3xl bg-secondary/20 border border-border/50 text-sm text-muted-foreground space-y-2">
        <h3 className="font-bold text-foreground">Next Updates:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Custom business logo upload</li>
          <li>Multiple branch management</li>
          <li>Currency and tax preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
