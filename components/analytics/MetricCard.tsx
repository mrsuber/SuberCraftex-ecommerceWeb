"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Truck,
  Package,
  Clock,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  iconName: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconMap: Record<string, any> = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Truck,
  Package,
  Clock,
};

export function MetricCard({
  title,
  value,
  description,
  iconName,
  trend,
}: MetricCardProps) {
  const Icon = iconMap[iconName] || DollarSign;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-destructive mr-1" />
            )}
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-green-500" : "text-destructive"
              }`}
            >
              {Math.abs(trend.value).toFixed(1)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
