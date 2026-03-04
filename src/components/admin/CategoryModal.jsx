import React from 'react';
import { ImageDropZone } from './ImageDropZone';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing 
            ? isSubcategory ? 'Éditer la sous-catégorie' : 'Éditer la catégorie'
            : isSubcategory ? 'Ajouter une sous-catégorie' : 'Ajouter une catégorie'
          }
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={isSubcategory ? 'Nom de la sous-catégorie' : 'Nom de la catégorie'}
            />
          </div>

          {isSubcategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie parent *
              </label>
              <select
                value={categoryForm.parentId || ''}
                onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={isSubcategory ? 'Description de la sous-catégorie' : 'Description de la catégorie'}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <ImageDropZone
              onImageSelected={setCategoryImage}
              preview={categoryImage}
              onRemove={() => setCategoryImage(null)}
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