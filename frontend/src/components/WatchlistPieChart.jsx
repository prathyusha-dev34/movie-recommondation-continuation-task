import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./WatchlistPieChart.css";

const COLORS = ["#22c55e", "#f59e0b"];

function WatchlistPieChart({ watched, watchlist }) {
  const data = [
    {
      name: "Watched",
      value: watched,
    },
    {
      name: "Watchlist",
      value: watchlist,
    },
  ];

  return (
    <div className="pie-card">

      <h3>Watched vs Watchlist</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default WatchlistPieChart;