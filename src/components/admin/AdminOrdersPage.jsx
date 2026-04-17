import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { AdminOrdersEnhanced } from './AdminOrdersEnhanced';

export default function AdminOrdersPage({ orders, loading, onRefresh }) {
  const [error, setError] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-1">Gérez toutes les commandes avec filtres avancés, tri et actions en masse</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-[#5E2251] hover:bg-[#4a1a40] text-white px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Rafraîchir</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Erreur</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mb-4"></div>
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <AdminOrdersEnhanced 
              orders={orders || []}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      )}
    </div>
  );
}
