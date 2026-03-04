import React from 'react';

export const AdminOrders = ({ orders, selectedOrder, setSelectedOrder, orderStatus, setOrderStatus, onUpdateOrder }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-gray-600">Commande</p>
              <p className="font-bold">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-bold">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-bold text-purple-600">{order.totalprice}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div>
              <button
                onClick={() => setSelectedOrder(order.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm w-full"
              >
                Gérer
              </button>
            </div>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Mettre à jour la commande #{selectedOrder}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="completed">Complété</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onUpdateOrder(selectedOrder)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};