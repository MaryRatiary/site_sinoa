
import bestSellers from "../../../data/bestsellers";
import { ProductCard } from "../../card/ProductCard";
const HuntrixSection = () => {

  return (
    <section className="py-16 py-4 flex grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="relative w-[400px] h-[600px] flex items-end overflow-hidden ml-5">
            <img 
                src="/huntrix/decouvrir.png" 
                alt="Kpop Demon " 
                className="object-cover h-full w-full"
            />
        </div>
        <div className="flex flex-1">
            {bestSellers.map((b) => (
            <div
            key={b.name}
            className="mx-auto"
            >
                <ProductCard
                className="w-45"
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