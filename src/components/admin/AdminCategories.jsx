import React from 'react';

export const AdminCategories = ({ categories, onEdit, onDelete, onAdd }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onAdd}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        + Ajouter une catégorie
      </button>

      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <p className="text-sm text-gray-600">Catégorie</p>
              <p className="font-bold">{category.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-700 truncate">{category.description || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Produits/Sous-catégories</p>
              <p className="font-bold">{category.productcount || 0} / {category.childcategorycount || 0}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex-1"
              >
                Éditer
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex-1"
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