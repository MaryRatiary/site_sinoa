import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, categoriesAPI, productsAPI } from '../services/api';
import { CategoryTree } from '../components/admin/CategoryTree';
import { CatalogDetailsPanel } from '../components/admin/CatalogDetailsPanel';
import { CategoryModal } from '../components/admin/CategoryModal';
import { ProductModal } from '../components/admin/ProductModal';

export default function AdminCatalog() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI States
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  // Form States
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '', parentId: null });
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubcategoryMode, setIsSubcategoryMode] = useState(false);

  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', originalPrice: '', categoryId: '', stock: '' });
  const [productImages, setProductImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch data
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

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

    fetchData();
  }, [isAdmin, navigate]);

  // Category Handlers
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
      parentId: category.parentid || null
    });
    setCategoryImage(null);
    setIsSubcategoryMode(!!category.parentid);
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

  // Product Handlers
  const handleAddProduct = (categoryId) => {
    resetProductForm();
    setProductForm({ ...productForm, categoryId });
    setModalMode('add');
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalprice || '',
      categoryId: product.categoryid || '',
      stock: product.stock || ''
    });
    setProductImages([]);
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
    setProductForm({ name: '', description: '', price: '', originalPrice: '', categoryId: '', stock: '' });
    setProductImages([]);
    setEditingProduct(null);
  };

  // Fonction pour récupérer toutes les catégories possibles en tant que parent
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

  const parentCategories = categories.filter(c => !c.parentid);
  const allCategoriesAsOptions = getAllCategoriesAsOptions();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Gestion du Catalogue</h1>
          <p className="text-gray-300">Bienvenue, {user?.email}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Category Tree */}
        <div className="w-72 bg-gray-50 border-r border-gray-300 overflow-hidden">
          <CategoryTree
            categories={categories}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onAddCategory={handleAddCategory}
            onAddSubcategory={handleAddSubcategory}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Main Panel - Details */}
        <CatalogDetailsPanel
          selectedItem={selectedItem}
          categories={categories}
          products={products}
          onAddProduct={handleAddProduct}
          onEditItem={(item) => {
            if (item.type === 'product' || item.price !== undefined) {
              handleEditProduct(item);
            } else {
              handleEditCategory(item);
            }
          }}
          onDeleteItem={(id) => {
            if (selectedItem?.type === 'product' || selectedItem?.price !== undefined) {
              handleDeleteProduct(id);
            } else {
              handleDeleteCategory(id);
            }
          }}
        />
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
