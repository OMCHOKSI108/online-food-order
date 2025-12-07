import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (foodItem) => {
    setFavorites(prevFavorites => {
      const existingItem = prevFavorites.find(item => item._id === foodItem._id);
      if (!existingItem) {
        return [...prevFavorites, foodItem];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (foodItemId) => {
    setFavorites(prevFavorites => prevFavorites.filter(item => item._id !== foodItemId));
  };

  const isFavorite = (foodItemId) => {
    return favorites.some(item => item._id === foodItemId);
  };

  const toggleFavorite = (foodItem) => {
    if (isFavorite(foodItem._id)) {
      removeFromFavorites(foodItem._id);
    } else {
      addToFavorites(foodItem);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      getFavoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};