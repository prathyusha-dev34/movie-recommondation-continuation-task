import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../services/collectionService";
import { useToast } from "../context/ToastContext";

import "./Collection.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load collections", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
    };

    try {
      if (editingId) {
        await updateCollection(editingId, payload);
        showToast("Collection updated successfully");
      } else {
        await createCollection(payload);
        showToast("Collection created successfully");
      }

      setName("");
      setDescription("");
      setEditingId(null);

      loadCollections();
    } catch (error) {
      console.error(error);
      showToast("Operation failed", "error");
    }
  };

  const handleEdit = (collection) => {
    setEditingId(collection.id);
    setName(collection.name);
    setDescription(collection.description || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;

    try {
      await deleteCollection(id);
      loadCollections();
      showToast("Collection deleted successfully");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <h2>🎬 My Collections</h2>

        <Link to="/collections/public" className="public-btn">
          🌍 Public Collections
        </Link>
      </div>

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

        <button type="submit">
          {editingId ? "✏️ Update Collection" : "➕ Create Collection"}
        </button>
      </form>

      <div className="collections-grid">
        {collections.length === 0 ? (
          <div className="no-collections">
            No collections found.
          </div>
        ) : (
          collections.map((collection) => (
            <div className="collection-card" key={collection.id}>
              <div className="collection-banner"></div>

              <div className="collection-body">
                <h3>{collection.name}</h3>

                <p>
                  {collection.description || "No description available."}
                </p>

                <div className="collection-info">
                  🎬 Movies: {collection.movies?.length || 0}
                </div>

                <div className="collection-actions">
                  <Link
                    to={`/collections/${collection.id}`}
                    className="open-btn"
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
    </div>
  );
};

export default Collections;