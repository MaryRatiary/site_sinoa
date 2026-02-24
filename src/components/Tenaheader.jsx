import React, { useState, useEffect, useRef } from 'react';
import { useNavigate , Link  } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems, dropdownData } from '../data/menuData';

const MenuColumn = ({ title, items }) => (
  <div className="space-y-4">
    <h4 className="font-bold text-[#5E2251] uppercase text-sm">
      {title}
    </h4>

    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center gap-3 group cursor-pointer">

            {/* Square Image */}
            <img
              src={item.image}
              alt={item.label}
              className="w-8 h-8 object-cover rounded-md border border-gray-200 group-hover:scale-105 transition-transform duration-200"
            />

            <span className="text-sm text-gray-700 group-hover:text-[#5E2251] transition">
              {item.label}
            </span>

          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);
  const [beautyFilter, setBeautyFilter] = useState('Produits Skincare');
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(menu); // ouverture instantanée
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null); // fermeture après 500ms
    }, 500);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const dropdownProps = {
    onMouseEnter: () => clearTimeout(timeoutRef.current),
    onMouseLeave: handleMouseLeave,
  };

  return (
    <nav className="relative w-full bg-white border-b border-gray-100">
      {/* Top Banner */}
      <div className="w-full bg-[#5E2251] text-white text-[11px] py-1.5 flex justify-center items-center gap-4">
        <span>⌛ Aujourd'hui Livraison Standard Gratuite</span>
        <span className="font-mono">5H : 30 : 23</span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex-1" />
        <div className="flex-col items-center text-center">
          <h1 className="text-2xl font-bold tracking-tighter">프랑스</h1>
          <h1 className="text-3xl font-black tracking-[0.2em] mt-[-8px]">KPOP</h1>
          <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Boutique</p>
        </div>
        <div className="flex-1 flex justify-end gap-5 text-gray-700">
          <Search size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#5E2251] transition-colors" />
          <User size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#5E2251] transition-colors" />
          <ShoppingBag size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#5E2251] transition-colors" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex justify-center gap-8 pb-4 text-[13px] font-medium uppercase tracking-wide relative">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative flex items-center gap-1 cursor-pointer group pb-2"
            onMouseEnter={() => handleMouseEnter(item.type ?? null)}
            onMouseLeave={handleMouseLeave}
          >
            {item.hot && (
              <span className="absolute -top-6 bg-[#5E2251] text-[9px] text-white px-1.5 py-0.5 rounded leading-none">Hot</span>
            )}
            <span className="text-gray-700 group-hover:text-[#5E2251] transition-colors">{item.name}</span>
            {item.hasDropdown && (
              <ChevronDown size={14} className="text-gray-700 group-hover:text-[#5E2251] group-hover:rotate-180 transition-colors duration-500" />
            )}
            <div className="absolute mt-10 bottom-0 left-0 w-0 h-0.5 bg-[#5E2251] group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>

      {activeMenu === 'shop' && (
        <div
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10 grid grid-cols-5 gap-8"
          {...dropdownProps}
        >
          {/* Featured images */}
          <div className="col-span-1 flex flex-col gap-3">
            {dropdownData.shop.featured.map((f) => (
              <Link
                key={f.label}
                to={f.url}
                onClick={closeNow}
                className="relative rounded-lg overflow-hidden aspect-video flex items-end group"
              >
                <img
                  src={f.image}
                  alt={f.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>

          {/* Columns */}
          {dropdownData.shop.columns.map((col) => (
            <MenuColumn key={col.title} title={col.title} items={col.items} onClose={closeNow} />
          ))}
        </div>
      )}


      {activeMenu === 'groups' && (
        <div
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10 transition-opacity duration-500"
          {...dropdownProps}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {dropdownData.groups.map((group) => (
              <button
                key={group.name}
                onClick={() => navigate(group.url)}
                className="group flex flex-col items-center text-center cursor-pointer"
              >
                <div className="relative w-40 h-40 overflow-hidden rounded-xl">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 pointer-events-none" />
                </div>

                <span className="mt-4 text-gray-800 group-hover:text-[#5E2251] text-sm font-semibold uppercase tracking-wide transition-colors duration-300">
                  {group.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown K-Style */}
      {activeMenu === 'style' && (
        <div className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10" {...dropdownProps}>
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
            {dropdownData.style.map((col) => (
              <MenuColumn
                key={col.title}
                title={col.title}
                items={col.items.map(item => ({
                  label: item.label,
                  url: item.url,
                  image: item.image
                }))}
              />
            ))}
          </div>
        </div>
      )}

      {activeMenu === 'beauty' && (
        <div
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-6 flex gap-6"
          {...dropdownProps}
        >
          {/* Colonne gauche : filtres */}
          <div className="flex flex-col gap-6 w-56">
            {dropdownData.beauty.map((filter) => {
              const isActive = beautyFilter === filter.title;

              return (
                <button
                  key={filter.title}
                  onClick={() => setBeautyFilter(filter.title)}
                  className="group flex items-center justify-between relative text-sm font-semibold uppercase tracking-wide"
                >
                  {/* Left side (arrow + text) */}
                  <div className="flex flex-row-reverse items-center justify-between w-full">
                    {/* Arrow */}
                    <ChevronRight
                      size={16}
                      className={`transition-all duration-300 ${isActive
                          ? "text-[#5E2251] translate-x-0"
                          : "text-gray-400 -translate-x-1 group-hover:translate-x-0 group-hover:text-[#5E2251]"
                        }`}
                    />

                    {/* Text */}
                    <span
                      className={`transition-colors duration-300 ${isActive
                          ? "text-[#5E2251]"
                          : "text-gray-700 group-hover:text-[#5E2251]"
                        }`}
                    >
                      {filter.title}
                    </span>
                  </div>

                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-[#5E2251] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Colonne droite : contenu dynamique */}
          <div className="flex-1 grid grid-cols-4 gap-6">
            {dropdownData.beauty
              .find((f) => f.title === beautyFilter)
              .items.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative w-36 h-36 overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 pointer-events-none" />
                  </div>
                  <span className="mt-2 text-gray-800 group-hover:text-[#5E2251] text-sm font-semibold uppercase tracking-wide transition-colors duration-300">
                    {item.label}
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Dropdown K-Drama */}
      {activeMenu === 'drama' && (
        <div className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10" {...dropdownProps}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
            {dropdownData.drama.map((drama) => (
              <a key={drama} className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors cursor-pointer">{drama}</a>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Blog */}
      {activeMenu === 'blog' && (
  <div
    className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
    {...dropdownProps}
  >
    <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
      {dropdownData.blog.map((post) => (
        <a
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex gap-4"
        >
          <div className="relative h-24 overflow-hidden rounded-xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#5E2251] transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {post.excerpt}
            </p>
          </div>
        </a>
      ))}
    </div>
  </div>
)}
    </nav>
  );
};

export default Navbar;