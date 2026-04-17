import huntrixProducts from "../../../data/huntrixProducts";
import { ProductCard } from "../../card/ProductCard";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";

const HuntrixSection = () => {
  const ref = useScrollAnimation();

  return (
    <section ref={ref} className="scroll-animate flex flex-col lg:flex-row gap-3 md:gap-6 items-start px-0">
      
      {/* Image Huntrix */}
      <div className="relative z-20 w-full sm:w-[55vw] lg:w-[280px] 
                      aspect-video h-[250px] 
                      sm:aspect-[4/6] sm:h-auto lg:h-[450px] 
                      flex-shrink-0 overflow-hidden rounded-lg lg:rounded-2xl shadow-md lg:shadow-xl group lg:sticky lg:top-4">
        <img 
          src="/kpoporiginal.jpg" 
          alt="Kpop Demon - Huntrix" 
          className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-200"
        />
        <div className="absolute bottom-3 left-3 lg:bottom-4 lg:left-4 text-white">
          <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-80">Collection</p>
          <p className="text-base lg:text-lg font-black uppercase">Huntrix</p>
        </div>
      </div>

      <div className="w-full flex flex-nowrap overflow-x-auto gap-3 pb-6 snap-x snap-mandatory scrollbar-hide focus:outline-none">
        {huntrixProducts.map((product, index) => (
          <div 
            key={product.id || `${product.name}-${index}`} 
            className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-[30vw] lg:w-[220px] snap-start"
          >
            <div className="h-[200px] md:h-auto overflow-hidden rounded-lg">
              <ProductCard
                id={product.id}
                slug={product.slug}
                className="w-full h-full object-cover shadow-sm hover:shadow-md transition-shadow border border-gray-50"
                image={product.url}
                hoverImage={product.urlHover}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HuntrixSection;