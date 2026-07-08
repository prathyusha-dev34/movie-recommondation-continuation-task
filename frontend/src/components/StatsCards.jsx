import {
  FaFilm,
  FaHeart,
  FaBookmark,
  FaStar,
  FaFolder,
  FaSearch,
} from "react-icons/fa";

import "./StatsCards.css";

function StatsCards({ stats }) {
  const cards = [
    {
      icon: <FaFilm />,
      title: "Watched",
      value: stats.watched_count,
      color: "#3b82f6",
    },
    {
      icon: <FaHeart />,
      title: "Favorites",
      value: stats.favorites_count,
      color: "#ef4444",
    },
    {
      icon: <FaBookmark />,
      title: "Watchlist",
      value: stats.watchlist_count,
      color: "#f59e0b",
    },
    {
      icon: <FaStar />,
      title: "Reviews",
      value: stats.reviews_count,
      color: "#facc15",
    },
    {
      icon: <FaFolder />,
      title: "Collections",
      value: stats.collections_count,
      color: "#10b981",
    },
    {
      icon: <FaSearch />,
      title: "Searches",
      value: stats.total_searches,
      color: "#a855f7",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.title}>
          <div
            className="stats-icon"
            style={{ color: card.color }}
          >
            {card.icon}
          </div>

          <h2>{card.value}</h2>

          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;