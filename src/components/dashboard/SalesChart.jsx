"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const SalesChart = ({ data }) => {
  // Format data for chart
  const chartData =
    data?.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      sales: item.salesCount,
    })) || [];

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No sales data available
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Start making sales to see data here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `₦${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: "#1F2937",
              borderColor: "#374151",
              borderRadius: "0.5rem",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
