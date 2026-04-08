import React from 'react';

export const AdminProducts = ({ products, onEdit, onDelete, onAdd }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <button
        onClick={onAdd}
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
      >
        + Ajouter un produit
      </button>

      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Produit</p>
              <p className="font-bold text-sm sm:text-base truncate">{product.name}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Prix</p>
              <p className="font-bold text-purple-600 text-sm sm:text-base">{product.price}€</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Stock</p>
              <p className="font-bold text-sm sm:text-base">{product.stock}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Catégorie</p>
              <p className="text-gray-700 text-sm truncate">{product.categoryname || '-'}</p>
            </div>
            <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors"
              >
                Éditer
              </button>
              <button
                onClick={() => onDelete(product.id)}
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
