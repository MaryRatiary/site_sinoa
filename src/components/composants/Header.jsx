import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, ChevronDown, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import ExpandSearch from '../forms/ExpandSearch';
import AnimatedBanner from './AnimatedBanner';
import CartModal from '../cart/CartModal'; // 👈 NOUVEAU

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // 👈 NOUVEAU
  const [isVisible, setIsVisible] = useState(true);
  const [navHeight, setNavHeight] = useState(0);

  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timeoutRef = useRef(null);

  // ✅ CORRECTION 1: Utiliser cartItems au lieu de getItemCount
  const { cartItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();

  // Mesurer la hauteur de la navbar
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
    window.addEventListener('resize', () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    });
  }, []);

  // Logic simple: track scroll direction
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const scrollDelta = currentY - lastScrollY.current;

        // En haut = toujours visible
        if (currentY < 50) {
          setIsVisible(true);
        } 
        // Scroll up = montre
        else if (scrollDelta < 0) {
          setIsVisible(true);
        } 
        // Scroll down = cache
        else if (scrollDelta > 0) {
          setIsVisible(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const open = (menu) => { clearTimeout(timeoutRef.current); setActiveMenu(menu); };
  const close = () => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 400); };
  const keep = () => clearTimeout(timeoutRef.current);
  const closeNow = () => setActiveMenu(null);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleLogout = () => { logout(); setShowUserMenu(false); navigate('/'); };

  return (
    <>
      <style>{`
        /* Important: applique padding au html, pas au body */
        html {
          scroll-padding-top: ${navHeight}px;
        }

        .navbar-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          width: 100%;
          background: white;
          border-bottom: 1px solid #f3f4f6;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          /* Animation smooth */
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
          will-change: transform;
        }

        .navbar-root.hidden {
          transform: translateY(-100%);
        }

        /* Padding pour la page sous la navbar */
        .page-spacer {
          height: ${navHeight}px;
        }

        @keyframes megaIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Spacer qui push le contenu vers le bas */}
      <div className="page-spacer" style={{ height: navHeight +7 }} />

      <nav 
        ref={navRef}
        className={`navbar-root ${!isVisible ? 'hidden' : ''}`}
      >
        <AnimatedBanner />

        {/* TOP BAR */}
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div className="flex-1">
            <ExpandSearch />
          </div>

          <Link to="/" className="flex flex-col items-center text-center mx-8">
            <h1 className="text-2xl font-bold tracking-tighter leading-none">프랑스</h1>
            <h1 className="text-2xl font-black tracking-[0.2em] leading-none">HUNTRIX</h1>
            <p className="text-[9px] tracking-[0.35em] text-gray-400 uppercase mt-0.5">Boutique</p>
          </Link>

          <div className="flex-1 flex justify-end items-center gap-5 text-gray-700">

            {/* User */}
            <div className="relative">
              <button onClick={() => setShowUserMenu(v => !v)}
                className="hover:text-[#5E2251] transition-colors duration-200">
                <User size={21} strokeWidth={1.5} />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                  style={{ animation: 'dropIn 0.2s ease forwards' }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors">
                        <Package size={15} /> Mes Commandes
                      </Link>
                      {isAdmin() && (
                        <Link to="/admin/management" onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#5E2251] transition-colors border-t border-gray-100">
                          <LayoutDashboard size={15} /> Dashboard Admin
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                        <LogOut size={15} /> Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Connexion
                      </Link>
                      <Link to="/register" onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100">
                        Inscription
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart - MODIFIÉ POUR OUVRIR LE MODAL */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-[#5E2251] transition-colors duration-200"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {/* ✅ CORRECTION 2: Utiliser cartItems.length au lieu de getItemCount() */}
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#5E2251] text-white text-[9px] font-black min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-1 animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex justify-center gap-8 pb-3 text-[12px] font-semibold uppercase tracking-widest">
          {categoriesLoading ? (
            <div className="flex gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {categories.length === 0 && (
                <p className="text-red-500 text-sm">❌ Aucune catégorie chargée</p>
              )}
              {categories.filter(cat => cat.level === 0).map((category) => {
                return (
                  <div key={category.id} className="relative"
                    onMouseEnter={() => { keep(); open(`category-${category.id}`); }}
                    onMouseLeave={close}>
                    <button
                      onClick={() => { closeNow(); navigate(`/category/${category.slug}`); }}
                      className="flex items-center gap-1 text-gray-600 hover:text-[#5E2251] py-2 transition-colors duration-200 relative group"
                    >
                      {category.name}
                      <ChevronDown size={12}
                        className={`transition-transform duration-300 ${activeMenu === `category-${category.id}` ? 'rotate-180 text-[#5E2251]' : ''}`}
                      />
                      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#5E2251] group-hover:w-full transition-all duration-300 rounded-full" />
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* MEGA MENU */}
        {categories.filter(cat => cat.level === 0).map((category) => {
          const isActive = activeMenu === `category-${category.id}`;
          if (!isActive || !category.children?.length) return null;
          const isSimple = category.children.every(c => !c.children?.length);

          return (
            <div key={`mega-${category.id}`}
              className="w-full bg-white border-t-2 border-[#5E2251] shadow-2xl px-8 py-6"
              style={{ animation: 'megaIn 0.22s cubic-bezier(0.4,0,0.2,1) forwards' }}
              onMouseEnter={keep}
              onMouseLeave={close}>
              <div className="max-w-7xl mx-auto">
                {isSimple ? (
                  <div className="grid grid-cols-6 gap-6">
                    {category.children.map(sub => (
                      <button key={sub.id}
                        onClick={() => { closeNow(); navigate(`/category/${sub.slug}`); }}
                        className="flex flex-col items-center gap-2 group text-center">
                        {sub.image && (
                          <div className="w-full aspect-square overflow-hidden rounded-xl border border-gray-100 group-hover:shadow-md transition-all duration-200">
                            <img src={sub.image} alt={sub.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-gray-700 group-hover:text-[#5E2251] transition-colors">
                          {sub.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-10">
                    <div>
                      <button onClick={() => { closeNow(); navigate(`/category/${category.slug}`); }}
                        className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-[#5E2251] w-full hover:opacity-75 transition-opacity">
                        {category.image && <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-lg" />}
                        <div className="text-left">
                          <p className="text-xs font-black text-[#5E2251] uppercase">{category.name}</p>
                          <p className="text-[10px] text-gray-400">Voir tout</p>
                        </div>
                      </button>
                    </div>
                    {category.children.map(sub => (
                      <div key={sub.id}>
                        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                          {sub.image && <img src={sub.image} alt={sub.name} className="w-10 h-10 object-cover rounded-lg" />}
                          <p className="text-xs font-black text-[#5E2251] uppercase">{sub.name}</p>
                        </div>
                        {sub.children?.length > 0 ? (
                          <ul className="space-y-2.5">
                            {sub.children.map(child => (
                              <li key={child.id}>
                                <button onClick={() => { closeNow(); navigate(`/category/${child.slug}`); }}
                                  className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-[#5E2251] transition-colors group">
                                  {child.image && <img src={child.image} alt={child.name} className="w-7 h-7 object-cover rounded" />}
                                  <span className="group-hover:underline underline-offset-2">{child.name}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <button onClick={() => { closeNow(); navigate(`/category/${sub.slug}`); }}
                            className="text-xs text-gray-400 hover:text-[#5E2251] transition-colors">
                            Voir les produits →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 👇 NOUVEAU: CartModal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;