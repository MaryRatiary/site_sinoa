import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Home,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ activeTab, setActiveTab, mobileOpen, onMobileClose }) {
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

  const handleMenuClick = (id) => {
    setActiveTab(id);
    onMobileClose?.();
  };

  return (
    <>
      {/* Sidebar Desktop (toujours visible) */}
      <div className={`hidden lg:flex fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex-col shadow-2xl`}>
        
        <div className="px-3 sm:px-4 py-4 sm:py-6 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-bold truncate">SINOA</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            title={isCollapsed ? 'Développer' : 'Réduire'}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon size={22} className="flex-shrink-0" />
                {!isCollapsed && (
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.label}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-2 sm:px-3 py-3 sm:py-4 border-t border-gray-700 space-y-2 flex-shrink-0">
          <Link
            to="/"
            onClick={onMobileClose}
            className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            title={isCollapsed ? 'Accueil' : ''}
          >
            <Home size={22} className="flex-shrink-0" />
            {!isCollapsed && <p className="font-semibold text-sm">Accueil</p>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut size={22} className="flex-shrink-0" />
            {!isCollapsed && <p className="font-semibold text-sm">Déconnexion</p>}
          </button>
        </div>
      </div>

      {/* Sidebar Mobile (drawer) */}
      {mobileOpen && (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 flex flex-col shadow-2xl lg:hidden">
          
          <div className="px-3 py-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg font-bold truncate">SINOA</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <button
              onClick={onMobileClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.label}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="px-2 py-3 border-t border-gray-700 space-y-2 flex-shrink-0">
            <Link
              to="/"
              onClick={onMobileClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <Home size={20} className="flex-shrink-0" />
              <p className="font-semibold text-sm">Accueil</p>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <p className="font-semibold text-sm">Déconnexion</p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
