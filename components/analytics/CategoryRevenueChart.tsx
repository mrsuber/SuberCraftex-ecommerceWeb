"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface CategoryRevenueChartProps {
  data: Array<{ name: string; revenue: number }>;
}

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
  // Take top 6 categories
  const topCategories = data.slice(0, 6);
  const total = topCategories.reduce((sum, item) => sum + item.revenue, 0);

  const chartData = topCategories.map((item) => ({
    name: item.name,
    value: item.revenue,
    percentage: total > 0 ? ((item.revenue / total) * 100).toFixed(1) : "0",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percentage }) => `${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => formatPrice(value)}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry: any) => (
            <span className="text-xs">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
