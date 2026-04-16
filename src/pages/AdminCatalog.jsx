import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, categoriesAPI, productsAPI } from '../services/api';
import { CategoryTree } from '../components/admin/CategoryTree';
import { CatalogDetailsPanel } from '../components/admin/CatalogDetailsPanel';
import { CategoryModal } from '../components/admin/CategoryModal';
import { ProductModal } from '../components/admin/ProductModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminCatalog() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [treeOpen, setTreeOpen] = useState(true);

  // ...existing code...

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchData();
  }, [isAdmin, navigate]);

  // ...existing code...

  const handleAddCategory = () => {
    resetCategoryForm();
    setIsSubcategoryMode(false);
    setModalMode('add');
    setShowCategoryModal(true);
  };

  const handleAddSubcategory = (parentId) => {
    resetCategoryForm();
    setCategoryForm({ name: '', description: '', image: '', parentId });
    setIsSubcategoryMode(true);
    setModalMode('add');
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || null
    });
    setCategoryImage(null);
    setIsSubcategoryMode(!!category.parentId);
    setModalMode('edit');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (!categoryForm.name) {
        setError('Le nom est requis');
        return;
      }

      const dataToSend = {
        ...categoryForm,
        image: categoryImage || categoryForm.image,
      };

      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, dataToSend);
      } else {
        await categoriesAPI.create(dataToSend);
      }

      const updatedCategories = await categoriesAPI.getAll();
      setCategories(updatedCategories);
      setShowCategoryModal(false);
      resetCategoryForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await categoriesAPI.delete(id);
        const updatedCategories = await categoriesAPI.getAll();
        setCategories(updatedCategories);
        setSelectedItem(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', image: '', parentId: null });
    setCategoryImage(null);
    setEditingCategory(null);
  };

  // ...existing code...

  const handleAddProduct = (categoryId) => {
    resetProductForm();
    setProductForm({ ...productForm, categoryId });
    setModalMode('add');
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    
    // Normaliser les tailles - extraire juste les noms si ce sont des objets
    const normalizedSizes = Array.isArray(product.sizes) 
      ? product.sizes.map(s => typeof s === 'string' ? s : s.size)
      : [];
    
    // Normaliser les couleurs - garder la structure {name, hex}
    const normalizedColors = Array.isArray(product.colors)
      ? product.colors.map(c => ({
          name: c.colorName || c.name || '',
          hex: c.colorHex || c.hex || '#000000'
        }))
      : [];
    
    // Charger les images existantes du produit
    const existingImages = Array.isArray(product.images)
      ? product.images.map(img => ({
          url: img,
          isMainImage: img === product.image,
          isHoverImage: img === product.hoverImage,
        }))
      : [];
    
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      categoryId: product.categoryId || '',
      stock: product.stock || '',
      brand: product.brand || '',
      material: product.material || '',
      careInstructions: product.careInstructions || '',
      sizes: normalizedSizes,
      colors: normalizedColors
    });
    setProductImages(existingImages);
    setModalMode('edit');
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!productForm.name || !productForm.price || !productForm.categoryId) {
        setError('Nom, prix et catégorie requis');
        return;
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stock: parseInt(productForm.stock) || 0,
        brand: productForm.brand || '',
        material: productForm.material || '',
        careInstructions: productForm.careInstructions || '',
        sizes: productForm.sizes || [],
        colors: productForm.colors || [],
      };

      let productId;
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        productId = editingProduct.id;
      } else {
        const response = await productsAPI.create(productData);
        productId = response.id;
      }

      if (productImages.length > 0) {
        for (const [index, image] of productImages.entries()) {
          if (image.url.startsWith('data:')) {
            await productsAPI.addImage(productId, {
              imageUrl: image.url,
              isMainImage: image.isMainImage,
              isHoverImage: image.isHoverImage,
              order: index,
            });
          }
        }
      }

      const updatedProducts = await productsAPI.getAll();
      setProducts(updatedProducts);
      setShowProductModal(false);
      resetProductForm();
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productsAPI.delete(id);
        const updatedProducts = await productsAPI.getAll();
        setProducts(updatedProducts);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({ 
      name: '', 
      description: '', 
      price: '', 
      originalPrice: '', 
      categoryId: '', 
      stock: '',
      brand: '',
      material: '',
      careInstructions: '',
      sizes: [],
      colors: []
    });
    setProductImages([]);
    setEditingProduct(null);
  };

  const getAllCategoriesAsOptions = () => {
    const flattenCategories = (cats, result = []) => {
      cats.forEach(cat => {
        result.push(cat);
        if (cat.children && cat.children.length > 0) {
          flattenCategories(cat.children, result);
        }
      });
      return result;
    };
    
    return flattenCategories(categories);
  };

  const parentCategories = categories.filter(c => !c.parentId);
  const allCategoriesAsOptions = getAllCategoriesAsOptions();

  // Form States
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '', parentId: null });
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubcategoryMode, setIsSubcategoryMode] = useState(false);

  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', originalPrice: '', categoryId: '', stock: '' });
  const [productImages, setProductImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // UI States
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl sm:text-2xl">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 mx-3 sm:mx-4 mt-4 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Main Layout - Responsive */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-0 lg:gap-0">
        {/* Sidebar - Category Tree (Responsive) */}
        <div className={`${
          treeOpen ? 'block' : 'hidden'
        } lg:block lg:w-64 xl:w-80 bg-gray-50 border-r border-gray-300 overflow-hidden transition-all duration-300 h-screen lg:h-auto`}>
          <CategoryTree
            categories={categories}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onAddCategory={handleAddCategory}
            onAddSubcategory={handleAddSubcategory}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setTreeOpen(!treeOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title={treeOpen ? 'Masquer le catalogue' : 'Afficher le catalogue'}
        >
          {treeOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Main Panel - Details (Responsive) */}
        <div className="flex-1 overflow-y-auto">
          <CatalogDetailsPanel
            selectedItem={selectedItem}
            categories={categories}
            products={products}
            onAddProduct={handleAddProduct}
            onEditItem={(item) => {
              // Vérifier si c'est un produit : les produits ont 'price', 'categoryId', etc.
              if (item.price !== undefined || item.categoryId !== undefined) {
                handleEditProduct(item);
              } else {
                handleEditCategory(item);
              }
            }}
            onDeleteItem={(item) => {
              // Vérifier si c'est un produit en regardant l'item lui-même, pas selectedItem
              if (item?.price !== undefined || item?.categoryId !== undefined) {
                handleDeleteProduct(item.id);
              } else {
                handleDeleteCategory(item.id);
              }
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <CategoryModal
        show={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          resetCategoryForm();
        }}
        isEditing={modalMode === 'edit'}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        categoryImage={categoryImage}
        setCategoryImage={setCategoryImage}
        parentCategories={allCategoriesAsOptions}
        isSubcategory={isSubcategoryMode}
        onSave={handleSaveCategory}
      />

      <ProductModal
        show={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          resetProductForm();
        }}
        isEditing={modalMode === 'edit'}
        productForm={productForm}
        setProductForm={setProductForm}
        productImages={productImages}
        setProductImages={setProductImages}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
