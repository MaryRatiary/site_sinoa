import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Sparkles, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { ProductCard2 } from "../components/card/ProductCard2";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { productsAPI } from "../services/api";

const PRODUCTS_PER_PAGE = 20;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiUrl = `?q=${encodeURIComponent(query)}&limit=250`;
        console.log(`🔍 [DEBUG] SearchPage calling productsAPI.getAll with: ${apiUrl}`);
        const data = await productsAPI.getAll(apiUrl);
        console.log(`🎯 [DEBUG] SearchPage received ${data?.length || 0} results`);
        setProducts(data || []);
        setCurrentPage(1); // Reset page on new search
      } catch (err) {

        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product) => {
    const target = product.slug || product.id;
    if (target) navigate(`/product/${target}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden lg:block"><Navbar /></div>
      <div className="lg:hidden"><RespNav /></div>

      {/* Search Header */}
      <div className="w-full bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-3 bg-[#5E2251]/10 rounded-2xl">
              <Search className="text-[#5E2251]" size={24} />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            RÉSULTATS POUR "<span className="text-[#5E2251] uppercase">{query}</span>"
          </h1>
          <p className="text-gray-500 font-medium tracking-wide">
            {loading ? "Recherche en cours..." : products.length > 0 ? `${products.length} produits trouvés` : "Aucun produit ne correspond à votre recherche"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#5E2251] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recherche en cours...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {paginatedProducts.map((product) => (
                <div key={product.id} onClick={() => handleProductClick(product)}>
                  <ProductCard2 product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white disabled:opacity-30 transition-all hover:border-[#5E2251] hover:text-[#5E2251]"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                      currentPage === page
                        ? "bg-[#5E2251] text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#5E2251] hover:text-[#5E2251]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white disabled:opacity-30 transition-all hover:border-[#5E2251] hover:text-[#5E2251]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <PackageSearch size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Désolé, nous n'avons rien trouvé</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Essayez avec d'autres mots-clés ou parcourez nos catégories pour trouver votre bonheur.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-[#5E2251] text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
            >
              Voir toute la boutique
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
