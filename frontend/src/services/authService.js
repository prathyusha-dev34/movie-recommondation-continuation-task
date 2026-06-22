import API from "./api";

// Login
export const loginUser = async (
  email,
  password
) => {

  try {

    const response = await API.post(
      "/login",
      {
        email,
        password,
      }
    );

    // store token
    localStorage.setItem(
      "token",
      response.data.access_token
    );

    return response.data;

  } catch (error) {

    throw error.response.data;

  }

};

// Register
export const registerUser = async (
  name,
  email,
  password
) => {

  try {

    const response = await API.post(
      "/register",
      {
        name,
        email,
        password,
      }
    );

    return response.data;

  } catch (error) {

    throw error.response.data;

  }

};

// Logout
export const logoutUser = () => {

  localStorage.removeItem("token");

};

// Check auth
export const isAuthenticated = () => {

  return !!localStorage.getItem(
    "token"
  );

};