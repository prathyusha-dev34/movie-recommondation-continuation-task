import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./GenrePreferences.css";

function GenrePreferences({ showToast }) {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await API.get("/preferences/");
      setGenres(response.data);
    } catch (error) {
      if (showToast) {
        showToast("Failed to load preferences", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const addGenre = async () => {
    if (!newGenre.trim()) {
      if (showToast) {
        showToast("Please enter a genre", "error");
      }
      return;
    }

    try {
      await API.post("/preferences/", {
        genre: newGenre,
      });

      if (showToast) {
        showToast("Genre added successfully", "success");
      }

      setNewGenre("");
      fetchGenres();
    } catch (error) {
      if (showToast) {
        showToast(
          error.response?.data?.detail || "Failed to add genre",
          "error"
        );
      }
    }
  };

  const deleteGenre = async (id) => {
    try {
      await API.delete(`/preferences/${id}`);

      if (showToast) {
        showToast("Genre removed successfully", "success");
      }

      fetchGenres();
    } catch (error) {
      if (showToast) {
        showToast("Failed to delete genre", "error");
      }
    }
  };

  return (
    <div className="genre-section">
      <h3>Genre Preferences</h3>

      <div className="genre-input">
        <input
          type="text"
          placeholder="Enter genre"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        />

        <button onClick={addGenre}>
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : genres.length === 0 ? (
        <p>No genre preferences found.</p>
      ) : (
        <div className="genre-list">
          {genres.map((item) => (
            <div className="genre-chip" key={item.id}>
              <span>{item.genre}</span>

              <button onClick={() => deleteGenre(item.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenrePreferences;