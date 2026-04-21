import { useState, useEffect } from "react";
import { productsAPI } from "../../../services/api";
import { ProductCard } from "../../card/ProductCard";
import { useScrollAnimation } from "../../../hooks/useScrollAnimation";

const HuntrixSection = () => {
  const ref = useScrollAnimation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const HUNTRIX_CATEGORIES = ['Peluches', 'Figurines', 'Box & Cosplay'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const allProducts = await productsAPI.getAll('?limit=250');
        
        if (!allProducts || allProducts.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const filteredProducts = allProducts.filter(p => {
          return HUNTRIX_CATEGORIES.includes(p.category_name);
        });

        const limitedProducts = filteredProducts.slice(0, 20);
        
        setProducts(limitedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des produits Huntrix:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section ref={ref} className="scroll-animate flex flex-col lg:flex-row gap-3 md:gap-6 items-start px-0">
        <div className="relative z-20 w-full sm:w-[55vw] lg:w-[280px] 
                        aspect-video h-[250px] 
                        sm:aspect-[5/6] sm:h-auto lg:h-[450px] 
                        flex-shrink-0 overflow-hidden rounded-lg lg:rounded-2xl shadow-md lg:shadow-xl">
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        </div>
        <div className="w-full flex items-center justify-center h-40">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[2px] border-gray-200" />
            <div className="absolute inset-0 rounded-full border-[2px] border-t-gray-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section ref={ref} className="scroll-animate flex flex-col lg:flex-row gap-3 md:gap-6 items-start px-0">
        <div className="relative z-20 w-full sm:w-[55vw] lg:w-[280px] 
                        aspect-video h-[250px] 
                        sm:aspect-[5/6] sm:h-auto lg:h-[450px] 
                        flex-shrink-0 overflow-hidden rounded-lg lg:rounded-2xl shadow-md lg:shadow-xl group">
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
        <div className="w-full text-center py-8">
          <p className="text-gray-400 text-sm">Aucun produit Huntrix trouvé</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="scroll-animate flex flex-col lg:flex-row gap-3 md:gap-6 items-start px-0">
      
      <div className="relative z-20 w-full sm:w-[55vw] lg:w-[280px] 
                      aspect-video h-[250px] 
                      sm:aspect-[5/6] sm:h-auto lg:h-[450px] 
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
        {products.map((product, index) => (
          <div 
            key={product.id || `${product.name}-${index}`} 
            className="flex-shrink-0 w-[45vw] sm:w-[40vw] md:w-[30vw] lg:w-[220px] snap-start"
          >
            <div className="h-[200px] md:h-auto overflow-hidden rounded-lg">
              <ProductCard
                slug={product.slug || `product-${product.id}`}
                className="w-full h-full object-cover shadow-sm hover:shadow-md transition-shadow border border-gray-50"
                image={product.image || product.url}
                hover_image={product.hover_image || product.urlHover}
                name={product.name || product.title}
                price={product.original_price}
                original_price={product.price}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HuntrixSection;
