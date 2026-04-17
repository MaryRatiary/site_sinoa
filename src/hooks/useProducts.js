import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';

export const useProducts = (query = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
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
 * Fonction utilitaire pour récupérer récursivement tous les IDs de sous-catégories
 */
const getAllCategoryIdsRecursive = (categoryId, allCategoriesFlat) => {
  const ids = new Set([parseInt(categoryId)]);
  
  const addChildIds = (parentId) => {
    parentId = parseInt(parentId);
    // Chercher les enfants avec parentid OU parentId (différentes conventions)
    const children = allCategoriesFlat.filter(cat => {
      const catParentId = cat.parentid !== undefined ? parseInt(cat.parentid) : (cat.parentId !== undefined ? parseInt(cat.parentId) : null);
      return catParentId === parentId;
    });
    
    children.forEach(child => {
      if (!ids.has(child.id)) {
        ids.add(parseInt(child.id));
        addChildIds(child.id);
      }
    });
  };
  
  addChildIds(categoryId);
  return Array.from(ids);
};

/**
 * Hook pour récupérer les produits d'une catégorie (parent + toutes les sous-catégories)
 * ✅ CORRIGÉ: Utilise getAllFlat() pour obtenir TOUTES les catégories
 */
export const useProductsByCategory = (categoryId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Récupérer TOUTES les catégories en format plat
        const allCategoriesFlat = await categoriesAPI.getAllFlat();
        console.log('🔍 Catégories (format plat) récupérées:', allCategoriesFlat.length);
        
        // 2. Obtenir tous les IDs de catégories (parent + sous-catégories récursives)
        const categoryIds = getAllCategoryIdsRecursive(categoryId, allCategoriesFlat);
        console.log('📂 IDs de catégories à afficher:', categoryIds);
        
        // 3. Récupérer tous les produits
        const allProducts = await productsAPI.getAll('?limit=50000');
        console.log('📦 Produits totaux récupérés:', allProducts.length);
        
        // 4. Filtrer les produits pour ceux qui appartiennent aux catégories
        const filteredProducts = allProducts.filter(product => {
          const prodCategoryId = parseInt(product.categoryId);
          return categoryIds.includes(prodCategoryId);
        });
        
        console.log('✅ Produits filtrés pour cette catégorie:', filteredProducts.length);
        console.log('📊 Détail filtrage:', {
          categoryIds,
          sampleProducts: filteredProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, categoryId: p.categoryId }))
        });
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des produits:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};

/**
 * Hook pour récupérer un produit par slug
 */
export const useProductBySlug = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product by slug:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};


