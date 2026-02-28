import React from 'react';
import lightStick from "../../data/lightStick";
import { ProductCard } from "../card/ProductCard";

const LightStickCard = () => {
  // On s'assure de ne prendre que les 4 premiers produits
  const displayProducts = lightStick.slice(0, 4);
  const categories = ["All Gear", "Lightsticks", "Apparel", "Limited"];

  return (
    <section className="w-full py-6 md:py-10 px-4 bg-white">
      
      {/* --- FILTRES (Horizontaux scrollables sur mobile) --- */}
      <div className="flex overflow-x-auto pb-6 scrollbar-hide gap-3 sm:justify-center">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
              ${i === 0 
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-[#b35fc2] hover:text-[#b35fc2]'
              }`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- GRILLE FIXE (Pas de scroll horizontal) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {displayProducts.map((b, index) => (
          <div
            key={b.id || `${b.name}-${index}`}
            className="group flex flex-col"
          >
            {/* Conteneur Huntrix */}
            <div className="relative p-[1px] rounded-xl md:rounded-2xl transition-all duration-500 group-hover:bg-gradient-to-b from-[#b35fc2] to-[#8318b3] shadow-sm hover:shadow-xl">
              <div className="bg-white rounded-[11px] md:rounded-[15px] overflow-hidden relative">
                
                <ProductCard
                  id={b.id}
                  image={b.url}
                  hoverImage={b.urlHover}
                  name={b.name}
                  price={b.realPrice}
                  reducedPrice={b.reducedPrice}
                  isEstimated={b.isEstimated}
                />

                {/* Badge au hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                  <span className="text-[8px] font-black text-white px-2 py-0.5 rounded bg-[#b35fc2] uppercase">
                    Hunter Gear
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer décoratif Huntrix */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]" style={{ fontFamily: "'Cinzel', serif" }}>
            Huntrix Selection 04
        </span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>
    </section>
  );
};

export default LightStickCard;