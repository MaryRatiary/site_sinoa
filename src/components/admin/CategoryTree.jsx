import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Folder, FolderOpen } from 'lucide-react';

export const CategoryTree = ({ categories, onSelectItem, selectedItem, onAddCategory, onAddSubcategory, onAddProduct }) => {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderNode = (category, level = 0) => {
    const children = category.children || [];
    const isExpanded = expandedIds.has(category.id);
    const isSelected = selectedItem?.id === category.id && selectedItem?.type === 'category';
    const isRootLevel = level === 0;
    const isMaxLevel = level >= 2;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
            isSelected ? 'bg-purple-600 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => {
            onSelectItem({ ...category, type: 'category' });
            if (children.length > 0) {
              toggleExpand(category.id);
            }
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(category.id);
            }}
            className="p-0 flex-shrink-0"
          >
            {children.length > 0 ? (
              isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            ) : (
              <div className="w-4" />
            )}
          </button>

          {isRootLevel ? <Folder size={16} className="flex-shrink-0" /> : <FolderOpen size={16} className="flex-shrink-0" />}
          <span className="flex-1 text-xs sm:text-sm font-medium truncate">{category.name}</span>

          {/* Boutons d'action */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {!isMaxLevel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubcategory(category.id);
                }}
                className={`p-1 rounded hover:bg-blue-500 transition-colors ${isSelected ? 'hover:bg-purple-700' : ''}`}
                title="Ajouter une sous-catégorie"
              >
                <Plus size={14} />
              </button>
            )}
            
            {isMaxLevel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddProduct(category.id);
                }}
                className={`p-1 rounded hover:bg-green-500 transition-colors ${isSelected ? 'hover:bg-purple-700' : ''}`}
                title="Ajouter un produit"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Enfants */}
        {isExpanded && children.length > 0 && (
          <div className="ml-3 sm:ml-4 border-l border-gray-300">
            {children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-300">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-300 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base sm:text-lg truncate">Catalogue</h2>
          <button
            onClick={() => onAddCategory()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            title="Ajouter une catégorie"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-xs sm:text-sm">Aucune catégorie</p>
            <p className="text-xs text-gray-400">Cliquez sur le + pour en créer une</p>
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map(category => renderNode(category, 0))}
          </div>
        )}
      </div>
    </div>
  );
};
