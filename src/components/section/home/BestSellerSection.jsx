
import bestSellers from "../../../data/bestsellers";
import { ProductCard } from "../../card/ProductCard";
const BestSellerSection = () => {

  return (
    <section className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {bestSellers.map((b) => (
            <div
            key={b.name}
            className="mx-auto"
            >
                <ProductCard
                className="sm:w-50 md:w-74 xl:80 2xl:w-96"
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