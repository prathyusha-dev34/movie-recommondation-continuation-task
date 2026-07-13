import React from "react";

const CreateCollectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  editingId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {editingId ? "Update Collection" : "Create Collection"}
        </h2>

        <form onSubmit={onSubmit}>
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

          <div className="modal-actions">
            <button type="submit">
              {editingId ? "Update" : "Create"}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCollectionModal;