import { generateSales } from "@/lib/mock-data";
import { Search, Filter, Download } from "lucide-react";
import { useState, useMemo } from "react";

const sales = generateSales();

const statusStyles: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Partial: "bg-info/10 text-info",
};

const SalesRegisterPage = () => {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() =>
    sales.filter(s => s.invoiceNo.toLowerCase().includes(search.toLowerCase()) || s.customer.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales Register</h1>
          <p className="text-sm text-muted-foreground">{sales.length} transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-sm min-w-[800px] lg:min-w-0">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Invoice</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Customer</th>
                <th className="text-right p-4 text-muted-foreground font-medium">Amount</th>
                <th className="text-right p-4 text-muted-foreground font-medium">GST</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Payment</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map((s) => (
                <tr key={s.invoiceNo} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium text-foreground mono">{s.invoiceNo}</td>
                  <td className="p-4 text-muted-foreground">{s.date}</td>
                  <td className="p-4 text-foreground">{s.customer}</td>
                  <td className="p-4 text-right font-medium text-foreground mono">₹{s.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-right text-muted-foreground mono">₹{s.gstAmount.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-muted-foreground">{s.paymentMode}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[s.status] || ""}`}>
                      {s.status}
                    </span>
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
