import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // =========================
  // SEARCH MOVIES
  // =========================
  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=8b2506ba&s=${query}`
      );

      setMovies(response.data.Search || []);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOAD RECOMMENDATIONS
  // =========================
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(
        "http://127.0.0.1:8000/recommendations/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendedMovies(response.data.recommended_movies || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <SearchBar onSearch={handleSearch} />

        <h1 className="section-title">Search Results</h1>

        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.imdbID}>
                <MovieCard
                  movie={{
                    imdbID: movie.imdbID,
                    title: movie.Title,
                    genre: movie.Type,
                    poster: movie.Poster,
                    reason: movie.Year,
                  }}
                />
              </div>
            ))
          ) : (
            <p>No search results</p>
          )}
        </div>

        <h1 className="section-title">Recommended Movies</h1>

        <div className="movies-grid">
          {recommendedMovies.length > 0 ? (
            recommendedMovies.map((movie, index) => (
              <div key={index}>
                <MovieCard
                  movie={{
                    imdbID: movie.imdbID,
                    title: movie.title,
                    genre: movie.genre,
                    poster:
                      movie.poster ||
                      "https://via.placeholder.com/300x450?text=No+Image",
                    reason: movie.reason,
                  }}
                />
              </div>
            ))
          ) : (
            <p>No recommendations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;