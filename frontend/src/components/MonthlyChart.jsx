import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./MonthlyChart.css";

function MonthlyChart({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="monthly-card">
        <h3>Monthly Watch Activity</h3>
        <p className="empty-text">
          No monthly data available.
        </p>
      </div>
    );
  }

  return (
    <div className="monthly-card">
      <h3>Monthly Watch Activity</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;