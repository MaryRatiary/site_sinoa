import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, AlertCircle, Info } from 'lucide-react';
import MarkdownEditor from '../composants/MarkdownEditor';
import CategoryDeleteModal from '../CategoryDeleteModal';
import { categoriesAPI } from '../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const [reordering, setReordering] = useState(false);
  
  // ✅ NOUVEAU: État pour la modale de suppression sécurisée
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: null
  });
  
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

  // ✅ NOUVEAU: Ouvrir la modale de suppression sécurisée
  const handleDelete = (category) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name
    });
  };

  // ✅ NOUVEAU: Callback après confirmation de suppression
  const handleConfirmDelete = async () => {
    try {
      await categoriesAPI.delete(deleteModal.categoryId);
      // Rafraîchir la liste
      fetchCategories();
      // Fermer la modale
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: null });
    } catch (err) {
      alert('Erreur: ' + err.message);
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

  // Drag and Drop Functions
  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  const handleDragOver = (e, targetId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(targetId);
    
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

    try {
      setReordering(true);
      
      if (categoriesAPI.reorder) {
        await categoriesAPI.reorder(draggedItem.id, targetCategory.id);
      }
      
      await fetchCategories();
    } catch (err) {
      alert('Erreur lors de la réorganisation: ' + err.message);
    } finally {
      setDraggedItem(null);
      setReordering(false);
    }
  };

  const renderCategories = (items, level = 0) => {
    return items.map((category) => (
      <div key={category.id} className="mb-3">
        {draggedItem && dragOverId === category.id && dragPosition === 'above' && (
          <div className="h-1 bg-purple-900 mb-2 rounded-full shadow-lg animate-pulse"></div>
        )}

        <div
          className={`flex items-center justify-between p-4 bg-white border-2 rounded-lg transition-all hover:shadow-md cursor-move group ${
            draggedItem?.id === category.id 
              ? 'opacity-50 bg-gray-50 border-purple-900 shadow-lg' 
              : dragOverId === category.id
              ? 'border-purple-900 bg-gray-50 shadow-md'
              : 'border-gray-200 hover:border-purple-900'
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={(e) => handleDragOver(e, category.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, category)}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col gap-1.5 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-purple-900 rounded-full"></span>
              </div>
            </div>

            {category.children && category.children.length > 0 ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              >
                {expandedIds.has(category.id) ? (
                  <ChevronDown size={20} className="text-purple-900" />
                ) : (
                  <ChevronRight size={20} className="text-purple-900" />
                )}
              </button>
            ) : (
              <div className="w-6 flex-shrink-0"></div>
            )}

            {category.image && (
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0" 
              />
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{category.name}</p>
              {category.description && (
                <p className="text-xs text-gray-600 line-clamp-1">{category.description}</p>
              )}
              {category.children && category.children.length > 0 && (
                <p className="text-xs text-purple-900 font-medium mt-1">
                  {category.children.length} sous-catégorie(s)
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 ml-4 flex-shrink-0">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors opacity-0 group-hover:opacity-100"
              title="Éditer"
            >
              <Edit2 size={18} />
            </button>
            {/* ✅ MODIFIÉ: Utiliser handleDelete avec l'objet category complet */}
            <button
              onClick={() => handleDelete(category)}
              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {draggedItem && dragOverId === category.id && dragPosition === 'below' && (
          <div className="h-1 bg-purple-900 mt-2 rounded-full shadow-lg animate-pulse"></div>
        )}

        {expandedIds.has(category.id) && category.children && category.children.length > 0 && (
          <div className="border-l-2 border-gray-300 ml-3 pl-2 mt-3">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Catégories</p>
            <p className="text-4xl font-bold text-purple-900 mt-2">{categories.length}</p>
            <p className="text-xs text-gray-600 mt-2">Drag and drop pour réorganiser</p>
          </div>
          <div className="bg-purple-900 p-4 rounded-lg text-white">
            <ChevronDown size={32} />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
        <button
          onClick={() => {
            setFormData({ name: '', description: '', image: '', parentId: null });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-lg hover:bg-purple-950 transition-all font-semibold"
        >
          <Plus size={20} />
          Nouvelle Catégorie
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg animate-in fade-in slide-in-from-top-2">
          <h3 className="text-xl font-bold mb-6">
            {editingId ? 'Modifier la Catégorie' : 'Créer une Nouvelle Catégorie'}
          </h3>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">💡 Conseil</p>
              <p className="text-sm text-blue-800 mt-1">
                La description s'affichera en bas de la page catégorie, visible par les clients. Utilisez le Markdown pour formater votre contenu !
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                placeholder="Ex: Light Sticks KPOP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description (avec support Markdown) *
              </label>
              <MarkdownEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Décrivez votre catégorie en détail..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                placeholder="https://exemple.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Catégorie parent
              </label>
              <select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 transition-all"
              >
                <option value="">Pas de parent (catégorie racine)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-all"
              >
                {editingId ? '✓ Mettre à jour' : '✓ Créer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ NOUVEAU: Modale de suppression sécurisée */}
      <CategoryDeleteModal
        categoryId={deleteModal.categoryId}
        categoryName={deleteModal.categoryName}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: null })}
        onConfirm={handleConfirmDelete}
      />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">Comment utiliser le Drag & Drop</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Cliquez et maintenez les points (:::) pour glisser une catégorie</li>
            <li>✓ Une barre violet sombre indique où l'élément sera inséré</li>
            <li>✓ Les flèches permettent de dérouler/réduire les sous-catégories</li>
            <li>✓ Les boutons d'édition/suppression apparaissent au survol</li>
          </ul>
        </div>
      </div>

      {/* Status Indicator */}
      {reordering && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-yellow-800 animate-pulse font-medium">
          Réorganisation en cours...
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900"></div>
          <p className="text-gray-600 mt-4">Chargement des catégories...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {categories.length > 0 ? (
            <div className={reordering ? 'opacity-50 pointer-events-none' : ''}>
              {renderCategories(categories)}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune catégorie créée</p>
          )}
        </div>
      )}
    </div>
  );
}
