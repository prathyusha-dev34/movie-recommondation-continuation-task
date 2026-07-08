import React from "react";
import "./RecentActivity.css";

function RecentActivity({ recent }) {
  return (
    <div className="recent-card">

      <h2>Recent Activity</h2>

      <div className="recent-grid">

        {/* Recently Watched */}
        <div className="recent-section">

          <h3>Recently Watched</h3>

          {recent.recent_watched.length === 0 ? (
            <p>No watched movies.</p>
          ) : (
            recent.recent_watched.map((movie, index) => (
              <div className="recent-item" key={index}>

                <img
                  src={movie.poster}
                  alt={movie.title}
                />

                <div>
                  <h4>{movie.title}</h4>

                  <small>
                    {new Date(movie.watched_date).toLocaleDateString()}
                  </small>
                </div>

              </div>
            ))
          )}

        </div>

        {/* Favorites */}
        <div className="recent-section">

          <h3>Recent Favorites</h3>

          {recent.recent_favorites.length === 0 ? (
            <p>No favorites found.</p>
          ) : (
            recent.recent_favorites.map((movie, index) => (
              <div className="recent-item" key={index}>

                <img
                  src={movie.poster}
                  alt={movie.title}
                />

                <div>
                  <h4>{movie.title}</h4>
                </div>

              </div>
            ))
          )}

        </div>

        {/* Reviews */}
        <div className="recent-section">

          <h3>Latest Reviews</h3>

          {recent.recent_reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            recent.recent_reviews.map((review, index) => (
              <div className="review-item" key={index}>

                <h4>{review.movie_title}</h4>

                <p>⭐ {review.rating}/5</p>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default RecentActivity;