import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/composants/Header";
import RespNav from "../components/resp/RespNav";
import Footer from "../components/composants/Footer";
import { useProductBySlug } from "../hooks/useProducts";

// Importer les données statiques
import fashion from "../data/k-fashion";
import beauty from "../data/k-beauty";
import bestSellers from "../data/bestSellers";
import huntrix from "../data/huntrixProducts";
import lightStick from "../data/lightStick";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Hook pour récupérer le produit par slug de la base de données
  const { product: dbProduct, loading: dbLoading } = useProductBySlug(slug);

  useEffect(() => {
    setLoading(true);

    // Chercher d'abord dans les données statiques
    const allStaticProducts = [
      ...fashion,
      ...beauty,
      ...bestSellers,
      ...huntrix,
      ...lightStick
    ];

    const staticProduct = allStaticProducts.find(p => p.slug === slug);

    if (staticProduct) {
      // Produit trouvé dans les données statiques
      setProduct(staticProduct);
      setLoading(false);
      // Initialiser la première taille et couleur disponibles
      if (staticProduct.sizes && staticProduct.sizes.length > 0) {
        setSelectedSize(staticProduct.sizes[0].size);
      }
      if (staticProduct.colors && staticProduct.colors.length > 0) {
        setSelectedColor(staticProduct.colors[0].colorName);
      }
    } else if (dbProduct) {
      // Produit trouvé dans la base de données
      setProduct(dbProduct);
      setLoading(false);
      // Initialiser la première taille et couleur disponibles
      if (dbProduct.sizes && dbProduct.sizes.length > 0) {
        setSelectedSize(dbProduct.sizes[0].size);
      }
      if (dbProduct.colors && dbProduct.colors.length > 0) {
        setSelectedColor(dbProduct.colors[0].colorName);
      }
    } else if (!dbLoading) {
      // Produit non trouvé ni dans les données statiques ni dans la BD
      setLoading(false);
    }
  }, [slug, dbProduct, dbLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="lg:hidden">
          <RespNav />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Produit non trouvé</h1>
        <p className="text-gray-600">Le produit que vous cherchez n'existe pas.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-[#5E2251] text-white rounded-lg hover:bg-[#4a1840] transition"
        >
          Retour à l'accueil
        </button>
        <Footer />
      </div>
    );
  }

  const mainImage = product.image || product.url || "/placeholder.png";
  const hoverImage = product.hoverImage || product.urlHover || mainImage;
  const images = product.images || [mainImage];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Veuillez sélectionner une taille et une couleur");
      return;
    }
    // TODO: Ajouter au panier
    console.log("Ajouter au panier:", {
      productId: product.id,
      productSlug: product.slug,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <div className="lg:hidden">
        <RespNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-[#5E2251] cursor-pointer overflow-hidden">
                    <img
                      src={img}
                      alt={`${product.name} ${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-[#5E2251]">
                  {product.price.toFixed(2)}€
                </div>
                {product.originalPrice && (
                  <div className="text-lg text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </div>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0} avis)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {typeof product.description === "string"
                    ? product.description.slice(0, 200)
                    : product.description}
                </p>
              </div>
            )}

            {/* Tailles */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Taille
                </label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={typeof size === "string" ? size : size.size}
                      onClick={() =>
                        setSelectedSize(typeof size === "string" ? size : size.size)
                      }
                      className={`py-2 px-3 border-2 rounded font-semibold text-sm transition ${
                        selectedSize === (typeof size === "string" ? size : size.size)
                          ? "border-[#5E2251] bg-[#5E2251] text-white"
                          : "border-gray-300 text-gray-700 hover:border-[#5E2251]"
                      }`}
                    >
                      {typeof size === "string" ? size : size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Couleurs */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Couleur
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const colorName = color.colorName || color.name || color;
                    const colorHex = color.colorHex || color.hex || "#000000";
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`flex items-center gap-2 px-3 py-2 border-2 rounded transition ${
                          selectedColor === colorName
                            ? "border-[#5E2251]"
                            : "border-gray-300 hover:border-[#5E2251]"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: colorHex }}
                        />
                        <span className="text-sm">{colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Quantité
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border border-gray-300 rounded py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-[#5E2251] text-white font-bold text-lg rounded-lg hover:bg-[#4a1840] transition"
            >
              Ajouter au panier
            </button>

            {/* Stock */}
            {product.stock && (
              <div className="text-sm text-gray-600">
                {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
