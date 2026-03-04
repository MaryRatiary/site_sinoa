import React from 'react';

export const AdminStock = ({ lowStock }) => {
  return (
    <div className="space-y-4">
      {lowStock && lowStock.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Produit</p>
              <p className="font-bold">{product.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prix</p>
              <p className="font-bold text-purple-600">{product.price}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock</p>
              <p className="font-bold text-red-600">{product.stock} unités</p>
            </div>
            <div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm w-full">
                Réapprovisionner
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};