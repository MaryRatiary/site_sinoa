import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Charger depuis localStorage au démarrage
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Ouvrir le panier
  const openCart = () => {
    setIsCartOpen(true);
  };

  // ✅ Fermer le panier
  const closeCart = () => {
    setIsCartOpen(false);
  };

  // ✅ Ajouter un produit au panier
  const addToCart = (product, quantity = 1, size = null, color = null, variantId = null, model = null) => {
    console.log('➕ addToCart appelé:', { product, quantity, size, color, variantId, model });
    
    if (!product || !product.id) {
      console.error('❌ Produit invalide:', product);
      return;
    }

    setCartItems(prevItems => {
      // Chercher un article existant avec le même id, size, color et model
      const existingItem = prevItems.find(
        (item) =>
          item.id === product.id &&
          item.size === size &&
          item.color === color &&
          item.model === model
      );

      let newItems;
      if (existingItem) {
        // Augmenter la quantité
        const selectedVariant = variantId ? product.variants?.find(v => v.id === variantId) : null;
        newItems = prevItems.map((item) =>
          item.id === product.id && item.size === size && item.color === color && item.model === model
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                image: selectedVariant?.image_url || item.image,
                price: selectedVariant ? (parseFloat(selectedVariant.price) || item.price) : item.price
              }
            : item
        );
      } else {
        // Ajouter un nouvel article
        console.log('🆕 Nouvel article ajouté au panier');
        
        // Trouver le variant pour l'image et le prix spécifiques
        const selectedVariant = variantId ? product.variants?.find(v => v.id === variantId) : null;
        
        const newItem = {
          id: product.id,
          variantId: variantId || product.variantId || (product.variants && product.variants[0]?.id),
          name: product.name || product.title || 'Produit',
          price: selectedVariant ? (parseFloat(selectedVariant.price) || parseFloat(product.price) || 0) : (parseFloat(product.price) || 0),
          image: selectedVariant?.image_url || product.image || '',
          quantity: Math.max(1, parseInt(quantity) || 1),
          size: size || null,
          color: color || null,
          model: model || null,
        };
        newItems = [...prevItems, newItem];
      }

      console.log('📦 Panier mis à jour:', newItems);
      return newItems;
    });
  };

  // ✅ Supprimer un article du panier
  const removeFromCart = (product_id, size = null, color = null) => {
    console.log('🗑️ removeFromCart appelé:', { product_id, size, color });
    setCartItems(prevItems =>
      prevItems.filter(
        (item) =>
          !(item.id === product_id && item.size === size && item.color === color)
      )
    );
  };

  // ✅ Mettre à jour la quantité d'un article
  const updateQuantity = (product_id, size = null, color = null, quantity) => {
    console.log('🔄 updateQuantity appelé:', { product_id, size, color, quantity });
    
    if (quantity <= 0) {
      removeFromCart(product_id, size, color);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map((item) =>
        item.id === product_id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, parseInt(quantity)) }
          : item
      )
    );
  };

  // ✅ Vider le panier
  const clearCart = () => {
    console.log('🧹 Panier vidé');
    setCartItems([]);
  };

  // ✅ Calculer le prix total
  const getTotalPrice = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)),
      0
    );
    return Math.round(total * 100) / 100; // Arrondir à 2 décimales
  };

  // ✅ Obtenir le nombre total d'articles
  const getTotalItems = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // ✅ Obtenir le nombre d'articles différents
  const getItemCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

export default CartContext;
