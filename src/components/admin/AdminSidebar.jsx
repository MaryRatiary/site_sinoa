import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Statistiques et aperçu',
    },
    {
      id: 'catalogue',
      label: 'Catalogue',
      icon: FolderOpen,
      description: 'Gérer le catalogue',
    },
    {
      id: 'categories',
      label: 'Catégories',
      icon: FolderOpen,
      description: 'Gérer les catégories',
    },
    {
      id: 'products',
      label: 'Produits',
      icon: Package,
      description: 'Gérer les produits',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-50 ${
      isCollapsed ? 'w-20' : 'w-64'
    } flex flex-col shadow-2xl`}>
      
      {/* Logo Section */}
      <div className="px-4 py-6 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">SINOA</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gray-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={22} className="flex-shrink-0" />
              {!isCollapsed && (
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-gray-700 space-y-2">
        {/* Home Button */}
        <Link
          to="/"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          title={isCollapsed ? 'Accueil' : ''}
        >
          <Home size={22} className="flex-shrink-0" />
          {!isCollapsed && <p className="font-semibold text-sm">Accueil</p>}
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
          title={isCollapsed ? 'Déconnexion' : ''}
        >
          <LogOut size={22} className="flex-shrink-0" />
          {!isCollapsed && <p className="font-semibold text-sm">Déconnexion</p>}
        </button>
      </div>
    </div>
  );
}
