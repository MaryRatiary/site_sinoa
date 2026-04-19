import React, { useState } from 'react';
import { ImageDropZone } from './ImageDropZone';
import { X, Loader } from 'lucide-react';

export const CategoryModal = ({ 
  show, 
  onClose, 
  isEditing, 
  categoryForm, 
  setCategoryForm, 
  categoryImage, 
  setCategoryImage,
  parentCategories,
  isSubcategory,
  onSave 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const getCategoryPath = (category_id, allCategories) => {
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
    
    const path = findPath(category_id, allCategories);
    return path ? path.join(' > ') : '';
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {isEditing 
              ? isSubcategory ? 'Éditer la sous-catégorie' : 'Éditer la catégorie'
              : isSubcategory ? 'Ajouter une sous-catégorie' : 'Ajouter une catégorie'
            }
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={isSubcategory ? 'Nom de la sous-catégorie' : 'Nom de la catégorie'}
            />
          </div>

          {isSubcategory && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Catégorie parent *
              </label>
              <select
                value={categoryForm.parent_id || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionner une catégorie parent</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getCategoryPath(cat.id, parentCategories)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={isSubcategory ? 'Description de la sous-catégorie' : 'Description de la catégorie'}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Image
            </label>
            <ImageDropZone
              onImageSelected={setCategoryImage}
              preview={categoryImage}
              onRemove={() => setCategoryImage(null)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-2 sm:py-3 px-4 rounded-lg transition text-sm sm:text-base disabled:cursor-not-allowed"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
