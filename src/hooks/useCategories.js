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
        console.error('❌ Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryById = (id) =>
    categories.find(cat => cat.id === parseInt(id));

  const getChildCategories = (parent_id) =>
    categories.filter(cat => cat.parent_id === parseInt(parent_id));

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
export const useChildCategories = (parent_id) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getChildren(parent_id);
        setChildren(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching child categories:', err);
        setError(err.message);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    if (parent_id) {
      fetchChildren();
    } else {
      setChildren([]);
      setLoading(false);
    }
  }, [parent_id]);

  return {
    children,
    loading,
    error,
  };
};

/**
 * Hook pour récupérer une catégorie avec ses détails complets
 */
export const useCategoryWithDetails = (category_id) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getById(category_id);
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching category:', err);
        setError(err.message);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (category_id) {
      fetchCategory();
    } else {
      setCategory(null);
      setLoading(false);
    }
  }, [category_id]);

  return {
    category,
    loading,
    error,
  };
};

/**
 * Hook pour récupérer une catégorie par slug
 */
export const useCategoryBySlug = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoriesAPI.getBySlug(slug);
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching category by slug:', err);
        setError(err.message);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    } else {
      setCategory(null);
      setLoading(false);
    }
  }, [slug]);

  return {
    category,
    loading,
    error,
  };
};
