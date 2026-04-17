// Ajouter cette méthode à categoriesAPI dans api.js
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  
  getAllFlat: () => apiCall('/categories/flat/all'),  // ✅ NOUVEAU
  
  getById: (id) => apiCall(`/categories/${id}`),

  getChildren: (parentId) => apiCall(`/categories/${parentId}/children`),

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

  delete: (id) =>
    apiCall(`/categories/${id}`, {
      method: 'DELETE',
    }),

  reorder: (categoryId, targetCategoryId) =>
    apiCall(`/categories/${categoryId}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ targetCategoryId }),
    }),
};
