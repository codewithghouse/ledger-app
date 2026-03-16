import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Wallet,
  CreditCard, Banknote, Landmark, IndianRupee
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import StatCard from "@/components/StatCard";
import {
  dashboardStats, monthlySalesData, expenseBreakdown, cashFlowData, aiInsights
} from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const COLORS = [
  "hsl(160,84%,39%)", "hsl(217,91%,60%)", "hsl(38,92%,50%)",
  "hsl(280,67%,54%)", "hsl(0,72%,51%)", "hsl(190,70%,50%)"
];

const insightIcons = { success: CheckCircle2, warning: AlertCircle, info: Info };
const insightStyles = {
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  info: "border-info/20 bg-info/5",
};
const insightTextStyles = { success: "text-success", warning: "text-warning", info: "text-info" };

const DashboardPage = () => {
  const { currentCompany } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{currentCompany?.name} — Financial Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
        <StatCard title="Total Sales" value={fmt(dashboardStats.totalSales)} icon={ShoppingCart} trend="+12%" trendUp variant="success" />
        <StatCard title="Purchases" value={fmt(dashboardStats.totalPurchases)} icon={Package} trend="+8%" trendUp variant="info" />
        <StatCard title="Net Profit" value={fmt(dashboardStats.netProfit)} icon={TrendingUp} trend="+18%" trendUp variant="success" />
        <StatCard title="Receivables" value={fmt(dashboardStats.receivables)} icon={Wallet} trend="+23%" trendUp={false} variant="warning" />
        <StatCard title="Payables" value={fmt(dashboardStats.payables)} icon={CreditCard} variant="destructive" />
        <StatCard title="Cash in Hand" value={fmt(dashboardStats.cashInHand)} icon={Banknote} variant="default" />
        <StatCard title="Bank Balance" value={fmt(dashboardStats.bankBalance)} icon={Landmark} variant="info" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Sales & Purchases</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,20%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222,30%,12%)", border: "1px solid hsl(222,20%,20%)", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="sales" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="purchases" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlySalesData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160,84%,39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,20%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222,30%,12%)", border: "1px solid hsl(222,20%,20%)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="profit" stroke="hsl(160,84%,39%)" fill="url(#profitGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cash Flow</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,20%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(220,9%,46%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(222,30%,12%)", border: "1px solid hsl(222,20%,20%)", borderRadius: 8, color: "#fff" }} />
              <Line type="monotone" dataKey="inflow" stroke="hsl(160,84%,39%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="outflow" stroke="hsl(0,72%,51%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {expenseBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222,30%,12%)", border: "1px solid hsl(222,20%,20%)", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {expenseBreakdown.map((e, i) => (
              <span key={e.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {e.name}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">AI Insights</h3>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => {
              const Icon = insightIcons[insight.type];
              return (
                <div key={i} className={`flex gap-3 p-3 rounded-lg border ${insightStyles[insight.type]}`}>
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${insightTextStyles[insight.type]}`} />
                  <p className="text-xs text-foreground leading-relaxed">{insight.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
