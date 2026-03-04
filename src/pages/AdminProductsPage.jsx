import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import Navbar from '../components/Header';
import Footer from '../components/Footer';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    composition: '',
    careInstructions: '',
    brand: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stock: '',
    image: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (editingId) {
        await productsAPI.update(editingId, data);
        alert('Produit mis à jour!');
      } else {
        await productsAPI.create(data);
        alert('Produit créé!');
      }

      resetForm();
      fetchData();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      detailedDescription: product.detailedDescription || '',
      composition: product.composition || '',
      careInstructions: product.careInstructions || '',
      brand: product.brand || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      categoryId: product.categoryId || '',
      stock: product.stock || '',
      image: product.image || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await productsAPI.delete(id);
        alert('Produit supprimé!');
        fetchData();
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      detailedDescription: '',
      composition: '',
      careInstructions: '',
      brand: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      stock: '',
      image: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <button
            onClick={() => resetForm()}
            className="flex items-center gap-2 bg-[#5E2251] text-white px-4 py-2 rounded-lg hover:bg-[#4a1a3f] transition"
          >
            <Plus size={20} />
            Nouveau Produit
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Modifier Produit' : 'Créer Produit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom du produit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                  required
                />

                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Marque"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                />

                <input
                  type="number"
                  placeholder="Prix (€)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                  step="0.01"
                  required
                />

                <input
                  type="number"
                  placeholder="Prix original (€)"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                  step="0.01"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                  required
                />
              </div>

              <textarea
                placeholder="Description courte"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                rows="2"
              />

              <textarea
                placeholder="Description détaillée"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                rows="3"
              />

              <textarea
                placeholder="Composition"
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                rows="2"
              />

              <textarea
                placeholder="Instructions de soin"
                value={formData.careInstructions}
                onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                rows="2"
              />

              <input
                type="url"
                placeholder="URL Image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des produits */}
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Nom</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Catégorie</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Prix</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Stock</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{getCategoryName(product.categoryid)}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">{product.price}€</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Aucun produit
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
