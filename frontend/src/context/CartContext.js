import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (foodItem, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.foodItem._id === foodItem._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.foodItem._id === foodItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { foodItem, quantity }];
    });
  };

  const removeFromCart = (foodItemId) => {
    setCart(prevCart => prevCart.filter(item => item.foodItem._id !== foodItemId));
  };

  const updateQuantity = (foodItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.foodItem._id === foodItemId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalAmount,
      getTotalItems,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
