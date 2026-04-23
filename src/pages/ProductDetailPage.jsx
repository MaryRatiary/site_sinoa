import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Heart, Star, Package, RotateCcw, Shield, Truck } from "lucide-react";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { useProductBySlug } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReviewsSection from "../components/composants/ReviewsSection";
import RelatedProducts from "../components/composants/RelatedProduct";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500?text=Image+non+disponible";



// ── Styled markdown renderer ───────────────────────────────────────────────
function MarkdownDescription({ markdown }) {
  if (!markdown) return null;

  // Nettoyer le markdown si Shopify l'a entouré de balises HTML (fréquent)
  // On garde les balises car rehypeRaw va les traiter correctement
  const cleanMarkdown = markdown
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<\/?span[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/?p[^>]*>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\|\s*\n+\s*\|/g, '|\n|')
    .trim();

  return (
    <div className="desc-body prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => (
            <div className="desc-h1">
              <h1 className="desc-h1-text" {...props} />
            </div>
          ),
          h2: ({ node, ...props }) => (
            <div className="desc-h2-wrap">
              <span className="desc-h2-dot" />
              <h2 className="desc-h2-text" {...props} />
            </div>
          ),
          h3: ({ node, ...props }) => <h3 className="desc-h3-text" {...props} />,
          p: ({ node, ...props }) => <p className="desc-p-text whitespace-pre-wrap" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="desc-ul space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="desc-li">
              <span className="desc-li-icon">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="3" fill="#5E2251" opacity="0.7" />
                </svg>
              </span>
              <span className="desc-li-text" {...props} />
            </li>
          ),
          table: ({ node, ...props }) => (
            <div className="desc-table-wrapper overflow-x-auto -mx-1.5">
              <table className="desc-table w-full border-collapse min-w-max sm:min-w-full" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-[#5E2251]/8 border-b-2 border-[#5E2251]/30" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="bg-white" {...props} />,
          th: ({ node, ...props }) => <th className="desc-table-header px-3 sm:px-4 py-3 text-left font-bold text-[#5E2251] text-xs sm:text-sm border-r border-[#5E2251]/10 last:border-r-0 whitespace-nowrap sm:whitespace-normal" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-gray-200/50 hover:bg-[#5E2251]/3 transition-colors" {...props} />,
          td: ({ node, ...props }) => <td className="desc-table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200/30 last:border-r-0" {...props} />,
        }}
      >
        {cleanMarkdown}
      </ReactMarkdown>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ✅ VERSION API UNIQUEMENT - Pas de données statiques
// ══════════════════════════════════════════════════════════════════════════

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();


  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [visible, setVisible] = useState(false);

  // ✅ Récupère le produit via l'API uniquement
  const { product: dbProduct, loading: dbLoading } = useProductBySlug(slug);

  useEffect(() => {
    if (dbLoading) {
      setLoading(true);
      setVisible(false);
    } else {
      setLoading(false);
      if (dbProduct) {
        console.log('📦 Produit chargé:', {
          id: dbProduct.id,
          name: dbProduct.name,
          colors: dbProduct.colors,
          sizes: dbProduct.sizes,
          images: dbProduct.images,
          fullProduct: dbProduct
        });
        setTimeout(() => setVisible(true), 60);
        // Initialiser les sélections par défaut
        if (dbProduct.sizes?.length > 0) {
          setSelectedSize(dbProduct.sizes[0].size || dbProduct.sizes[0]);
        }
        if (dbProduct.colors?.length > 0) {
          setSelectedColor(dbProduct.colors[0].color_name || dbProduct.colors[0]);
        }
        if (dbProduct.models?.length > 0) {
          setSelectedModel(typeof dbProduct.models[0] === 'string' ? dbProduct.models[0] : (dbProduct.models[0].model || dbProduct.models[0].name));
        }
        setCurrentImageIndex(0);
      }
    }
  }, [dbProduct, dbLoading]);

  // ✅ SYNC: selectedColor/Model avec currentImageIndex
  useEffect(() => {
    if (!dbProduct?.variants || dbLoading || (!selectedColor && !selectedSize && !selectedModel)) return;

    // Trouver le variant qui match EXACTEMENT la sélection actuelle
    // On privilégie un variant qui a une IMAGE spécifique
    const matchingVariant = dbProduct.variants.find(v => {
      const matchColor = !selectedColor || v.option1 === selectedColor || v.option2 === selectedColor || v.option3 === selectedColor;
      const matchSize = !selectedSize || v.option1 === selectedSize || v.option2 === selectedSize || v.option3 === selectedSize;
      const matchModel = !selectedModel || v.option1 === selectedModel || v.option2 === selectedModel || v.option3 === selectedModel;
      return matchColor && matchSize && matchModel && v.image_id;
    }) || dbProduct.variants.find(v => {
      const matchColor = !selectedColor || v.option1 === selectedColor || v.option2 === selectedColor || v.option3 === selectedColor;
      const matchSize = !selectedSize || v.option1 === selectedSize || v.option2 === selectedSize || v.option3 === selectedSize;
      const matchModel = !selectedModel || v.option1 === selectedModel || v.option2 === selectedModel || v.option3 === selectedModel;
      return matchColor && matchSize && matchModel;
    });

    if (matchingVariant && matchingVariant.image_url) {
      const imgIndex = dbProduct.images.indexOf(matchingVariant.image_url);
      if (imgIndex !== -1 && imgIndex !== currentImageIndex) {
        setCurrentImageIndex(imgIndex);
      }
    }
  }, [selectedColor, selectedSize, selectedModel, dbProduct, dbLoading]);

  // ── Guards ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#5E2251]/10" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-[#5E2251] animate-spin" />
          </div>
          <p className="text-[11px] font-bold text-gray-400 tracking-[0.3em] uppercase">Chargement</p>
        </div>
      </div>
    );
  }

  if (!dbProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[#faf9f7]">
        <div className="hidden lg:block"><Navbar /></div>
        <div className="lg:hidden"><RespNav /></div>
        <div className="text-center px-4">
          <p className="text-7xl mb-6">✦</p>
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Produit introuvable</h1>
          <p className="text-gray-400 mb-8 text-sm">Ce produit n'existe pas ou a été retiré.</p>
          <button onClick={() => navigate("/")}
            className="px-10 py-3.5 bg-[#5E2251] text-white rounded-full font-bold text-sm hover:bg-[#4a1840] transition-all duration-300 hover:shadow-xl hover:shadow-[#5E2251]/20 hover:-translate-y-0.5">
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Utiliser dbProduct directement depuis l'API
  const product = dbProduct;

  // ── Computed values ──────────────────────────────────────────────────────
  const images = product.images?.filter(Boolean) || [product.image || product.url].filter(Boolean);

  // currentImageIndex est la source de vérité unique
  // Afficher l'image à currentImageIndex
  const currentImage = images.length > 0 ? images[currentImageIndex] : PLACEHOLDER_IMAGE;

  const numPrice = parseFloat(product.price) || 0;
  const numOriginalPrice = parseFloat(product.original_price) || null;
  const isOnSale = numOriginalPrice !== null && numOriginalPrice > numPrice;
  const discount = isOnSale
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
    : null;

  // ✅ CORRIGÉ: Les flèches changent juste currentImageIndex (la couleur se synchro via useEffect)
  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const rawDescription = typeof product.description === "string" ? product.description : "";

  // ✅ CORRIGÉ: Passer les paramètres correctement
  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Veuillez sélectionner une couleur");
      return;
    }
    if (product.models?.length > 0 && !selectedModel) {
      alert("Veuillez sélectionner un modèle");
      return;
    }

    // Trouver le variant exact
    console.log('🔍 Recherche de variante pour:', { selectedColor, selectedSize, selectedModel });
    console.log('📦 Variantes disponibles:', product.variants?.length);

    const selectedVariant = product.variants?.find(v => {
      // Nettoyer les valeurs pour comparer (insensible à la casse)
      const v1 = v.option1?.trim().toLowerCase();
      const v2 = v.option2?.trim().toLowerCase();
      const v3 = v.option3?.trim().toLowerCase();

      const sColor = selectedColor?.trim().toLowerCase();
      const sSize = selectedSize?.trim().toLowerCase();
      const sModel = selectedModel?.trim().toLowerCase();

      // Vérifier si chaque option sélectionnée correspond à l'une des 3 options du variant
      const matchColor = !sColor || v1 === sColor || v2 === sColor || v3 === sColor;
      const matchSize = !sSize || v1 === sSize || v2 === sSize || v3 === sSize;
      const matchModel = !sModel || v1 === sModel || v2 === sModel || v3 === sModel;

      return matchColor && matchSize && matchModel;
    });

    if (selectedVariant) {
      console.log('✅ Variante trouvée:', selectedVariant.id, selectedVariant.title);
    } else {
      console.warn('⚠️ Aucune variante correspondante trouvée ! Liste des variantes:',
        product.variants?.map(v => `${v.option1} / ${v.option2} / ${v.option3}`));
    }

    // ✅ Appeler addToCart avec l'image spécifique du variant si elle existe
    addToCart(
      {
        ...product,
        image: selectedVariant?.image_url || product.image
      },
      quantity,
      selectedSize,
      selectedColor,
      selectedVariant?.id || (product.variants && product.variants[0]?.id),
      selectedModel
    );

    // ✅ Ouvrir le modal du panier immédiatement
    openCart();

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pdp-root { font-family: 'DM Sans', sans-serif; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .anim-1 { animation: scaleIn  0.55s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-2 { animation: slideUp  0.55s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-3 { animation: slideUp  0.55s 0.25s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-4 { animation: slideUp  0.55s 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .anim-5 { animation: slideUp  0.55s 0.45s cubic-bezier(0.16,1,0.3,1) both; }

        .thumb-btn { transition: all 0.2s ease; }
        .thumb-btn:hover { transform: scale(1.04); }
        .thumb-btn.active { transform: scale(1.04); }
        .img-zoom img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .img-zoom:hover img { transform: scale(1.06); }
        .nav-arrow { transition: all 0.2s ease; opacity: 0; }
        .img-zoom:hover .nav-arrow { opacity: 1; }
        .nav-arrow:hover { background: #5E2251; color: white; transform: translateY(-50%) scale(1.1); }

        .size-btn { transition: all 0.18s ease; height: 44px; display: flex; align-items: center; justify-content: center; padding: 0 12px; white-space: nowrap; min-width: max-content; }
        .size-btn:hover:not(.active) { border-color: #5E2251; color: #5E2251; transform: translateY(-1px); }
        .size-btn.active { background: #5E2251; border-color: #5E2251; color: white; box-shadow: 0 4px 12px rgba(94,34,81,0.25); }
        .size-options-container {
          display: flex; flex-wrap: wrap;
          gap: 0.5rem; width: 100%;
          align-items: center; justify-content: flex-start;
        }
        @media (max-width: 640px) {
          .size-options-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }
        @media (min-width: 641px) {
          .size-options-container { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        }

        .color-btn { transition: all 0.18s ease; }
        .color-btn:hover:not(.active) { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .color-btn.active { box-shadow: 0 0 0 3px white, 0 0 0 5px #5E2251; transform: scale(1.08); }

        .cart-btn { position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
        .cart-btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%); transition: transform 0.4s ease;
        }
        .cart-btn:hover::before { transform: translateX(0); }
        .cart-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(94,34,81,0.3); }
        .cart-btn:active { transform: translateY(0); }

        .wish-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .wish-btn:hover { transform: scale(1.1); }
        .wish-btn.wished { background: #fff0f5; border-color: #f43f6e; }
        .guarantee-card { transition: all 0.2s ease; }
        .guarantee-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        @media (min-width: 1024px) {
          .img-col-sticky {
            position: sticky;
            top: 1.5rem;
            align-self: flex-start;
          }
        }

        .desc-card {
          background: linear-gradient(135deg, #fdf9fc 0%, #faf7fb 100%);
          border: 1px solid rgba(94,34,81,0.10);
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .desc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #5E2251, #9b4a8a, #5E2251);
          border-radius: 20px 20px 0 0;
        }
        .desc-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        .desc-title-icon {
          width: 18px; height: 28px;
          background: #5E2251;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .desc-title-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5E2251;
        }
        .desc-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(94,34,81,0.15) 0%, transparent 100%);
          margin-bottom: 1.25rem;
        }

        .desc-h1 {
          background: rgba(94,34,81,0.06);
          border-left: 3px solid #5E2251;
          border-radius: 0 10px 10px 0;
          padding: 0.8rem 1.5rem;
          margin-bottom: 0.5rem;
        }
        .desc-h1-text {
          font-size: 20px;
          font-weight: 700;
          color: #3d1636;
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.2;
        }

        .desc-h2-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 0.5rem;
        }
        .desc-h2-dot {
          width: 10px; height: 10px;
          background: #5E2251;
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .desc-h2-text {
          font-size: 17px;
          font-weight: 700;
          color: #5E2251;
          margin: 0;
          line-height: 1.2;
        }

        .desc-h3-text {
          font-size: 14px;
          font-weight: 600;
          color: #7a3569;
          padding-left: 1rem;
          margin: 0;
          line-height: 1.2;
        }

        .desc-p-text {
          font-size: 15px;
          color: #6b5566;
          line-height: 1.8;
          margin: 0;
        }

        .desc-ul { list-style: none; padding-left: 0.25rem; margin: 0; }
        .desc-li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 16px;
          color: #6b5566;
          line-height: 1.8;
        }
        .desc-li-icon {
          flex-shrink: 0;
          margin-top: 6px;
          display: flex;
          align-items: center;
        }
        .desc-li-text { flex: 1; }

        /* Styles pour les tableaux dans la description */
        .desc-table-wrapper {
          margin: 1.5rem 0;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          overflow-x: auto;
        }
        .desc-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .desc-table-header {
          background: rgba(94,34,81,0.05) !important;
          color: #5E2251 !important;
          font-weight: 700 !important;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid rgba(94,34,81,0.1);
        }
        .desc-table-cell {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          color: #4a4a4a;
        }
        .desc-table tr:last-child .desc-table-cell {
          border-bottom: none;
        }
        .desc-table tr:hover {
          background: rgba(94,34,81,0.02);
        }
      `}</style>

      <div className="pdp-root">
        <div className="hidden lg:block"><Navbar /></div>
        <div className="lg:hidden"><RespNav /></div>

        {/* ── Promo banner ─────────────────────────────────────────── */}
        <div className="w-full bg-[#5E2251]">
          <div className="max-w-7xl mx-auto px-4 py-2.5">
            <div className="flex justify-center divide-x divide-white/20">
              {[["−10%", "dès 2 articles"], ["−15%", "dès 3 articles"], ["−20%", "dès 4 articles"]].map(([pct, label]) => (
                <div key={pct} className="flex items-center gap-2 px-6 py-0.5">
                  <span className="text-white font-black text-sm">{pct}</span>
                  <span className="text-white/60 text-[10px] uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#5E2251] transition-colors group font-medium">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Retour
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <a href="/" className="hover:text-[#5E2251] transition-colors">Accueil</a>
            <span className="text-gray-200">›</span>
            {product.category && (
              <>
                <span className="hover:text-[#5E2251] transition-colors cursor-pointer">{product.category}</span>
                <span className="text-gray-200">›</span>
              </>
            )}
            <span className="text-gray-600 font-medium truncate max-w-[180px]">{product.name || product.title}</span>
          </div>
        </div>

        {/* ── Main Grid ────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-start transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

            {/* ── LEFT — Images (sticky on desktop) ──────────────── */}
            <div className={`flex flex-col gap-3 img-col-sticky ${visible ? 'anim-1' : ''}`}>
              <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 img-zoom">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {discount && (
                    <span className="bg-[#5E2251] text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-[#5E2251]/20">
                      -{discount}%
                    </span>
                  )}
                  {product.isEstimated && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Estimé
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <button onClick={() => setWished(w => !w)}
                  className={`wish-btn absolute top-4 right-4 z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white shadow-md ${wished ? 'wished' : 'border-gray-100'}`}>
                  <Heart size={17} className={wished ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
                </button>

                <img src={currentImage} alt={product.name || product.title}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <button key={idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                      }}
                      className={`thumb-btn aspect-square rounded-2xl overflow-hidden border-2 bg-white ${currentImageIndex === idx ? 'active border-[#5E2251]' : 'border-transparent hover:border-gray-200'
                        }`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT — Info (scrolls normally) ────────────────── */}
            <div className="flex flex-col gap-6 lg:pt-2">

              {/* Brand + Title */}
              <div className={visible ? 'anim-2' : ''}>
                {product.brand && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5E2251] mb-2">{product.brand}</p>
                )}
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {product.name || product.title}
                </h1>
                {product.rating > 0 && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13}
                          className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                      ))}
                    </div>

                  </div>
                )}
              </div>

              {/* Price */}
              <div className={`flex items-end gap-4 ${visible ? 'anim-2' : ''}`}>
                <div>
                  <span className="text-5xl font-black text-gray-900 tracking-tight">
                    {numPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-2xl font-black text-gray-900">€</span>
                </div>
                {isOnSale && (
                  <div className="flex flex-col pb-1">
                    <span className="text-base text-gray-400 line-through">
                      {numOriginalPrice.toFixed(2).replace(".", ",")}€
                    </span>
                    {discount && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-center">
                        −{discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

              {/* Colors - Small Circles with Images */}
              {product.colors?.filter(c => c && c.color_name !== "" && c !== "").length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Couleur — <span className="text-gray-800 normal-case tracking-normal font-semibold">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors
                      .map((color, idx) => ({ color, idx }))
                      .filter(({ idx }) => idx < images.length)
                      .map(({ color, idx }) => {
                        const name = color.color_name || color.name || color;
                        const colorImage = images[idx];
                        const isActive = selectedColor === name;
                        return (
                          <button key={name} onClick={() => {
                            const colorString = typeof color === 'string' ? color : (color.color_name || color.name);
                            setSelectedColor(colorString);
                            setCurrentImageIndex(idx);
                          }}
                            title={name}
                            className={`color-btn w-12 h-12 rounded-full border-2 overflow-hidden transition-all flex items-center justify-center bg-white ${isActive ? 'active border-[#5E2251] ring-2 ring-[#5E2251] ring-offset-2' : 'border-gray-300 hover:border-[#5E2251]'}`}>
                            <img src={colorImage} alt={name} className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.filter(s => s && s.size !== "" && s !== "").length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Taille — <span className="text-gray-800 normal-case tracking-normal font-semibold text-[11px] break-words">{selectedSize}</span>
                  </p>
                  <div className="size-options-container">
                    {product.sizes.map((size) => {
                      const val = typeof size === "string" ? size : (size.size || size.name);
                      const isActive = selectedSize === val;
                      return (
                        <button key={val} onClick={() => {
                          const sizeString = typeof size === 'string' ? size : (size.size || size.name);
                          setSelectedSize(sizeString);
                        }}
                          className={`size-btn py-2.5 px-3 rounded-xl border-2 font-semibold text-xs sm:text-sm ${isActive ? 'active' : 'border-gray-200 text-gray-600 bg-white'
                            }`}
                          title={val}>
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Models */}
              {product.models?.filter(m => m && m !== "").length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Modèle — <span className="text-gray-800 normal-case tracking-normal font-semibold text-[11px] break-words">{selectedModel}</span>
                  </p>
                  <div className="size-options-container">
                    {product.models.map((modelObj, idx) => {
                      const val = typeof modelObj === "string" ? modelObj : (modelObj.model || modelObj.name);
                      const isActive = selectedModel === val;
                      return (
                        <button key={val || idx} onClick={() => setSelectedModel(val)}
                          className={`size-btn py-2.5 px-3 rounded-xl border-2 font-semibold text-xs sm:text-sm ${isActive ? 'active' : 'border-gray-200 text-gray-600 bg-white'
                            }`}
                          title={val}>
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Cart */}
              <div className={`flex flex-col sm:flex-row gap-3 items-stretch ${visible ? 'anim-4' : ''}`}>
                <div className="flex items-center rounded-2xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm h-12">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-800 text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex flex-1 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#5E2251] hover:bg-[#4a1a40] text-white font-bold h-12 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#5E2251]/20 active:scale-95"
                  >
                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Panier</span>
                  </button>


                </div>
              </div>

              {/* Stock */}
              {product.stock !== undefined && (
                <div className={`flex items-center gap-2 ${visible ? 'anim-4' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                  <p className={`text-xs font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'
                    }`}>
                    {product.stock > 10
                      ? `En stock — ${product.stock} disponibles`
                      : product.stock > 0
                        ? `Plus que ${product.stock} en stock !`
                        : 'Rupture de stock'}
                  </p>
                </div>
              )}

              {/* Guarantees */}
              <div className={`grid grid-cols-3 gap-2 ${visible ? 'anim-4' : ''}`}>
                {[
                  { icon: Truck, label: "Livraison", sub: "Gratuite" },
                  { icon: RotateCcw, label: "Retours", sub: "14 jours" },
                  { icon: Shield, label: "Paiement", sub: "Sécurisé" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="guarantee-card flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white rounded-2xl border border-gray-100 text-center cursor-default">
                    <div className="w-8 h-8 rounded-full bg-[#5E2251]/5 flex items-center justify-center">
                      <Icon size={15} className="text-[#5E2251]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-700">{label}</p>
                      <p className="text-[9px] text-gray-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {rawDescription && (
                <div className={`desc-card ${visible ? 'anim-5' : ''}`}>
                  <div className="desc-title-row">
                    <div className="desc-title-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1.5 1.5h4.8l6 6a1 1 0 010 1.41l-3.4 3.4a1 1 0 01-1.41 0l-6-6V1.5z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
                        <circle cx="4.5" cy="4.5" r="0.8" fill="white" />
                      </svg>
                    </div>
                    <span className="desc-title-label">Description du produit</span>
                  </div>
                  <div className="desc-divider" />
                  <MarkdownDescription markdown={rawDescription} />
                </div>
              )}

              {/* Care instructions */}
              {product.careInstructions && (
                <div className={`flex items-start gap-3 px-4 py-3 bg-amber-50 rounded-2xl border border-amber-100 ${visible ? 'anim-5' : ''}`}>
                  <Package size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ReviewsSection product_id={product.id} />
        <RelatedProducts currentProductId={product.id} />
        <Footer />
      </div>
    </div>
  );
}
