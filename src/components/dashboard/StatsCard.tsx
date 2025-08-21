import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  variant = "default"
}: StatsCardProps) {
  const variantStyles = {
    default: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
    success: "bg-gradient-to-br from-success/5 to-success/10 border-success/20",
    warning: "bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20",
    destructive: "bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive"
  };

  const changeStyles = {
    default: trend === "up" ? "text-success" : "text-destructive",
    success: "text-success",
    warning: "text-warning", 
    destructive: "text-destructive"
  };

  return (
    <Card className={cn("relative overflow-hidden transition-smooth hover:shadow-md", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{value}</p>
              <p className={cn("text-xs font-medium", changeStyles[variant])}>
                {trend === "up" ? "+" : ""}{change}
              </p>
            </div>
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}