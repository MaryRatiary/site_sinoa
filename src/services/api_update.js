// Ajouter cette méthode à categoriesAPI dans api.js
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  
  getAllFlat: () => apiCall('/categories/flat/all'),  // ✅ NOUVEAU
  
  getById: (id) => apiCall(`/categories/${id}`),

  getChildren: (parent_id) => apiCall(`/categories/${parent_id}/children`),

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

  reorder: (category_id, targetCategoryId) =>
    apiCall(`/categories/${category_id}/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ targetCategoryId }),
    }),
};
