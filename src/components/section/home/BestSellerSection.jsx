import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";

const BestSellerSection = () => {
  return (
    <section className="w-full py-4 md:py-8">
      {/* Mobile: flex-nowrap + overflow-x-auto (Scroll horizontal)
          Desktop: md:grid (Grille classique)
      */}
      <div className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-6 md:pb-0 scrollbar-hide snap-x snap-mandatory">
        {bestSellers.map((b) => (
          <div
            key={b.name}
            className="w-[70vw] sm:w-[40vw] md:w-full flex-shrink-0 snap-center"
          >
            <ProductCard
              className="w-full shadow-sm border border-gray-100 rounded-xl transition-all duration-300 hover:shadow-lg"
              image={b.url}
              hoverImage={b.urlHover}
              name={b.name}
              price={b.realPrice}
              reducedPrice={b.reducedPrice}
              isEstimated={b.isEstimated}
            />
          </div>
        ))}
      </div>

      {/* Indicateur visuel pour le scroll mobile uniquement */}
      <div className="flex md:hidden justify-center gap-1 mt-2">
        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: '#8318b3' }}></div>
        <div className="h-1 w-2 rounded-full bg-gray-200"></div>
        <div className="h-1 w-2 rounded-full bg-gray-200"></div>
      </div>
    </section>
  );
};

export default BestSellerSection;