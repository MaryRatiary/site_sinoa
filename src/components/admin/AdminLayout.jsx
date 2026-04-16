import React from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ activeTab, setActiveTab, children, sidebarOpen, setSidebarOpen }) {
  return (
    <div 
      className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden"
      style={{
        marginLeft: 'var(--sidebar-width, 256px)',
      }}
    >
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <div className="bg-gray-700 text-white shadow-lg sticky top-0 z-30 w-full">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Bouton hamburger à GAUCHE */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
              title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Titre */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">Panneau Admin</h1>
              <p className="text-purple-100 text-xs sm:text-sm hidden sm:block">Gestion de la boutique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-3 sm:p-4 lg:p-6 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
