import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Filter, X, ShoppingBag, Star } from "lucide-react";
import { productsAPI, categoriesAPI } from "../../services/api";
import { ProductCard2 } from "../card/ProductCard2";
import Navbar from "../Header";
import RespNav from "../resp/RespNav";
import Footer from '../Footer';
import '../../assets/animatedButton.css';

const SORT_OPTIONS = [
  { value: 'vedette', label: 'En vedette' },
  { value: 'best-sellers', label: 'Meilleur vente' },
  { value: 'price-desc', label: 'Prix: élevés → bas' },
  { value: 'price-asc', label: 'Prix: bas → élevés' },
];

function applySort(products, sortType) {
  const sorted = [...products];
  
  switch(sortType) {
    case 'vedette':
      return sorted.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    case 'best-sellers':
      return sorted.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = a.originalPrice || a.price;
        const priceB = b.originalPrice || b.price;
        return priceA - priceB;
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = a.originalPrice || a.price;
        const priceB = b.originalPrice || b.price;
        return priceB - priceA;
      });
    default:
      return sorted;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('vedette');
  
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Récupère toutes les catégories pour trouver l'ID par slug
        const categories = await categoriesAPI.getAll();
        const foundCategory = categories.find(c => c.slug === slug);
        
        if (!foundCategory) {
          setCategory(null);
          return;
        }
        
        setCategory(foundCategory);
        
        // Charge les produits pour cette catégorie
        const productsData = await productsAPI.getAll(`?categoryId=${foundCategory.id}&limit=100`);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
        Catégorie introuvable — slug : <strong className="ml-1">{slug}</strong>
      </div>
    );
  }

  const sortedProducts = applySort(products, sortBy);

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
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">-10%</p>
            <p className="text-sm text-gray-600">dès 2 articles achetés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">-15%</p>
            <p className="text-sm text-gray-600">dès 3 articles achetés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">-20%</p>
            <p className="text-sm text-gray-600">dès 4 articles achetés</p>
          </div>
        </div>
      </div>

      {/* Title Section with Animation */}
      <div className="w-full bg-white py-8 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight animate-slide-up">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <span>{category.name}</span>
        </nav>
      </div>

      {/* Filter & Sort Bar - Improved Design */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all duration-300 text-gray-700 hover:text-[#5E2251] font-medium">
            <Filter size={18} />
            <span>Filtrer</span>
          </button>

          {/* Sort Section */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <span className="text-gray-700 font-medium text-sm">Trier par:</span>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
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
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="text-gray-600 text-sm">{sortedProducts.length} produits</p>
      </div>

      {/* Products Grid - 2 colonnes en mobile, 3 en tablet, 4 en desktop */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard2 product={product} />
              {/* Rating */}
              {product.rating && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(product.rating) ? "fill-[#5E2251] text-[#5E2251]" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews || 0})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
      
      {/* Bottom Footer */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}