import { useState } from 'react';
import { Settings, Package, FolderOpen, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Header';
import Footer from '../components/Footer';
import AdminDashboard from './AdminDashboard';
import AdminCategoriesPage from './AdminCategoriesPage';
import AdminProductsPage from './AdminProductsPage';

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: '📊 Dashboard',
      icon: BarChart3,
      description: 'Vue d\'ensemble des statistiques',
    },
    {
      id: 'categories',
      label: '📁 Catégories',
      icon: FolderOpen,
      description: 'Gérer les catégories et sous-catégories',
    },
    {
      id: 'products',
      label: '📦 Produits',
      icon: Package,
      description: 'Gérer les produits et stocks',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'categories':
        return <AdminCategoriesPage />;
      case 'products':
        return <AdminProductsPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">🛠️ Panneau d'Administration</h1>
          <p className="text-gray-600">Gérez votre boutique K-POP en ligne</p>
        </div>

        {/* Tabs Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-[#5E2251] text-white border-[#5E2251]'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-[#5E2251]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{tab.label}</h3>
                    <p className={`text-sm ${activeTab === tab.id ? 'text-pink-100' : 'text-gray-600'}`}>
                      {tab.description}
                    </p>
                  </div>
                  <Icon size={24} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
}
