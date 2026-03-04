import React from 'react';

export const AdminSubcategories = ({ subcategories, categories, onEdit, onDelete, onAdd, parentCategories }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onAdd}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        + Ajouter une sous-catégorie
      </button>

      {parentCategories.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Créez d'abord des catégories parentes avant d'ajouter des sous-catégories.
        </div>
      ) : null}

      {subcategories.map((subcategory) => {
        const parentCategory = categories.find(c => c.id === subcategory.parentid);
        return (
          <div key={subcategory.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div>
                <p className="text-sm text-gray-600">Sous-catégorie</p>
                <p className="font-bold">{subcategory.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Catégorie parent</p>
                <p className="text-gray-700 font-medium">{parentCategory?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-700 truncate">{subcategory.description || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Produits</p>
                <p className="font-bold">{subcategory.productcount || 0}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(subcategory)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex-1"
                >
                  Éditer
                </button>
                <button
                  onClick={() => onDelete(subcategory.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex-1"
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