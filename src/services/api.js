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
    const error = await response.json();
    throw new Error(error.error || 'API Error');
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

  // ✅ NOUVEAU: Vérifier ce qui sera supprimé avant suppression
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

  // Images
  addImage: (product_id, imageData) =>
    apiCall(`/products/${product_id}/images`, {
      method: 'POST',
      body: JSON.stringify(imageData),
    }),

  // Tailles
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

  // Couleurs
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
  createOrder: (items, shippingAddress, paymentMethod, shippingDetails = {}) =>
    apiCall('/checkout', {
      method: 'POST',
      body: JSON.stringify({ 
        items, 
        shippingAddress, 
        paymentMethod,
        first_name: shippingDetails.first_name,
        last_name: shippingDetails.last_name,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        city: shippingDetails.city,
        postal_code: shippingDetails.postal_code,
        country: shippingDetails.country,
        latitude: shippingDetails.latitude,
        longitude: shippingDetails.longitude,
        notes: shippingDetails.notes
      }),
    }),

  getUserOrders: () => apiCall('/checkout'),

  getOrderById: (orderId) => apiCall(`/checkout/${orderId}`),

  cancelOrder: (orderId) =>
    apiCall(`/checkout/${orderId}/cancel`, {
      method: 'PUT',
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
