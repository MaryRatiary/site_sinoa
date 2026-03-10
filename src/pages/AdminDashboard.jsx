import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminStock } from '../components/admin/AdminStock';
import { TrendingUp, Package, AlertCircle, Clock } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Quick stats cards
  const quickStats = [
    {
      label: 'Total Ventes',
      value: dashboard?.totalSales || '0€',
      icon: TrendingUp,
      iconBg: 'bg-purple-900',
      textColor: 'text-purple-900',
    },
    {
      label: 'Commandes',
      value: orders.length,
      icon: Package,
      iconBg: 'bg-purple-900',
      textColor: 'text-purple-900',
    },
    {
      label: 'Stock Bas',
      value: dashboard?.lowStock?.length || 0,
      icon: AlertCircle,
      iconBg: 'bg-purple-900',
      textColor: 'text-purple-900',
    },
    {
      label: 'En Attente',
      value: orders.filter(o => o.status === 'pending').length,
      icon: Clock,
      iconBg: 'bg-purple-900',
      textColor: 'text-purple-900',
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Erreur</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-300 overflow-x-auto bg-white rounded-t-lg px-6">
        {[
          { id: 'stats', label: 'Statistiques', icon: TrendingUp },
          { id: 'orders', label: `Commandes (${orders.length})`, icon: Package },
          { id: 'stock', label: 'Stock Bas', icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-purple-900 border-b-2 border-purple-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
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
