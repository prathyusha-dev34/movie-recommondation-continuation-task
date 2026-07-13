import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "./ToastContext";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("compare_movies");
    if (saved) {
      try {
        setSelectedMovies(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCompare = (movies) => {
    setSelectedMovies(movies);
    localStorage.setItem("compare_movies", JSON.stringify(movies));
  };

  const addMovieToCompare = (movie) => {
    if (selectedMovies.some((m) => m.id === movie.id)) return;

    if (selectedMovies.length >= 3) {
      showToast("You can compare up to 3 movies at a time.", "warning");
      return;
    }

    saveCompare([...selectedMovies, movie]);
  };

  const removeMovieFromCompare = (movieId) => {
    saveCompare(selectedMovies.filter((m) => m.id !== movieId));
  };

  const clearCompare = () => {
    saveCompare([]);
  };

  const isMovieSelected = (movieId) =>
    selectedMovies.some((m) => m.id === movieId);

  return (
    <CompareContext.Provider
      value={{
        selectedMovies,
        addMovieToCompare,
        removeMovieFromCompare,
        clearCompare,
        isMovieSelected,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }

  return context;
};