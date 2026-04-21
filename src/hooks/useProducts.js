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
        const finalQuery = query || '?limit=250';
        const data = await productsAPI.getAll(finalQuery);
        
        if (!Array.isArray(data)) {
          console.warn('⚠️ Products API returned non-array:', typeof data);
          setProducts([]);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return { products, loading, error };
};

export const useProductById = (product_id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product_id) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(product_id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  return { product, loading, error };
};

/**
 * Utility function to recursively get all subcategory IDs
 */
const getAllCategoryIdsRecursive = (category_id, allCategoriesFlat) => {
  const ids = new Set([parseInt(category_id)]);
  
  const addChildIds = (parent_id) => {
    parent_id = parseInt(parent_id);
    
    const children = allCategoriesFlat.filter(cat => {
      const catParentId = cat.parent_id !== undefined 
        ? parseInt(cat.parent_id) 
        : null;
      return catParentId === parent_id;
    });
    
    children.forEach(child => {
      if (!ids.has(child.id)) {
        ids.add(parseInt(child.id));
        addChildIds(child.id);
      }
    });
  };
  
  addChildIds(category_id);
  return Array.from(ids);
};

/**
 * Hook to get products for a category (parent + all subcategories)
 */
export const useProductsByCategory = (category_id) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category_id) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allCategoriesFlat = await categoriesAPI.getAllFlat();
        
        if (!Array.isArray(allCategoriesFlat) || allCategoriesFlat.length === 0) {
          console.warn('⚠️ No categories found in database');
          setProducts([]);
          setError('No categories available');
          return;
        }
        
        const category_ids = getAllCategoryIdsRecursive(category_id, allCategoriesFlat);
        
        const allProducts = await productsAPI.getAll('?limit=250');
        
        if (!Array.isArray(allProducts)) {
          console.warn('⚠️ Products API returned non-array');
          setProducts([]);
          return;
        }
        
        const filteredProducts = allProducts.filter(product => {
          const prodCategoryId = parseInt(product.category_id);
          return category_ids.includes(prodCategoryId);
        });
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error('❌ Error loading products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category_id]);

  return { products, loading, error };
};

/**
 * Hook to get a product by slug
 */
export const useProductBySlug = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getBySlug(slug);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching product by slug:', err);
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
