"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface CustomerSegmentChartProps {
  data: {
    new: number;
    returning: number;
  };
}

const COLORS = {
  new: "#10b981",
  returning: "#8b5cf6",
};

export function CustomerSegmentChart({ data }: CustomerSegmentChartProps) {
  const total = data.new + data.returning;

  const chartData = [
    {
      name: "New Customers",
      value: data.new,
      percentage: total > 0 ? ((data.new / total) * 100).toFixed(1) : "0",
    },
    {
      name: "Returning Customers",
      value: data.returning,
      percentage: total > 0 ? ((data.returning / total) * 100).toFixed(1) : "0",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ percentage }) => `${percentage}%`}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === 0 ? COLORS.new : COLORS.returning}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
          formatter={(value: number) => [value, "Customers"]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-xs">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
