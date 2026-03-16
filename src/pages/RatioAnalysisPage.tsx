import { ratios } from "@/lib/mock-data";

const ratioItems = [
  { name: "Current Ratio", value: ratios.currentRatio, suffix: ":1", ideal: "2:1", color: "text-success" },
  { name: "Quick Ratio", value: ratios.quickRatio, suffix: ":1", ideal: "1:1", color: "text-success" },
  { name: "Gross Profit Ratio", value: ratios.grossProfitRatio, suffix: "%", ideal: ">30%", color: "text-success" },
  { name: "Net Profit Ratio", value: ratios.netProfitRatio, suffix: "%", ideal: ">15%", color: "text-success" },
  { name: "Debt-Equity Ratio", value: ratios.debtEquityRatio, suffix: ":1", ideal: "<1:1", color: "text-success" },
  { name: "Inventory Turnover", value: ratios.inventoryTurnover, suffix: "x", ideal: ">5x", color: "text-success" },
];

const RatioAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ratio Analysis</h1>
        <p className="text-sm text-muted-foreground">Key financial ratios and health indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratioItems.map((r) => (
          <div key={r.name} className="glass-card rounded-xl p-5 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">{r.name}</p>
            <p className={`text-3xl font-bold mono ${r.color}`}>{r.value}{r.suffix}</p>
            <p className="text-xs text-muted-foreground mt-2">Ideal: {r.ideal}</p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.min((r.value / (r.suffix === "%" ? 50 : 3)) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatioAnalysisPage;
