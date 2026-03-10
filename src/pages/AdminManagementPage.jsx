import { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminCategoriesPage from './AdminCategoriesPage';
import AdminProductsPage from './AdminProductsPage';
import AdminCatalog from './AdminCatalog';

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fixed */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Layout avec contenu */}
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </AdminLayout>
    </div>
  );
}
