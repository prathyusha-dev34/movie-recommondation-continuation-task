import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

import StatsCards from "../components/StatsCards";
import GenreChart from "../components/GenreChart";
import MonthlyChart from "../components/MonthlyChart";
import WatchlistPieChart from "../components/WatchlistPieChart";
import RecentActivity from "../components/RecentActivity";

import "./Dashboard.css";

function Dashboard() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    watched_count: 0,
    favorites_count: 0,
    watchlist_count: 0,
    reviews_count: 0,
    collections_count: 0,
    total_searches: 0,
  });

  const [genres, setGenres] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [recent, setRecent] = useState({
    recent_watched: [],
    recent_favorites: [],
    recent_reviews: [],
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [statsRes, genreRes, monthlyRes, recentRes] =
        await Promise.all([
          API.get("/dashboard"),
          API.get("/dashboard/genres"),
          API.get("/dashboard/monthly"),
          API.get("/dashboard/recent"),
        ]);

      setStats(statsRes.data);
      setGenres(genreRes.data);
      setMonthly(monthlyRes.data);
      setRecent(recentRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          🎬 Movie Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Track your movie journey with detailed statistics,
          analytics, genre insights and recent activity.
        </p>
      </div>

      <StatsCards stats={stats} />

      <h2 className="section-title">
        📊 Analytics
      </h2>

      <div className="dashboard-chart-grid">

        <div className="genre-card">
          <h3>🎭 Genre Distribution</h3>
          <GenreChart genres={genres} />
        </div>

        <div className="monthly-card">
          <h3>📈 Monthly Activity</h3>
          <MonthlyChart monthlyData={monthly} />
        </div>

        <div className="pie-card">
          <h3>🥧 Watchlist Overview</h3>
          <WatchlistPieChart
            watched={stats.watched_count}
            watchlist={stats.watchlist_count}
          />
        </div>

      </div>

      <h2 className="section-title">
        🕒 Recent Activity
      </h2>

      <RecentActivity recent={recent} />

    </div>
  );
}

export default Dashboard;