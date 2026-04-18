import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Heart, Star, Package, RotateCcw, Shield, Truck, ChevronDown } from "lucide-react";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { useProductBySlug } from "../hooks/useProducts";
import { useCart } from "../store/CartContext";

import fashion from "../data/k-fashion";
import beauty from "../data/k-beauty";
import bestSellers from "../data/bestSellers";
import huntrix from "../data/huntrixProducts";
import lightStick from "../data/lightStick";
import ReviewsSection from "../components/composants/ReviewsSection";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500?text=Image+non+disponible";

function findProductInStaticData(slug) {
  const allProducts = [...fashion, ...beauty, ...bestSellers, ...huntrix, ...lightStick];
  return allProducts.find(p => p.slug === slug);
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [visible, setVisible] = useState(false);
  const [descOpen, setDescOpen] = useState(false);

  const { product: dbProduct, loading: dbLoading } = useProductBySlug(slug);

  useEffect(() => {
    setLoading(true);
    setVisible(false);

    const normalize = (p) => ({
      ...p,
      name: p.name || p.title,
      images: p.images?.filter(Boolean).length > 0
        ? p.images
        : [p.url, p.urlHover, p.image, p.hoverImage, p.imageUrl].filter(Boolean),
    });

    const foundProduct = findProductInStaticData(slug);

    if (foundProduct) {
      const n = normalize(foundProduct);
      setProduct(n);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
      if (n.sizes?.length > 0) setSelectedSize(n.sizes[0].size || n.sizes[0]);
      if (n.colors?.length > 0) setSelectedColor(n.colors[0].colorName || n.colors[0]);
    } else if (dbProduct) {
      const n = normalize(dbProduct);
      setProduct(n);
      setLoading(false);
      setTimeout(() => setVisible(true), 60);
      if (n.sizes?.length > 0) setSelectedSize(n.sizes[0].size || n.sizes[0]);
      if (n.colors?.length > 0) setSelectedColor(n.colors[0].colorName || n.colors[0]);
    } else if (!dbLoading) {
      setLoading(false);
    }
  }, [slug, dbProduct, dbLoading]);

  // ── Guards en premier ──
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

  if (!product) {
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

  // ── Ici product est garanti non-null ──
  const images = product.images?.filter(Boolean) || [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : PLACEHOLDER_IMAGE;
  
  // ✅ CORRIGÉ: price est le prix réduit, originalPrice est l'ancien prix
  const numPrice = parseFloat(product.price) || 0;
  const numOriginalPrice = parseFloat(product.originalPrice) || null;
  const isOnSale = numOriginalPrice !== null && numOriginalPrice > numPrice;
  const discount = isOnSale
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
    : null;

  const nextImage = () => images.length > 1 && setCurrentImageIndex(p => (p + 1) % images.length);
  const prevImage = () => images.length > 1 && setCurrentImageIndex(p => (p - 1 + images.length) % images.length);

  const cleanDescription = typeof product.description === "string"
    ? product.description.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/💜|🎭|✨|📸|🌟|👕|👚|👗|👜|☕|🧢|🎵|📦|📐|💆/g, '').trim()
    : '';

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Veuillez sélectionner une taille");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Veuillez sélectionner une couleur");
      return;
    }

    addToCart(
      {
        id: product.id || product.slug,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.url,
      },
      {
        quantity,
        size: selectedSize,
        color: selectedColor,
      }
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

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
        .size-btn { transition: all 0.18s ease; }
        .size-btn:hover:not(.active) { border-color: #5E2251; color: #5E2251; transform: translateY(-1px); }
        .size-btn.active { background: #5E2251; border-color: #5E2251; color: white; box-shadow: 0 4px 12px rgba(94,34,81,0.25); }
        .color-btn { transition: all 0.18s ease; }
        .color-btn:hover:not(.active) { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .color-btn.active { box-shadow: 0 0 0 3px white, 0 0 0 5px #5E2251; transform: scale(1.08); }
        .cart-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        .cart-btn:hover::before { transform: translateX(0); }
        .cart-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(94,34,81,0.3); }
        .cart-btn:active { transform: translateY(0); }
        .wish-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .wish-btn:hover { transform: scale(1.1); }
        .wish-btn.wished { background: #fff0f5; border-color: #f43f6e; }
        .guarantee-card { transition: all 0.2s ease; }
        .guarantee-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .img-zoom img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .img-zoom:hover img { transform: scale(1.06); }
        .nav-arrow { transition: all 0.2s ease; opacity: 0; }
        .img-zoom:hover .nav-arrow { opacity: 1; }
        .nav-arrow:hover { background: #5E2251; color: white; transform: translateY(-50%) scale(1.1); }
        
        /* ✅ NOUVEAU: Styles pour les tailles avec scroll horizontal et wrapping smart */
        .size-options-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          width: 100%;
          align-items: center;
          justify-content: flex-start;
        }
        
        /* Sur mobile: grille 2-3 colonnes */
        @media (max-width: 640px) {
          .size-options-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 0.5rem;
          }
        }
        
        /* Sur tablet/desktop: flex normal avec wrapping */
        @media (min-width: 641px) {
          .size-options-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
        }
      `}</style>

      <div className="pdp-root">
        <div className="hidden lg:block"><Navbar /></div>
        <div className="lg:hidden"><RespNav /></div>

        {/* Promo banner */}
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

        {/* Breadcrumb */}
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
            <span className="text-gray-600 font-medium truncate max-w-[180px]">{product.name}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-start transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

            {/* LEFT — Images */}
            <div className={`flex flex-col gap-3 ${visible ? 'anim-1' : ''}`}>
              <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 img-zoom">
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

                <button onClick={() => setWished(w => !w)}
                  className={`wish-btn absolute top-4 right-4 z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white shadow-md ${wished ? 'wished' : 'border-gray-100'}`}>
                  <Heart size={17} className={wished ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
                </button>

                <img src={currentImage} alt={product.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />

                {images.length > 1 && (
                  <>
                    <button onClick={prevImage}
                      className="nav-arrow absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextImage}
                      className="nav-arrow absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center">
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setCurrentImageIndex(i)}
                          className={`rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-5 h-1.5 bg-[#5E2251]' : 'w-1.5 h-1.5 bg-gray-300'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                      className={`thumb-btn aspect-square rounded-2xl overflow-hidden border-2 bg-white ${
                        currentImageIndex === idx ? 'active border-[#5E2251]' : 'border-transparent hover:border-gray-200'
                      }`}>
                      <img src={img} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Info */}
            <div className="flex flex-col gap-6 lg:pt-2">

              {/* Brand + Title */}
              <div className={visible ? 'anim-2' : ''}>
                {product.brand && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5E2251] mb-2">{product.brand}</p>
                )}
                <h1 style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                {product.rating && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13}
                          className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount || 0} avis)</span>
                  </div>
                )}
              </div>

              {/* ✅ PRIX CORRIGÉ */}
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

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Couleur — <span className="text-gray-800 normal-case tracking-normal font-semibold">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color) => {
                      const name = color.colorName || color.name || color;
                      const hex = color.colorHex || color.hex || "#888";
                      const isActive = selectedColor === name;
                      return (
                        <button key={name} onClick={() => setSelectedColor(name)}
                          title={name}
                          className={`color-btn w-8 h-8 rounded-full border-2 ${isActive ? 'active border-white' : 'border-white'}`}
                          style={{ backgroundColor: hex }} />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ✅ Sizes - NOUVEAU LAYOUT RESPONSIVE */}
              {product.sizes?.length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Taille — <span className="text-gray-800 normal-case tracking-normal font-semibold text-[11px] break-words">{selectedSize}</span>
                  </p>
                  <div className="size-options-container">
                    {product.sizes.map((size) => {
                      const val = typeof size === "string" ? size : size.size;
                      const isActive = selectedSize === val;
                      return (
                        <button 
                          key={val} 
                          onClick={() => setSelectedSize(val)}
                          className={`size-btn py-2.5 px-3 rounded-xl border-2 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                            isActive 
                              ? 'active' 
                              : 'border-gray-200 text-gray-600 bg-white'
                          }`}
                          title={val}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + Cart */}
              <div className={`flex gap-3 items-stretch ${visible ? 'anim-4' : ''}`}>
                <div className="flex items-center rounded-2xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xl font-light">
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 text-base">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xl font-light">
                    +
                  </button>
                </div>

                <button onClick={handleAddToCart}
                  className={`cart-btn flex-1 h-12 flex items-center justify-center gap-2.5 rounded-2xl font-bold text-sm tracking-wide ${
                    addedToCart
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-[#5E2251] text-white'
                  }`}>
                  {addedToCart
                    ? <>✓ Ajouté au panier</>
                    : <><ShoppingBag size={17} /> Ajouter au panier</>
                  }
                </button>
              </div>

              {/* Stock */}
              {product.stock !== undefined && (
                <div className={`flex items-center gap-2 ${visible ? 'anim-4' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${
                    product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <p className={`text-xs font-medium ${
                    product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'
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

              {/* Description accordéon */}
              {cleanDescription && (
                <div className={`border border-gray-100 rounded-2xl overflow-hidden bg-white ${visible ? 'anim-5' : ''}`}>
                  <button onClick={() => setDescOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="text-sm font-bold text-gray-800">Description du produit</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${descOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${descOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 border-t border-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-4">
                        {cleanDescription}
                      </p>
                    </div>
                  </div>
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
        <ReviewsSection productId={product.id}/>
        

        <Footer />
      </div>
    </div>
  );
}