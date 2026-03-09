import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CartSidebar from "../cart/CartSidebar";
import Navbar from "../Header";


const colorSwatches = [
  { key: "beige", bg: "#D4B896", label: "Beige" },
  { key: "black", bg: "#2a2a2a", label: "Noir" },
  { key: "brown", bg: "#8B5E3C", label: "Marron" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

const tableData = [
  { taille: "S", longueur: 67, manches: 51, epaule: 53 },
  { taille: "M", longueur: 68, manches: 52, epaule: 54 },
  { taille: "L", longueur: 70, manches: 53, epaule: 56 },
  { taille: "XL", longueur: 72, manches: 54, epaule: 58 },
  { taille: "XXL", longueur: 74, manches: 55, epaule: 60 },
];

export default function ProductDetailPage() {
  const { category, productId } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("beige");
  const [selectedSize, setSelectedSize] = useState("S");
  const [activeImage, setActiveImage] = useState(0);
  const [imageAnimating, setImageAnimating] = useState(false);
  const [colorAnimating, setColorAnimating] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Find product from CATEGORIES
  const categoryProducts = CATEGORIES[category] || [];
  const product = categoryProducts[parseInt(productId) - 1]; // ID is 1-indexed

  if (!product) {
    return (
      <div style={{ fontFamily: "'Helvetica Neue', sans-serif", padding: "60px 20px", textAlign: "center" }}>
        <h1>Produit non trouvé</h1>
        <p>Le produit que vous cherchez n'existe pas.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Generate images for carousel (use main image and hover image)
  const generateImages = () => {
    const imgs = [product.image];
    if (product.hoverImage) imgs.push(product.hoverImage);
    // Fill remaining slots with placeholder
    while (imgs.length < 6) {
      imgs.push("https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop");
    }
    return imgs;
  };

  const currentImages = generateImages();
  const priceText = typeof product.price === "number" ? `${product.price.toFixed(2).replace(".", ",")}€` : product.price;
  const originalPriceText = product.originalPrice ? `${product.originalPrice.toFixed(2).replace(".", ",")}€` : null;

  const handleColorChange = (colorKey) => {
    if (colorKey === selectedColor) return;
    setColorAnimating(true);
    setImageAnimating(true);
    setTimeout(() => {
      setSelectedColor(colorKey);
      setActiveImage(0);
      setColorAnimating(false);
      setImageAnimating(false);
    }, 300);
  };

  const handleThumbClick = (idx) => {
    setImageAnimating(true);
    setTimeout(() => {
      setActiveImage(idx);
      setImageAnimating(false);
    }, 200);
  };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <div className="hidden lg:block">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.04)} }
        @keyframes shimmer { 0%{background-position:-400px 0}100%{background-position:400px 0} }
        @keyframes badgePop { 0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1} }
        .fade-img { transition: opacity 0.3s ease, transform 0.3s ease; }
        .fade-img.animating { opacity: 0; transform: scale(0.97); }
        .thumb-item { transition: all 0.25s ease; cursor: pointer; border: 2px solid transparent; border-radius: 6px; overflow: hidden; }
        .thumb-item:hover { transform: scale(1.04); border-color: #9C6BC0; }
        .thumb-item.active { border-color: #9C6BC0; box-shadow: 0 0 0 2px #e8d5f5; }
        .color-swatch { transition: all 0.25s ease; cursor: pointer; border-radius: 50%; border: 3px solid transparent; }
        .color-swatch:hover { transform: scale(1.15); }
        .color-swatch.active { border-color: #333; box-shadow: 0 0 0 2px rgba(0,0,0,0.15); }
        .size-btn { transition: all 0.2s ease; cursor: pointer; border: 2px solid #ddd; padding: 6px 14px; border-radius: 4px; background: #fff; font-size: 13px; font-weight: 500; }
        .size-btn:hover:not(.disabled) { border-color: #9C6BC0; color: #9C6BC0; transform: translateY(-1px); }
        .size-btn.active { background: #5c2d91; border-color: #5c2d91; color: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(92,45,145,0.3); }
        .size-btn.disabled { opacity: 0.4; cursor: not-allowed; text-decoration: line-through; }
        .add-btn { width: 100%; padding: 14px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; background: #9C6BC0; color: white; letter-spacing: 0.5px; }
        .add-btn.out-of-stock { background: #c0a0d8; cursor: not-allowed; animation: none; }
        .add-btn:not(.out-of-stock):hover { background: #7a4fa0; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(92,45,145,0.35); }
        .promo-banner { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); border-radius: 10px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; overflow: hidden; position: relative; }
        .promo-text { color: #fff; font-size: 20px; font-weight: 900; font-style: italic; letter-spacing: 1px; }
        .promo-badge { background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px 14px; text-align: center; color: white; animation: badgePop 0.4s ease forwards; }
        .promo-pct { font-size: 22px; font-weight: 900; color: #f0c040; }
        .promo-label { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; white-space: nowrap; }
        .stock-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: #888; }
        .main-image-wrap { position: relative; border-radius: 12px; overflow: hidden; background: #f5f5f5; }
        .main-image-wrap img { width: 100%; height: 400px; object-fit: cover; display: block; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead th { background: #f0e8fa; padding: 10px 12px; text-align: center; font-weight: 600; color: #5c2d91; border: 1px solid #e0d0f0; }
        tbody td { padding: 9px 12px; text-align: center; border: 1px solid #eee; color: #444; }
        tbody tr:nth-child(even) { background: #faf7fd; }
        .section-title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .product-title { font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; line-height: 1.3; }
        .price { font-size: 24px; font-weight: 700; color: #9C6BC0; margin-bottom: 12px; }
        .original-price { font-size: 16px; color: #999; text-decoration: line-through; margin-right: 10px; }
        .promo-inline { font-size: 12px; color: #666; display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
        .tag { font-size: 11px; background: #f0e8fa; color: #7a4fa0; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
        .label { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 8px; margin-top: 14px; }
        .desc-point { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #444; margin-bottom: 6px; }
        .desc-point::before { content: '•'; color: #9C6BC0; font-size: 18px; line-height: 1; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* LEFT: Images */}
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div className="main-image-wrap" style={{ marginBottom: 12 }}>
            <img
              src={currentImages[activeImage]}
              alt={product.name}
              className={`fade-img ${imageAnimating ? "animating" : ""}`}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop";
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {currentImages.slice(1).map((src, i) => (
              <div
                key={`${selectedColor}-${i}`}
                className={`thumb-item ${activeImage === i + 1 ? "active" : ""}`}
                onClick={() => handleThumbClick(i + 1)}
                style={{ animation: `slideIn 0.3s ease ${i * 0.07}s both` }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div style={{ animation: "fadeIn 0.5s ease 0.1s both" }}>
          <h1 className="product-title">{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="price">{priceText}</div>
            {originalPriceText && <div className="original-price">{originalPriceText}</div>}
          </div>

          <div className="stock-badge">
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4caf50", display: "inline-block" }}></span>
            En stock
          </div>

          <div className="promo-inline" style={{ marginTop: 10 }}>
            <span style={{ fontSize: 14 }}>🏷</span>
            Promo : Achetez 2 : <span className="tag">-10%</span> | 3 : <span className="tag">-15%</span> | 4 : <span className="tag">-20%</span>
          </div>

          {/* Color */}
          <div className="label">Couleur</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
            {colorSwatches.map((c) => (
              <div
                key={c.key}
                className={`color-swatch ${selectedColor === c.key ? "active" : ""}`}
                onClick={() => handleColorChange(c.key)}
                title={c.label}
                style={{ width: 36, height: 36, background: c.bg }}
              />
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Sélectionné : <strong>{colorSwatches.find(c => c.key === selectedColor)?.label}</strong>
          </div>

          {/* Size */}
          <div className="label">Taille</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {sizes.map((s) => (
              <button
                key={s}
                className={`size-btn ${selectedSize === s ? "active" : ""}`}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="add-btn">
            Ajouter au panier – {priceText}
          </button>

          {/* Promo Banner */}
          <div className="promo-banner" style={{ marginTop: 18 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 50%, rgba(156,107,192,0.15) 0%, transparent 60%)", pointerEvents: "none" }} />
            <div className="promo-text">PROMO<br /><span style={{ fontSize: 12, fontWeight: 400, fontStyle: "normal", opacity: 0.7 }}>AUJOURD'HUI :</span></div>
            {[
              { pct: "-10%", label: "2 Articles" },
              { pct: "-15%", label: "3 Articles" },
              { pct: "-20%", label: "4 Articles" },
            ].map((b, i) => (
              <div key={i} className="promo-badge" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="promo-pct">{b.pct}</div>
                <div className="promo-label">{b.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginTop: 28 }}>
            <div className="section-title">À propos de ce produit</div>
            <p style={{ fontSize: 13.5, color: "#555", marginBottom: 14, lineHeight: 1.6 }}>
              Découvrez cette magnifique {product.name.toLowerCase()} pour les fans de K-Culture. Qualité premium et livraison rapide.
            </p>
            <div className="desc-point">Produit officiel K-Culture</div>
            <div className="desc-point">Qualité premium</div>
            <div className="desc-point">Livraison Standard Gratuite</div>
          </div>

          {/* Size Table */}
          <div style={{ marginTop: 22 }}>
            <table>
              <thead>
                <tr>
                  <th>Taille (cm)</th>
                  <th>Longueur</th>
                  <th>Manches</th>
                  <th>Epaule</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr
                    key={row.taille}
                    style={{
                      fontWeight: selectedSize === row.taille ? 700 : 400,
                      background: selectedSize === row.taille ? "#f0e8fa" : undefined,
                      transition: "background 0.3s ease",
                    }}
                  >
                    <td>{row.taille}</td>
                    <td>{row.longueur}</td>
                    <td>{row.manches}</td>
                    <td>{row.epaule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
