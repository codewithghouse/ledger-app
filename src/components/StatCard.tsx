import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "default" | "success" | "warning" | "info" | "destructive";
}

const variantStyles = {
  default: "border-border/50",
  success: "border-success/20 hover:border-success/40",
  warning: "border-warning/20 hover:border-warning/40",
  info: "border-info/20 hover:border-info/40",
  destructive: "border-destructive/20 hover:border-destructive/40",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) => {
  return (
    <div className={`stat-card animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-card-foreground mono">{value}</p>
    </div>
  );
};

export default StatCard;
