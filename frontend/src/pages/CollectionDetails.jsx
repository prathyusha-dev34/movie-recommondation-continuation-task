import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCollection,
  removeMovieFromCollection,
} from "../services/collectionService";
import { useToast } from "../context/ToastContext";

import "./CollectionDetails.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const CollectionDetails = () => {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      const data = await getCollection(id);
      setCollection(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load collection", "error");
    }
  };

  const handleRemove = async () => {
    try {
      await removeMovieFromCollection(id, movieToRemove);

      loadCollection();

      showToast("Movie removed from collection", "success");

      setShowConfirm(false);
      setMovieToRemove(null);
    } catch (error) {
      console.error(error);
      showToast("Failed to remove movie", "error");
    }
  };

  if (!collection) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="collection-details">
      <h2>{collection.name}</h2>

      <p>{collection.description}</p>

      <div className="movies-grid">
        {collection.movies?.length === 0 ? (
          <h3>No movies in this collection.</h3>
        ) : (
          collection.movies.map((movie) => (
            <div className="movie-card" key={movie.movie_id}>
              <img
                src={
                  movie.poster_path && movie.poster_path !== "N/A"
                    ? movie.poster_path.startsWith("http")
                      ? movie.poster_path
                      : `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.movie_title}
              />

              <h4>{movie.movie_title}</h4>

              <button
                className="remove-btn"
                onClick={() => {
                  setMovieToRemove(movie.movie_id);
                  setShowConfirm(true);
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Remove Movie?</h3>

            <p>
              Are you sure you want to remove this movie from the collection?
            </p>

            <div className="modal-buttons">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setMovieToRemove(null);
                }}
              >
                Cancel
              </button>

              <button onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetails;