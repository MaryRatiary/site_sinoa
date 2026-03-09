import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import { OrderDetailsModal } from './OrderDetailsModal';
import { ChevronRight, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminOrders = ({ orders, onRefresh }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les détails complets d'une commande
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

  // Mettre à jour le statut d'une commande
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
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">Commande</p>
                    <p className="font-bold text-[#5E2251] text-lg">#{order.id}</p>
                  </div>

                  {/* Client */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">Client</p>
                    <p className="font-semibold text-gray-900">{order.firstname} {order.lastname}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">Montant</p>
                    <p className="font-bold text-green-600 text-lg">{parseFloat(order.totalprice).toFixed(2)}€</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">Statut</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getStatusBg(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectOrder(order.id)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 w-full md:w-auto justify-center"
                >
                  Voir Détails
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {orderDetails && (
        <OrderDetailsModal
          order={orderDetails}
          isOpen={selectedOrderId !== null}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={handleUpdateOrder}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-red-900">Erreur</p>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
    </>
  );
};