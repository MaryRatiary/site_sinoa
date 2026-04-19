import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Heart, Share2, ShoppingCart, Check, Minus, Plus } from 'lucide-react';

const ProductDetail = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(product?.image || '');

  // Utiliser les données du produit du backend
  const productDetails = {
    name: product?.name || 'Produit KPOP',
    price: product?.price || 0,
    original_price: product?.original_price || null,
    rating: product?.rating || 4.5,
    reviews: product?.reviewCount || 128,
    image: product?.image || '',
    hover_image: product?.hover_image || '',
    description: product?.description || 'Produit officiel KPOP de haute qualité',
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    inStock: product?.stock > 0 ? true : false,
    stockQuantity: product?.stock || 0,
    material: product?.material || 'Matière premium',
    careInstructions: product?.careInstructions || 'Lavage à l\'eau froide',
    brand: product?.brand || 'KPOP Official',
  };

  const discount = productDetails.original_price 
    ? Math.round(((productDetails.original_price - productDetails.price) / productDetails.original_price) * 100)
    : 0;

  const getSizeStock = (size) => {
    const sizeData = productDetails.sizes?.find(s => s.size === size);
    return sizeData?.stock || 0;
  };

  const getColorStock = (color) => {
    const colorData = productDetails.colors?.find(c => c.color_name === color);
    return colorData?.stock || 0;
  };

  const isVariantAvailable = () => {
    if (!productDetails.inStock) return false;
    if (!productDetails.sizes || productDetails.sizes.length === 0) {
      return productDetails.stockQuantity > 0;
    }
    if (selectedSize && getSizeStock(selectedSize) <= 0) return false;
    if (selectedColor && getColorStock(selectedColor) <= 0) return false;
    return true;
  };

  const handleAddToCart = () => {
    if (productDetails.sizes?.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    if (productDetails.colors?.length > 0 && !selectedColor) {
      alert('Veuillez sélectionner une couleur');
      return;
    }
    if (!isVariantAvailable()) {
      alert('Désolé, cette variante n\'est pas disponible');
      return;
    }

    addToCart(product, {
      quantity,
      size: selectedSize || 'Unique',
      color: selectedColor || 'Défaut',
      notes,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        {/* Breadcrumb - Responsive: 11px, 13px, 14px */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mb-6 sm:mb-8">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition">Accueil</a>
          <span className="text-gray-400">/</span>
          <a href="/shop" className="text-gray-600 hover:text-gray-900 transition">Boutique</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold truncate">{productDetails.name}</span>
        </div>

        {/* MAIN GRID: 1 col mobile, 3 cols tablet, 2 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Images */}
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
            
            {/* Main Image - Magic Numbers: responsive radius */}
            <div className="aspect-square bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center relative group w-full">
              <img
                src={mainImage || productDetails.image}
                alt={productDetails.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {discount > 0 && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails - Magic Numbers: 64px (mobile), 80px (tablet), 96px (desktop) */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setMainImage(productDetails.image)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                  mainImage === productDetails.image ? 'border-pink-500 shadow-md' : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                <img src={productDetails.image} alt="Vue 1" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </button>
              
              {productDetails.hover_image && (
                <button
                  onClick={() => setMainImage(productDetails.hover_image)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    mainImage === productDetails.hover_image ? 'border-pink-500 shadow-md' : 'border-gray-300 hover:border-pink-300'
                  }`}
                >
                  <img src={productDetails.hover_image} alt="Vue 2" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            
            {/* Title & Rating - Magic Numbers: 24px, 28px, 36px, 42px */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                {productDetails.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm sm:text-base ${i < Math.floor(productDetails.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {productDetails.rating} ({productDetails.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price - Magic Numbers: 24px, 28px, 36px, 48px */}
            <div className="flex items-baseline gap-2 sm:gap-3 py-2 sm:py-3 border-y border-gray-200">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {productDetails.price.toFixed(2)}€
              </span>
              {productDetails.original_price && (
                <>
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    {productDetails.original_price.toFixed(2)}€
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-red-600 ml-1 sm:ml-2">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-xs sm:text-sm">
              {productDetails.inStock ? (
                <span className="text-green-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {productDetails.stockQuantity} en stock
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Indisponible
                </span>
              )}
            </div>

            {/* COULEUR - Horizontal Layout */}
            {productDetails.colors?.length > 0 && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                  Couleur
                </label>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {productDetails.colors.map((colorObj) => {
                    const color_name = colorObj.color_name;
                    const color_hex = colorObj.color_hex || '#cccccc';
                    const stock = colorObj.stock || 0;
                    const hasStock = stock > 0;
                    
                    return (
                      <button
                        key={color_name}
                        onClick={() => setSelectedColor(color_name)}
                        disabled={!hasStock}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 ${
                          selectedColor === color_name
                            ? 'bg-pink-600 text-white border-2 border-pink-600 shadow-md'
                            : hasStock
                            ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                        title={`${color_name}${hasStock ? ` (${stock} en stock)` : ' - rupture'}`}
                      >
                        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-400" style={{ backgroundColor: color_hex }} />
                        <span className="hidden sm:inline">{color_name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAILLE - Horizontal Responsive Grid - Magic Numbers: 3 cols, 4 cols, 5 cols */}
            {productDetails.sizes?.length > 0 && (
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                  Taille
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                  {productDetails.sizes.map((sizeObj) => {
                    const size = sizeObj.size;
                    const stock = sizeObj.stock || 0;
                    const hasStock = stock > 0;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`py-2 sm:py-2.5 px-2 rounded-lg font-bold transition-all text-xs sm:text-sm flex flex-col items-center justify-center ${
                          selectedSize === size
                            ? 'bg-pink-600 text-white border-2 border-pink-600 shadow-md'
                            : hasStock
                            ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                        }`}
                        title={`Taille ${size}${hasStock ? ` - ${stock} en stock` : ' - rupture'}`}
                      >
                        <span>{size}</span>
                        {hasStock && <span className="text-xs opacity-60">({stock})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITÉ + BOUTONS ACTION - Horizontal Layout - Magic Numbers: 32px, 40px buttons */}
            <div className="flex gap-2 sm:gap-3 items-end">
              
              {/* Quantity Selector */}
              <div className="flex-shrink-0">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Qty</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!productDetails.inStock}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-sm sm:text-base font-semibold w-8 sm:w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(productDetails.stockQuantity, quantity + 1))}
                    disabled={!productDetails.inStock}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button - Magic Numbers: 48px, 56px, 64px height */}
              <button
                onClick={handleAddToCart}
                disabled={!isVariantAvailable()}
                className={`flex-1 py-2 sm:py-2.5 lg:py-3 px-3 sm:px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                  isAdded
                    ? 'bg-green-500 text-white shadow-lg'
                    : isVariantAvailable()
                    ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Ajouté !</span>
                    <span className="sm:hidden">OK</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden md:inline">Ajouter au panier</span>
                    <span className="md:hidden">Ajouter</span>
                  </>
                )}
              </button>

              {/* Favorite Button - Magic Numbers: 32px, 40px, 48px */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-600 transition flex-shrink-0"
                title="Ajouter aux favoris"
              >
                <Heart size={16} className={`sm:w-5 sm:h-5 ${isFavorite ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}`} />
              </button>

              {/* Share Button */}
              <button className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-600 transition flex-shrink-0" title="Partager">
                <Share2 size={16} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-2.5 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm text-blue-900 font-semibold flex items-center gap-2">
                <span>📦</span>
                <span><strong>Livraison gratuite</strong> à partir de 50€</span>
              </p>
              <p className="text-xs sm:text-sm text-blue-900 flex items-center gap-2">
                <span>✓</span>
                <span><strong>30 jours</strong> satisfait ou remboursé</span>
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Notes <span className="font-normal text-gray-500">(optionnel)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!productDetails.inStock}
                placeholder="Ex: Offert, emballage cadeau..."
                className="w-full h-16 sm:h-20 p-2 sm:p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 resize-none disabled:opacity-50 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* PRODUCT INFO SECTION - Below Main Grid */}
        <div className="mt-8 sm:mt-10 lg:mt-16 border-t pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Description */}
            <div className="md:col-span-2">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">À propos</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6">
                {productDetails.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {productDetails.brand && (
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Marque</p>
                    <p className="text-sm font-semibold text-gray-900">{productDetails.brand}</p>
                  </div>
                )}
                {productDetails.material && (
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Matière</p>
                    <p className="text-sm font-semibold text-gray-900">{productDetails.material}</p>
                  </div>
                )}
                {productDetails.careInstructions && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Entretien</p>
                    <p className="text-sm font-semibold text-gray-900">{productDetails.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-bold text-green-900 mb-1">✓ OFFICIEL</p>
                <p className="text-xs text-green-700">100% authentique</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-bold text-blue-900 mb-1">🚚 LIVRAISON</p>
                <p className="text-xs text-blue-700">Préparation 24h</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-bold text-purple-900 mb-1">💬 SUPPORT</p>
                <p className="text-xs text-purple-700">Chat 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
