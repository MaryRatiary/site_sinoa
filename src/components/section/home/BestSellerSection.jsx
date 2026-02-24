import bestSellers from "../../../data/bestSellers";
import { ProductCard } from "../../card/ProductCard";
const BestSellerSection = () => {

  return (
    <section className="py-4 sm:py-6 md:py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 px-4">
        {bestSellers.map((b) => (
            <div
            key={b.name}
            className="mx-auto w-full"
            >
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
    </section>
  );
};

export default BestSellerSection;