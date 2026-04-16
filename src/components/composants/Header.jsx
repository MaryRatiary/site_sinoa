import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import ExpandSearch from '../forms/ExpandSearch';
import AnimatedBanner from './AnimatedBanner';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef(null);
  const lastScrollY = useRef(0);

  const { getItemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();

  // 🔥 SCROLL LOGIC CLEAN
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 50) {
        setShowNavbar(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);

        if (Math.abs(currentY - lastScrollY.current) < 10) return;

        if (currentY > lastScrollY.current) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔥 DROPDOWN LOGIC (inchangé)
  const open = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 400);
  };

  const keep = () => clearTimeout(timeoutRef.current);
  const closeNow = () => setActiveMenu(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav
  className={`
    ${isScrolled ? 'fixed top-0 left-0 right-0' : 'relative'}
    w-full z-50
    transition-transform duration-300 ease-in-out
    ${showNavbar ? 'translate-y-0' : '-translate-y-full'}
    ${isScrolled 
      ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md' 
      : 'bg-white border-b border-gray-100'
    }
  `}
>
      {/* Banner */}
      <AnimatedBanner />

      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex-1">
          <ExpandSearch />
        </div>

        <Link to="/" className="flex-col items-center text-center">
          <h1 className="text-2xl font-bold tracking-tighter">프랑스</h1>
          <h1 className="text-3xl font-black tracking-[0.2em] mt-[-8px]">KPOP</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Boutique</p>
        </Link>

        {/* RIGHT */}
        <div className="flex-1 flex justify-end gap-5 text-gray-700">
          
          {/* USER */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hover:text-[#5E2251] transition-colors"
            >
              <User size={22} strokeWidth={1.5} />
            </button>

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

                    <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                      <Package size={16} />
                      Mes Commandes
                    </Link>

                    {isAdmin() && (
                      <Link to="/admin/management" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 border-t">
                        <LayoutDashboard size={16} />
                        Dashboard Admin
                      </Link>
                    )}

                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t">
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 text-sm hover:bg-gray-50">
                      Connexion
                    </Link>
                    <Link to="/register" className="block px-4 py-3 text-sm hover:bg-gray-50 border-t">
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* CART */}
          <Link to="/cart" className="relative hover:text-[#5E2251] transition-colors group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5E2251] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* NAV LINKS */}
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
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#5E2251] py-2">
                {category.name}
                <ChevronDown size={14} className="hover:rotate-180 transition-all duration-500" />
              </button>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5E2251] hover:w-full transition-all duration-500" />
            </div>
          ))
        )}
      </div>

      {/* 🔥 MEGA MENU ORIGINAL (inchangé) */}
      {categories.map((category) => {
        const isSimpleCategory = category.children && 
          category.children.length > 0 && 
          category.children.every(child => !child.children || child.children.length === 0);

        return (
          activeMenu === `category-${category.id}` && category.children?.length > 0 && (
            <div
              key={`dropdown-${category.id}`}
              className="sticky w-full bg-white border-t-4 border-[#5E2251] shadow-xl p-8 z-50"
              style={{ top: '0' }}
              onMouseEnter={keep}
              onMouseLeave={close}
            >
              <div className="max-w-7xl mx-auto">
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
                        {subcategory.image && (
                          <div className="w-full aspect-square mb-3 overflow-hidden rounded-lg border border-gray-200 group-hover:shadow-lg">
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#5E2251]">
                          {subcategory.name}
                        </h4>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-12">
                    {category.children.map((subcategory) => (
                      <div key={subcategory.id} className="space-y-4">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                          {subcategory.image && (
                            <img
                              src={subcategory.image}
                              alt={subcategory.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <h4 className="text-sm font-bold text-[#5E2251] uppercase flex-1">
                            {subcategory.name}
                          </h4>
                        </div>

                        {subcategory.children?.length > 0 ? (
                          <ul className="space-y-3">
                            {subcategory.children.map((child) => (
                              <li key={child.id}>
                                <button
                                  onClick={() => {
                                    closeNow();
                                    navigate(`/category/${child.id}`);
                                  }}
                                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#5E2251]"
                                >
                                  {child.image && (
                                    <img
                                      src={child.image}
                                      alt={child.name}
                                      className="w-8 h-8 object-cover rounded"
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
                            className="text-sm hover:text-[#5E2251]"
                          >
                            Voir les produits →
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