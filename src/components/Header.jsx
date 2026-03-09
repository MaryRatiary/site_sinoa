import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, ChevronRight, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import ExpandSearch from './forms/ExpandSearch';
import CountdownBanner from './CountdownBanner';
import AnimatedBanner from './AnimatedBanner';

// ─── Shared item row used in Shop, K-Style, K-Beauty columns ─────────────────
// Every item MUST have a slug → links to /products/:slug
// Falls back to item.url if no slug (future-proof)

const MenuItemLink = ({ item, onClose }) => {
  const to = item.slug ? `/products/${item.slug}` : (item.url ?? '#');

  return (
    <li>
      <Link
        to={to}
        onClick={onClose}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.label}
          className="w-8 h-8 object-cover rounded-md border border-gray-200 group-hover:scale-105 transition-transform duration-200"
        />
        <span className="text-sm text-gray-700 group-hover:text-[#5E2251] transition-colors">
          {item.label}
        </span>
      </Link>
    </li>
  );
};

// ─── Generic column used everywhere ──────────────────────────────────────────

const MenuColumn = ({ title, items, onClose }) => (
  <div className="space-y-4">
    <h4 className="font-bold text-[#5E2251] uppercase text-sm">{title}</h4>
    <ul className="space-y-3">
      {items.map((item) => (
        <MenuItemLink key={item.label} item={item} onClose={onClose} />
      ))}
    </ul>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const timeoutRef = useRef(null);
  const { getItemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  // Récupérer les catégories du backend
  const { categories, loading: categoriesLoading } = useCategories();

  const open  = (menu) => { clearTimeout(timeoutRef.current); setActiveMenu(menu); };
  const close  = ()    => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 500); };
  const keep  = ()    => clearTimeout(timeoutRef.current);
  const closeNow = () => setActiveMenu(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const dropdownProps = { onMouseEnter: keep, onMouseLeave: close };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 w-full bg-white border-b border-gray-100 z-40">

      {/* Top Banner */}
      <AnimatedBanner/>
      
      {/* Logo */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex-1">
          <ExpandSearch />
        </div>
        <Link to="/" className="flex-col items-center text-center">
          <h1 className="text-2xl font-bold tracking-tighter">프랑스</h1>
          <h1 className="text-3xl font-black tracking-[0.2em] mt-[-8px]">KPOP</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Boutique</p>
        </Link>
        
        {/* Right side - User & Cart */}
        <div className="flex-1 flex justify-end gap-5 text-gray-700">
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hover:text-[#5E2251] transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
            </button>
            
            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors"
                    >
                      <Package size={16} />
                      Mes Commandes
                    </Link>
                    
                    {isAdmin() && (
                      <Link
                        to="/admin/management"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors border-t border-gray-100"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard Admin
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors border-t border-gray-100"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Cart */}
          <Link to="/cart" className="relative hover:text-[#5E2251] transition-colors group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5E2251] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Nav links - Dynamique depuis le backend */}
      <div className="flex justify-center gap-8 pb-4 text-[13px] font-medium uppercase tracking-wide relative">
        {categoriesLoading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : (
          categories.map((category) => (
            <div 
              key={category.id} 
              className="relative"
              onMouseEnter={() => {
                keep();
                open(`category-${category.id}`);
              }}
              onMouseLeave={() => close()}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#5E2251] transition-colors py-2">
                {category.name}
                <ChevronDown size={14} className="hover:rotate-180 transition-all duration-500" />
              </button>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5E2251] hover:w-full transition-all duration-500" />
            </div>
          ))
        )}
      </div>

      {/* Sous-catégories affichées en grille - STICKY POSITION */}
      {categories.map((category) => {
        // Vérifier si c'est une catégorie simple (enfants sans sous-enfants)
        const isSimpleCategory = category.children && 
          category.children.length > 0 && 
          category.children.every(child => !child.children || child.children.length === 0);

        return (
          activeMenu === `category-${category.id}` && category.children && category.children.length > 0 && (
            <div
              key={`dropdown-${category.id}`}
              className="sticky w-full bg-white border-t-4 border-[#5E2251] shadow-xl p-8 z-50"
              style={{ top: '0' }}
              onMouseEnter={() => keep()}
              onMouseLeave={() => close()}
            >
              <div className="max-w-7xl mx-auto">
                {/* Style 1: Catégories simples (6 colonnes avec grande image) */}
                {isSimpleCategory ? (
                  <div className="grid grid-cols-6 gap-6">
                    {category.children.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => {
                          closeNow();
                          navigate(`/category/${subcategory.id}`);
                        }}
                        className="flex flex-col items-center group text-center"
                      >
                        {/* Grande image */}
                        {subcategory.image && (
                          <div className="w-full aspect-square mb-3 overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow">
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {/* Titre en bas */}
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#5E2251] transition-colors line-clamp-2">
                          {subcategory.name}
                        </h4>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Style 2: Catégories complexes (4 colonnes avec sous-catégories) */
                  <div className="grid grid-cols-4 gap-12">
                    {category.children.map((subcategory) => (
                      <div key={subcategory.id} className="space-y-4">
                        {/* Titre de la sous-catégorie avec image */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                          {subcategory.image && (
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <h4 className="text-sm font-bold text-[#5E2251] uppercase flex-1">
                            {subcategory.name}
                          </h4>
                        </div>
                        
                        {/* Sous-sous-catégories ou lien direct */}
                        {subcategory.children && subcategory.children.length > 0 ? (
                          <ul className="space-y-3">
                            {subcategory.children.map((child) => (
                              <li key={child.id}>
                                <button
                                  onClick={() => {
                                    closeNow();
                                    navigate(`/category/${child.id}`);
                                  }}
                                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#5E2251] transition-colors group/item w-full"
                                >
                                  {child.image && (
                                    <img
                                      src={child.image}
                                      alt={child.name}
                                      className="w-8 h-8 object-cover rounded group-hover/item:scale-110 transition-transform flex-shrink-0"
                                    />
                                  )}
                                  <span className="hover:underline">{child.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <button
                            onClick={() => {
                              closeNow();
                              navigate(`/category/${subcategory.id}`);
                            }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#5E2251] hover:bg-gray-50 rounded transition-colors w-full"
                          >
                            <span className="text-xs font-medium">Voir les produits →</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        );
      })}

    </nav>
  );
};

export default Navbar;