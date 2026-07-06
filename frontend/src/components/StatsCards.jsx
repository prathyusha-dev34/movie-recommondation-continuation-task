import React from "react";
import "./StatsCards.css";

function StatsCards({ stats }) {
  const cards = [
    {
      title: "Movies Watched",
      value: stats.watched_count,
    },
    {
      title: "Favorites",
      value: stats.favorites_count,
    },
    {
      title: "Watchlist",
      value: stats.watchlist_count,
    },
    {
      title: "Reviews",
      value: stats.reviews_count,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.title}>
          <h4>{card.title}</h4>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;