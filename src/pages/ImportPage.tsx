import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload, FileSpreadsheet, CheckCircle2, AlertCircle,
  Download, ChevronRight, Loader2, X, Info
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface SheetSummary {
  imported: number;
  skipped?: number;
}
interface ImportResult {
  message: string;
  total_imported: number;
  summary: Record<string, SheetSummary>;
  errors: string[];
}

const SHEET_INFO = [
  { sheet: "Products",        color: "#6366f1", desc: "Inventory items" },
  { sheet: "Customers",       color: "#0ea5e9", desc: "Customer master" },
  { sheet: "Vendors",         color: "#10b981", desc: "Vendor master" },
  { sheet: "Sales",           color: "#f59e0b", desc: "Sales transactions" },
  { sheet: "Purchases",       color: "#ef4444", desc: "Purchase transactions" },
  { sheet: "Journals",        color: "#8b5cf6", desc: "Journal entries" },
  { sheet: "Sales Orders",    color: "#f97316", desc: "Sales order records" },
  { sheet: "Purchase Orders", color: "#ec4899", desc: "Purchase order records" },
];

const TEMPLATE_COLUMNS: Record<string, string[]> = {
  Products:        ["id", "name", "category", "price", "gst", "stock", "reorder_level"],
  Customers:       ["id", "name", "phone", "address", "email", "gstin", "outstanding_balance"],
  Vendors:         ["id", "name", "phone", "address", "email", "gstin", "outstanding_balance"],
  Sales:           ["invoice_no", "date", "customer_id", "customer_name", "subtotal", "gst_amount", "total_amount", "payment_mode", "status"],
  Purchases:       ["purchase_no", "date", "vendor_id", "vendor_name", "subtotal", "gst_amount", "total_amount", "payment_mode", "status"],
  Journals:        ["journal_no", "date", "description", "debit_account", "credit_account", "amount"],
  "Sales Orders":  ["order_no", "date", "customer_id", "customer_name", "total_amount", "status"],
  "Purchase Orders":["order_no", "date", "vendor_id", "vendor_name", "total_amount", "status"],
};

export default function ImportPage() {
  const { token } = useAuth() as any;
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<ImportResult | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith(".xlsx")) {
      setFile(dropped);
      setResult(null);
      setError(null);
    } else {
      setError("Please upload a valid .xlsx file.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.endsWith(".xlsx")) {
      setFile(selected);
      setResult(null);
      setError(null);
    } else {
      setError("Please upload a valid .xlsx file.");
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/api/import/excel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Import failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, padding: "0.6rem", display:"flex" }}>
              <FileSpreadsheet size={24} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
              Excel Import
            </h1>
          </div>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
            Upload one Excel file — all modules get populated automatically ✨
          </p>
        </div>

        {/* ── Sheet Info Cards ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "0.75rem", marginBottom: "1.75rem"
        }}>
          {SHEET_INFO.map(({ sheet, color, desc }) => (
            <div key={sheet} style={{
              background: "#1e293b", border: `1px solid ${color}30`,
              borderRadius: 12, padding: "0.85rem 1rem",
              borderLeft: `3px solid ${color}`,
            }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#f1f5f9" }}>{sheet}</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#64748b" }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Drag & Drop Zone ── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#6366f1" : file ? "#10b981" : "#334155"}`,
            borderRadius: 16,
            background: dragging ? "#6366f115" : file ? "#10b98110" : "#1e293b",
            padding: "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.25s ease",
            marginBottom: "1.25rem",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {file ? (
            <>
              <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: "1rem" }} />
              <p style={{ color: "#10b981", fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>{file.name}</p>
              <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                {(file.size / 1024).toFixed(1)} KB · Click to change file
              </p>
            </>
          ) : (
            <>
              <Upload size={48} color="#4f6275" style={{ marginBottom: "1rem" }} />
              <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: "1.05rem", margin: 0 }}>
                Drag & Drop your Excel file here
              </p>
              <p style={{ color: "#475569", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                or click to browse · Only .xlsx files
              </p>
            </>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#ef444415", border: "1px solid #ef4444",
            borderRadius: 10, padding: "0.85rem 1rem", display: "flex",
            alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem"
          }}>
            <AlertCircle size={18} color="#ef4444" />
            <span style={{ color: "#fca5a5", fontSize: "0.9rem" }}>{error}</span>
            <X size={16} color="#ef4444" style={{ marginLeft: "auto", cursor:"pointer" }} onClick={() => setError(null)} />
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          <button
            onClick={handleImport}
            disabled={!file || loading}
            style={{
              background: (!file || loading) ? "#1e293b" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: (!file || loading) ? "#475569" : "#fff",
              border: "none", borderRadius: 10,
              padding: "0.75rem 1.75rem",
              fontWeight: 700, fontSize: "0.95rem",
              cursor: (!file || loading) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.2s",
            }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={18} />}
            {loading ? "Importing..." : "Import Now"}
          </button>

          <button
            onClick={() => setShowTemplate(!showTemplate)}
            style={{
              background: "#1e293b", color: "#94a3b8",
              border: "1px solid #334155", borderRadius: 10,
              padding: "0.75rem 1.25rem",
              fontWeight: 600, fontSize: "0.9rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
            }}
          >
            <Info size={16} />
            {showTemplate ? "Hide" : "Show"} Column Guide
          </button>
        </div>

        {/* ── Column Guide ── */}
        {showTemplate && (
          <div style={{
            background: "#1e293b", border: "1px solid #334155",
            borderRadius: 14, padding: "1.25rem", marginBottom: "1.75rem"
          }}>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Download size={18} color="#6366f1" /> Column Guide (Use exact sheet names)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1rem" }}>
              {Object.entries(TEMPLATE_COLUMNS).map(([sheet, cols]) => (
                <div key={sheet} style={{
                  background: "#0f172a", borderRadius: 10, padding: "0.85rem 1rem",
                  border: "1px solid #1e293b"
                }}>
                  <p style={{ margin: "0 0 0.5rem", fontWeight: 700, color: "#a5b4fc", fontSize: "0.85rem" }}>
                    📋 Sheet: <span style={{ color: "#e2e8f0" }}>{sheet}</span>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {cols.map(col => (
                      <span key={col} style={{
                        background: "#1e293b", color: "#94a3b8",
                        padding: "0.2rem 0.5rem", borderRadius: 5, fontSize: "0.72rem",
                        fontFamily: "monospace"
                      }}>{col}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              background: "#0f172a", borderRadius: 8, padding: "0.75rem 1rem",
              marginTop: "1rem", border: "1px solid #1e293b"
            }}>
              <p style={{ margin: 0, color: "#f59e0b", fontSize: "0.82rem" }}>
                ⚠️ <strong>Important Order:</strong> Always fill <strong>Products → Customers → Vendors</strong> first, then <strong>Sales & Purchases</strong>. Duplicate IDs will be skipped automatically.
              </p>
            </div>
          </div>
        )}

        {/* ── Result Summary ── */}
        {result && (
          <div style={{
            background: "#1e293b", border: "1px solid #10b981",
            borderRadius: 16, padding: "1.5rem", animation: "fadeIn 0.4s ease"
          }}>
            {/* Success header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                background: "#10b98120", borderRadius: 10, padding: "0.5rem",
                display: "flex", alignItems: "center"
              }}>
                <CheckCircle2 size={24} color="#10b981" />
              </div>
              <div>
                <h3 style={{ margin: 0, color: "#10b981", fontWeight: 800, fontSize: "1.1rem" }}>
                  Import Successful!
                </h3>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>{result.message}</p>
              </div>
              <span style={{
                marginLeft: "auto", background: "#10b98120",
                color: "#10b981", fontWeight: 800, fontSize: "1.5rem",
                padding: "0.3rem 1rem", borderRadius: 10
              }}>
                {result.total_imported}
              </span>
            </div>

            {/* Sheet breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {Object.entries(result.summary).map(([sheet, stats]) => {
                const info = SHEET_INFO.find(s => s.sheet === sheet);
                return (
                  <div key={sheet} style={{
                    background: "#0f172a", borderRadius: 10,
                    padding: "0.85rem 1rem",
                    borderLeft: `3px solid ${info?.color || "#6366f1"}`
                  }}>
                    <p style={{ margin: 0, fontWeight: 700, color: "#e2e8f0", fontSize: "0.85rem" }}>{sheet}</p>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.35rem" }}>
                      <span style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 600 }}>
                        ✅ {stats.imported} imported
                      </span>
                      {stats.skipped !== undefined && stats.skipped > 0 && (
                        <span style={{ color: "#f59e0b", fontSize: "0.8rem" }}>
                          ⚠️ {stats.skipped} skipped
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Errors */}
            {result.errors?.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ color: "#f87171", fontWeight: 600, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
                  ⚠️ Some rows had issues:
                </p>
                {result.errors.map((e, i) => (
                  <p key={i} style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0.2rem 0" }}>• {e}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
