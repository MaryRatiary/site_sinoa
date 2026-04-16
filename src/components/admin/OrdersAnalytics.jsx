import React, { useMemo } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

export const OrdersAnalytics = ({ orders }) => {
  const analytics = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        statusBreakdown: {},
        paymentBreakdown: {},
        revenueByDay: {},
        topClients: [],
        ordersByMonth: {}
      };
    }

    // Statistiques de base
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalprice), 0);
    const avgOrderValue = totalRevenue / orders.length;

    // Répartition par statut
    const statusBreakdown = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // Répartition par paiement
    const paymentBreakdown = orders.reduce((acc, o) => {
      const paymentStatus = o.paymentstatus || 'unpaid';
      acc[paymentStatus] = (acc[paymentStatus] || 0) + 1;
      return acc;
    }, {});

    // Revenu par jour
    const revenueByDay = orders.reduce((acc, o) => {
      const date = new Date(o.createdat).toLocaleDateString('fr-FR');
      acc[date] = (acc[date] || 0) + parseFloat(o.totalprice);
      return acc;
    }, {});

    // Top clients
    const clientOrders = {};
    orders.forEach(o => {
      const clientName = `${o.firstname} ${o.lastname}`;
      if (!clientOrders[clientName]) {
        clientOrders[clientName] = { count: 0, revenue: 0, email: o.email };
      }
      clientOrders[clientName].count += 1;
      clientOrders[clientName].revenue += parseFloat(o.totalprice);
    });

    const topClients = Object.entries(clientOrders)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Commandes par mois
    const ordersByMonth = orders.reduce((acc, o) => {
      const month = new Date(o.createdat).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      avgOrderValue: avgOrderValue.toFixed(2),
      statusBreakdown,
      paymentBreakdown,
      revenueByDay,
      topClients,
      ordersByMonth
    };
  }, [orders]);

  const StatCard = ({ label, value, subtext, color, icon: Icon }) => (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-4 border border-opacity-20`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-700 uppercase">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-600 mt-1">{subtext}</p>}
        </div>
        {Icon && <Icon className="text-opacity-20 text-gray-900 flex-shrink-0" size={32} />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Commandes"
          value={analytics.totalOrders}
          color="from-blue-50 to-blue-100"
          icon={BarChart3}
        />
        <StatCard
          label="Revenu Total"
          value={`${analytics.totalRevenue}€`}
          color="from-green-50 to-green-100"
          icon={TrendingUp}
        />
        <StatCard
          label="Panier Moyen"
          value={`${analytics.avgOrderValue}€`}
          subtext="par commande"
          color="from-purple-50 to-purple-100"
          icon={PieChart}
        />
        <StatCard
          label="Taux Conversion"
          value={`${((Object.values(analytics.statusBreakdown).reduce((a, b) => a + b, 0) > 0 ? (analytics.statusBreakdown.completed || 0) / Object.values(analytics.statusBreakdown).reduce((a, b) => a + b, 0) * 100 : 0).toFixed(1))}%`}
          subtext="commandes complétées"
          color="from-orange-50 to-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="text-[#5E2251]" size={20} />
            Statut des Commandes
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.statusBreakdown).map(([status, count]) => {
              const percentage = (count / analytics.totalOrders) * 100;
              const statusColors = {
                pending: 'bg-yellow-500',
                processing: 'bg-blue-500',
                completed: 'bg-green-500',
                cancelled: 'bg-red-500'
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700 capitalize">{status}</span>
                    <span className="font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColors[status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition par paiement */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="text-[#5E2251]" size={20} />
            Statut des Paiements
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.paymentBreakdown).map(([status, count]) => {
              const percentage = (count / analytics.totalOrders) * 100;
              const paymentColors = {
                paid: 'bg-green-500',
                pending: 'bg-yellow-500',
                unpaid: 'bg-red-500'
              };
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700 capitalize">{status}</span>
                    <span className="font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${paymentColors[status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top clients */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top 5 Clients</h3>
        <div className="space-y-3">
          {analytics.topClients.map((client, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{client.name}</p>
                <p className="text-xs text-gray-600">{client.email}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-bold text-[#5E2251]">{client.revenue.toFixed(2)}€</p>
                <p className="text-xs text-gray-600">{client.count} commande{client.count > 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commandes par mois */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="text-[#5E2251]" size={20} />
          Commandes par Période
        </h3>
        <div className="space-y-3">
          {Object.entries(analytics.ordersByMonth)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([month, count]) => {
              const maxCount = Math.max(...Object.values(analytics.ordersByMonth));
              const percentage = (count / maxCount) * 100;
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700 capitalize">{month}</span>
                    <span className="font-bold text-gray-900">{count} commande{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
