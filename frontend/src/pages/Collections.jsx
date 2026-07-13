import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CollectionCard from "../components/CollectionCard";
import CreateCollectionModal from "../components/CollectionModal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);

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
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCollection(id);
      loadCollections();
      showToast("Collection deleted successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Delete failed", "error");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <h2>🎬 My Collections</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="public-btn"
            onClick={openCreateModal}
          >
            ➕ Create Collection
          </button>

          <Link to="/collections/public" className="public-btn">
            🌍 Public Collections
          </Link>
        </div>
      </div>

      <div className="collections-grid">
        {collections.length === 0 ? (
          <div className="no-collections">
            No collections found.
          </div>
        ) : (
          collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        editingId={editingId}
      />
    </div>
  );
};

export default Collections;