import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter un produit au panier
  const addToCart = useCallback((product, options = {}) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.size === options.size
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === options.size
            ? { ...item, quantity: item.quantity + (options.quantity || 1) }
            : item
        );
      }

      return [...prevCart, { 
        ...product, 
        quantity: options.quantity || 1,
        size: options.size,
        color: options.color,
        notes: options.notes,
      }];
    });
  }, []);

  // Supprimer un produit du panier
  const removeFromCart = useCallback((id) => {
    setCartItems(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  // Mettre à jour un article du panier
  const updateCartItem = useCallback((id, updates) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, ...updates }
          : item
      )
    );
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculer le total
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Calculer le nombre total d'articles
  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalPrice,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
