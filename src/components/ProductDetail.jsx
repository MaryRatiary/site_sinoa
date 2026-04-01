import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import { Heart, Share2, ShoppingCart, Check } from 'lucide-react';

const ProductDetail = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(product?.image || productDetails?.image || '');

  // Utiliser les données du produit du backend
  const productDetails = {
    name: product?.name || 'Produit KPOP',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || null,
    rating: product?.rating || 4.5,
    reviews: product?.reviewCount || 128,
    image: product?.image || '',
    hoverImage: product?.hoverImage || '',
    description: product?.description || 'Produit officiel KPOP de haute qualité',
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    inStock: product?.stock > 0 ? true : false,
    stockQuantity: product?.stock || 0,
    material: product?.material || 'Matière premium',
    careInstructions: product?.careInstructions || 'Lavage à l\'eau froide',
    brand: product?.brand || 'KPOP Official',
  };

  const discount = productDetails.originalPrice 
    ? Math.round(((productDetails.originalPrice - productDetails.price) / productDetails.originalPrice) * 100)
    : 0;

  // Vérifier si une taille/couleur a du stock
  const getSizeStock = (size) => {
    const sizeData = productDetails.sizes?.find(s => s.size === size);
    return sizeData?.stock || 0;
  };

  const getColorStock = (color) => {
    const colorData = productDetails.colors?.find(c => c.colorName === color);
    return colorData?.stock || 0;
  };

  // Vérifier si la variante est disponible
  const isVariantAvailable = () => {
    if (!productDetails.inStock) return false;
    
    // Si pas de tailles, vérifier juste le stock global
    if (!productDetails.sizes || productDetails.sizes.length === 0) {
      return productDetails.stockQuantity > 0;
    }
    
    // Si taille sélectionnée, vérifier son stock
    if (selectedSize && getSizeStock(selectedSize) <= 0) {
      return false;
    }
    
    // Si couleur sélectionnée, vérifier son stock
    if (selectedColor && getColorStock(selectedColor) <= 0) {
      return false;
    }
    
    return true;
  };

  const handleAddToCart = () => {
    // Validation
    if (productDetails.sizes && productDetails.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }

    if (productDetails.colors && productDetails.colors.length > 0 && !selectedColor) {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <a href="/" className="text-gray-600 hover:text-gray-900">Accueil</a>
          <span className="text-gray-400">/</span>
          <a href="/shop" className="text-gray-600 hover:text-gray-900">Boutique</a>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{productDetails.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center relative group">
              <img
                src={mainImage}
                alt={productDetails.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              <div 
                onClick={() => setMainImage(productDetails.image)}
                className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${mainImage === productDetails.image ? 'border-pink-500' : 'border-gray-300 hover:border-pink-300'}`}
              >
                <img
                  src={productDetails.image}
                  alt="Vue 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              {productDetails.hoverImage && (
                <div 
                  onClick={() => setMainImage(productDetails.hoverImage)}
                  className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${mainImage === productDetails.hoverImage ? 'border-pink-500' : 'border-gray-300 hover:border-pink-300'}`}
                >
                  <img
                    src={productDetails.hoverImage}
                    alt="Vue 2"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {productDetails.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(productDetails.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productDetails.rating} ({productDetails.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {productDetails.price.toFixed(2)}€
              </span>
              {productDetails.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {productDetails.originalPrice.toFixed(2)}€
                </span>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-sm text-gray-600">
              {productDetails.inStock ? (
                <span className="text-green-600 font-semibold">
                  ✓ {productDetails.stockQuantity} en stock
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Indisponible</span>
              )}
            </div>

            {/* Taille */}
            {productDetails.sizes && productDetails.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Taille
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {productDetails.sizes.map((sizeObj) => {
                    const size = sizeObj.size;
                    const stock = sizeObj.stock || 0;
                    const hasStock = stock > 0;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 relative ${
                          selectedSize === size
                            ? 'bg-pink-600 text-white border-2 border-pink-600'
                            : hasStock
                            ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-50'
                        }`}
                        title={hasStock ? `${stock} en stock` : 'Rupture de stock'}
                      >
                        {size}
                        {hasStock && <span className="text-xs block">({stock})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Couleur */}
            {productDetails.colors && productDetails.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Couleur
                </label>
                <div className="flex gap-3 flex-wrap">
                  {productDetails.colors.map((colorObj) => {
                    const colorName = colorObj.colorName;
                    const colorHex = colorObj.colorHex || '#cccccc';
                    const stock = colorObj.stock || 0;
                    const hasStock = stock > 0;
                    
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        disabled={!hasStock}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                          selectedColor === colorName
                            ? 'bg-pink-600 text-white border-2 border-pink-600'
                            : hasStock
                            ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-50'
                        }`}
                        title={hasStock ? `${stock} en stock` : 'Rupture de stock'}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colorHex }}
                        />
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantité
              </label>
              <div className="flex items-center gap-4 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!productDetails.inStock}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-pink-600 transition-colors disabled:opacity-50"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(productDetails.stockQuantity, quantity + 1))}
                  disabled={!productDetails.inStock}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-pink-600 transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Notes additionnelles (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={!productDetails.inStock}
                placeholder="Ex: Offert pour un anniversaire, emballage cadeau..."
                className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-600 resize-none disabled:opacity-50"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!isVariantAvailable()}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : isVariantAvailable()
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={20} />
                    Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </>
                )}
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-600 transition-colors"
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}
                />
              </button>

              <button className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-pink-600 transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-900 space-y-2">
                <p><strong>📦 Livraison gratuite à partir de 50€</strong></p>
                <p><strong>✓ 30 jours satisfait ou remboursé</strong></p>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="font-semibold text-lg text-gray-900">À propos du produit</h3>
              <p className="text-gray-600 leading-relaxed">{productDetails.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {productDetails.brand && (
                  <div>
                    <p className="text-sm text-gray-600">Marque</p>
                    <p className="font-semibold text-gray-900">{productDetails.brand}</p>
                  </div>
                )}
                {productDetails.material && (
                  <div>
                    <p className="text-sm text-gray-600">Matière</p>
                    <p className="font-semibold text-gray-900">{productDetails.material}</p>
                  </div>
                )}
                {productDetails.careInstructions && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Entretien</p>
                    <p className="font-semibold text-gray-900">{productDetails.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
