import React, { useState, useEffect, useRef } from 'react';
import { useProductsByCategory } from '../../../hooks/useProducts';
import { categoriesAPI } from '../../../services/api';
import SmoothSlider from '../../card/SmoothSlider';

const ACCENT_COLOR = "#b35fc2";

const CollectiblesSection = () => {
  const [collectiblesCategories, setCollectiblesCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [collectiblesParentId, setCollectiblesParentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  // Récupérer les sous-catégories de Collectibles & Fun
  useEffect(() => {
    const fetchCollectibles = async () => {
      try {
        const allCategories = await categoriesAPI.getAllFlat();
        
        const collectiblesParent = allCategories.find(
          cat => cat.name === 'Collectibles & Fun' && cat.level === 0
        );

        if (collectiblesParent) {
          setCollectiblesParentId(collectiblesParent.id);

          const children = allCategories.filter(
            cat => cat.parent_id === collectiblesParent.id || cat.parentid === collectiblesParent.id
          );

          setCollectiblesCategories(children);
          setSelectedTab(children[0]?.id || null);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des collectibles:', error);
        setLoading(false);
      }
    };

    fetchCollectibles();
  }, []);

  // Récupérer les produits de la catégorie sélectionnée
  const { products: selectedProducts, loading: productsLoading } = useProductsByCategory(selectedTab);

  // ✅ CORRIGÉ: Transformer les produits avec prix inversés
  const sliderCards = selectedProducts.map(product => ({
    id: product.id,
    slug: product.slug,
    url: product.image || product.image_url || '/placeholder.jpg',
    title: product.name,
    price: product.original_price,  // ✅ Inversé: original_price en normal
    original_price: product.price   // ✅ Inversé: price barré
  }));

  if (loading) {
    return (
      <section className="w-full py-29 px-4 md:px-6 bg-white">
        <div className="flex items-center justify-center !min-h-160">
          <div className="text-xs tracking-widest text-gray-400 uppercase">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Lexend:wght@300;400;500;600;700;800&display=swap');

        @keyframes slide-down {
          from { width: 0; opacity: 0; }
          to { width: 40px; opacity: 1; }
        }

        @keyframes float-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(179, 95, 194, 0.3); }
          50% { box-shadow: 0 0 12px 4px rgba(179, 95, 194, 0.1); }
        }

        .title-line {
          animation: slide-down 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
          width: 0;
          height: 2px;
          background: ${ACCENT_COLOR};
        }

        .float-in {
          animation: float-in 0.8s ease-out;
        }

        .tab-button {
          transition: all 0.25s ease;
        }

        .tab-button:hover {
          border-color: ${ACCENT_COLOR};
          color: ${ACCENT_COLOR};
          box-shadow: 0 2px 8px rgba(179, 95, 194, 0.15);
        }

        .tab-button.active {
          background: ${ACCENT_COLOR};
          color: #fff;
          border-color: ${ACCENT_COLOR};
          box-shadow: 0 4px 12px rgba(179, 95, 194, 0.3);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: ${ACCENT_COLOR};
          box-shadow: 0 0 6px rgba(179, 95, 194, 0.6);
        }
      `}</style>

      <section ref={sectionRef} className="w-full py-8 md:py-10 px-4 md:px-6 bg-white relative overflow-hidden">
        
        {/* Subtle top border with accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* TITRE PRINCIPAL */}
          <div className="text-center mb-6 md:mb-8">
            <div className="float-in inline-block mb-2">
              <span className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase" 
                    style={{ fontFamily: "'Space Mono', monospace", color: ACCENT_COLOR }}>
                ✦ Collection
              </span>
            </div>

            <div className="relative mb-4">
              <h2 
                className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black leading-none"
                style={{ fontFamily: "'Lexend', sans-serif", letterSpacing: '-0.02em' }}
              >
                Collectibles <span style={{ color: ACCENT_COLOR }}>&</span> Fun
              </h2>
              <div className="title-line mx-auto mt-3"></div>
            </div>

            <p 
              className="text-xs md:text-sm tracking-widest text-gray-500 uppercase font-light"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Peluches • Figurines • Photocards
            </p>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
            {collectiblesCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedTab(category.id)}
                className={`tab-button relative px-4 md:px-5 py-1.5 md:py-2 rounded-sm text-xs md:text-sm font-bold uppercase tracking-widest border border-gray-200 ${
                  selectedTab === category.id 
                    ? 'active' 
                    : 'bg-white text-black'
                }`}
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* PRODUITS SLIDER */}
          <div>
            {productsLoading ? (
              <div className="flex items-center justify-center min-h-32">
                <div className="text-xs tracking-widest text-gray-400 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Loading...
                </div>
              </div>
            ) : sliderCards.length > 0 ? (
              <SmoothSlider 
                cards={sliderCards}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                  No products available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CollectiblesSection;