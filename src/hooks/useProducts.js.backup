import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

/**
 * Hook pour récupérer tous les produits
 * @param {string} query - Paramètres de requête (ex: ?limit=500&offset=0)
 * @returns {Object} {products, loading, error}
 */
export const useProducts = (query = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ CORRIGÉ: limit=50000 par défaut si aucun query fourni
        const finalQuery = query || '?limit=50000';
        const data = await productsAPI.getAll(finalQuery);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return { products, loading, error };
};

/**
 * Hook pour récupérer un produit par ID avec détails
 * @param {number} productId - ID du produit
 * @returns {Object} {product, loading, error}
 */
export const useProductById = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

/**
 * Hook pour récupérer les produits d'une catégorie
 * @param {number} categoryId - ID de la catégorie
 * @returns {Object} {products, loading, error}
 */
export const useProductsByCategory = (categoryId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // ✅ CORRIGÉ: limit=50000 pour récupérer tous les produits de la catégorie
        const data = await productsAPI.getAll(`?categoryId=${categoryId}&limit=50000`);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};