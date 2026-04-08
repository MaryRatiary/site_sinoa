import React from 'react';

export const AdminSubcategories = ({ subcategories, categories, onEdit, onDelete, onAdd, parentCategories }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <button
        onClick={onAdd}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
      >
        + Ajouter une sous-catégorie
      </button>

      {parentCategories.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 sm:px-4 py-3 rounded text-sm sm:text-base">
          Créez d'abord des catégories parentes avant d'ajouter des sous-catégories.
        </div>
      ) : null}

      {subcategories.map((subcategory) => {
        const parentCategory = categories.find(c => c.id === subcategory.parentid);
        return (
          <div key={subcategory.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-start">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Sous-catégorie</p>
                <p className="font-bold text-sm sm:text-base truncate">{subcategory.name}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Catégorie parent</p>
                <p className="text-gray-700 font-medium text-sm truncate">{parentCategory?.name || 'N/A'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Description</p>
                <p className="text-gray-700 truncate text-xs sm:text-sm">{subcategory.description || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Produits</p>
                <p className="font-bold text-sm sm:text-base">{subcategory.productcount || 0}</p>
              </div>
              <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                <button
                  onClick={() => onEdit(subcategory)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  Éditer
                </button>
                <button
                  onClick={() => onDelete(subcategory.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
