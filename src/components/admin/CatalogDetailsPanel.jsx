import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronLeft } from 'lucide-react';
import { MultiImageUpload } from './MultiImageUpload';

export const CatalogDetailsPanel = ({ 
  selectedItem, 
  categories,
  products,
  onBack, 
  onAddProduct, 
  onEditItem,
  onDeleteItem,
  onUpdateProduct
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (selectedItem?.type === 'category') {
      // Charger les produits de cette catégorie et de toutes ses sous-catégories
      const getAllCategoryIds = (catId) => {
        const ids = [catId];
        const cat = findCategoryById(catId, categories);
        if (cat?.children) {
          cat.children.forEach(child => {
            ids.push(...getAllCategoryIds(child.id));
          });
        }
        return ids;
      };

      const findCategoryById = (id, cats) => {
        for (const cat of cats) {
          if (cat.id === id) return cat;
          if (cat.children) {
            const found = findCategoryById(id, cat.children);
            if (found) return found;
          }
        }
        return null;
      };

      const categoryIds = getAllCategoryIds(selectedItem.id);
      const subProducts = products.filter(p => categoryIds.includes(p.categoryid));
      setFilteredProducts(subProducts);
    }
  }, [selectedItem, products, categories]);

  if (!selectedItem) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Sélectionnez un élément</p>
          <p className="text-sm">Cliquez sur une catégorie dans la sidebar</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'category') {
    // Déterminer le niveau et le badge
    const determineLevel = (item) => {
      if (!item.parentid) return { level: 'Catégorie', color: 'purple' };
      // Chercher le parent pour déterminer le niveau
      const findParent = (id, cats) => {
        for (const cat of cats) {
          if (cat.id === id) return cat;
          if (cat.children) {
            const found = findParent(id, cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      const parent = findParent(item.parentid, categories);
      if (!parent?.parentid) return { level: 'Sous-catégorie', color: 'blue' };
      return { level: 'Sous-sous-catégorie', color: 'indigo' };
    };

    const levelInfo = determineLevel(selectedItem);
    const colorClasses = {
      purple: 'bg-purple-100 text-purple-800',
      blue: 'bg-blue-100 text-blue-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <div className="flex-1 bg-white p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{selectedItem.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${colorClasses[levelInfo.color]}`}>
                {levelInfo.level}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAddProduct(selectedItem.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                Ajouter un produit
              </button>
              <button
                onClick={() => onEditItem(selectedItem)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Éditer"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDeleteItem(selectedItem.id)}
                className="p-2 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
            {selectedItem.image && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Image</h3>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div>
              {selectedItem.description && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{selectedItem.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Produits</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredProducts.length}
                </p>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h2 className="text-xl font-bold mb-4">Produits ({filteredProducts.length})</h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">Aucun produit</p>
                <button
                  onClick={() => onAddProduct(selectedItem.id)}
                  className="mt-3 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Créer le premier produit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                      <p className="text-lg font-bold text-purple-600 mt-2">{product.price}€</p>
                      <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => onEditItem(product)}
                          className="flex-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => onDeleteItem(product.id)}
                          className="flex-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
