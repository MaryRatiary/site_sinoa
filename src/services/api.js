// Configuration API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper pour les requêtes
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const baseMsg = error.message || error.error || `API Error (${response.status})`;
    const msg = error.details ? `${baseMsg} — ${error.details}` : baseMsg;
    const e = new Error(msg);
    e.status = response.status;
    e.details = error.details;
    throw e;
  }

  return response.json();
};

// ============ AUTH ============
export const authAPI = {
  register: (email, password, first_name, last_name) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ============ CATEGORIES ============
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),

  getAllFlat: () => apiCall('/categories/flat/all'),

  getBySlug: (slug) => apiCall(`/categories/slug/${slug}`),

  getById: (id) => apiCall(`/categories/${id}`),

  getChildren: (parent_id) => apiCall(`/categories/${parent_id}/children`),

  preDeleteCheck: (id) => apiCall(`/categories/${id}/delete-check`),

  create: (data) =>
    apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id, confirmationText = null) =>
    apiCall(`/categories/${id}`, {
      method: 'DELETE',
      body: confirmationText ? JSON.stringify({ confirmationText }) : undefined,
    }),

  reorder: (category_id, targetCategoryId) =>
    apiCall(`/categories/${category_id}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ targetCategoryId }),
    }),
};

// ============ PRODUCTS ============
export const productsAPI = {
  getAll: (query = '') => apiCall(`/products${query}`),

  getById: (id) => apiCall(`/products/${id}`),

  getBySlug: (slug) => apiCall(`/products/slug/${slug}`),

  create: (data) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),

  addImage: (product_id, imageData) =>
    apiCall(`/products/${product_id}/images`, {
      method: 'POST',
      body: JSON.stringify(imageData),
    }),

  addSize: (product_id, size, stock) =>
    apiCall(`/products/${product_id}/sizes`, {
      method: 'POST',
      body: JSON.stringify({ size, stock }),
    }),

  updateSizeStock: (product_id, sizeId, stock) =>
    apiCall(`/products/${product_id}/sizes/${sizeId}`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    }),

  addColor: (product_id, color_name, color_hex, stock) =>
    apiCall(`/products/${product_id}/colors`, {
      method: 'POST',
      body: JSON.stringify({ color_name, color_hex, stock }),
    }),

  updateColorStock: (product_id, colorId, stock) =>
    apiCall(`/products/${product_id}/colors/${colorId}`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    }),
};

// ============ REVIEWS ============
export const reviewsAPI = {
  getProductReviews: (productId, limit = 10, offset = 0, handle = '') => 
    apiCall(`/reviews/product/${productId}?limit=${limit}&offset=${offset}&handle=${handle}`),
    
  getCategoryReviews: (categoryName, limit = 10, offset = 0) => 
    apiCall(`/reviews/category/${encodeURIComponent(categoryName)}?limit=${limit}&offset=${offset}`),
  
  createReview: (productId, data) => 
    apiCall(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  markHelpful: (reviewId) => 
    apiCall(`/reviews/${reviewId}/helpful`, { method: 'PUT' }),

  markNotHelpful: (reviewId) => 
    apiCall(`/reviews/${reviewId}/not-helpful`, { method: 'PUT' }),
};

// ============ CART ============
export const cartAPI = {
  addToCart: (product_id, quantity, size, color) =>
    apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity, size, color }),
    }),

  getCart: () => apiCall('/cart'),

  removeFromCart: (product_id) =>
    apiCall(`/cart/${product_id}`, {
      method: 'DELETE',
    }),

  clearCart: () =>
    apiCall('/cart', {
      method: 'DELETE',
    }),
};

// ============ CHECKOUT / COMMANDES ============
export const checkoutAPI = {
  // Liste les commandes (proxy direct des orders Shopify)
  getUserOrders: () => apiCall('/orders'),

  // Récupère une commande spécifique par son ID Shopify
  getOrderById: (orderId) => apiCall(`/orders/${orderId}`),

  // Checkout direct Shopify : envoie les items au back, récupère le checkoutUrl
  // Shopify hosted (cartCreate via Storefront API) et redirige le client.
  createShopifyCheckout: (items, discountCode = null) => {
    const formattedItems = (items || [])
      .filter(i => i.variantId)
      .map(i => ({ variantId: i.variantId, quantity: i.quantity }));

    if (formattedItems.length === 0) {
      return Promise.reject(new Error('Aucun produit valide dans le panier (variantId Shopify manquant).'));
    }

    return apiCall('/shopify-checkout', {
      method: 'POST',
      body: JSON.stringify({
        items: formattedItems,
        discountCode: discountCode || undefined,
      }),
    });
  },

  // Valide un code de réduction Shopify avant le checkout
  // Renvoie { valid, code?, type?, value?, amount?, message? }
  validateDiscountCode: (code, subtotal) =>
    apiCall('/shopify-checkout/validate-discount', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
};

// ============ DASHBOARD ADMIN ============
export const dashboardAPI = {
  getDashboard: () => apiCall('/dashboard'),

  getStats: (period = '7days') =>
    apiCall(`/dashboard/stats?period=${period}`),

  getAllOrders: (status = '', limit = 50, offset = 0) =>
    apiCall(`/dashboard/orders?status=${status}&limit=${limit}&offset=${offset}`),

  getOrderDetails: (orderId) => apiCall(`/dashboard/orders/${orderId}`),

  updateOrderStatus: (orderId, status, paymentStatus, trackingNumber, notes) =>
    apiCall(`/dashboard/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus, trackingNumber, notes }),
    }),
};

