import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, ArrowLeft } from "lucide-react";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/composants/Footer';
import ProductDetail from "../components/composants/ProductDetail";
import ReviewsSection from "../components/composants/ReviewsSection";
import { categoriesAPI } from "../services/api";
import { productsAPI } from "../services/api";

const SORT_OPTIONS = [
  { value: 'featured', label: 'En vedette' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix: bas → élevés' },
  { value: 'price-desc', label: 'Prix: élevés → bas' },
];

function applySort(products, sortType) {
  const sorted = [...products];
  
  switch(sortType) {
    case 'featured':
      return sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    default:
      return sorted;
  }
}

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Charger les données de la catégorie et les produits
  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les informations de la catégorie
        const categoryResponse = await fetch(`/api/categories/${id}`);
        if (!categoryResponse.ok) {
          throw new Error('Catégorie non trouvée');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        // Charger tous les produits
        const allProductsResponse = await fetch(`/api/products?limit=250`);
        if (!allProductsResponse.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }
        const allProductsData = await allProductsResponse.json();

        // Filtrer les produits pour cette catégorie ET toutes ses sous-catégories
        const filteredProducts = filterProductsByCategory(allProductsData, categoryData, categoryData);
        setProducts(filteredProducts);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCategoryAndProducts();
    }
  }, [id]);

  // Fonction pour filtrer les produits de manière récursive
  const filterProductsByCategory = (allProducts, category, parentCategory) => {
    const category_ids = [category.id];

    // Ajouter tous les IDs des sous-catégories
    const getAllSubcategory_ids = (cat) => {
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach(child => {
          category_ids.push(child.id);
          getAllSubcategory_ids(child);
        });
      }
    };

    getAllSubcategory_ids(parentCategory);

    // Filtrer les produits
    return allProducts.filter(product => category_ids.includes(product.category_id));
  };

  const sortedProducts = applySort(products, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5E2251] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la catégorie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Erreur: {error}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Catégorie introuvable
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>

      {/* Discount Banner */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 text-center">
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-10%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 2 articles</p>
            </div>
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-15%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 3 articles</p>
            </div>
            <div>
              <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">-20%</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">dès 4 articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="w-full bg-white py-3 sm:py-4 md:py-6 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-2 sm:gap-3">
          {category.image && (
            <div className="flex-shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2">
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600">
          <button 
            onClick={() => navigate('/')}
            className="text-[#5E2251] hover:underline"
          >
            KPOP
          </button>
          <span>›</span>
          <span className="truncate">{category.name}</span>
        </nav>
      </div>

      {/* Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all duration-300 text-gray-700 hover:text-[#5E2251] font-medium text-xs sm:text-sm w-fit">
            <Filter size={16} className="sm:size-18" />
            <span>Filtrer</span>
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Trier par:</span>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-medium text-[10px] sm:text-sm transition-all duration-300 whitespace-nowrap ${
                    sortBy === option.value
                      ? 'bg-[#5E2251] text-white shadow-lg'
                      : 'border border-gray-300 text-gray-700 hover:border-[#5E2251] hover:bg-[#f5f0f2]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <p className="text-gray-600 text-xs sm:text-sm">
          {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Product Detail or Grid */}
      <div className="max-w-full mx-auto px-3 sm:px-4 pb-10">
        {selectedProduct ? (
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="mb-4 sm:mb-6 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[#5E2251] hover:bg-[#f5f0f2] rounded-lg transition-colors text-xs sm:text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Retour à la liste
            </button>
            <ProductDetail product={selectedProduct} />
            
            {/* Reviews Section */}
            <div className="bg-gray-50 -mb-6 mt-6 sm:mt-8 px-3 sm:px-4 py-6 sm:py-8">
              <ReviewsSection />
            </div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {sortedProducts.map((product) => {
                const price = product.price || 0;
                const original_price = product.original_price || null;
                const image_url = product.image || product.images?.[0] || '/placeholder.png';
                
                return (
                  <div 
                    key={product.id} 
                    className="flex flex-col group cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-lg transition-all duration-300 p-2.5 sm:p-3 md:p-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2.5 sm:mb-3 md:mb-4">
                        <img
                          src={image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                        {original_price && price < original_price && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            Soldes
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-0.5 mb-2 sm:mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-[10px] sm:text-xs ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-[8px] sm:text-xs text-gray-600 ml-1">({product.reviewCount || 0})</span>
                      </div>

                      {price > 0 && (
                        <div className="flex items-baseline gap-1.5 sm:gap-2">
                          {original_price && price < original_price ? (
                            <>
                              <span className="text-sm sm:text-base md:text-lg font-bold text-red-600">
                                {price.toFixed(2)}€
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {original_price.toFixed(2)}€
                              </span>
                            </>
                          ) : (
                            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                              {price.toFixed(2)}€
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">
                          {product.stock > 0 ? `${product.stock} en stock` : 'Indisponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reviews Section */}
            <div className="w-full bg-gray-50 -mx-3 sm:-mx-4 -mb-10 mt-8 sm:mt-12 md:mt-16 px-3 sm:px-4 py-6 sm:py-8 md:py-10">
              <ReviewsSection />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Aucun produit disponible dans cette catégorie.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
