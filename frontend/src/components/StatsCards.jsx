import {
  FaFilm,
  FaHeart,
  FaBookmark,
  FaStar
} from "react-icons/fa";

import "./StatsCards.css";

function StatsCards({ stats }) {

  const cards = [
    {
      icon: <FaFilm />,
      title: "Watched",
      value: stats.watched_count,
    },
    {
      icon: <FaHeart />,
      title: "Favorites",
      value: stats.favorites_count,
    },
    {
      icon: <FaBookmark />,
      title: "Watchlist",
      value: stats.watchlist_count,
    },
    {
      icon: <FaStar />,
      title: "Reviews",
      value: stats.reviews_count,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stats-card" key={card.title}>

          <div className="stats-icon">
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