import { Brain, TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";
import { aiInsights, monthlySalesData, generateProducts } from "@/lib/mock-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const products = generateProducts();
const topProducts = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5);

// Simulated forecast data
const forecastData = monthlySalesData.map((d, i) => ({
  ...d,
  forecast: d.sales + Math.floor(Math.random() * 50000) + i * 10000,
}));

const AIInsightsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
          <p className="text-sm text-muted-foreground">Predictive analytics & smart recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Forecast */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Sales Forecast (Next 90 Days)</h3>
          <p className="text-xs text-muted-foreground mb-4">Based on historical trends & seasonal patterns</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,20%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222,30%,12%)", border: "1px solid hsl(222,20%,20%)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="sales" stroke="hsl(160,84%,39%)" fill="none" strokeWidth={2} />
              <Area type="monotone" dataKey="forecast" stroke="hsl(217,91%,60%)" fill="url(#forecastGrad)" strokeWidth={2} strokeDasharray="6 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Predicted Products */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Predicted Best Sellers</h3>
          <p className="text-xs text-muted-foreground mb-4">ML-predicted top products for next quarter</p>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category} — ₹{p.price.toLocaleString()}</p>
                </div>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                  High demand
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Insights */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Smart Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, i) => {
            const icons = { success: Lightbulb, warning: AlertTriangle, info: BarChart3 };
            const styles = {
              success: "border-success/20 bg-success/5",
              warning: "border-warning/20 bg-warning/5",
              info: "border-info/20 bg-info/5",
            };
            const iconStyles = { success: "text-success", warning: "text-warning", info: "text-info" };
            const Icon = icons[insight.type];
            return (
              <div key={i} className={`flex gap-3 p-4 rounded-lg border ${styles[insight.type]}`}>
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconStyles[insight.type]}`} />
                <p className="text-sm text-foreground">{insight.message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;
