import React from 'react';

export const AdminStock = ({ lowStock }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {lowStock && lowStock.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-3 sm:p-4 border-l-4 border-red-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-start">
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
              <p className="font-bold text-red-600 text-sm sm:text-base">{product.stock} unités</p>
            </div>
            <div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm transition-colors">
                Réapprovisionner
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
