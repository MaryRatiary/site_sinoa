import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import fashion from "../../../data/k-fashion";
import beauty from "../../../data/k-beauty";
import bestSellers from "../../../data/bestSellers";
import huntrix from "../../../data/huntrixProducts";
import lightStick from "../../../data/lightStick";

const GroupSection = () => {
  const scrollContainerRef = useRef(null);
  const headerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);

  const navigate = useNavigate();

  // Récupérer tous les produits et filtrer ceux avec +20% de réduction
  useEffect(() => {
    const allProducts = [...fashion, ...beauty, ...bestSellers, ...huntrix, ...lightStick];
    
    const withDiscount = allProducts
      .map(p => {
        const price = parseFloat(p.price) || 0;
        const originalPrice = parseFloat(p.originalPrice) || null;
        if (originalPrice && originalPrice > price) {
          const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
          if (discount >= 20) {
            return { 
              ...p, 
              discountPercent: discount,
              slug: p.slug || `product-${p.id}`
            };
          }
        }
        return null;
      })
      .filter(Boolean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    setDiscountedProducts(withDiscount);
  }, []);

  // Rendre le header visible immédiatement
  useEffect(() => {
    setIsHeaderVisible(true);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!autoScroll || discountedProducts.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 260, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, discountedProducts.length]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setAutoScroll(false);
      setTimeout(() => setAutoScroll(true), 6000);
    }
  };

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-white max-h-[400px] flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-6 md:gap-8 items-start h-full">
        
        {/* Header - Left Side like HuntrixSection with Hunter style */}
        <div 
          ref={headerRef}
          className="w-full lg:w-auto flex-shrink-0 lg:sticky lg:top-0"
        >
          <div className="flex items-center gap-4 md:gap-6 group">
            {/* Ligne de couleur */}
            <div className="h-8 md:h-12 w-1 md:w-1.5 bg-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.1)]"></div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-gray-900 leading-none tracking-tighter">
                Les Meilleures <span className="text-gray-500">OFFRES</span>
              </h2>
              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                Flash Deals Active
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Container - Right Side like HuntrixSection */}
        <div className="w-full flex-1 flex flex-nowrap overflow-x-auto gap-3 pb-2 snap-x snap-mandatory scrollbar-hide focus:outline-none relative group/carousel">
          
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute -left-14 top-24 z-20 w-10 h-10 rounded-full bg-gray-900 text-white items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 group-hover/carousel:opacity-100 opacity-0"
            aria-label="Produit précédent"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
          >
            {discountedProducts.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-[30vw] lg:w-[200px] snap-start cursor-pointer group"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-gray-50">
                  <img
                    src={product.image || product.url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <button className="w-full bg-white text-gray-900 font-bold py-1.5 rounded text-[10px] hover:bg-gray-100 transition-colors">
                      Voir
                    </button>
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-2 right-2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-gray-900 text-white font-black text-xs shadow-md">
                    -{product.discountPercent}%
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-2 flex flex-col gap-0.5">
                  <h3 className="font-semibold text-gray-900 text-[11px] sm:text-xs line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-xs sm:text-sm text-gray-900">
                      {product.price?.toFixed(2).replace('.', ',')}€
                    </span>
                    {product.originalPrice && (
                      <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                        {product.originalPrice?.toFixed(2).replace('.', ',')}€
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute -right-14 top-24 z-20 w-10 h-10 rounded-full bg-gray-900 text-white items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 group-hover/carousel:opacity-100 opacity-0"
            aria-label="Produit suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-center gap-2 w-full mt-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-gray-900 text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
            aria-label="Produit précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-gray-900 text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
            aria-label="Produit suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default GroupSection;