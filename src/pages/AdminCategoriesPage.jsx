import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, GripVertical, ChevronDown } from 'lucide-react';
import { categoriesAPI } from '../services/api';
import Navbar from '../components/Header';
import Footer from '../components/Footer';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // 'above' ou 'below'
  const [expandedIds, setExpandedIds] = useState(new Set()); // Nouveau: gère les catégories dépliées
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

  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(targetId);
    
    // Déterminer si c'est au-dessus ou au-dessous
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    setDragPosition(e.clientY < midpoint ? 'above' : 'below');
  };

  const handleDragLeave = () => {
    setDragOverId(null);
    setDragPosition(null);
  };

  const handleDrop = async (e, targetCategory) => {
    e.preventDefault();
    setDragOverId(null);
    setDragPosition(null);

    if (!draggedItem || draggedItem.id === targetCategory.id) {
      setDraggedItem(null);
      return;
    }

    // Vérifier que les deux catégories sont au même niveau (même parentId)
    if (draggedItem.parentid !== targetCategory.parentid) {
      alert('Vous pouvez seulement réorganiser les catégories au même niveau!');
      setDraggedItem(null);
      return;
    }

    try {
      // Appel API pour réorganiser
      await categoriesAPI.reorder(draggedItem.id, targetCategory.id);
      await fetchCategories();
    } catch (err) {
      alert('Erreur lors de la réorganisation: ' + err.message);
    } finally {
      setDraggedItem(null);
    }
  };

  const toggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedIds(newExpanded);
  };

  const renderCategories = (items, level = 0) => {
    return items.map((category, index) => (
      <div key={category.id} className="mb-1">
        {/* Ligne d'insertion au-dessus */}
        {draggedItem && dragOverId === category.id && dragPosition === 'above' && (
          <div className="h-1 bg-[#5E2251] mb-1 rounded"></div>
        )}

        <div
          className={`flex items-center justify-between p-3 bg-gray-50 border-2 rounded-lg hover:bg-gray-100 transition cursor-move ${
            draggedItem?.id === category.id 
              ? 'opacity-50 bg-blue-100 border-blue-400' 
              : dragOverId === category.id
              ? 'border-[#5E2251] bg-purple-50'
              : 'border-gray-200'
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={(e) => handleDragOver(e, category.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, category)}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Poignée de drag avec 6 points */}
          <div className="flex items-center gap-3 flex-1">
            {/* Bouton expand/collapse */}
            {category.children && category.children.length > 0 ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-300 rounded transition"
              >
                {expandedIds.has(category.id) ? (
                  <ChevronDown size={18} className="text-[#5E2251]" />
                ) : (
                  <ChevronRight size={18} className="text-[#5E2251]" />
                )}
              </button>
            ) : (
              <div className="w-6"></div>
            )}

            <div className="flex flex-col gap-1.5 cursor-grab active:cursor-grabbing hover:opacity-100 opacity-60">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
                <span className="w-2 h-2 bg-[#5E2251] rounded-full"></span>
              </div>
            </div>

            {category.image && (
              <img src={category.image} alt={category.name} className="w-8 h-8 rounded object-cover" />
            )}
            <div>
              <p className="font-semibold text-gray-900">{category.name}</p>
              {category.description && <p className="text-xs text-gray-600">{category.description}</p>}
              {category.children && category.children.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{category.children.length} sous-catégorie(s)</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Ligne d'insertion au-dessous */}
        {draggedItem && dragOverId === category.id && dragPosition === 'below' && (
          <div className="h-1 bg-[#5E2251] mt-1 rounded"></div>
        )}

        {/* Afficher les enfants seulement si la catégorie est dépliée */}
        {expandedIds.has(category.id) && category.children && category.children.length > 0 && (
          <div className="border-l-2 border-gray-300 ml-3 pl-2">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
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
            <h2 className="text-xl font-bold mb-2">Catégories ({categories.length})</h2>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Guide:</strong> Glissez les 6 points (:::) pour réorganiser. Les catégories au même niveau apparaîtront en <span className="text-[#5E2251]">violet</span> au survol. Une barre <span className="text-[#5E2251]">violette</span> indique où l'élément sera inséré.
              </p>
            </div>
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
