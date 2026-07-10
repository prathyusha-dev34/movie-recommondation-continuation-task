import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCollection,
  removeMovieFromCollection,
} from "../services/collectionService";

import "./CollectionDetails.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function CollectionDetails() {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollection();
  }, [id]);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const data = await getCollection(id);
      setCollection(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId) => {
    if (!window.confirm("Remove this movie from the collection?")) return;

    try {
      await removeMovieFromCollection(id, movieId);
      loadCollection();
      alert("Movie removed successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to remove movie");
    }
  };

  if (loading) {
    return <h2>Loading Collection...</h2>;
  }

  if (!collection) {
    return <h2>Collection not found.</h2>;
  }

  return (
    <div className="collection-details">

      <h2>{collection.name}</h2>

      <p>{collection.description}</p>

      <p>
        <strong>Visibility:</strong>{" "}
        {collection.is_public ? "🌍 Public" : "🔒 Private"}
      </p>

      <p>
        <strong>Total Movies:</strong> {collection.movies?.length || 0}
      </p>

      <div className="movies-grid">
        {collection.movies?.length === 0 ? (
          <h3>No movies in this collection.</h3>
        ) : (
          collection.movies.map((movie) => (
            <div className="movie-card" key={movie.movie_id}>
              <img
                src={
                  movie.poster_path
                    ? movie.poster_path.startsWith("http")
                      ? movie.poster_path
                      : `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.movie_title}
              />

              <h3>{movie.movie_title}</h3>

              <p>Movie ID: {movie.movie_id}</p>

              <button
                className="remove-btn"
                onClick={() => handleRemove(movie.movie_id)}
              >
                ❌ Remove From Collection
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CollectionDetails;