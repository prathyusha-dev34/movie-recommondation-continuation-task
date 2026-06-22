import API from "./api";

// Get Recommendations
export const getRecommendations =
  async () => {

    try {

      const response = await API.get(
        "/recommendations"
      );

      return response.data;

    } catch (error) {

      throw error.response.data;

    }

  };

// Get Favorites
export const getFavorites =
  async () => {

    try {

      const response = await API.get(
        "/favorites"
      );

      return response.data;

    } catch (error) {

      throw error.response.data;

    }

  };

// Get Search History
export const getHistory =
  async () => {

    try {

      const response = await API.get(
        "/history"
      );

      return response.data;

    } catch (error) {

      throw error.response.data;

    }

  };

// Get Dashboard
export const getDashboard =
  async () => {

    try {

      const response = await API.get(
        "/dashboard"
      );

      return response.data;

    } catch (error) {

      throw error.response.data;

    }

  };

// Add Favorite
export const addFavorite =
  async (movie) => {

    try {

      const response = await API.post(
        "/favorites",
        movie
      );

      return response.data;

    } catch (error) {

      throw error.response.data;

    }

  };