import React, { useEffect, useState } from "react";
import {
  getCollections,
  addMovieToCollection,
} from "../services/collectionService";
import { useToast } from "../context/ToastContext";

const AddToCollection = ({ movie }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);

      if (data.length > 0) {
        setSelectedCollection(data[0].id);
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to load collections.", "error");
    }
  };

  const handleAdd = async () => {
    if (!selectedCollection) {
      showToast("Please create a collection first.", "warning");
      return;
    }

    try {
      await addMovieToCollection(selectedCollection, {
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path,
      });

      showToast("Movie added successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Unable to add movie.", "error");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <select
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
      >
        {collections.length > 0 ? (
          collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))
        ) : (
          <option value="">No Collections</option>
        )}
      </select>

      <button
        onClick={handleAdd}
        style={{
          marginLeft: "10px",
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        Add to Collection
      </button>
    </div>
  );
};

export default AddToCollection;