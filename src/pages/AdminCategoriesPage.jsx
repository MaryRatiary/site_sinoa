import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight } from 'lucide-react';
import { categoriesAPI } from '../services/api';
import Navbar from '../components/Header';
import Footer from '../components/Footer';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentId: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriesAPI.update(editingId, formData);
        alert('Catégorie mise à jour!');
      } else {
        await categoriesAPI.create(formData);
        alert('Catégorie créée!');
      }
      setFormData({ name: '', description: '', image: '', parentId: null });
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || null,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await categoriesAPI.delete(id);
        alert('Catégorie supprimée!');
        fetchCategories();
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    }
  };

  const renderCategories = (items, level = 0) => {
    return items.map((category) => (
      <div key={category.id} className="mb-2">
        <div
          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {category.image && (
              <img src={category.image} alt={category.name} className="w-8 h-8 rounded object-cover" />
            )}
            <div>
              <p className="font-semibold text-gray-900">{category.name}</p>
              {category.description && <p className="text-xs text-gray-600">{category.description}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Afficher les enfants */}
        {category.children && category.children.length > 0 && renderCategories(category.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
          <button
            onClick={() => {
              setFormData({ name: '', description: '', image: '', parentId: null });
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#5E2251] text-white px-4 py-2 rounded-lg hover:bg-[#4a1a3f] transition"
          >
            <Plus size={20} />
            Nouvelle Catégorie
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Modifier Catégorie' : 'Créer Catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
                rows="3"
              />
              <input
                type="url"
                placeholder="URL Image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
              />
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5E2251]"
              >
                <option value="">Pas de parent (catégorie racine)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des catégories */}
        {loading ? (
          <div className="text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Catégories ({categories.length})</h2>
            {categories.length > 0 ? (
              renderCategories(categories)
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune catégorie</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
