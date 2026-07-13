import React from "react";
import { Link } from "react-router-dom";

const CollectionCard = ({ collection, onEdit, onDelete }) => {
  return (
    <div className="collection-card">
      <div className="collection-banner"></div>

      <div className="collection-body">
        <h3>{collection.name}</h3>

        <p>{collection.description || "No description available."}</p>

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
            onClick={() => onEdit(collection)}
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(collection.id)}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;