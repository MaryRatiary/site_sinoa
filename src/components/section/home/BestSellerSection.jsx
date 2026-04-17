import { useNavigate } from "react-router-dom";
import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";

const BestSellerSection = () => {
  const fontHunter = "'Cinzel', serif";




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
        --col-width: 42%;  /* ✅ était 65%, maintenant ~2 cartes visibles */
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

          {bestSellers.map((b, index) => (
            <div
              key={b.id || `${b.name}-${index}`}
              className="snap-start group flex flex-col h-full"
            >
              <div className="flex flex-col h-full space-y-3">
                <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 bg-white">
                  {/* ✅ slug passé, id=null retiré, pas de onClick externe */}
                  <ProductCard
                    slug={b.slug}
                    image={b.url}
                    hoverImage={b.urlHover}
                    name={b.name}
                    price={b.price}
                    originalPrice={b.originalPrice}
                    isEstimated={b.isEstimated}
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