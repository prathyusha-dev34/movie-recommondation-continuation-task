import axios from "axios";

const API_URL = "https://collect-dd4h.onrender.com/collections";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all collections
export const getCollections = async () => {
  const response = await axios.get(
    `${API_URL}/`,
    getAuthHeader()
  );
  return response.data;
};

// Get single collection
export const getCollection = async (collectionId) => {
  const response = await axios.get(
    `${API_URL}/${collectionId}`,
    getAuthHeader()
  );
  return response.data;
};

// Create collection
export const createCollection = async (data) => {
  const response = await axios.post(
    `${API_URL}/`,
    data,
    getAuthHeader()
  );
  return response.data;
};

// Update collection
export const updateCollection = async (
  collectionId,
  data
) => {
  const response = await axios.put(
    `${API_URL}/${collectionId}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

// Delete collection
export const deleteCollection = async (
  collectionId
) => {
  const response = await axios.delete(
    `${API_URL}/${collectionId}`,
    getAuthHeader()
  );
  return response.data;
};

// Add movie to collection
export const addMovieToCollection = async (
  collectionId,
  movie
) => {
  const response = await axios.post(
    `${API_URL}/${collectionId}/movies`,
    movie,
    getAuthHeader()
  );
  return response.data;
};

// Remove movie from collection
export const removeMovieFromCollection = async (
  collectionId,
  movieId
) => {
  const response = await axios.delete(
    `${API_URL}/${collectionId}/movies/${movieId}`,
    getAuthHeader()
  );
  return response.data;
};