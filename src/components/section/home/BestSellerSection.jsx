import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";

const BestSellerSection = () => {
  return (
    <section className="w-full py-6 md:py-10 px-4 bg-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Conteneur Scrollable Horizontal - Mobile & Desktop */}
        <div className="flex flex-nowrap overflow-x-auto gap-4 md:gap-6 pb-8 scrollbar-hide snap-x snap-mandatory">
          {bestSellers.map((b) => (
            <div
              key={b.name}
              /* Largeur adaptative : 65% sur mobile, 20% sur desktop pour voir 5 produits */
              className="w-[65vw] sm:w-[40vw] md:w-[28vw] lg:w-[18%] flex-shrink-0 snap-start group"
            >
              <div className="flex flex-col h-full space-y-3">
                {/* Carte Produit - Hauteur contrôlée */}
                <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <ProductCard
                    className="w-full object-cover"
                    image={b.url}
                    hoverImage={b.urlHover}
                    name={b.name}
                    price={b.realPrice}
                    reducedPrice={b.reducedPrice}
                    isEstimated={b.isEstimated}
                  />
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