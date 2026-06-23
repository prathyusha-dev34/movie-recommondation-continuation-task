import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getCollections,
  addMovieToCollection,
} from "../services/collectionService";

function MovieCard({ movie }) {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FAVORITES
  const addToFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        return;
      }

      const favoriteData = {
        movie_id: movie.imdbID || movie.movie_id || movie.title,
        movie_title: movie.title,
        genre: movie.genre,
        poster: movie.poster,
      };

      const response = await axios.post(
        "https://collect-dd4h.onrender.com/favorites/",
        favoriteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Added to Favorites ❤️");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Favorite failed ❌");
    }
  };

  // WATCHLIST
  const addToWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        return;
      }

      const watchlistData = {
        movie_id: movie.imdbID || movie.movie_id || movie.title,
        movie_title: movie.title,
        genre: movie.genre,
        poster: movie.poster,
      };

      const response = await axios.post(
        "https://collect-dd4h.onrender.com/watchlist/",
        watchlistData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Added to Watchlist 📺");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Watchlist failed ❌");
    }
  };

  // ADD REVIEW
  const addReview = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        return;
      }

      const reviewData = {
        movie_id: movie.imdbID || movie.movie_id || movie.title,
        movie_title: movie.title,
        rating: 5,
        review: "Excellent Movie ⭐",
      };

      const response = await axios.post(
        "https://collect-dd4h.onrender.com/reviews/",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Review Added ⭐");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.detail || "Review failed ❌");
    }
  };

  // VIEW REVIEWS
  const getReviews = async () => {
    try {
      const movieId =
        movie.imdbID || movie.movie_id || movie.title;

      const response = await axios.get(
        `https://collect-dd4h.onrender.com/reviews/${movieId}`
      );

      if (response.data.reviews.length === 0) {
        alert("No reviews found");
        return;
      }

      const reviewsText = response.data.reviews
        .map(
          (review) =>
            `⭐ ${review.rating}/5\n${review.review}`
        )
        .join("\n\n");

      alert(reviewsText);
    } catch (error) {
      console.log(error);
      alert("Failed to load reviews");
    }
  };

  // ADD TO COLLECTION
  const addToCollection = async () => {
    if (!selectedCollection) {
      alert("Please select a collection");
      return;
    }

    try {
     await addMovieToCollection(selectedCollection, {
  movie_id: String(
    movie.imdbID || movie.movie_id || movie.title
  ),
  movie_title: movie.title,
  poster_path: movie.poster,
});

      alert("Movie added to collection 📁");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.detail ||
          "Failed to add movie"
      );
    }
  };

  return (
    <div className="movie-card">
      <img
        src={
          movie.poster && movie.poster !== "N/A"
            ? movie.poster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
      />

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p>{movie.genre}</p>

        <p>{movie.reason}</p>

        <button
          className="fav-btn"
          onClick={addToFavorites}
        >
          ❤️ Favorite
        </button>

        <button
          className="watch-btn"
          onClick={addToWatchlist}
        >
          📺 Watchlist
        </button>

        <button
          className="review-btn"
          onClick={addReview}
        >
          ⭐ Add Review
        </button>

        <button
          className="review-btn"
          onClick={getReviews}
        >
          👁 View Reviews
        </button>

        <select
          value={selectedCollection}
          onChange={(e) =>
            setSelectedCollection(e.target.value)
          }
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
      </div>
    </div>
  );
}

export default MovieCard;