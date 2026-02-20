
import lightStick from "../../data/lightStick"
import { ProductCard } from "../card/ProductCard";
const LightStickCard = () => {

  return (
    <section className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {lightStick.map((b) => (
            <div
            key={b.name}
            className="mx-auto"
            >
                <ProductCard
                className="sm:w-40 md:w-64 xl:70 2xl:w-90"
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

export default LightStickCard;