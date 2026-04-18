import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useProductsByCategory } from "../../hooks/useProducts";
import { categoriesAPI } from "../../services/api";
import { ProductCard } from "../card/ProductCard";

const LightStickCard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'all', label: 'Tous les articles', dbId: null }
  ]);
  const [categoryIds, setCategoryIds] = useState({});
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Récupérer les IDs des catégories parents
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await categoriesAPI.getAllFlat();
        console.log('📂 Catégories récupérées:', allCategories.length);
        
        const clothingParent = allCategories.find(
          cat => cat.name === 'Vêtements & Style' && cat.level === 0
        );
        const accessoriesParent = allCategories.find(
          cat => cat.name === 'Accessoires & Lifestyle' && cat.level === 0
        );

        const newCategories = [{ id: 'all', label: 'Tous les articles', dbId: null }];
        const newIds = {};

        if (clothingParent) {
          newCategories.push({
            id: 'clothing',
            label: 'Vêtements',
            dbId: clothingParent.id
          });
          newIds['clothing'] = clothingParent.id;
        }

        if (accessoriesParent) {
          newCategories.push({
            id: 'accessories',
            label: 'Accessoires',
            dbId: accessoriesParent.id
          });
          newIds['accessories'] = accessoriesParent.id;
        }

        newCategories.push({
          id: 'trending',
          label: 'Tendances',
          dbId: null
        });

        setCategories(newCategories);
        setCategoryIds(newIds);
        console.log('✅ Catégories chargées:', newCategories);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  // 2️⃣ Récupérer les produits pour chaque catégorie
  const { products: allProducts, loading: allLoading } = useProducts('?limit=50000');
  const { products: clothingProducts, loading: clothingLoading } = useProductsByCategory(categoryIds['clothing']);
  const { products: accessoriesProducts, loading: accessoriesLoading } = useProductsByCategory(categoryIds['accessories']);

  // 3️⃣ Filtrer et afficher les produits basés sur la catégorie sélectionnée
  useEffect(() => {
    let filtered = [];

    if (selectedCategory === 'all') {
      filtered = [...clothingProducts, ...accessoriesProducts];
    } else if (selectedCategory === 'clothing') {
      filtered = clothingProducts;
    } else if (selectedCategory === 'accessories') {
      filtered = accessoriesProducts;
    } else if (selectedCategory === 'trending') {
      filtered = allProducts.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    setDisplayProducts(filtered.slice(0, 4));
    console.log(`📊 ${filtered.length} produits affichés pour: ${selectedCategory}`);
  }, [selectedCategory, clothingProducts, accessoriesProducts, allProducts]);

  // 4️⃣ Vérifier si on est en train de charger
  const isLoading = loading || allLoading || clothingLoading || accessoriesLoading || 
                    (selectedCategory === 'clothing' && clothingLoading) ||
                    (selectedCategory === 'accessories' && accessoriesLoading);

  useEffect(() => {
    if (Object.keys(categoryIds).length > 0) {
      setLoading(false);
    }
  }, [categoryIds]);

  if (isLoading) {
    return (
      <section className="w-full py-0 md:py-1 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-center min-h-30">
          <div className="animate-pulse text-gray-400 font-semibold">Chargement de la collection...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-0 md:py-4 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-6 scrollbar-hide gap-2 md:gap-3 mb-8 md:mb-10 justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 border-2
                ${selectedCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-12">
          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <div
                key={product.id || `${product.name}-${index}`}
                className="group flex flex-col cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div className="relative p-0.5 rounded-lg md:rounded-xl transition-all duration-500 group-hover:shadow-xl">
                  <div className="absolute inset-0 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gray-900/10 to-transparent pointer-events-none"></div>
                  <div className="bg-white rounded-lg md:rounded-xl overflow-hidden relative border border-gray-100 group-hover:border-gray-300 transition-colors">
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      image={product.image || product.url}
                      hoverImage={product.imageHover || product.urlHover}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      isEstimated={product.isEstimated}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
                      <span className="text-[9px] font-black text-white px-2.5 py-1 rounded-md bg-gray-900 uppercase tracking-wider">
                        {product.categoryName || 'Article'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 md:col-span-4 text-center py-8">
              <p className="text-gray-500 font-semibold">Aucun produit disponible dans cette catégorie</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 py-8 md:py-10 border-y border-gray-200">
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>
          <span className="text-xs md:text-sm font-black text-gray-400 uppercase tracking-[0.2em]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Collection Exclusives
          </span>
          <div className="hidden md:block h-px flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 md:mt-10 text-center">
          <button 
            onClick={() => navigate('/shop')}
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-gray-900 hover:bg-black text-white font-bold uppercase text-xs md:text-sm tracking-wider transition-all duration-300 rounded-lg hover:shadow-lg active:scale-95"
          >
            Voir Toute la Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default LightStickCard;
