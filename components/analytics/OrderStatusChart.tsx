"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface OrderStatusChartProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  out_for_delivery: "#10b981",
  delivered: "#22c55e",
  cancelled: "#ef4444",
  refunded: "#64748b",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((item) => ({
    status: STATUS_LABELS[item.status] || item.status,
    count: item.count,
    originalStatus: item.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" tick={{ fill: "currentColor" }} />
        <YAxis
          type="category"
          dataKey="status"
          className="text-xs"
          tick={{ fill: "currentColor" }}
          width={100}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => [value, "Orders"]}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={STATUS_COLORS[entry.originalStatus] || "#888888"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
