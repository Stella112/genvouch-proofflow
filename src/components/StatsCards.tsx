import { DollarSign, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Circle, Loan } from "@/lib/mockData";

interface Props {
  circles: Circle[];
  loans: Loan[];
}

export function StatsCards({ circles, loans }: Props) {
  const tvl = circles.reduce((sum, c) => sum + c.poolSize, 0);
  const activeLoans = loans.filter((l) => l.status === "approved" || l.status === "pending").length;
  const defaulted = loans.filter((l) => l.status === "defaulted").length;
  const defaultRate = loans.length > 0 ? ((defaulted / loans.length) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      label: "Total Value Locked",
      value: `$${tvl.toLocaleString()}`,
      sub: "GEN",
      icon: DollarSign,
      gradient: "gradient-emerald",
      iconColor: "text-emerald-foreground",
    },
    {
      label: "Active Loans",
      value: activeLoans.toString(),
      sub: `of ${loans.length} total`,
      icon: TrendingUp,
      gradient: "gradient-indigo",
      iconColor: "text-indigo-foreground",
    },
    {
      label: "Default Rate",
      value: `${defaultRate}%`,
      sub: `${defaulted} defaulted`,
      icon: ShieldAlert,
      gradient: "",
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          className="glass-card overflow-hidden border-border/50 transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ animationDelay: `${i * 100}ms`, animation: "fade-in-up 0.5s ease-out forwards", opacity: 0 }}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                stat.gradient || "bg-destructive/10"
              }`}
            >
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
