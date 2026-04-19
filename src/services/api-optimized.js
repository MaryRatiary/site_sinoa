// ✅ OPTIMISATION: API avec timeout, retry logic et cache

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Cache simple en mémoire (5 minutes)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

// ✅ Timeout helper
const fetchWithTimeout = (url, options = {}, timeoutMs = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('API Timeout')), timeoutMs)
    )
  ]);
};

// ✅ Retry logic
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchWithTimeout(url, options, 10000);
    } catch (err) {
      lastError = err;
      if (i < maxRetries - 1) {
        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 100));
      }
    }
  }
  
  throw lastError;
};

// ✅ Helper pour les requêtes avec cache et retry
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}_${endpoint}`;

  // ✅ Check cache for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`📦 Cache hit: ${endpoint}`);
      return cached.data;
    }
  }

  try {
    const response = await fetchWithRetry(url, {
      ...options,
      headers,
    }, 3);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'API Error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // ✅ Cache successful GET responses
    if (!options.method || options.method === 'GET') {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  } catch (err) {
    console.error(`❌ API Error on ${endpoint}:`, err.message);
    throw err;
  }
};

// ✅ Invalidate cache
export const invalidateCache = (pattern) => {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
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
    invalidateCache();
  },
};

// ============ CATEGORIES ============
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),

  getById: (id) => apiCall(`/categories/${id}`),

  getChildren: (parent_id) => apiCall(`/categories/${parent_id}/children`),

  create: (data) =>
    apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(res => {
      invalidateCache('categories');
      return res;
    }),

  update: (id, data) =>
    apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(res => {
      invalidateCache('categories');
      return res;
    }),

  delete: (id) =>
    apiCall(`/categories/${id}`, {
      method: 'DELETE',
    }).then(res => {
      invalidateCache('categories');
      return res;
    }),
};

// ============ PRODUCTS ============
export const productsAPI = {
  getAll: (query = '') => apiCall(`/products${query}`),

  getById: (id) => apiCall(`/products/${id}`),

  create: (data) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(res => {
      invalidateCache('products');
      return res;
    }),

  update: (id, data) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }).then(res => {
      invalidateCache('products');
      return res;
    }),

  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }).then(res => {
      invalidateCache('products');
      return res;
    }),

  addImage: (product_id, imageData) =>
    apiCall(`/products/${product_id}/images`, {
      method: 'POST',
      body: JSON.stringify(imageData),
    }).then(res => {
      invalidateCache(`products/${product_id}`);
      return res;
    }),

  addSize: (product_id, size, stock) =>
    apiCall(`/products/${product_id}/sizes`, {
      method: 'POST',
      body: JSON.stringify({ size, stock }),
    }).then(res => {
      invalidateCache(`products/${product_id}`);
      return res;
    }),

  updateSizeStock: (product_id, sizeId, stock) =>
    apiCall(`/products/${product_id}/sizes/${sizeId}`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    }).then(res => {
      invalidateCache(`products/${product_id}`);
      return res;
    }),

  addColor: (product_id, color_name, color_hex, stock) =>
    apiCall(`/products/${product_id}/colors`, {
      method: 'POST',
      body: JSON.stringify({ color_name, color_hex, stock }),
    }).then(res => {
      invalidateCache(`products/${product_id}`);
      return res;
    }),

  updateColorStock: (product_id, colorId, stock) =>
    apiCall(`/products/${product_id}/colors/${colorId}`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    }).then(res => {
      invalidateCache(`products/${product_id}`);
      return res;
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
    }).then(res => {
      invalidateCache('checkout');
      return res;
    }),

  getUserOrders: () => apiCall('/checkout'),

  getOrderById: (orderId) => apiCall(`/checkout/${orderId}`),

  cancelOrder: (orderId) =>
    apiCall(`/checkout/${orderId}/cancel`, {
      method: 'PUT',
    }).then(res => {
      invalidateCache('checkout');
      return res;
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
    }).then(res => {
      invalidateCache('dashboard/orders');
      return res;
    }),
};
