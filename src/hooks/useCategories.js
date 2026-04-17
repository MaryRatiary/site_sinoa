import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getAll();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id) =>
    categories.find(cat => cat.id === parseInt(id)); // ✅ CORRIGÉ: parseInt pour cohérence

  // ✅ CORRIGÉ: parseInt ajouté pour éviter le bug string vs number
  const getChildCategories = (parentId) =>
    categories.filter(cat => cat.parentid === parseInt(parentId));

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getChildCategories,
  };
};

/**
 * Hook pour récupérer les sous-catégories d'une catégorie parente
 */
export const useChildCategories = (parentId) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        // ✅ Utilise l'endpoint dédié au lieu de tout récupérer et filtrer côté client
        const data = await categoriesAPI.getChildren(parentId);
        setChildren(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching child categories:', err);
        setError(err.message);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchChildren();
    }
  }, [parentId]);

  return {
    children,
    loading,
    error,
  };
};

/**
 * Hook pour récupérer une catégorie avec ses détails complets
 */
export const useCategoryWithDetails = (categoryId) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getById(categoryId);
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.message);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  return {
    category,
    loading,
    error,
  };
};