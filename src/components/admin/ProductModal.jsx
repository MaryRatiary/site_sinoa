import { RichDescriptionEditor } from './RichDescriptionEditor';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {isEditing ? 'Éditer le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
              placeholder="Nom du produit"
            />
          </div>

          <div>
            <RichDescriptionEditor
              value={productForm.description}
              onChange={(desc) => setProductForm({ ...productForm, description: desc })}
              placeholder="Décrivez votre produit avec style... (Markdown supporté)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Prix *
              </label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Prix Original
              </label>
              <input
                type="number"
                step="0.01"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Catégorie *
              </label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Stock
              </label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Tailles Disponibles
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
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
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 text-sm flex-shrink-0"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productForm.sizes?.map((size) => (
                <div
                  key={size}
                  className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
                >
                  {size}
                  <button
                    onClick={() => handleRemoveSize(size)}
                    className="hover:text-purple-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Couleurs Disponibles
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Nom de la couleur (ex: Noir, Rose, Bleu)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
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
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 text-sm flex-shrink-0"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productForm.colors?.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 bg-gray-100 px-2 sm:px-3 py-1 rounded-full border-2 text-xs sm:text-sm"
                  style={{ borderColor: color.hex }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="truncate">{color.name}</span>
                  <button
                    onClick={() => handleRemoveColor(color.name)}
                    className="hover:text-red-600 ml-1 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Marque
              </label>
              <input
                type="text"
                value={productForm.brand || ''}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                placeholder="Ex: HYBE, SM Entertainment"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Matière
              </label>
              <input
                type="text"
                value={productForm.material || ''}
                onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                placeholder="Ex: Coton 100%"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Instructions d'Entretien
            </label>
            <textarea
              value={productForm.careInstructions || ''}
              onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
              placeholder="Lavage à l'eau froide, séchage à l'air..."
              rows="2"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Images du produit (plusieurs possibles)
            </label>
            <MultiImageUpload
              images={productImages}
              onImagesChange={setProductImages}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base"
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
