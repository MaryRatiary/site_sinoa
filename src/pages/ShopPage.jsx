import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard2 } from "../components/card/ProductCard2";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { productsAPI } from "../services/api";

const SORT_OPTIONS = [
  { value: 'random', label: 'Aléatoire' },
  { value: 'price-asc', label: 'Prix: bas → élevés' },
  { value: 'price-desc', label: 'Prix: élevés → bas' },
  { value: 'vedette', label: 'En vedette' },
];

const PRODUCTS_PER_PAGE = 40;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function applySort(products, sortType) {
  const sorted = [...products];
  switch (sortType) {
    case 'price-asc':
      return sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    case 'price-desc':
      return sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    case 'random':
      return shuffleArray(sorted);
    default:
      return sorted;
  }
}

export default function ShopPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('random');
  const [dbProducts, setDbProducts] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const data = await productsAPI.getAll('?limit=250');
        setDbProducts(data || []);
      } catch {
        setDbProducts([]);
      } finally {
        setDbLoading(false);
      }
    };
    fetchDb();
  }, []);

  const allProducts = useMemo(() => 
    shuffleArray(dbProducts || []), [dbProducts]);

  const sortedProducts = useMemo(() => {
    setCurrentPage(1);
    return applySort(allProducts, sortBy);
  }, [allProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return sortedProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (product) => {
    const target = product.slug || product.id;
    if (target) navigate(`/product/${target}`);
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block"><Navbar /></div>
      <div className="lg:hidden"><RespNav /></div>

      {/* Discount Banner */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 text-center">
            {[["−10%", "dès 2 articles"], ["−15%", "dès 3 articles"], ["−20%", "dès 4 articles"]].map(([pct, label]) => (
              <div key={pct}>
                <p className="text-xs sm:text-base md:text-lg font-bold text-gray-900">{pct}</p>
                <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="w-full bg-white py-3 sm:py-4 md:py-8 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-[#5E2251]" size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5E2251]">Collection complète</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            TOUS LES <span className="text-[#5E2251]">PRODUITS</span>
          </h1>
          {!dbLoading && (
            <p className="text-xs sm:text-sm text-gray-400 mt-1">{allProducts.length} articles disponibles</p>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2">
        <nav className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-600">
          <a href="/" className="text-[#5E2251] hover:underline">KPOP</a>
          <span>›</span>
          <span>Tous les produits</span>
        </nav>
      </div>

      {/* Filter & Sort */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 border-b border-gray-200">
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 hover:border-[#5E2251] hover:bg-[#f5f0f2] transition-all text-gray-700 hover:text-[#5E2251] font-medium text-xs sm:text-sm w-fit">
            <Filter size={15} />
            Filtrer
          </button>
          <div className="flex flex-col gap-2">
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Trier par :</span>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg font-medium text-[10px] sm:text-sm transition-all whitespace-nowrap ${
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

      {/* Products count + page info */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex items-center justify-between">
        <p className="text-gray-600 text-xs sm:text-sm">
          {sortedProducts.length} produits
        </p>
        {totalPages > 1 && (
          <p className="text-gray-400 text-xs sm:text-sm">
            Page {currentPage} / {totalPages}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-8">
        {dbLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#5E2251] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400 uppercase tracking-widest">Chargement...</p>
            </div>
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {paginatedProducts.map((product, idx) => (
              <div
                key={`product-${product.id}-${idx}`}
                className="flex flex-col group cursor-pointer"
                onClick={() => handleClick(product)}
              >
                <ProductCard2 product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 pb-16">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-500 hover:border-[#5E2251] hover:text-[#5E2251] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 text-sm">
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border-2 font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-[#5E2251] border-[#5E2251] text-white shadow-lg shadow-[#5E2251]/20'
                      : 'border-gray-200 text-gray-600 hover:border-[#5E2251] hover:text-[#5E2251]'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-500 hover:border-[#5E2251] hover:text-[#5E2251] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick jump on mobile */}
          <p className="text-center text-xs text-gray-400 mt-3">
            Page {currentPage} sur {totalPages}
          </p>
        </div>
      )}

      <Footer />
      <footer className="bg-black text-white py-10 text-center text-sm">
        <p>© 2026 K-POP BOUTIQUE. Made with Passion.</p>
      </footer>
    </div>
  );
}
