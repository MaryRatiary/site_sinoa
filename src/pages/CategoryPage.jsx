import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Filter, X, ShoppingBag, Star, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProductCard2 } from "../card/ProductCard2";
import { categoriesAPI } from "../services/api";
import Navbar from "../Header";
import RespNav from "../resp/RespNav";
import Footer from '../Footer';
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

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('vedette');
  
  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesAPI.getById(id);
      setCategory(data);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Catégorie introuvable');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-sans">
        <div>{error || 'Catégorie introuvable'}</div>
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
        {sortedProducts.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Category Description Section - Enhanced Styling */}
      {category.description && category.description.length > 50 && (
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
      
      {/* Bottom Footer */}
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
