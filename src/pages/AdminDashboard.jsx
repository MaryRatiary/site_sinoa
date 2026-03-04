import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminStock } from '../components/admin/AdminStock';
import { Folder } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');

  // Fetch data
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [dashData, ordersData, statsData] = await Promise.all([
          dashboardAPI.getDashboard(),
          dashboardAPI.getAllOrders(),
          dashboardAPI.getStats('7days'),
        ]);

        setDashboard(dashData.dashboard);
        setOrders(ordersData);
        setStats(statsData.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  // Order handlers
  const handleUpdateOrder = async (orderId) => {
    try {
      await dashboardAPI.updateOrderStatus(orderId, orderStatus, 'paid', '');
      const updatedOrders = await dashboardAPI.getAllOrders();
      setOrders(updatedOrders);
      setSelectedOrder(null);
      setOrderStatus('pending');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-black text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-gray-300">Bienvenue, {user?.email}</p>
          </div>
          <button
            onClick={() => navigate('/admin/catalog')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
          >
            <Folder size={20} />
            Gestion du Catalogue
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          {['stats', 'orders', 'stock'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {tab === 'stats' && 'Statistiques'}
              {tab === 'orders' && `Commandes (${orders.length})`}
              {tab === 'stock' && 'Stock Bas'}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'stats' && dashboard && (
          <AdminStats dashboard={dashboard} stats={stats} />
        )}

        {activeTab === 'orders' && (
          <AdminOrders 
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            orderStatus={orderStatus}
            setOrderStatus={setOrderStatus}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {activeTab === 'stock' && dashboard?.lowStock && (
          <AdminStock lowStock={dashboard.lowStock} />
        )}
      </div>
    </div>
  );
}
