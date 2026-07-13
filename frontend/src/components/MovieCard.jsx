import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";
import {
  getCollections,
  addMovieToCollection,
} from "../services/collectionService";

function MovieCard({ movie }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  const {
    isMovieSelected,
    addMovieToCompare,
    removeMovieFromCompare,
  } = useCompare();

  const { showToast } = useToast();

  const movieId = movie.imdbID || movie.movie_id || movie.title;
  const isSelected = isMovieSelected(movieId);

  const movieTitle = movie.title || movie.movie_title || "Unknown Title";
  const moviePoster = movie.poster || movie.poster_path || "";
  const movieGenre = movie.genre || "";

  const [isWatched, setIsWatched] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    loadCollections();
    checkStatus();
  }, [movieId]);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to load collections:", error);
      showToast("Failed to load collections", "error");
    }
  };

  const checkStatus = async () => {
    if (!movieId) return;

    try {
      const response = await API.get(`/watched/status/${movieId}`);
      setIsWatched(response.data.watched);
      setInWatchlist(response.data.watchlist);
    } catch (error) {
      console.warn(error);
    }
  };

  // FAVORITES
  const addToFavorites = async () => {
    try {
      const favoriteData = {
        movie_id: movieId,
        movie_title: movieTitle,
        genre: movieGenre,
        poster: moviePoster,
      };

      const response = await API.post("/favorites/", favoriteData);

      showToast(
        response.data.message || "Added to Favorites ❤️",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.detail || "Favorite failed",
        "error"
      );
    }
  };

  // WATCHLIST
  const addToWatchlist = async () => {
    try {
      const watchlistData = {
        movie_id: String(movieId),
        movie_title: movieTitle,
        genre: movieGenre,
        poster: moviePoster,
      };

      const response = await API.post("/watchlist/", watchlistData);

      setInWatchlist(true);

      showToast(
        response.data.message || "Added to Watchlist 📺",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.detail || "Watchlist failed",
        "error"
      );
    }
  };

  // WATCHED
  const toggleWatched = async () => {
    try {
      if (isWatched) {
        await API.delete(`/watched/${movieId}`);

        setIsWatched(false);

        await checkStatus();

        showToast("Removed from Watched History", "success");
      } else {
        const watchedData = {
          movie_id: String(movieId),
          movie_title: movieTitle,
          genre: movieGenre,
          poster: moviePoster,
          imdb_rating: movie.imdb_rating || movie.rating || "N/A",
        };

        await API.post("/watched/", watchedData);

        setIsWatched(true);
        setInWatchlist(false);

        showToast("Marked as Watched", "success");
      }
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.detail || "Action failed",
        "error"
      );
    }
  };

    // ADD REVIEW
  const addReview = async () => {
    try {
      const reviewData = {
        movie_id: movieId,
        movie_title: movieTitle,
        rating: 5,
        review: "Excellent Movie ⭐",
      };

      const response = await API.post("/reviews/", reviewData);

      showToast(
        response.data.message || "Review Added ⭐",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.detail || "Review failed",
        "error"
      );
    }
  };

  // VIEW REVIEWS
  const getReviews = async () => {
    try {
      const response = await API.get(`/reviews/${movieId}`);

      if (response.data.reviews.length === 0) {
        showToast("No reviews found", "info");
        return;
      }

      showToast("Reviews loaded successfully", "success");

      console.log(response.data.reviews);
    } catch (error) {
      console.error(error);
      showToast("Failed to load reviews", "error");
    }
  };

  // ADD TO COLLECTION
  const addToCollection = async () => {
    if (!selectedCollection) {
      showToast("Please select a collection", "warning");
      return;
    }

    try {
      await addMovieToCollection(selectedCollection, {
        movie_id: String(movieId),
        movie_title: movieTitle,
        poster_path: moviePoster,
      });

      showToast("Movie added to collection", "success");
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.detail || "Failed to add movie",
        "error"
      );
    }
  };

  // COMPARE
  const handleCompareToggle = () => {
    if (isSelected) {
      removeMovieFromCompare(movieId);
    } else {
      addMovieToCompare({
        id: movieId,
        title: movieTitle,
        poster: moviePoster,
      });
    }
  };

  return (
    <div className="movie-card" style={{ position: "relative" }}>
      {isWatched && (
        <span
          className="watched-badge"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#10b981",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          ✓ Watched
        </span>
      )}

      {inWatchlist && (
        <span
          className="watchlist-badge"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          📺 Watchlist
        </span>
      )}

      <img
        src={
          moviePoster && moviePoster !== "N/A"
            ? moviePoster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movieTitle}
      />

      <div className="movie-info">
        <h3>{movieTitle}</h3>

        <p>{movieGenre}</p>

        <p>{movie.reason}</p>

                <button className="fav-btn" onClick={addToFavorites}>
          ❤️ Favorite
        </button>

        <button className="watch-btn" onClick={addToWatchlist}>
          📺 Watchlist
        </button>

        <button
          className="watched-btn"
          onClick={toggleWatched}
          style={{
            backgroundColor: isWatched ? "#ef4444" : "#10b981",
            color: "white",
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginTop: "8px",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {isWatched ? "❌ Remove Watched" : "👁️ Mark Watched"}
        </button>

        <button className="review-btn" onClick={addReview}>
          ⭐ Add Review
        </button>

        <button className="review-btn" onClick={getReviews}>
          👁 View Reviews
        </button>

        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
        >
          <option value="">Select Collection</option>

          {collections.map((collection) => (
            <option
              key={collection.id}
              value={collection.id}
            >
              {collection.name}
            </option>
          ))}
        </select>

        <button
          className="collection-btn"
          onClick={addToCollection}
        >
          📁 Add to Collection
        </button>

        <div className="compare-checkbox-container">
          <button
            className={`compare-toggle-btn ${
              isSelected ? "selected" : ""
            }`}
            onClick={handleCompareToggle}
          >
            {isSelected ? "✓ Comparing" : "＋ Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;