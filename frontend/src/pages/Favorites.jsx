import React, { useEffect, useState } from "react";
import axios from "axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/favorites/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(response.data.favorites);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/favorites/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Movie removed from favorites");

      setFavorites(
        favorites.filter(
          (movie) => movie.id !== id
        )
      );

    } catch (error) {
      console.log(error);
      alert("Failed to remove movie");
    }
  };

  return (
    <div className="page">
      <h1>Your Favorite Movies</h1>

      {favorites.length === 0 ? (
        <p>No favorite movies yet.</p>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
            >
              <img
                src={
                  movie.poster &&
                  movie.poster !== "N/A"
                    ? movie.poster
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.movie_title}
              />

              <div className="movie-info">
                <h3>{movie.movie_title}</h3>

                <p>
                  {movie.genre || "Movie"}
                </p>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFavorite(movie.id)
                  }
                >
                  ❌ Remove
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;