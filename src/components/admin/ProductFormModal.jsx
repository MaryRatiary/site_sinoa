import { useState, useEffect } from 'react';
import { X, Upload, Trash2, ImageIcon } from 'lucide-react';
import { productsAPI } from '../../services/api';

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  product, 
  categories, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    stock: '',
  });

  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mettre à jour les données quand le produit change
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        categoryId: product.categoryId || '',
        stock: product.stock || '',
      });
      setImages(product.images || []);
      setError('');
    } else if (!product && isOpen) {
      // Réinitialiser pour un nouveau produit
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        categoryId: '',
        stock: '',
      });
      setImages([]);
      setError('');
    }
  }, [product, isOpen]);

  const handleImageUrlAdd = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { 
        imageUrl: newImageUrl, 
        isMainImage: images.length === 0,
        isNew: true 
      }]);
      setNewImageUrl('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, { 
          imageUrl: reader.result, 
          isMainImage: images.length === 0,
          isNew: true 
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetMainImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isMainImage: i === index,
      isHoverImage: false
    }));
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const data = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      };

      if (product?.id) {
        await productsAPI.update(product.id, data);
        
        // Ajouter les nouvelles images
        for (const img of images) {
          if (img.isNew || !img.id) {
            await productsAPI.addImage(product.id, {
              imageUrl: img.imageUrl,
              isMainImage: img.isMainImage,
              isHoverImage: img.isHoverImage || false,
            });
          }
        }
      } else {
        const newProduct = await productsAPI.create(data);
        
        // Ajouter les images au nouveau produit
        for (const img of images) {
          await productsAPI.addImage(newProduct.id, {
            imageUrl: img.imageUrl,
            isMainImage: img.isMainImage,
            isHoverImage: img.isHoverImage || false,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">
            {product?.id ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-start gap-2">
              <X size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Infos Produit */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations du Produit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />

              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Prix (€)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                step="0.01"
                required
              />

              <input
                type="number"
                placeholder="Prix original (€)"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                step="0.01"
              />

              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              rows="3"
            />
          </div>

          {/* Images Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon size={20} />
              Gestion des Images
            </h3>

            {/* Ajouter des images */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Collez une URL d'image"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Ajouter URL
                </button>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-600 hover:bg-purple-50 transition"
                >
                  <Upload size={20} className="text-purple-600" />
                  <span className="text-purple-600 font-medium">Uploader une image</span>
                </label>
              </div>
            </div>

            {/* Galerie d'images */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                      img.isMainImage
                        ? 'border-purple-600 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={img.imageUrl}
                      alt={`Product ${index}`}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/160x160?text=Erreur';
                      }}
                    />

                    {/* Badge Principal */}
                    {img.isMainImage && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold">
                        PRINCIPALE
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {!img.isMainImage && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(index)}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-bold hover:bg-purple-700 transition whitespace-nowrap"
                        >
                          Définir principale
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">Aucune image ajoutée</p>
                <p className="text-gray-500 text-sm mt-1">Ajoutez des images via URL ou en uploadant des fichiers</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          {product?.id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">ID Produit:</span> {product.id}
              </p>
            </div>
          )}
        </form>

        {/* Actions - Sticky Bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-2">
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </span>
            ) : (
              'Enregistrer'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-semibold transition-all"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
