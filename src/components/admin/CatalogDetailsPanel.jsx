import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronLeft } from 'lucide-react';

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
      const subProducts = products.filter(p => categoryIds.includes(p.categoryId));
      setFilteredProducts(subProducts);
    }
  }, [selectedItem, products, categories]);

  if (!selectedItem) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white p-4 sm:p-6">
        <div className="text-center text-gray-500">
          <p className="text-base sm:text-lg font-medium">Sélectionnez un élément</p>
          <p className="text-xs sm:text-sm">Cliquez sur une catégorie dans la sidebar</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'category') {
    const determineLevel = (item) => {
      if (!item.parentId) return { level: 'Catégorie', color: 'purple' };
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
      const parent = findParent(item.parentId, categories);
      if (!parent?.parentId) return { level: 'Sous-catégorie', color: 'blue' };
      return { level: 'Sous-sous-catégorie', color: 'indigo' };
    };

    const levelInfo = determineLevel(selectedItem);
    const colorClasses = {
      purple: 'bg-purple-100 text-purple-800',
      blue: 'bg-blue-100 text-blue-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <div className="flex-1 bg-white p-3 sm:p-4 md:p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{selectedItem.name}</h1>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${colorClasses[levelInfo.color]}`}>
                {levelInfo.level}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAddProduct(selectedItem.id)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-bold"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Ajouter un produit</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
              <button
                onClick={() => onEditItem(selectedItem)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDeleteItem(selectedItem)}
                className="p-2 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
            {selectedItem.image && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm">Image</h3>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div>
              {selectedItem.description && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-xs sm:text-sm">Description</h3>
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-4">{selectedItem.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500 font-semibold uppercase">Produits</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                  {filteredProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Produits ({filteredProducts.length})</h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm sm:text-base">Aucun produit</p>
                <button
                  onClick={() => onAddProduct(selectedItem.id)}
                  className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Créer le premier produit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                    )}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{product.name}</h3>
                      <p className="text-lg sm:text-xl font-bold text-purple-600 mt-2">{product.price}€</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
                      <div className="flex gap-2 mt-3 sm:mt-auto">
                        <button
                          onClick={() => onEditItem(product)}
                          className="flex-1 px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs sm:text-sm transition-colors font-bold"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => onDeleteItem(product)}
                          className="flex-1 px-2 sm:px-3 py-1 sm:py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs sm:text-sm transition-colors font-bold"
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
