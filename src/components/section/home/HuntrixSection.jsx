import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";

const HuntrixSection = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="scroll-animate flex flex-col lg:flex-row gap-4 md:gap-8 items-start">
      
      {/* Image Huntrix - Plus étroite et stylisée */}
      <div className="relative w-full lg:w-[280px] aspect-[3/4] lg:h-[450px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl group">
        <img 
          src="/image1.jpg" 
          alt="Kpop Demon - Huntrix" 
          className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay dégradé sur l'image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001c66]/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Collection</p>
            <p className="text-lg font-black uppercase">Huntrix</p>
        </div>
      </div>

     {/* Grille de Produits - Scrollable sur mobile, Grille sur Desktop */}
      <div className="w-full flex flex-nowrap overflow-x-auto md:grid md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {bestSellers.map((b) => (
          <div 
            key={b.name} 
            className="flex-shrink-0 w-[65vw] sm:w-[45vw] md:w-full snap-center flex justify-center"
          >
            <ProductCard
              className="w-full shadow-sm hover:shadow-md transition-shadow border border-gray-50 rounded-xl"
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