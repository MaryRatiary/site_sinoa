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
        
        // ✅ Validate data structure
        if (!Array.isArray(data)) {
          console.warn('⚠️ Products API returned non-array:', typeof data);
          setProducts([]);
        } else {
          setProducts(data);
          console.log(`✅ Products loaded: ${data.length}`);
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
 * ✅ FIXED: Only checks 'parent_id' (normalized from backend)
 */
const getAllCategoryIdsRecursive = (category_id, allCategoriesFlat) => {
  const ids = new Set([parseInt(category_id)]);
  
  const addChildIds = (parent_id) => {
    parent_id = parseInt(parent_id);
    
    // ✅ FIXED: Only check parent_id (consistent with backend normalization)
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
 * ✅ FIXED: Uses proper field names and better error handling
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
        
        // 1. Get all categories in flat format
        const allCategoriesFlat = await categoriesAPI.getAllFlat();
        console.log(`📂 Flat categories retrieved: ${allCategoriesFlat.length}`);
        
        if (!Array.isArray(allCategoriesFlat) || allCategoriesFlat.length === 0) {
          console.warn('⚠️ No categories found in database');
          setProducts([]);
          setError('No categories available');
          return;
        }
        
        // 2. Get all category IDs (parent + recursive subcategories)
        const category_ids = getAllCategoryIdsRecursive(category_id, allCategoriesFlat);
        console.log(`🗂️ Category IDs to display:`, category_ids);
        
        // 3. Get all products
        const allProducts = await productsAPI.getAll('?limit=50000');
        console.log(`📦 Total products retrieved: ${allProducts.length}`);
        
        if (!Array.isArray(allProducts)) {
          console.warn('⚠️ Products API returned non-array');
          setProducts([]);
          return;
        }
        
        // 4. Filter products for this category and its subcategories
        const filteredProducts = allProducts.filter(product => {
          const prodCategoryId = parseInt(product.category_id);
          return category_ids.includes(prodCategoryId);
        });
        
        console.log(`✅ Filtered products for category: ${filteredProducts.length}`);
        console.log('📊 Sample:', {
          category_ids,
          matchedProducts: filteredProducts.slice(0, 3).map(p => ({ 
            id: p.id, 
            name: p.name, 
            category_id: p.category_id 
          }))
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