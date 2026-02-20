import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    { name: 'Best Sellers', hot: true },
    { name: 'Kpop Shop', hasDropdown: true, type: 'shop' },
    { name: 'Par Groupe', hasDropdown: true, type: 'groups' },
    { name: 'K-Style', hasDropdown: true, type: 'style' },
    { name: 'K-Beauty', hasDropdown: true, type: 'beauty' },
    { name: 'K-Drama', hasDropdown: true, type: 'drama' },
    { name: 'Blog', hasDropdown: true, type: 'blog' },
  ];

  return (
    <nav className="relative w-full bg-white border-b border-gray-100">
      {/* Top Banner */}
      <div className="w-full bg-[#5E2251] text-white text-[11px] py-1.5 flex justify-center items-center gap-4">
        <span>⌛ Aujourd'hui Livraison Standard Gratuite</span>
        <span className="font-mono">5H : 30 : 23</span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex-1"></div>
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
            onMouseEnter={() => setActiveMenu(item.type)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {item.hot && <span className="absolute -top-6 bg-[#5E2251] text-[9px] text-white px-1.5 py-0.5 rounded leading-none">Hot</span>}
            <span className="text-gray-700 group-hover:text-[#5E2251] transition-colors">{item.name}</span>
            {item.hasDropdown && <ChevronDown size={14} className="text-gray-700 group-hover:text-[#5E2251] group-hover:rotate-180 transition-colors duration-500" />}
            {/* Underline animation on hover */}
            <div className="absolute mt-10 bottom-0 left-0 w-0 h-0.5 bg-[#5E2251] group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* Dropdown Shop */}
      {activeMenu === 'shop' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10 grid grid-cols-5 gap-8"
          onMouseEnter={() => setActiveMenu('shop')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="col-span-1 space-y-4">
             <div className="rounded-lg overflow-hidden bg-purple-900 aspect-video flex items-center justify-center text-white font-bold italic text-sm">K-POP DEMON HUNTERS</div>
             <div className="rounded-lg overflow-hidden bg-purple-600 aspect-video flex items-center justify-center text-white font-bold text-sm">BTS SHOP</div>
             <div className="rounded-lg overflow-hidden bg-yellow-300 aspect-video flex items-center justify-center text-white font-bold text-sm">BTS SHOP</div>
          </div>
          <MenuColumn title="KPOP Merch" items={['Lightsticks', 'Box & Coffrets', 'Figurines & Poupées', 'Coques', 'Photocards', 'Posters']} />
          <MenuColumn title="Vêtement KPOP" items={['T-Shirts', 'Sweats & Pulls', 'Masques', 'Casquettes', 'Bonnets & Bobs', 'Gants & Mitaines']} />
          <MenuColumn title="Bijoux KPOP" items={['Bagues', 'Colliers', 'Boucles d\'oreilles', 'Bracelets', 'Porte-clés', 'Serre-Têtes']} />
          <MenuColumn title="Accessoires KPOP" items={['Peluches', 'Sacs à dos', 'Mugs & Gourdes', 'Trousses', 'Portefeuilles', 'Totebags']} />
        </div>
      )}

      {/* Dropdown Par Groupe */}
      {activeMenu === 'groups' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
          onMouseEnter={() => setActiveMenu('groups')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-6 gap-6">
            {['BTS', 'Blackpink', 'Huntrix', 'Stray Kids', 'Twice', 'New Jeans', 'ATEEZ', 'Seventeen', '+TOMORROW X+TOGETHER', 'NBIT', 'ITZY', 'IVE'].map((group) => (
              <a key={group} className="text-gray-700 hover:text-[#5E2251] text-sm font-medium uppercase transition-colors">
                {group}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown K-Style */}
      {activeMenu === 'style' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
          onMouseEnter={() => setActiveMenu('style')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
            <MenuColumn title="Korean Style" items={['T-Shirts Korean', 'Débardeurs Coréens', 'Pulls & Sweats', 'Manteaux & Doudounes', 'Pyjamas Coréens', 'Blouses & Chemises']} />
            <MenuColumn title="Mode coréenne" items={['Jupes Coréenne', 'Pantalons Coréen', 'Robes Coréennes', 'Vestes & Blazers', 'Chaussures', 'Chaussons & Pantoufles']} />
            <MenuColumn title="Hanbok" items={['Vestes Kimonos', 'Hanbok Femme', 'Hanbok Homme', 'Hanbok Enfant']} />
            <div></div>
          </div>
        </div>
      )}

      {/* Dropdown K-Beauty */}
      {activeMenu === 'beauty' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
          onMouseEnter={() => setActiveMenu('beauty')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
            <MenuColumn title="Produits Skincare" items={['Huile Démaquillante', 'Toner', 'Essence', 'Sérum & Ampoule', 'Nettoyant', 'Crème']} />
            <MenuColumn title="Marques" items={['Skin1004', 'Cosrx', 'Purito', 'Benton', 'Isntree', 'Rovectin']} />
            <div></div>
          </div>
        </div>
      )}

      {/* Dropdown K-Drama */}
      {activeMenu === 'drama' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
          onMouseEnter={() => setActiveMenu('drama')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">A Korean Odyssey</a>
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">Crash Landing On You</a>
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">Start-Up Drama</a>
          </div>
        </div>
      )}

      {/* Dropdown Blog */}
      {activeMenu === 'blog' && (
        <div 
          className="absolute top-full left-0 w-full bg-white z-50 shadow-lg border-t-2 border-[#5E2251] p-10"
          onMouseEnter={() => setActiveMenu('blog')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">Actualités K-pop</a>
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">Guides & Conseils</a>
            <a className="text-gray-700 hover:text-[#5E2251] text-sm font-medium transition-colors">Tendances Coréennes</a>
          </div>
        </div>
      )}
    </nav>
  );
};

const MenuColumn = ({ title, items }) => (
  <div className="flex flex-col gap-2">
    <h3 className="font-bold text-sm border-b border-gray-200 pb-2 mb-1 uppercase tracking-wider text-gray-900">{title}</h3>
    {items.map(i => <a key={i} className="text-gray-700 hover:text-[#5E2251] text-sm transition-colors cursor-pointer">{i}</a>)}
  </div>
);

export default Navbar;