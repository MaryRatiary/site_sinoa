import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../../../hooks/useProducts";

const ACCENT_COLOR = "#b35fc2";

const GroupSection = () => {
  const scrollContainerRef = useRef(null);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const navigate = useNavigate();
  const { products } = useProducts('?limit=250');

  useEffect(() => {
    if (!products || products.length === 0) {
      setLoading(true);
      return;
    }
    
    const withDiscount = products
      .map(p => {
        const price = parseFloat(p.price) || 0;
        const original_price = parseFloat(p.original_price) || null;
        if (original_price && original_price > price) {
          const discount = Math.round(((original_price - price) / original_price) * 100);
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
      .slice(0, 12);

    setDiscountedProducts(withDiscount);
    setLoading(false);
  }, [products]);

  useEffect(() => {
    if (!autoScroll || discountedProducts.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [autoScroll, discountedProducts.length]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setAutoScroll(false);
      setTimeout(() => setAutoScroll(true), 7000);
    }
  };

  if (loading) {
    return (
      <section className="w-full py-8 md:py-10 px-4 bg-white">
        <div className="flex items-center justify-center min-h-40">
          <div className="text-xs tracking-[0.3em] text-gray-400 uppercase font-light">
            • Loading offers...
          </div>
        </div>
      </section>
    );
  }

  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap');

        @keyframes float-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { width: 0; opacity: 0; }
          to { width: 40px; opacity: 1; }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .float-in {
          animation: float-in 0.8s ease-out;
        }

        .title-line {
          animation: slide-down 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          width: 0;
          height: 2px;
          background: ${ACCENT_COLOR};
        }

        .product-image {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .product-card:hover .product-image {
          transform: scale(1.06);
        }

        .discount-badge {
          transition: all 0.3s ease;
          background: ${ACCENT_COLOR};
          box-shadow: 0 4px 12px rgba(179, 95, 194, 0.3);
        }

        .product-card:hover .discount-badge {
          transform: scale(1.12);
          box-shadow: 0 6px 20px rgba(179, 95, 194, 0.5);
        }

        .product-card:hover {
          border-color: ${ACCENT_COLOR};
          box-shadow: 0 8px 20px rgba(179, 95, 194, 0.15);
        }

        .nav-button {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          transition: all 0.25s ease;
        }

        .nav-button:hover:not(:disabled) {
          background: ${ACCENT_COLOR};
          border-color: ${ACCENT_COLOR};
          color: #ffffff;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(179, 95, 194, 0.3);
        }

        .nav-button:active:not(:disabled) {
          transform: scale(0.96);
        }

        .nav-button:disabled {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      <section className="w-full py-8 md:py-10 px-4 md:px-8 bg-white relative overflow-hidden border-t border-gray-100">
        
        {/* Subtle background element */}
        <div className="absolute inset-0 opacity-100">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="float-in inline-block mb-2">
              <span className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase"
                    style={{ color: ACCENT_COLOR }}>
                ⚡ Flash Deals
              </span>
            </div>

            <div className="relative mb-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-black" 
                  style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Les Meilleures <span style={{ color: ACCENT_COLOR }}>OFFRES</span>
              </h2>
              <div className="title-line mx-auto mt-3"></div>
            </div>

            <p className="text-xs md:text-sm tracking-widest text-gray-500 uppercase font-light"
               style={{ fontFamily: "'Space Mono', monospace" }}>
              Jusqu'à -70% sélectionnés
            </p>
          </div>

          {/* Carousel */}
          <div className="relative group/carousel">
            
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-6 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-black items-center justify-center border border-gray-300 transition-all duration-300 group-hover/carousel:opacity-100 opacity-0 shadow-sm hover:shadow-md"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT_COLOR;
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(179, 95, 194, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = ACCENT_COLOR;
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.1)';
              }}
              aria-label="Produit précédent"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Products Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 pb-2"
              style={{ scrollBehavior: 'smooth' }}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
            >
              {discountedProducts.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="flex-shrink-0 w-[140px] md:w-[170px] snap-start float-in"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Product Card */}
                  <div
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="product-card cursor-pointer group h-full flex flex-col rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 bg-white"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={product.image || product.url}
                        alt={product.name}
                        className="product-image w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                        <button 
                          className="w-full font-bold py-1.5 rounded text-xs hover:shadow-md transition-all duration-300 uppercase tracking-widest text-[10px] text-white"
                          style={{ background: ACCENT_COLOR }}
                        >
                          Voir
                        </button>
                      </div>

                      {/* Discount Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="discount-badge flex items-center justify-center w-12 h-12 rounded-full text-white font-black text-xs" 
                             style={{ textShadow: '0 0 4px rgba(0,0,0,0.5)' }}>
                          -{product.discountPercent}%
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-2.5 md:p-3 flex flex-col justify-between bg-white">
                      <h3 className="font-semibold text-gray-900 text-[11px] md:text-xs line-clamp-2 leading-tight mb-1.5"
                          style={{ fontFamily: "'Space Mono', monospace" }}>
                        {product.name}
                      </h3>
                      
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-xs md:text-sm"
                              style={{ fontFamily: "'Space Mono', monospace", color: ACCENT_COLOR }}>
                          {product.price?.toFixed(2).replace('.', ',')}€
                        </span>
                        {product.original_price && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {product.original_price?.toFixed(2).replace('.', ',')}€
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-6 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-black items-center justify-center border border-gray-300 transition-all duration-300 group-hover/carousel:opacity-100 opacity-0 shadow-sm hover:shadow-md"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT_COLOR;
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = `0 4px 12px rgba(179, 95, 194, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = ACCENT_COLOR;
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.1)';
              }}
              aria-label="Produit suivant"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center justify-center gap-3 w-full mt-6">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-white text-black border border-gray-300 active:scale-95 transition-all"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT_COLOR;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = ACCENT_COLOR;
              }}
              aria-label="Produit précédent"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-white text-black border border-gray-300 active:scale-95 transition-all"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ACCENT_COLOR;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = ACCENT_COLOR;
              }}
              aria-label="Produit suivant"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroupSection;