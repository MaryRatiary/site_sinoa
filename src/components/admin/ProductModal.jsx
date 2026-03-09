import React, { useState } from 'react';
import { MultiImageUpload } from './MultiImageUpload';
import { X, Plus } from 'lucide-react';

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
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

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

  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];

  const handleAddSize = () => {
    if (newSize && !productForm.sizes?.includes(newSize)) {
      setProductForm({
        ...productForm,
        sizes: [...(productForm.sizes || []), newSize]
      });
      setNewSize('');
    }
  };

  const handleRemoveSize = (size) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter(s => s !== size)
    });
  };

  const handleAddColor = () => {
    if (newColor && !productForm.colors?.some(c => c.name === newColor)) {
      setProductForm({
        ...productForm,
        colors: [...(productForm.colors || []), { name: newColor, hex: newColorHex }]
      });
      setNewColor('');
      setNewColorHex('#000000');
    }
  };

  const handleRemoveColor = (colorName) => {
    setProductForm({
      ...productForm,
      colors: productForm.colors.filter(c => c.name !== colorName)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

          {/* TAILLES */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tailles Disponibles
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Sélectionner une taille</option>
                {AVAILABLE_SIZES.map((size) => (
                  <option key={size} value={size} disabled={productForm.sizes?.includes(size)}>
                    {size}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSize}
                disabled={!newSize}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productForm.sizes?.map((size) => (
                <div
                  key={size}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {size}
                  <button
                    onClick={() => handleRemoveSize(size)}
                    className="hover:text-purple-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COULEURS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleurs Disponibles
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Nom de la couleur (ex: Noir, Rose, Bleu)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <button
                onClick={handleAddColor}
                disabled={!newColor}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productForm.colors?.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border-2"
                  style={{ borderColor: color.hex }}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                  <button
                    onClick={() => handleRemoveColor(color.name)}
                    className="hover:text-red-600 ml-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AUTRES DONNÉES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                value={productForm.brand || ''}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ex: HYBE, SM Entertainment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matière
              </label>
              <input
                type="text"
                value={productForm.material || ''}
                onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Ex: Coton 100%"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions d'Entretien
            </label>
            <textarea
              value={productForm.careInstructions || ''}
              onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Lavage à l'eau froide, séchage à l'air..."
              rows="2"
            />
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
const getAllCategoriesFlat = (allCategories) => {
  const result = [];
  const traverse = (cats, depth = 0) => {
    cats.forEach(cat => {
      const path = getCategoryPath(cat.id, allCategories);
      result.push({ ...cat, path, depth });
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children, depth + 1);
      }
    });
  };
  traverse(allCategories);
  return result;
};