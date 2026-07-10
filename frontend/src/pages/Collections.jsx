import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../services/collectionService";

import "./Collection.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollections();

      setCollections(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      is_public: isPublic,
    };

    try {
      if (editingId) {
        await updateCollection(editingId, payload);
      } else {
        await createCollection(payload);
      }

      setName("");
      setDescription("");
      setIsPublic(false);
      setEditingId(null);

      loadCollections();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Something went wrong");
    }
  };

  const handleEdit = (collection) => {
    setEditingId(collection.id);
    setName(collection.name);
    setDescription(collection.description || "");
    setIsPublic(collection.is_public);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;

    try {
      await deleteCollection(id);
      loadCollections();
    } catch (error) {
      console.error(error);
    }
  };

    return (
    <div className="collections-page">
      <h2>🎬 My Collections</h2>

      <form onSubmit={handleSubmit} className="collection-form">
        <input
          type="text"
          placeholder="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public Collection
        </label>

        <button type="submit">
          {editingId ? "✏️ Update Collection" : "➕ Create Collection"}
        </button>
      </form>

      {loading ? (
        <h3>Loading collections...</h3>
      ) : (
        <div className="collection-grid">
          {collections.length === 0 ? (
            <p>No collections found.</p>
          ) : (
            collections.map((collection) => (
              <div className="collection-card" key={collection.id}>
                <div className="collection-body">
                  <h3>{collection.name}</h3>

                  <p>
                    {collection.description || "No description available."}
                  </p>

                  <p className="movie-count">
                    🎬 Movies: {collection.movies?.length || 0}
                  </p>

                  <p>
                    {collection.is_public ? "🌍 Public" : "🔒 Private"}
                  </p>

                  <div className="card-buttons">
                    <Link
                      to={`/collections/${collection.id}`}
                      className="view-btn"
                    >
                      📂 Open
                    </Link>

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() => handleEdit(collection)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(collection.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Collections;