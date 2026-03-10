import React from 'react';

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* La sidebar est en position fixed, donc on ajoute du padding au contenu */}
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-gray-700 text-white shadow-lg">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold">Panneau d'Administration Kpop</h1>
            <p className="text-purple-100 mt-1">Gérez votre boutique en ligne</p>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
