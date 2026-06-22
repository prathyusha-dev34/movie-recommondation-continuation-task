import React, { useEffect, useState } from "react";
import {
  getCollections,
  addMovieToCollection,
} from "../services/collectionService";

const AddToCollection = ({ movie }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

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
    }
  };

  const handleAdd = async () => {
    if (!selectedCollection) {
      alert("Please create a collection first.");
      return;
    }

    try {
      await addMovieToCollection(selectedCollection, {
        movie_id: movie.id,
        movie_title: movie.title,
        poster_path: movie.poster_path,
      });

      alert("Movie added successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to add movie.");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <select
        value={selectedCollection}
        onChange={(e) => setSelectedCollection(e.target.value)}
      >
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
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