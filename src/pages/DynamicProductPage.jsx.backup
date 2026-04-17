import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, Star, BookOpen, Sparkles, Layers, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProductsByCategory } from "../hooks/useProducts";
import { useCategoryWithDetails } from "../hooks/useCategories";
import { ProductCard2 } from "../components/card/ProductCard2";
import ProductDetail from "../components/composants/ProductDetail";
import ReviewSection from "../components/composants/ReviewSection";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from '../components/composants/Footer';
import '../assets/animatedButton.css';

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

export default function DynamicProductPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [sortBy, setSortBy] = useState('vedette');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Récupérer les produits et la catégorie
  const { products, loading: productsLoading } = useProductsByCategory(categoryId);
  const { category, loading: categoryLoading } = useCategoryWithDetails(categoryId);

  const sortedProducts = applySort(products, sortBy);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
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

      {/* Discount Banner - RESPONSIVE */}
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

      {/* Title Section - RESPONSIVE */}
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
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight animate-slide-up">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2">
        <nav className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <span className="truncate">{category.name}</span>
        </nav>
      </div>

      {/* Filter & Sort Bar - RESPONSIVE */}
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
        <p className="text-gray-600 text-xs sm:text-sm">{sortedProducts.length} produits</p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-16">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col group cursor-pointer"
                onClick={() => handleViewDetails(product)}
              >
                <ProductCard2 product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Aucun produit trouvé dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Sub-categories Section */}
      {category.children && Array.isArray(category.children) && category.children.length > 0 && (
        <div className="w-full bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-[#5E2251]"></div>
              <div className="flex items-center gap-2">
                <Layers className="text-[#5E2251]" size={28} />
                <h2 className="text-3xl font-bold text-gray-900">Sous-catégories</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.children.map((subcat) => (
                <div 
                  key={subcat.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/category/${subcat.id}`)}
                >
                  {subcat.image && (
                    <img 
                      src={subcat.image} 
                      alt={subcat.name}
                      className="w-full h-40 object-cover rounded-lg mb-0"
                    />
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{subcat.name}</h3>
                  {subcat.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{subcat.description}</p>
                  )}
                  <button className="mt-4 text-[#5E2251] font-semibold hover:underline text-sm">
                    Voir →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Section */}
      <ReviewSection categoryId={categoryId} />

      {/* Category Description Section */}
      {category.description && category.description.trim().length > 0 && (
        <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t-2 border-[#5E2251]">
          <div className="max-w-7xl mx-auto px-4 py-20">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-12">
              <div className="h-1 w-12 bg-[#5E2251]"></div>
              <div className="flex items-center gap-2">
                <BookOpen className="text-[#5E2251]" size={28} />
                <h2 className="text-4xl font-black text-gray-900">À propos de {category.name}</h2>
              </div>
            </div>

            {/* Description Content with Markdown Support */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#5E2251] mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#5E2251] mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#5E2251] mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed text-justify" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 text-gray-700" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 text-gray-700" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-[#5E2251] font-mono" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#5E2251] pl-4 italic text-gray-600" {...props} />,
                  }}
                >
                  {category.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Sparkles className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-sm text-blue-900 font-medium">💡 Conseil client</p>
                <p className="text-sm text-blue-800 mt-1">Découvrez tous nos produits {category.name.toLowerCase()} avec des descriptions détaillées et des images haute résolution.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
