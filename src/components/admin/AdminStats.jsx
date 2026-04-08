import React from 'react';

export const AdminStats = ({ dashboard, stats }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Total Commandes</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">{dashboard.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Revenu Total</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{dashboard.totalRevenue}€</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Catégories</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
            {dashboard.topCategories?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Produits Vendus</p>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-2">
            {dashboard.topProducts?.reduce((sum, p) => sum + parseInt(p.totalquantity || 0), 0) || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Statistiques (7 derniers jours)</h2>
        <div className="space-y-2 overflow-x-auto">
          {stats.map((stat) => (
            <div key={stat.date} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 gap-2 sm:gap-0">
              <span className="font-medium text-sm sm:text-base">{new Date(stat.date).toLocaleDateString('fr-FR')}</span>
              <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm">
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
