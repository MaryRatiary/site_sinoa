import React from 'react';

export const AdminStats = ({ dashboard, stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Commandes</p>
          <p className="text-3xl font-bold text-purple-600">{dashboard.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Revenu Total</p>
          <p className="text-3xl font-bold text-green-600">{dashboard.totalRevenue}€</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Catégories</p>
          <p className="text-3xl font-bold text-blue-600">
            {dashboard.topCategories?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Produits Vendus</p>
          <p className="text-3xl font-bold text-orange-600">
            {dashboard.topProducts?.reduce((sum, p) => sum + parseInt(p.totalquantity || 0), 0) || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Statistiques (7 derniers jours)</h2>
        <div className="space-y-2">
          {stats.map((stat) => (
            <div key={stat.date} className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">{new Date(stat.date).toLocaleDateString('fr-FR')}</span>
              <div className="flex gap-6">
                <span>Commandes: <strong>{stat.ordercount}</strong></span>
                <span>Revenu: <strong>{stat.totalrevenue}€</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};