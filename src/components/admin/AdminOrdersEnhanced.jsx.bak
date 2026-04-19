import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  User,
  X
} from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import { OrderDetailsModal } from './OrderDetailsModal';

export const AdminOrdersEnhanced = ({ orders, onRefresh }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  
  // Selection for bulk actions
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Handle order selection
  const handleSelectOrder = async (orderId) => {
    setLoading(true);
    setError('');
    try {
      const details = await dashboardAPI.getOrderDetails(orderId);
      setOrderDetails(details);
      setSelectedOrderId(orderId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk selection
  const toggleOrderSelection = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const selectAllFiltered = () => {
    const allIds = new Set(filteredAndSortedOrders.map(o => o.id));
    setSelectedOrders(allIds);
  };

  const clearSelection = () => {
    setSelectedOrders(new Set());
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      for (const orderId of selectedOrders) {
        await dashboardAPI.updateOrderStatus(orderId, newStatus, '', '', '');
      }
      setSelectedOrders(new Set());
      onRefresh?.();
    } catch (err) {
      setError(err.message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Email', 'Montant', 'Statut', 'Paiement', 'Date'];
    const data = filteredAndSortedOrders.map(order => [
      order.id,
      `${order.firstname} ${order.lastname}`,
      order.email,
      order.totalprice,
      order.status,
      order.paymentstatus || 'N/A',
      new Date(order.createdat).toLocaleDateString('fr-FR')
    ]);

    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter and sort logic
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(search) ||
        `${order.firstname} ${order.lastname}`.toLowerCase().includes(search) ||
        order.email.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }

    // Payment filter
    if (filterPayment !== 'all') {
      result = result.filter(order => (order.paymentstatus || 'unpaid') === filterPayment);
    }

    // Date range filter
    if (dateRange.start) {
      result = result.filter(order => 
        new Date(order.createdat) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      result = result.filter(order => 
        new Date(order.createdat) <= new Date(dateRange.end)
      );
    }

    // Price range filter
    result = result.filter(order =>
      parseFloat(order.totalprice) >= priceRange.min &&
      parseFloat(order.totalprice) <= priceRange.max
    );

    // Sort
    switch(sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdat) - new Date(b.createdat));
        break;
      case 'highest_price':
        result.sort((a, b) => parseFloat(b.totalprice) - parseFloat(a.totalprice));
        break;
      case 'lowest_price':
        result.sort((a, b) => parseFloat(a.totalprice) - parseFloat(b.totalprice));
        break;
      case 'client_name':
        result.sort((a, b) => 
          `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`)
        );
        break;
      default:
        break;
    }

    return result;
  }, [orders, searchTerm, filterStatus, filterPayment, dateRange, priceRange, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const filtered = filteredAndSortedOrders;
    return {
      totalOrders: filtered.length,
      totalRevenue: filtered.reduce((sum, o) => sum + parseFloat(o.totalprice), 0).toFixed(2),
      avgOrderValue: filtered.length > 0 ? 
        (filtered.reduce((sum, o) => sum + parseFloat(o.totalprice), 0) / filtered.length).toFixed(2) : 
        '0.00',
      pendingCount: filtered.filter(o => o.status === 'pending').length,
      completedCount: filtered.filter(o => o.status === 'completed').length,
      paidCount: filtered.filter(o => (o.paymentstatus || 'unpaid') === 'paid').length,
    };
  }, [filteredAndSortedOrders]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />;
      case 'processing': return <Truck className="text-blue-600" size={16} />;
      case 'pending': return <Clock className="text-yellow-600" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-600" size={16} />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBg = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold">Total</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-700 font-semibold">Revenu</p>
          <p className="text-xl font-bold text-green-900">{stats.totalRevenue}€</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-700 font-semibold">Moy.</p>
          <p className="text-xl font-bold text-purple-900">{stats.avgOrderValue}€</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
          <p className="text-xs text-yellow-700 font-semibold">En attente</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-700 font-semibold">Complétées</p>
          <p className="text-2xl font-bold text-green-900">{stats.completedCount}</p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par ID, client ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5E2251] text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#5E2251] hover:bg-[#4a1a40] text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filtres</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="border-t pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Statut</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="completed">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Paiement</label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                >
                  <option value="all">Tous les paiements</option>
                  <option value="unpaid">Non payée</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tri</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                >
                  <option value="newest">Plus récentes</option>
                  <option value="oldest">Plus anciennes</option>
                  <option value="highest_price">Prix plus élevés</option>
                  <option value="lowest_price">Prix plus bas</option>
                  <option value="client_name">Nom du client</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">De</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">À</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Prix max (€)</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseFloat(e.target.value) || 999999})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5E2251]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions en masse */}
        {selectedOrders.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm font-semibold text-blue-900">
              {selectedOrders.size} commande(s) sélectionnée(s)
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkStatusUpdate('processing')}
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                → Traitement
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('completed')}
                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                → Livrée
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('cancelled')}
                className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                → Annuler
              </button>
              <button
                onClick={clearSelection}
                className="text-xs px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
              >
                ✕ Effacer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des commandes */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg">
            <AlertCircle size={40} className="mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-gray-600 text-base sm:text-lg">Aucune commande trouvée</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={selectedOrders.size === filteredAndSortedOrders.length && filteredAndSortedOrders.length > 0}
                onChange={selectedOrders.size === filteredAndSortedOrders.length ? clearSelection : selectAllFiltered}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span onClick={selectedOrders.size === filteredAndSortedOrders.length ? clearSelection : selectAllFiltered} className="cursor-pointer">
                Tout sélectionner
              </span>
            </div>
            {filteredAndSortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-4 items-start sm:items-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="w-4 h-4 rounded cursor-pointer mt-1"
                  />
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">ID</p>
                      <p className="font-bold text-[#5E2251] text-base sm:text-lg">#{order.id}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Client</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">{order.firstname} {order.lastname}</p>
                      <p className="text-xs text-gray-600 truncate">{order.email}</p>
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase">Montant</p>
                      <p className="font-bold text-green-600 text-base sm:text-lg">{parseFloat(order.totalprice).toFixed(2)}€</p>
                    </div>

                    <div className="hidden lg:block">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Date</p>
                      <p className="text-sm text-gray-900">{new Date(order.createdat).toLocaleDateString('fr-FR')}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Statut</p>
                      <div className="flex flex-col gap-1">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold w-fit ${getStatusBg(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                        <div className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold w-fit ${getPaymentBg(order.paymentstatus || 'unpaid')}`}>
                          {order.paymentstatus || 'unpaid'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectOrder(order.id)}
                    disabled={loading}
                    className="flex items-center justify-center bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {orderDetails && (
        <OrderDetailsModal
          order={orderDetails}
          isOpen={selectedOrderId !== null}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={(orderId, updates) => {
            dashboardAPI.updateOrderStatus(
              orderId,
              updates.status,
              updates.paymentStatus,
              updates.trackingNumber,
              updates.notes
            );
            setSelectedOrderId(null);
            setOrderDetails(null);
            onRefresh?.();
          }}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="min-w-0">
            <p className="font-bold text-red-900">Erreur</p>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}
    </>
  );
};
