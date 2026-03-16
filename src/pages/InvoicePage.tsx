import { useState, useMemo } from "react";
import { generateProducts, generateCustomers } from "@/lib/mock-data";
import { Plus, Trash2, Mic, MicOff, Printer } from "lucide-react";

const products = generateProducts();
const customers = generateCustomers();

interface InvoiceItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  gst: number;
}

const InvoicePage = () => {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const addItem = (productId: string) => {
    const p = products.find(pr => pr.id === productId);
    if (!p) return;
    const existing = items.find(i => i.productId === productId);
    if (existing) {
      setItems(items.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems([...items, { productId: p.id, name: p.name, qty: 1, price: p.price, gst: p.gst }]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems(items.map(i => i.productId === productId ? { ...i, qty } : i));
  };

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const totalGst = useMemo(() => items.reduce((s, i) => s + (i.price * i.qty * i.gst) / 100, 0), [items]);
  const grandTotal = subtotal + totalGst;

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript.toLowerCase();
      setVoiceText(text);
      // Try to parse "add N product_name"
      const match = text.match(/add\s+(\d+)\s+(.+)/);
      if (match) {
        const qty = parseInt(match[1]);
        const name = match[2].trim();
        const found = products.find(p => p.name.toLowerCase().includes(name));
        if (found) {
          const existing = items.find(i => i.productId === found.id);
          if (existing) {
            setItems(prev => prev.map(i => i.productId === found.id ? { ...i, qty: i.qty + qty } : i));
          } else {
            setItems(prev => [...prev, { productId: found.id, name: found.name, qty, price: found.price, gst: found.gst }]);
          }
        }
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
          <p className="text-sm text-muted-foreground">Generate a new sales invoice</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              listening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {listening ? "Stop" : "Voice Billing"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      {voiceText && (
        <div className="glass-card rounded-xl p-3 text-sm text-muted-foreground">
          🎤 Heard: "<span className="text-foreground">{voiceText}</span>"
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Customer & Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-xl p-4 md:p-5">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.address}</option>)}
            </select>
          </div>

          <div className="glass-card rounded-xl p-4 md:p-5">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Add Product</label>
            <select
              onChange={(e) => { addItem(e.target.value); e.target.value = ""; }}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              defaultValue=""
            >
              <option value="" disabled>Select product to add...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString()} (GST {p.gst}%)</option>)}
            </select>
          </div>

          {/* Invoice Items Table */}
          {items.length > 0 && (
            <div className="glass-card rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[600px] lg:min-w-0">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-muted-foreground font-medium">Product</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">Qty</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Price</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">GST</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.productId} className="border-b border-border/30">
                      <td className="p-4 text-foreground">{item.name}</td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateQty(item.productId, parseInt(e.target.value) || 1)}
                          min={1}
                          className="w-16 text-center py-1 rounded bg-secondary border border-border text-foreground text-sm focus:outline-none"
                        />
                      </td>
                      <td className="p-4 text-right mono text-muted-foreground">₹{item.price.toLocaleString()}</td>
                      <td className="p-4 text-right mono text-muted-foreground">{item.gst}%</td>
                      <td className="p-4 text-right mono font-medium text-foreground">₹{(item.price * item.qty * (1 + item.gst / 100)).toLocaleString()}</td>
                      <td className="p-4">
                        <button onClick={() => removeItem(item.productId)} className="text-destructive hover:opacity-70">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Totals */}
        <div className="glass-card rounded-xl p-4 md:p-5 h-fit lg:sticky lg:top-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Invoice Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="mono text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST</span>
              <span className="mono text-foreground">₹{Math.round(totalGst).toLocaleString("en-IN")}</span>
            </div>
            <div className="border-t border-border/50 pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Grand Total</span>
              <span className="mono text-xl font-bold text-primary">₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
