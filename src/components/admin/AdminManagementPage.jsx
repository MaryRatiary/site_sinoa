import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import AdminSidebar from './AdminSidebar';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminCategoriesPage from './AdminCategoriesPage';
import AdminProductsPage from './AdminProductsPage';
import AdminCatalog from './AdminCatalog';
import AdminOrdersPage from './AdminOrdersPage';

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch orders when needed
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const data = await dashboardAPI.getAllOrders();
          setOrders(data);
        } catch (err) {
          console.error('Erreur lors du chargement des commandes:', err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleRefreshOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await dashboardAPI.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des commandes:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <AdminOrdersPage orders={orders} loading={ordersLoading} onRefresh={handleRefreshOrders} />;
      case 'categories':
        return <AdminCategoriesPage />;
      case 'products':
        return <AdminProductsPage />;
      case 'catalogue':
        return <AdminCatalog/>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Sidebar fixed */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Layout avec contenu */}
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {renderContent()}
      </AdminLayout>
    </div>
  );
}
