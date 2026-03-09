import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Heart, Share2, ShoppingCart, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsAPI } from '../services/api';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullProduct, setFullProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const completeProduct = await productsAPI.getById(product.id);
        setFullProduct(completeProduct);
      } catch (err) {
        console.error('Erreur chargement produit:', err);
        setFullProduct(product);
      } finally {
        setLoading(false);
      }
    };

    if (product?.id) {
      loadProductDetails();
    }
  }, [product?.id]);

  if (loading || !fullProduct) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8">
            <p className="text-lg font-semibold">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  const productDetails = {
    name: fullProduct.name || 'Produit KPOP',
    price: parseFloat(fullProduct.price) || 0,
    originalPrice: parseFloat(fullProduct.originalprice || fullProduct.originalPrice) || null,
    rating: fullProduct.rating || 4.5,
    reviews: fullProduct.reviews || 0,
    image: fullProduct.image || '',
    images: (fullProduct.images && Array.isArray(fullProduct.images)) ? fullProduct.images.filter(img => img) : [fullProduct.image || ''],
    description: fullProduct.description || 'Produit officiel KPOP de haute qualité',
    sizes: (fullProduct.sizes && Array.isArray(fullProduct.sizes)) ? fullProduct.sizes : [],
    colors: (fullProduct.colors && Array.isArray(fullProduct.colors)) ? fullProduct.colors : [],
    inStock: fullProduct.stock > 0,
    stockQuantity: fullProduct.stock || 0,
    material: fullProduct.material || '',
    brand: fullProduct.brand || '',
    careInstructions: fullProduct.careinstructions || fullProduct.careInstructions || '',
  };

  const discount = productDetails.originalPrice 
    ? Math.round(((productDetails.originalPrice - productDetails.price) / productDetails.originalPrice) * 100)
    : 0;

  const allImages = productDetails.images.filter(img => img);
  const currentImage = allImages[currentImageIndex] || productDetails.image;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (productDetails.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }

    addToCart(
      product,
      quantity,
      selectedSize,
      selectedColor
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 bg-white"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                    <img
                      src={currentImage}
                      alt={productDetails.name}
                      className="w-full h-full object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{discount}%
                      </div>
                    )}

                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                        >
                          <ChevronLeft size={20} className="text-gray-800" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                        >
                          <ChevronRight size={20} className="text-gray-800" />
                        </button>
                      </>
                    )}
                  </div>

                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? 'border-pink-600 ring-2 ring-pink-600'
                              : 'border-gray-300 hover:border-pink-400'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Vue ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {allImages.length > 1 && (
                    <div className="text-center text-xs text-gray-500">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {productDetails.name}
                    </h2>
                    {productDetails.brand && (
                      <p className="text-xs text-gray-500 mb-2">
                        Marque: <span className="font-semibold">{productDetails.brand}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(productDetails.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">
                        {productDetails.rating} ({productDetails.reviews} avis)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {productDetails.price.toFixed(2)}€
                    </span>
                    {productDetails.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {productDetails.originalPrice.toFixed(2)}€
                      </span>
                    )}
                  </div>

                  <div className="text-xs">
                    {productDetails.inStock ? (
                      <span className="text-green-600 font-semibold">
                        ✓ {productDetails.stockQuantity} en stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Indisponible</span>
                    )}
                  </div>

                  {productDetails.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {productDetails.description}
                    </p>
                  )}

                  {productDetails.sizes && productDetails.sizes.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        Taille * <span className="text-gray-500 font-normal">(sélectionnez une taille)</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {productDetails.sizes.map((sizeObj) => {
                          const sizeValue = sizeObj.size || sizeObj;
                          const sizeStock = sizeObj.stock || 0;
                          const isAvailable = sizeStock > 0;
                          return (
                            <div key={sizeValue} className="relative">
                              <button
                                onClick={() => isAvailable && setSelectedSize(sizeValue)}
                                disabled={!isAvailable}
                                className={`w-full py-2 px-2 rounded text-xs font-semibold transition-all duration-200 ${
                                  selectedSize === sizeValue
                                    ? 'bg-pink-600 text-white border-2 border-pink-600'
                                    : isAvailable
                                    ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                                }`}
                              >
                                {sizeValue}
                              </button>
                              {!isAvailable && (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-gray-500 font-bold whitespace-nowrap pointer-events-none">
                                  Rupture
                                </span>
                              )}
                              {isAvailable && sizeStock > 0 && sizeStock <= 3 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 rounded-full font-bold">
                                  {sizeStock}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {productDetails.colors && productDetails.colors.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        Couleur <span className="text-gray-500 font-normal">(optionnel)</span>
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {productDetails.colors.map((colorObj) => {
                          const colorName = colorObj.colorname || colorObj.name || colorObj;
                          const colorHex = colorObj.colorhex || colorObj.hex || '#000000';
                          const colorStock = colorObj.stock || 0;
                          const isAvailable = colorStock > 0;
                          return (
                            <div key={colorName} className="relative">
                              <button
                                onClick={() => isAvailable && setSelectedColor(colorName)}
                                disabled={!isAvailable}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                                  selectedColor === colorName
                                    ? 'bg-pink-600 text-white border-2 border-pink-600'
                                    : isAvailable
                                    ? 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:border-pink-600 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full border-2 ${
                                    isAvailable ? 'border-gray-400' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: isAvailable ? colorHex : '#d1d5db' }}
                                />
                                {colorName}
                              </button>
                              {!isAvailable && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] px-1 rounded-full font-bold">
                                  Rupture
                                </span>
                              )}
                              {isAvailable && colorStock > 0 && colorStock <= 3 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 rounded-full font-bold">
                                  {colorStock}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                      Quantité
                    </label>
                    <div className="flex items-center gap-3 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 border-2 border-gray-300 rounded hover:border-pink-600 transition-colors flex items-center justify-center text-sm"
                      >
                        −
                      </button>
                      <span className="font-semibold w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(productDetails.stockQuantity, quantity + 1))}
                        className="w-8 h-8 border-2 border-gray-300 rounded hover:border-pink-600 transition-colors flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Emballage cadeau, anniversaire..."
                      className="w-full h-14 p-2 border-2 border-gray-300 rounded text-xs focus:outline-none focus:border-pink-600 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={!productDetails.inStock}
                      className={`flex-1 py-2 px-4 rounded font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                        isAdded
                          ? 'bg-green-500 text-white'
                          : productDetails.inStock
                          ? 'bg-pink-600 text-white hover:bg-pink-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} />
                          Ajouté
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          Ajouter
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:border-pink-600 transition-colors"
                    >
                      <Heart
                        size={16}
                        className={isFavorite ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}
                      />
                    </button>

                    <button className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:border-pink-600 transition-colors">
                      <Share2 size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {(productDetails.material || productDetails.careInstructions) && (
                    <div className="border-t pt-3 mt-3">
                      <div className="space-y-2">
                        {productDetails.material && (
                          <div className="text-xs">
                            <p className="text-gray-600">Matière:</p>
                            <p className="font-semibold text-gray-800">{productDetails.material}</p>
                          </div>
                        )}
                        {productDetails.careInstructions && (
                          <div className="text-xs">
                            <p className="text-gray-600">Entretien:</p>
                            <p className="font-semibold text-gray-800">{productDetails.careInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailModal;