import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Star, Package, RotateCcw, Shield, Truck } from "lucide-react";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { useProductBySlug } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import ReviewsSection from "../components/composants/ReviewsSection";
import RelatedProducts from "../components/composants/RelatedProduct";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/500?text=Image+non+disponible";

// ── Détecte si une valeur de size est un variant "nominal" (nom propre)
// Exclut : chiffres purs, pointures, dimensions, tailles vestimentaires
const EXCLUDED_SIZE_PATTERNS = [
  /^\d+([.,]\d+)?\s*(cm|mm|m|kg|g|l|ml|")?$/i,
  /^(xs|s|m|l|xl|xxl|xxxl|2xl|3xl|4xl|taille\s*unique|tu)$/i,
  /^\d{2,3}$/,
  /^\d+x\d+/i,
  /^\d+\/\d+/,
];

function isNamedVariant(val) {
  if (!val || typeof val !== "string") return false;
  return !EXCLUDED_SIZE_PATTERNS.some((re) => re.test(val.trim()));
}

// ── Inline parser ────────────────────────────────────────────────────────
function parseInline(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", content: text.slice(last, match.index) });
    if (match[2]) parts.push({ type: "bold", content: match[2] });
    else if (match[3]) parts.push({ type: "italic", content: match[3] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

function InlineText({ text }) {
  const parts = parseInline(text);
  return (
    <>
      {parts.map((p, i) => {
        if (p.type === "bold") return <strong key={i} className="font-semibold text-[#5E2251]">{p.content}</strong>;
        if (p.type === "italic") return <em key={i} className="italic text-gray-500">{p.content}</em>;
        return <span key={i}>{p.content}</span>;
      })}
    </>
  );
}

// ── Markdown parser ──────────────────────────────────────────────────────
function parseMarkdown(markdown) {
  if (!markdown || typeof markdown !== "string") return [];
  const lines = markdown.split("\n");
  const elements = [];
  let listBuffer = [];
  let i = 0;
  const flushList = () => {
    if (listBuffer.length > 0) { elements.push({ type: "ul", items: [...listBuffer] }); listBuffer = []; }
  };
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (t.startsWith("|") && t.endsWith("|")) {
      flushList();
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) { tableLines.push(lines[i].trim()); i++; }
      i--;
      if (tableLines.length >= 2) {
        const headerCells = tableLines[0].split("|").slice(1, -1).map(c => c.trim());
        const bodyRows = tableLines.slice(2).map(row => row.split("|").slice(1, -1).map(c => c.trim()));
        elements.push({ type: "table", headers: headerCells, rows: bodyRows, key: i });
      }
    } else if (!t) { flushList(); }
    else if (t.startsWith("### ")) { flushList(); elements.push({ type: "h3", text: t.slice(4), key: i }); }
    else if (t.startsWith("## ")) { flushList(); elements.push({ type: "h2", text: t.slice(3), key: i }); }
    else if (t.startsWith("# ")) { flushList(); elements.push({ type: "h1", text: t.slice(2), key: i }); }
    else if (/^[-*•]\s/.test(t)) { listBuffer.push({ text: t.replace(/^[-*•]\s/, ""), key: i }); }
    else { flushList(); elements.push({ type: "p", text: t, key: i }); }
    i++;
  }
  flushList();
  return elements;
}

function MarkdownDescription({ markdown }) {
  const blocks = parseMarkdown(markdown);
  if (!blocks.length) return null;
  return (
    <div className="desc-body space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "h1": return <div key={block.key} className="desc-h1"><h2 className="desc-h1-text"><InlineText text={block.text} /></h2></div>;
          case "h2": return <div key={block.key} className="desc-h2-wrap"><span className="desc-h2-dot" /><h3 className="desc-h2-text"><InlineText text={block.text} /></h3></div>;
          case "h3": return <p key={block.key} className="desc-h3-text"><InlineText text={block.text} /></p>;
          case "ul": return (
            <ul key={block.items[0]?.key} className="desc-ul space-y-2">
              {block.items.map((item) => (
                <li key={item.key} className="desc-li">
                  <span className="desc-li-icon"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill="#5E2251" opacity="0.7" /></svg></span>
                  <span className="desc-li-text"><InlineText text={item.text} /></span>
                </li>
              ))}
            </ul>
          );
          case "table": return (
            <div key={block.key} className="desc-table-wrapper overflow-x-auto -mx-1.5">
              <table className="desc-table w-full border-collapse min-w-max sm:min-w-full">
                <thead>
                  <tr className="bg-[#5E2251]/8 border-b-2 border-[#5E2251]/30">
                    {block.headers.map((header, idx) => (
                      <th key={idx} className="desc-table-header px-3 sm:px-4 py-3 text-left font-bold text-[#5E2251] text-xs sm:text-sm border-r border-[#5E2251]/10 last:border-r-0 whitespace-nowrap sm:whitespace-normal">
                        <InlineText text={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={`border-b border-gray-200/50 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-[#5E2251]/3 transition-colors`}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="desc-table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 border-r border-gray-200/30 last:border-r-0">
                          <InlineText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          case "p": return <p key={block.key} className="desc-p-text"><InlineText text={block.text} /></p>;
          default: return null;
        }
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]); // multi-select nominaux
  const [previewVariantIdx, setPreviewVariantIdx] = useState(null); // index image en preview
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [visible, setVisible] = useState(false);

  const { product: dbProduct, loading: dbLoading } = useProductBySlug(slug);

  // ── Init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (dbLoading) { setLoading(true); setVisible(false); return; }
    setLoading(false);
    if (dbProduct) {
      setTimeout(() => setVisible(true), 60);
      const allSizes = (dbProduct.sizes || []).map(s => typeof s === "string" ? s : s.size).filter(Boolean);
      const classicSizes = allSizes.filter(s => !isNamedVariant(s));
      if (classicSizes.length > 0) setSelectedSize(classicSizes[0]);
      if (dbProduct.colors?.length > 0) setSelectedColor(dbProduct.colors[0].color_name || dbProduct.colors[0]);
      setCurrentImageIndex(0);
      setSelectedVariants([]);
      setPreviewVariantIdx(null);
    }
  }, [dbProduct, dbLoading]);

  // ── Sync couleur quand image change (sauf si un variant est en preview) ──
  useEffect(() => {
    if (!dbProduct?.colors?.length) return;
    if (previewVariantIdx !== null) return;
    const idx = currentImageIndex;
    if (idx < dbProduct.colors.length) {
      const c = dbProduct.colors[idx];
      setSelectedColor(c ? (c.color_name || c.name || c) : null);
    } else {
      setSelectedColor(null);
    }
  }, [currentImageIndex, dbProduct?.colors, previewVariantIdx]);

  // ── Guards ───────────────────────────────────────────────────────────
  if (loading) return (
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

  if (!dbProduct) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[#faf9f7]">
      <div className="hidden lg:block"><Navbar /></div>
      <div className="lg:hidden"><RespNav /></div>
      <div className="text-center px-4">
        <p className="text-7xl mb-6">✦</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Produit introuvable</h1>
        <p className="text-gray-400 mb-8 text-sm">Ce produit n'existe pas ou a été retiré.</p>
        <button onClick={() => navigate("/")} className="px-10 py-3.5 bg-[#5E2251] text-white rounded-full font-bold text-sm hover:bg-[#4a1840] transition-all">
          Retour à l'accueil
        </button>
      </div>
      <Footer />
    </div>
  );

  const product = dbProduct;
  const images = product.images?.filter(Boolean) || [product.image || product.url].filter(Boolean);

  // ── Séparation sizes : classiques vs nominaux ────────────────────────
  const allSizes = (product.sizes || []).map(s => typeof s === "string" ? s : s.size).filter(Boolean);
  const classicSizes = allSizes.filter(s => !isNamedVariant(s));
  const namedVariants = allSizes.filter(s => isNamedVariant(s));

  // Chaque variant nominal → son index d'image (position dans allSizes)
  const namedVariantWithIndex = namedVariants.map((variantName) => {
    const posInAll = allSizes.indexOf(variantName);
    const imgIdx = posInAll < images.length ? posInAll : images.length - 1;
    return { name: variantName, imgIdx };
  });

  // Image affichée : si un variant est en preview → son image, sinon currentImageIndex
  const displayIndex = previewVariantIdx !== null ? previewVariantIdx : currentImageIndex;
  const currentImage = images.length > 0 ? (images[displayIndex] || images[0]) : PLACEHOLDER_IMAGE;

  const numPrice = parseFloat(product.price) || 0;
  const numOriginalPrice = parseFloat(product.original_price) || null;
  const isOnSale = numOriginalPrice !== null && numOriginalPrice > numPrice;
  const discount = isOnSale ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) : null;
  const rawDescription = typeof product.description === "string" ? product.description : "";

  // ── Toggle variant nominal (multi-select) ────────────────────────────
  const toggleVariant = (variantName, imgIdx) => {
    setSelectedVariants(prev =>
      prev.includes(variantName) ? prev.filter(v => v !== variantName) : [...prev, variantName]
    );
    // Afficher l'image du variant cliqué
    setPreviewVariantIdx(imgIdx);
    setCurrentImageIndex(imgIdx);
  };

  // ── Ajouter au panier ────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (classicSizes.length > 0 && !selectedSize) { alert("Veuillez sélectionner une taille"); return; }
    if (product.colors?.length > 0 && !selectedColor) { alert("Veuillez sélectionner une couleur"); return; }

    if (namedVariants.length > 0) {
      if (selectedVariants.length === 0) { alert("Veuillez sélectionner au moins un modèle"); return; }
      // Une ligne par variant sélectionné, chacun avec son image propre
      namedVariantWithIndex
        .filter(({ name }) => selectedVariants.includes(name))
        .forEach(({ name, imgIdx }) => {
          addToCart(
            {
              id: `${product.id}_${name}`,
              name: `${product.name || product.title} — ${name}`,
              price: product.price,
              image: images[imgIdx] || images[0] || PLACEHOLDER_IMAGE,
            },
            quantity,
            selectedSize,
            selectedColor,
            name
          );
        });
    } else {
      addToCart(
        {
          id: product.id,
          name: product.name || product.title,
          price: product.price,
          image: images[0] || PLACEHOLDER_IMAGE,
        },
        quantity,
        selectedSize,
        selectedColor
      );
    }

    openCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pdp-root { font-family: 'DM Sans', sans-serif; }

        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        .anim-1{animation:scaleIn .55s .05s cubic-bezier(.16,1,.3,1) both}
        .anim-2{animation:slideUp .55s .15s cubic-bezier(.16,1,.3,1) both}
        .anim-3{animation:slideUp .55s .25s cubic-bezier(.16,1,.3,1) both}
        .anim-4{animation:slideUp .55s .35s cubic-bezier(.16,1,.3,1) both}
        .anim-5{animation:slideUp .55s .45s cubic-bezier(.16,1,.3,1) both}

        .thumb-btn{transition:all .2s ease}
        .thumb-btn:hover,.thumb-btn.active{transform:scale(1.04)}
        .img-zoom img{transition:transform .6s cubic-bezier(.16,1,.3,1)}
        .img-zoom:hover img{transform:scale(1.06)}

        .size-btn{transition:all .18s ease;height:44px;display:flex;align-items:center;justify-content:center;padding:0 12px;white-space:nowrap;min-width:max-content}
        .size-btn:hover:not(.active){border-color:#5E2251;color:#5E2251;transform:translateY(-1px)}
        .size-btn.active{background:#5E2251;border-color:#5E2251;color:white;box-shadow:0 4px 12px rgba(94,34,81,.25)}
        .size-options-container{display:flex;flex-wrap:wrap;gap:.5rem;width:100%;align-items:center;justify-content:flex-start}
        @media(min-width:641px){.size-options-container{gap:.75rem}}

        /* Variant nominal avec image + checkmark */
        .variant-btn{
          transition:all .2s ease;
          position:relative;
          display:flex;flex-direction:column;align-items:center;gap:5px;
          padding:6px;border-radius:14px;border:2px solid #e5e7eb;
          background:white;cursor:pointer;min-width:68px;
        }
        .variant-btn:hover:not(.active){border-color:#9b4a8a;transform:translateY(-2px);box-shadow:0 4px 12px rgba(94,34,81,.12)}
        .variant-btn.active{border-color:#5E2251;box-shadow:0 0 0 3px rgba(94,34,81,.15);transform:translateY(-2px)}
        .variant-img{width:54px;height:54px;border-radius:10px;object-fit:cover;display:block}
        .variant-name{font-size:10px;font-weight:700;color:#5E2251;text-align:center;line-height:1.2;max-width:66px;word-break:break-word}
        .variant-check{
          position:absolute;top:4px;right:4px;
          width:18px;height:18px;border-radius:50%;
          background:#5E2251;display:flex;align-items:center;justify-content:center;
          opacity:0;transition:opacity .15s;
        }
        .variant-btn.active .variant-check{opacity:1}

        .color-btn{transition:all .18s ease}
        .color-btn:hover:not(.active){transform:scale(1.05);box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .color-btn.active{box-shadow:0 0 0 3px white,0 0 0 5px #5E2251;transform:scale(1.08)}

        .cart-btn{position:relative;overflow:hidden;transition:all .3s cubic-bezier(.16,1,.3,1)}
        .cart-btn::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,.15);transform:translateX(-100%);transition:transform .4s ease}
        .cart-btn:hover::before{transform:translateX(0)}
        .cart-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(94,34,81,.3)}
        .cart-btn:active{transform:translateY(0)}

        .wish-btn{transition:all .25s cubic-bezier(.34,1.56,.64,1)}
        .wish-btn:hover{transform:scale(1.1)}
        .wish-btn.wished{background:#fff0f5;border-color:#f43f6e}
        .guarantee-card{transition:all .2s ease}
        .guarantee-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.06)}

        @media(min-width:1024px){.img-col-sticky{position:sticky;top:1.5rem;align-self:flex-start}}

        .desc-card{background:linear-gradient(135deg,#fdf9fc,#faf7fb);border:1px solid rgba(94,34,81,.10);border-radius:20px;padding:1.5rem;position:relative;overflow:hidden}
        .desc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5E2251,#9b4a8a,#5E2251);border-radius:20px 20px 0 0}
        .desc-title-row{display:flex;align-items:center;gap:10px;margin-bottom:1.25rem}
        .desc-title-icon{width:18px;height:28px;background:#5E2251;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .desc-title-label{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#5E2251}
        .desc-divider{height:1px;background:linear-gradient(90deg,rgba(94,34,81,.15),transparent);margin-bottom:1.25rem}
        .desc-h1{background:rgba(94,34,81,.06);border-left:3px solid #5E2251;border-radius:0 10px 10px 0;padding:.8rem 1.5rem;margin-bottom:.5rem}
        .desc-h1-text{font-size:20px;font-weight:700;color:#3d1636;letter-spacing:-.01em;margin:0;line-height:1.2}
        .desc-h2-wrap{display:flex;align-items:center;gap:12px;margin-top:.5rem}
        .desc-h2-dot{width:10px;height:10px;background:#5E2251;border-radius:50%;flex-shrink:0;opacity:.7}
        .desc-h2-text{font-size:17px;font-weight:700;color:#5E2251;margin:0;line-height:1.2}
        .desc-h3-text{font-size:14px;font-weight:600;color:#7a3569;padding-left:1rem;margin:0;line-height:1.2}
        .desc-p-text{font-size:15px;color:#6b5566;line-height:1.8;margin:0}
        .desc-ul{list-style:none;padding-left:.25rem;margin:0}
        .desc-li{display:flex;align-items:flex-start;gap:12px;font-size:16px;color:#6b5566;line-height:1.8}
        .desc-li-icon{flex-shrink:0;margin-top:6px;display:flex;align-items:center}
        .desc-li-text{flex:1}
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
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#5E2251] transition-colors group font-medium">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Retour
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <a href="/" className="hover:text-[#5E2251] transition-colors">Accueil</a>
            <span className="text-gray-200">›</span>
            {product.category && (<><span className="hover:text-[#5E2251] transition-colors cursor-pointer">{product.category}</span><span className="text-gray-200">›</span></>)}
            <span className="text-gray-600 font-medium truncate max-w-[180px]">{product.name || product.title}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-start transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>

            {/* ── LEFT — Images ── */}
            <div className={`flex flex-col gap-3 img-col-sticky ${visible ? 'anim-1' : ''}`}>
              <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 img-zoom">
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {discount && <span className="bg-[#5E2251] text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-[#5E2251]/20">-{discount}%</span>}
                  {product.isEstimated && <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Estimé</span>}
                </div>
                <button onClick={() => setWished(w => !w)}
                  className={`wish-btn absolute top-4 right-4 z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white shadow-md ${wished ? 'wished' : 'border-gray-100'}`}>
                  <Heart size={17} className={wished ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
                </button>
                <img src={currentImage} alt={product.name || product.title}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <button key={idx}
                      onClick={() => { setCurrentImageIndex(idx); setPreviewVariantIdx(null); }}
                      className={`thumb-btn aspect-square rounded-2xl overflow-hidden border-2 bg-white ${displayIndex === idx ? 'active border-[#5E2251]' : 'border-transparent hover:border-gray-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT — Info ── */}
            <div className="flex flex-col gap-6 lg:pt-2">

              {/* Brand + Title */}
              <div className={visible ? 'anim-2' : ''}>
                {product.brand && <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5E2251] mb-2">{product.brand}</p>}
                <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  {product.name || product.title}
                </h1>
                {product.rating && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className={`flex items-end gap-4 ${visible ? 'anim-2' : ''}`}>
                <div>
                  <span className="text-5xl font-black text-gray-900 tracking-tight">{numPrice.toFixed(2).replace(".", ",")}</span>
                  <span className="text-2xl font-black text-gray-900">€</span>
                </div>
                {isOnSale && (
                  <div className="flex flex-col pb-1">
                    <span className="text-base text-gray-400 line-through">{numOriginalPrice.toFixed(2).replace(".", ",")}€</span>
                    {discount && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-center">−{discount}%</span>}
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
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, idx) => {
                      if (idx >= images.length) return null;
                      const name = color.color_name || color.name || color;
                      return (
                        <button key={name}
                          onClick={() => { setSelectedColor(name); setCurrentImageIndex(idx); setPreviewVariantIdx(null); }}
                          title={name}
                          className={`color-btn w-12 h-12 rounded-full border-2 overflow-hidden flex items-center justify-center bg-white ${selectedColor === name ? 'active border-[#5E2251] ring-2 ring-[#5E2251] ring-offset-2' : 'border-gray-300 hover:border-[#5E2251]'}`}>
                          <img src={images[idx]} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Variants nominaux (multi-select avec image thumbnail) ── */}
              {namedVariantWithIndex.length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Modèle
                    {selectedVariants.length > 0 && (
                      <span className="ml-2 text-gray-800 normal-case tracking-normal font-semibold">
                        — {selectedVariants.join(", ")}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {namedVariantWithIndex.map(({ name, imgIdx }) => {
                      const isActive = selectedVariants.includes(name);
                      return (
                        <button key={name}
                          onClick={() => toggleVariant(name, imgIdx)}
                          className={`variant-btn ${isActive ? 'active' : ''}`}
                          title={name}>
                          <img
                            src={images[imgIdx] || PLACEHOLDER_IMAGE}
                            alt={name}
                            className="variant-img"
                            onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                          />
                          <span className="variant-name">{name}</span>
                          <span className="variant-check">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedVariants.length > 1 && (
                    <p className="text-[10px] text-[#5E2251] mt-2 font-semibold">
                      ✓ {selectedVariants.length} modèles sélectionnés — ajoutés séparément au panier
                    </p>
                  )}
                </div>
              )}

              {/* Tailles classiques */}
              {classicSizes.length > 0 && (
                <div className={visible ? 'anim-3' : ''}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
                    Taille — <span className="text-gray-800 normal-case tracking-normal font-semibold text-[11px] break-words">{selectedSize}</span>
                  </p>
                  <div className="size-options-container">
                    {classicSizes.map((val) => (
                      <button key={val} onClick={() => setSelectedSize(val)}
                        className={`size-btn py-2.5 px-3 rounded-xl border-2 font-semibold text-xs sm:text-sm ${selectedSize === val ? 'active' : 'border-gray-200 text-gray-600 bg-white'}`}
                        title={val}>
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Cart */}
              <div className={`flex gap-3 items-stretch ${visible ? 'anim-4' : ''}`}>
                <div className="flex items-center rounded-2xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xl font-light">−</button>
                  <span className="w-10 text-center font-bold text-gray-900 text-base">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xl font-light">+</button>
                </div>
                <button onClick={handleAddToCart}
                  className={`cart-btn flex-1 h-12 flex items-center justify-center gap-2.5 rounded-2xl font-bold text-sm tracking-wide ${addedToCart ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-[#5E2251] text-white'}`}>
                  {addedToCart ? <>✓ Ajouté au panier</> : <><ShoppingBag size={17} /> Ajouter au panier</>}
                </button>
              </div>

              {/* Stock */}
              {product.stock !== undefined && (
                <div className={`flex items-center gap-2 ${visible ? 'anim-4' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-400'}`} />
                  <p className={`text-xs font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                    {product.stock > 10 ? `En stock — ${product.stock} disponibles` : product.stock > 0 ? `Plus que ${product.stock} en stock !` : 'Rupture de stock'}
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
                        <path d="M1.5 1.5h4.8l6 6a1 1 0 010 1.41l-3.4 3.4a1 1 0 01-1.41 0l-6-6V1.5z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
                        <circle cx="4.5" cy="4.5" r="0.8" fill="white"/>
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