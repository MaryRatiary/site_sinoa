import React from 'react';

export const AdminCategories = ({ categories, onEdit, onDelete, onAdd }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <button
        onClick={onAdd}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
      >
        + Ajouter une catégorie
      </button>

      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-start">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Catégorie</p>
              <p className="font-bold text-sm sm:text-base truncate">{category.name}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Description</p>
              <p className="text-gray-700 truncate text-xs sm:text-sm">{category.description || '-'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Produits/Sous-catégories</p>
              <p className="font-bold text-sm sm:text-base">{category.productcount || 0} / {category.childcategorycount || 0}</p>
            </div>
            <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => onEdit(category)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors"
              >
                Éditer
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
