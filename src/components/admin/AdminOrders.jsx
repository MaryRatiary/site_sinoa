import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { OrderDetailsModal } from './OrderDetailsModal';
import { ChevronRight, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminOrders = ({ orders, onRefresh }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectOrder = async (orderId) => {
    setLoading(true);
    setError('');
    try {
      const details = await dashboardAPI.getOrderDetails(orderId);
      setOrderDetails(details);
      setSelectedOrderId(orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId, updates) => {
    try {
      await dashboardAPI.updateOrderStatus(
        orderId,
        updates.status,
        updates.paymentStatus,
        updates.trackingNumber,
        updates.notes
      );
      setSelectedOrderId(null);
      setOrderDetails(null);
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />;
      case 'processing': return <Truck className="text-blue-600" size={16} />;
      case 'pending': return <Clock className="text-yellow-600" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-600" size={16} />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle size={40} className="mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-gray-600 text-base sm:text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Commande</p>
                    <p className="font-bold text-[#5E2251] text-base sm:text-lg">#{order.id}</p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Client</p>
                    <p className="font-semibold text-gray-900 text-sm truncate">{order.firstname} {order.lastname}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{order.email}</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Montant</p>
                    <p className="font-bold text-green-600 text-base sm:text-lg">{parseFloat(order.totalprice).toFixed(2)}€</p>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Statut</p>
                    <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${getStatusBg(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize hidden sm:inline">{order.status}</span>
                      <span className="capitalize sm:hidden">{order.status.substring(0, 3)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectOrder(order.id)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-colors disabled:opacity-50 w-full lg:w-auto text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Voir Détails</span>
                  <span className="sm:hidden">Détails</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {orderDetails && (
        <OrderDetailsModal
          order={orderDetails}
          isOpen={selectedOrderId !== null}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={handleUpdateOrder}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="min-w-0">
            <p className="font-bold text-red-900">Erreur</p>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}
    </>
  );
};
