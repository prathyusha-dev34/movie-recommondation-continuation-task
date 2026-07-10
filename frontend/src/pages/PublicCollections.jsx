import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "./Collection.css";

const PublicCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);

      const response = await API.get("/collections/public");

      setCollections(response.data);
    } catch (error) {
      console.error("Failed to load public collections", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim() === "") {
      fetchCollections();
      return;
    }

    try {
      const response = await API.get(
        `/collections/search?query=${value}`
      );

      setCollections(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>Loading Public Collections...</h2>;
  }

  return (
    <div className="collections-page">
      <h2>🌍 Public Collections</h2>

      <input
        type="text"
        placeholder="🔍 Search by Collection or Owner"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {collections.length === 0 ? (
        <p>No public collections available.</p>
      ) : (
        <div className="collection-grid">
          {collections.map((collection) => (
            <div className="collection-card" key={collection.id}>
              <div className="collection-body">
                <h3>{collection.name}</h3>

                <p>{collection.description || "No description"}</p>

                <p>👤 {collection.owner_name}</p>

                <p>🎬 Movies: {collection.movie_count}</p>

                <p>
                  📅{" "}
                  {new Date(
                    collection.created_at
                  ).toLocaleDateString()}
                </p>

                <Link
                  to={`/collections/${collection.id}`}
                  className="view-btn"
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicCollections;