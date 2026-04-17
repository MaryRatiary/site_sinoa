import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, TrendingUp } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../services/api';
import ProductFormModal from './ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await productsAPI.delete(id);
        alert('Produit supprimé!');
        fetchData();
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'N/A';
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.categoryId === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  // Calculer les statistiques
  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Produits</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-purple-900 p-3 rounded-lg text-white">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock Bas</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.lowStock}</p>
            </div>
            <div className="bg-purple-900 p-3 rounded-lg text-white">
              <Filter size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Valeur Stock</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.totalValue}€</p>
            </div>
            <div className="bg-purple-900 p-3 rounded-lg text-white">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-lg hover:bg-purple-950 transition-all font-semibold"
        >
          <Plus size={20} />
          Nouveau Produit
        </button>
      </div>

      {/* Recherche et filtrage */}
      <div className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des produits */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900"></div>
          <p className="text-gray-600 mt-4">Chargement des produits...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Produit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getCategoryName(product.categoryid)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.price}€</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 5 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} unités
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Éditer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Aucun produit trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSuccess={() => {
          fetchData();
          setShowModal(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
}
