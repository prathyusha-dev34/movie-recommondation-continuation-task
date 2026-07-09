import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import "./GenreChart.css";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

function GenreChart({ genres }) {
  if (!genres || genres.length === 0) {
    return (
      <div className="genre-card">
        <h3>Top Genres</h3>
        <p className="empty-text">
          No genre data available.
        </p>
      </div>
    );
  }

  return (
    <div className="genre-card">
      <h3>Top Genres</h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={genres}
            dataKey="count"
            nameKey="genre"
            outerRadius={100}
            label
          >
            {genres.map((item, index) => (
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

export default GenreChart;