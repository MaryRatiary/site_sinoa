import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";

const ACCENT_COLOR = "#5E2251";

const RelatedProducts = ({ currentProductId }) => {
  const scrollContainerRef = useRef(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { products } = useProducts('?limit=250');

  useEffect(() => {
    if (!products || products.length === 0) {
      setLoading(true);
      return;
    }
    
    // Filtrer les produits (exclure le produit actuel)
    const filtered = products
      .filter(p => p.id !== currentProductId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 20); // Garder 20 produits pour plus de variété

    setRelatedProducts(filtered);
    setLoading(false);
  }, [products, currentProductId]);

  useEffect(() => {
    if (!autoScroll || relatedProducts.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        // Scroller une largeur de produit (150px + gap)
        const scrollAmount = 162; // 150px width + 12px gap
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, relatedProducts.length]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -162 : 162; // 150px + 12px gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setAutoScroll(false);
      setTimeout(() => setAutoScroll(true), 6000);
    }
  };

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes float-in-related {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .scrollbar-hide-related::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide-related {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .float-in-related {
          animation: float-in-related 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .product-image-related {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .product-card-related:hover .product-image-related {
          transform: scale(1.05);
        }

        .product-card-related {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-related:hover {
          transform: translateY(-4px);
          border-color: ${ACCENT_COLOR};
          box-shadow: 0 12px 24px rgba(94, 34, 81, 0.15);
        }

        .nav-button-related {
          background: #ffffff;
          border: 2px solid #e5e5e5;
          transition: all 0.3s ease;
        }

        .nav-button-related:hover:not(:disabled) {
          background: ${ACCENT_COLOR};
          border-color: ${ACCENT_COLOR};
          color: #ffffff;
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(94, 34, 81, 0.3);
        }

        .nav-button-related:active:not(:disabled) {
          transform: scale(0.95);
        }

        .product-overlay {
          backdrop-filter: blur(2px);
        }
      `}</style>

      <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
              Vous pourriez aussi aimer
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gradient-to-r from-[#5E2251] to-[#8B3A62]"></div>
              <p className="text-sm md:text-base text-gray-600">
                Découvrez d'autres produits de notre sélection
              </p>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative group/carousel">
            
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="nav-button-related hidden lg:flex absolute -left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center group-hover/carousel:opacity-100 opacity-0 transition-all duration-300"
              style={{ color: ACCENT_COLOR }}
              aria-label="Produit précédent"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Products Container - Affiche 6 produits */}
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide-related snap-x snap-mandatory"
              style={{ 
                scrollBehavior: 'smooth',
                // Container width pour afficher exactement 6 produits
                // 6 produits × 150px + 5 gaps × 12px = 960px
              }}
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
            >
              {relatedProducts.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="flex-shrink-0 w-[150px] snap-start float-in-related"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  {/* Product Card - 150px × 300px */}
                  <div
                    onClick={() => navigate(`/product/${product.slug || `product-${product.id}`}`)}
                    className="product-card-related cursor-pointer group h-[300px] flex flex-col rounded-xl overflow-hidden border border-gray-200 transition-all bg-white"
                  >
                    {/* Image Container - 150px × 200px */}
                    <div className="relative w-full h-[200px] overflow-hidden bg-gray-100">
                      <img
                        src={product.image || product.url || 'https://via.placeholder.com/150x200?text=Image'}
                        alt={product.name || product.title}
                        className="product-image-related w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x200?text=Image';
                        }}
                      />

                      {/* Overlay on Hover */}
                      <div className="product-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          className="font-bold py-2 px-4 rounded-lg text-xs hover:shadow-lg transition-all duration-300 uppercase tracking-wide text-white"
                          style={{ background: ACCENT_COLOR }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.slug || `product-${product.id}`}`);
                          }}
                        >
                          Voir
                        </button>
                      </div>

                      {/* Sale Badge */}
                      {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                        <div className="absolute top-2 right-2 z-10">
                          <div 
                            className="flex items-center justify-center px-2 py-1 rounded-full text-white font-bold text-[11px] shadow-lg"
                            style={{ background: ACCENT_COLOR }}
                          >
                            -{Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info - 150px × 100px */}
                    <div className="flex-1 p-3 flex flex-col justify-between bg-white">
                      {/* Product Name */}
                      <h3 
                        className="font-semibold text-gray-900 text-[13px] leading-tight line-clamp-2 mb-2"
                        title={product.name || product.title}
                      >
                        {product.name || product.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <span 
                          className="font-black text-sm"
                          style={{ color: ACCENT_COLOR }}
                        >
                          {parseFloat(product.price || 0).toFixed(2).replace('.', ',')}€
                        </span>
                        {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {parseFloat(product.original_price).toFixed(2).replace('.', ',')}€
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
              className="nav-button-related hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center group-hover/carousel:opacity-100 opacity-0 transition-all duration-300"
              style={{ color: ACCENT_COLOR }}
              aria-label="Produit suivant"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center justify-center gap-3 w-full mt-6">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-white border-2 transition-all active:scale-95"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
              aria-label="Produit précédent"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <span className="text-xs text-gray-400 tracking-widest uppercase font-medium">Faites défiler</span>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-white border-2 transition-all active:scale-95"
              style={{ borderColor: ACCENT_COLOR, color: ACCENT_COLOR }}
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

export default RelatedProducts;