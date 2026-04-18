import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Filter, Star, BookOpen, Sparkles, Layers, ArrowLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProductsByCategory } from "../hooks/useProducts";
import { useCategoryBySlug } from "../hooks/useCategories";
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
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [sortBy, setSortBy] = useState('vedette');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ✅ Récupérer la catégorie par slug au lieu de par ID
  const { category, loading: categoryLoading } = useCategoryBySlug(slug);
  
  // ✅ Récupérer les produits en utilisant l'ID de la catégorie
  const { products, loading: productsLoading } = useProductsByCategory(category?.id);

  const sortedProducts = applySort(products, sortBy);

  const handleViewDetails = (product) => {
    navigate(`/product/${product.slug}`);
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Catégorie introuvable</h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-[#5E2251] text-white rounded-lg hover:bg-[#4A1940] transition-colors"
        >
          <ArrowLeft size={18} />
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="lg:hidden">
        <RespNav />
      </div>

      {/* ============ DISCOUNT BANNER - RESPONSIVE ============ */}
      <div className="w-full bg-gradient-to-r from-amber-50 to-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {[
              { discount: '-10%', condition: 'dès 2 articles' },
              { discount: '-15%', condition: 'dès 3 articles' },
              { discount: '-20%', condition: 'dès 4 articles' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <p className="text-sm sm:text-base md:text-lg font-black text-amber-700">{item.discount}</p>
                <p className="text-[9px] sm:text-[11px] md:text-xs text-amber-600 font-medium">{item.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CATEGORY HEADER - RESPONSIVE ============ */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Category Image */}
            {category.image && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 line-clamp-1">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-sm sm:text-base text-gray-600 mt-2 line-clamp-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ BREADCRUMB ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <nav className="flex items-center justify-start gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          <a href="/" className="text-[#5E2251] font-medium hover:underline whitespace-nowrap">Accueil</a>
          <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-700 font-medium truncate">{category.name}</span>
        </nav>
      </div>

      {/* ============ FILTER & SORT BAR - RESPONSIVE ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b border-gray-200">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Filter Button */}
          <div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all duration-300 text-gray-700 hover:text-[#5E2251] font-semibold text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
            >
              <Filter size={18} />
              <span>Filtrer</span>
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col gap-3">
            <span className="text-gray-700 font-semibold text-sm sm:text-base">Trier par:</span>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                    sortBy === option.value
                      ? 'bg-[#5E2251] text-white shadow-lg hover:shadow-xl'
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

      {/* ============ PRODUCTS COUNT ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <p className="text-gray-700 font-semibold text-sm sm:text-base">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'produit' : 'produits'} trouvés
        </p>
      </div>

      {/* ============ PRODUCTS GRID - RESPONSIVE ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-max">
            {sortedProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex flex-col cursor-pointer"
                onClick={() => handleViewDetails(product)}
              >
                <ProductCard2 product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-base sm:text-lg">Aucun produit trouvé dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* ============ SUB-CATEGORIES SECTION ============ */}
      {category.children && Array.isArray(category.children) && category.children.length > 0 && (
        <div className="w-full bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div className="h-1 w-8 sm:w-12 bg-[#5E2251] rounded-full"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Layers className="text-[#5E2251] flex-shrink-0" size={24} />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">Sous-catégories</h2>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {category.children.map((subcat) => (
                <div 
                  key={subcat.id}
                  onClick={() => navigate(`/category/${subcat.slug}`)}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#5E2251] transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  {subcat.image && (
                    <div className="w-full h-40 sm:h-48 overflow-hidden bg-gray-100">
                      <img 
                        src={subcat.image} 
                        alt={subcat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#5E2251] transition-colors">
                      {subcat.name}
                    </h3>
                    {subcat.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{subcat.description}</p>
                    )}
                    <button className="mt-4 inline-flex items-center gap-1.5 text-[#5E2251] font-semibold text-sm hover:gap-2.5 transition-all">
                      <span>Voir</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ REVIEW SECTION ============ */}
      <ReviewSection categoryId={category.id} />

      {/* ============ CATEGORY DESCRIPTION SECTION ============ */}
      {category.description && category.description.trim().length > 0 && (
        <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t-2 border-[#5E2251]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              <div className="h-1 w-8 sm:w-12 bg-[#5E2251] rounded-full"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="text-[#5E2251] flex-shrink-0" size={24} />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">À propos de {category.name}</h2>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-4">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl sm:text-3xl font-black text-[#5E2251] mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl sm:text-2xl font-bold text-[#5E2251] mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg sm:text-xl font-bold text-[#5E2251] mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed text-justify text-sm sm:text-base" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm sm:text-base" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-[#5E2251] font-mono text-xs sm:text-sm" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#5E2251] pl-4 italic text-gray-600 text-sm sm:text-base" {...props} />,
                  }}
                >
                  {category.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5">
              <Sparkles className="text-blue-600 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
              <div>
                <p className="text-xs sm:text-sm text-blue-900 font-bold">💡 Conseil client</p>
                <p className="text-xs sm:text-sm text-blue-800 mt-1">Découvrez tous nos produits {category.name.toLowerCase()} avec des descriptions détaillées et des images haute résolution.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
      <footer className="bg-black text-white py-8 sm:py-10 text-center text-xs sm:text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}