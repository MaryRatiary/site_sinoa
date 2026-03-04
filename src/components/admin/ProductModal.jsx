import React from 'react';
import { MultiImageUpload } from './MultiImageUpload';

export const ProductModal = ({ 
  show, 
  onClose, 
  isEditing, 
  productForm, 
  setProductForm, 
  productImages,
  setProductImages,
  categories,
  onSave 
}) => {
  if (!show) return null;

  // Fonction pour obtenir le chemin complet d'une catégorie
  const getCategoryPath = (categoryId, allCategories) => {
    const findPath = (id, cats, path = []) => {
      for (const cat of cats) {
        if (cat.id === id) {
          return [...path, cat.name];
        }
        if (cat.children && cat.children.length > 0) {
          const result = findPath(id, cat.children, [...path, cat.name]);
          if (result) return result;
        }
      }
      return null;
    };
    
    const path = findPath(categoryId, allCategories);
    return path ? path.join(' > ') : '';
  };

  // Fonction pour obtenir toutes les catégories à plat avec leur chemin
  const getAllCategoriesFlat = () => {
    const result = [];
    const traverse = (cats, depth = 0) => {
      cats.forEach(cat => {
        const path = getCategoryPath(cat.id, categories);
        result.push({ ...cat, path, depth });
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, depth + 1);
        }
      });
    };
    traverse(categories);
    return result;
  };

  const flatCategories = getAllCategoriesFlat();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Éditer le produit' : 'Ajouter un produit'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Description du produit"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix *
              </label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix Original
              </label>
              <input
                type="number"
                step="0.01"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Sélectionner une catégorie</option>
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {'—'.repeat(cat.depth)} {cat.path}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du produit (plusieurs possibles)
            </label>
            <MultiImageUpload
              images={productImages}
              onImagesChange={setProductImages}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};