import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";

const HuntrixSection = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="scroll-animate py-4 sm:py-6 md:py-8 flex flex-col md:flex-row gap-4 md:gap-6 items-center px-4">
      {/* Image Huntrix Demon */}
      <div className="relative w-full sm:w-64 md:w-[250px] h-48 sm:h-64 md:h-[350px] flex-shrink-0 overflow-hidden rounded-xl">
        <img 
          src="/fan_kpop.webp" 
          alt="Kpop Demon - Huntrix" 
          className="object-cover h-full w-full"
        />
      </div>

      {/* Produits */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full">
        {bestSellers.map((b) => (
          <div key={b.name} className="w-full">
            <ProductCard
              className="w-full"
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
    </section>
  );
};

export default HuntrixSection;