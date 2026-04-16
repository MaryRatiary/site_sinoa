import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant réutilisable pour afficher une colonne de menu
 * Affiche une catégorie avec ses enfants (sous-catégories)
 */
export const DynamicMenuColumn = ({ category, onClose, children }) => {
  if (!category) return null;

  // Utilise la prop 'children' si elle est fournie, sinon essaie category.children
  const subcategories = children && children.length > 0 ? children : (category.children || []);

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-[#5E2251] uppercase text-sm">
        {category.name}
      </h4>
      <ul className="space-y-3">
        {subcategories && subcategories.length > 0 ? (
          subcategories.map((child) => (
            <li key={child.id}>
              <Link
                to={`/products/${child.id}`}
                onClick={onClose}
                className="flex items-center gap-3 group cursor-pointer"
              >
                {child.image && (
                  <img
                    src={child.image}
                    alt={child.name}
                    className="w-8 h-8 object-cover rounded-md border border-gray-200 group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <span className="text-sm text-gray-700 group-hover:text-[#5E2251] transition-colors">
                  {child.name}
                </span>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-xs text-gray-500">Aucune sous-catégorie</li>
        )}
      </ul>
    </div>
  );
};

export default DynamicMenuColumn;
