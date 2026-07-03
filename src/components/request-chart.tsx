"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const methodColors: Record<string, string> = {
  GET: "#3b82f6",    // Blue
  POST: "#10b981",   // Green
  PUT: "#f59e0b",    // Orange
  PATCH: "#8b5cf6",  // Purple
  DELETE: "#ef4444", // Red
};

const getMethodColor = (method: string) => {
  return methodColors[method?.toUpperCase()] || "#64748b"; // Slate as fallback
};

type ChartData = {
  name: string;
  total: number;
};

interface RequestChartProps {
  data: ChartData[];
}

export function RequestChart({ data }: RequestChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          cursor={{ fill: "var(--muted)", opacity: 0.1 }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            color: "hsl(var(--foreground))",
          }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: any) => [value, "Requests"]}
        />
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          barSize={40}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getMethodColor(entry.name)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
