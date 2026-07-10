import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// =========================
// COLLECTION APIs
// =========================

// Get all collections
export const getCollections = async () => {
  const response = await API.get("/collections/");
  return response.data;
};

// Get single collection
export const getCollection = async (id) => {
  const response = await API.get(`/collections/${id}`);
  return response.data;
};

// Create collection
export const createCollection = async (data) => {
  const response = await API.post("/collections/", data);
  return response.data;
};

// Update collection
export const updateCollection = async (id, data) => {
  const response = await API.put(`/collections/${id}`, data);
  return response.data;
};

// Delete collection
export const deleteCollection = async (id) => {
  const response = await API.delete(`/collections/${id}`);
  return response.data;
};

// Add movie to collection
export const addMovieToCollection = async (collectionId, movie) => {
  const response = await API.post(
    `/collections/${collectionId}/movies`,
    movie
  );
  return response.data;
};

// Remove movie from collection
export const removeMovieFromCollection = async (
  collectionId,
  movieId
) => {
  const response = await API.delete(
    `/collections/${collectionId}/movies/${movieId}`
  );
  return response.data;
};

// Get public collections
export const getPublicCollections = async () => {
  const response = await API.get("/collections/public");
  return response.data;
};

// Search collections
export const searchCollections = async (query) => {
  const response = await API.get(
    `/collections/search?query=${encodeURIComponent(query)}`
  );
  return response.data;
};

export default API;