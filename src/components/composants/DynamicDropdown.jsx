import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant dropdown dynamique qui affiche les sous-catégories
 * d'une catégorie parente avec support de hiérarchie multi-niveaux
 */
export const DynamicDropdown = ({ 
  category_id, 
  category,
  dropdownProps, 
  onClose, 
  isOpen,
  columnsPerRow = 4 
}) => {
  const [displayChildren, setDisplayChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  // Utiliser les enfants directs de la catégorie passée en props
  useEffect(() => {
    if (category && category.children) {
      setDisplayChildren(category.children);
      setLoading(false);
    }
  }, [category]);

  // Vérifier si une catégorie a seulement des produits (dernière feuille)
  const isLeafCategory = (cat) => {
    return !cat.children || cat.children.length === 0;
  };

  // Vérifier si une catégorie a des sous-catégories avec enfants
  const hasNestedChildren = (cat) => {
    if (!cat.children || cat.children.length === 0) return false;
    return cat.children.some(child => child.children && child.children.length > 0);
  };

  // Handler pour cliquer sur une sous-catégorie
  const handleSubcategoryClick = (subcategory) => {
    // Si c'est une feuille (seulement des produits), rediriger vers la page des produits
    if (isLeafCategory(subcategory)) {
      onClose();
      navigate(`/category/${subcategory.id}`);
    } else if (hasNestedChildren(subcategory)) {
      // Si a des enfants, l'agrandir pour afficher les sous-sous-catégories
      setExpandedCategory(expandedCategory === subcategory.id ? null : subcategory.id);
    } else {
      // Sinon afficher les produits
      onClose();
      navigate(`/category/${subcategory.id}`);
    }
  };

  // Récursivement afficher les catégories imbriquées
  const renderNestedCategory = (subcategory, level = 0) => {
    const childSubcategories = subcategory.children || [];
    const isExpanded = expandedCategory === subcategory.id;
    const hasChildren = childSubcategories.length > 0;

    return (
      <div key={subcategory.id} className="space-y-2">
        <div
          onClick={() => {
            if (hasChildren) {
              setExpandedCategory(isExpanded ? null : subcategory.id);
            } else {
              handleSubcategoryClick(subcategory);
            }
          }}
          className={`flex items-center gap-3 group cursor-pointer p-3 rounded-lg transition-all duration-200 ${
            hasChildren ? 'hover:bg-purple-50' : 'hover:bg-gray-50'
          } ${level === 0 ? 'border border-gray-200' : 'border-l-2 border-gray-200 pl-2'}`}
        >
          {/* Image à gauche du titre */}
          {subcategory.image && (
            <img
              src={subcategory.image}
              alt={subcategory.name}
              className={`flex-shrink-0 object-cover rounded-md border border-gray-200 group-hover:scale-105 transition-transform duration-200 ${
                level === 0 ? 'w-16 h-16' : 'w-12 h-12'
              }`}
            />
          )}
          
          {/* Titre et chevron */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={`${level === 0 ? 'text-sm font-medium' : 'text-xs font-medium'} text-gray-700 group-hover:text-[#5E2251] transition-colors truncate`}>
              {subcategory.name}
            </span>
            {hasChildren && (
              <ChevronRight 
                size={14} 
                className={`text-gray-400 group-hover:text-[#5E2251] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
              />
            )}
          </div>
        </div>

        {/* Affiche les enfants si expandés */}
        {isExpanded && hasChildren && (
          <div className="space-y-2 ml-4">
            {childSubcategories.map(child => renderNestedCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div
        className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
        {...dropdownProps}
      >
        <div className="text-center text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!displayChildren || displayChildren.length === 0) {
    return (
      <div
        className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
        {...dropdownProps}
      >
        <div className="text-center text-gray-500">Aucune sous-catégorie</div>
      </div>
    );
  }

  return (
    <div
      className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
      {...dropdownProps}
    >
      <div className="max-w-7xl mx-auto">
        {/* <h4 className="font-bold text-[#5E2251] uppercase text-sm mb-6">
          {category.name}
        </h4> */}

        {/* Affichage avec support complet de l'arborescence */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayChildren.map((subcategory) => renderNestedCategory(subcategory, 0))}
        </div>
      </div>
    </div>
  );
};

export default DynamicDropdown;
