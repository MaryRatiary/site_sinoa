import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsAPI } from "../../../services/api";
import { ProductCard } from "../../card/ProductCard";

const BestSellerSection = () => {
  const fontHunter = "'Cinzel', serif";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ CORRIGÉ: Utilise les NOMS de catégories au lieu des IDs
  const CATEGORIES = {
    vetements: ['T-shirts & Débardeurs', 'Sweats & Pulls', 'Vestes & Costumes'],
    accessoires: ['Sacs & Maroquinerie', 'Bijoux & Accessoires', 'Mode & Protection'],
    collectibles: ['Peluches', 'Figurines', 'Box & Cosplay'],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 1. Récupérer TOUS les produits
        const allProducts = await productsAPI.getAll('?limit=50000');
        
        if (!allProducts || allProducts.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // 2. Grouper les produits par catégorie (en utilisant categoryName)
        const productsByCategory = {};
        
        Object.entries(CATEGORIES).forEach(([groupName, categoryNames]) => {
          productsByCategory[groupName] = allProducts.filter(p =>
            categoryNames.includes(p.categoryName)
          );
        });

        // 3. Sélectionner aléatoirement 2 produits par catégorie
        const selectedProducts = [];
        
        Object.entries(productsByCategory).forEach(([groupName, groupProducts]) => {
          if (groupProducts.length === 0) return;

          // Mélanger et prendre 2 aléatoires
          const shuffled = [...groupProducts].sort(() => Math.random() - 0.5);
          const twoRandom = shuffled.slice(0, 2);
          selectedProducts.push(...twoRandom);
        });

        // 4. Mélanger les 6 produits finaux (2×3 catégories)
        const mixed = selectedProducts.sort(() => Math.random() - 0.5);
        
        console.log(`✅ ${mixed.length} produits Best Seller chargés`);
        setProducts(mixed);
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ── Loader ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="w-full py-8 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-4 flex flex-col items-center md:items-start">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#b35fc2] mb-2" style={{ fontFamily: fontHunter }}>
              Elite Equipment
            </span>
          </div>
          <div className="flex items-center justify-center h-40">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-[2px] border-[#b35fc2]/10" />
              <div className="absolute inset-0 rounded-full border-[2px] border-t-[#b35fc2] animate-spin" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-2 md:py-4 px-4 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-4 md:mb-4 flex flex-col items-center md:items-start relative">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#b35fc2] mb-2" style={{ fontFamily: fontHunter }}>
            Elite Equipment
          </span>
        </div>

        <div className="grid-container grid gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-8 scrollbar-hide snap-x snap-mandatory">
        <style jsx>{`
      .grid-container {
        grid-auto-flow: column;
        grid-template-rows: repeat(2, min-content);
        --col-width: 42%;  /* ✅ ~2 cartes visibles */
      }
      @media (min-width: 768px) {
        .grid-container {
          grid-template-rows: repeat(1, min-content);
          --col-width: 22%;
        }
      }
      @media (min-width: 1024px) {
        .grid-container { --col-width: 18%; }
      }
      .grid-container { grid-auto-columns: var(--col-width); }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>

          {products.map((product, index) => (
            <div
              key={product.id || `${product.name}-${index}`}
              className="snap-start group flex flex-col h-full animate-fade-in"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
              }}
            >
              <style>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              <div className="flex flex-col h-full space-y-3">
                <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white">
                  {/* ✅ CORRIGÉ: Inversé les prix - originalPrice affiché, price barré */}
                  <ProductCard
                    slug={product.slug || `product-${product.id}`}
                    image={product.image || product.url}
                    hoverImage={product.hoverImage || product.urlHover}
                    name={product.name || product.title}
                    price={product.originalPrice}
                    originalPrice={product.price}
                    isEstimated={product.isEstimated}
                  />
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#b35fc2] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerSection;