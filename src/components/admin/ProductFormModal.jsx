import { useState, useEffect } from 'react';
import { X, Upload, Trash2, ImageIcon, Plus, Palette } from 'lucide-react';
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
    material: '',
    brand: '',
    careInstructions: '',
  });

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newSize, setNewSize] = useState({ size: '', stock: '' });
  const [newColor, setNewColor] = useState({ colorName: '', colorHex: '#000000', stock: '' });
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
        originalPrice: product.originalPrice || product.originalprice || '',
        categoryId: product.categoryId || product.categoryid || '',
        stock: product.stock || '',
        material: product.material || '',
        brand: product.brand || '',
        careInstructions: product.careInstructions || product.careinstructions || '',
      });

      // Normaliser les tailles
      const normalizedSizes = (product.sizes || []).map(s => ({
        id: s.id,
        size: s.size || s,
        stock: s.stock || 0
      }));
      setSizes(normalizedSizes);

      // Normaliser les couleurs
      const normalizedColors = (product.colors || []).map(c => ({
        id: c.id,
        colorName: c.colorName || c.colorname || c.name || '',
        colorHex: c.colorHex || c.colorhex || c.hex || '#000000',
        stock: c.stock || 0
      }));
      setColors(normalizedColors);

      // Normaliser les images - gérer les deux formats : array d'URLs ou array d'objets
      const normalizedImages = (product.images || []).map((img, idx) => {
        if (typeof img === 'string') {
          // Si c'est une URL directe
          return {
            imageUrl: img,
            isMainImage: idx === 0,
            isHoverImage: false,
            isNew: false
          };
        } else {
          // Si c'est déjà un objet
          return {
            ...img,
            imageUrl: img.imageUrl || img.url || '',
            isMainImage: img.isMainImage || idx === 0,
            isHoverImage: img.isHoverImage || false,
            isNew: false
          };
        }
      });
      setImages(normalizedImages);

      setError('');
      setNewSize({ size: '', stock: '' });
      setNewColor({ colorName: '', colorHex: '#000000', stock: '' });
    } else if (!product && isOpen) {
      // Réinitialiser pour un nouveau produit
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        categoryId: '',
        stock: '',
        material: '',
        brand: '',
        careInstructions: '',
      });
      setSizes([]);
      setColors([]);
      setImages([]);
      setError('');
      setNewSize({ size: '', stock: '' });
      setNewColor({ colorName: '', colorHex: '#000000', stock: '' });
    }
  }, [product, isOpen]);

  // Gestion des tailles
  const handleAddSize = () => {
    if (newSize.size && newSize.stock) {
      setSizes([...sizes, { ...newSize, stock: parseInt(newSize.stock) }]);
      setNewSize({ size: '', stock: '' });
    }
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleUpdateSizeStock = (index, stock) => {
    const updated = [...sizes];
    updated[index].stock = parseInt(stock) || 0;
    setSizes(updated);
  };

  // Gestion des couleurs
  const handleAddColor = () => {
    if (newColor.colorName && newColor.colorHex && newColor.stock) {
      setColors([...colors, { ...newColor, stock: parseInt(newColor.stock) }]);
      setNewColor({ colorName: '', colorHex: '#000000', stock: '' });
    }
  };

  const handleRemoveColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleUpdateColorStock = (index, stock) => {
    const updated = [...colors];
    updated[index].stock = parseInt(stock) || 0;
    setColors(updated);
  };

  // Gestion des images
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
        sizes: sizes.map(s => ({
          size: s.size,
          stock: parseInt(s.stock) || 0
        })),
        colors: colors.map(c => ({
          name: c.colorName,
          hex: c.colorHex,
          stock: parseInt(c.stock) || 0
        })),
      };

      if (product?.id) {
        // Mettre à jour le produit
        await productsAPI.update(product.id, data);
        
        // Ajouter/mettre à jour les images
        for (const img of images) {
          // Si c'est une nouvelle image (Base64 ou URL), l'ajouter
          if (img.isNew && img.imageUrl) {
            try {
              await productsAPI.addImage(product.id, {
                imageUrl: img.imageUrl,
                isMainImage: img.isMainImage || false,
                isHoverImage: img.isHoverImage || false,
              });
            } catch (imgErr) {
              console.warn(`Erreur lors de l'ajout de l'image: ${imgErr.message}`);
            }
          }
        }
      } else {
        // Créer un nouveau produit
        const newProduct = await productsAPI.create(data);
        
        // Ajouter les images au nouveau produit
        for (const img of images) {
          if (img.imageUrl) {
            try {
              await productsAPI.addImage(newProduct.id, {
                imageUrl: img.imageUrl,
                isMainImage: img.isMainImage || false,
                isHoverImage: img.isHoverImage || false,
              });
            } catch (imgErr) {
              console.warn(`Erreur lors de l'ajout de l'image: ${imgErr.message}`);
            }
          }
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
      <div className="bg-white rounded-lg max-w-5xl w-full shadow-2xl my-8">
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
                placeholder="Nom du produit *"
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
                placeholder="Prix (€) *"
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
                type="text"
                placeholder="Marque"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              <input
                type="text"
                placeholder="Matière"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              <input
                type="number"
                placeholder="Stock général *"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />

              <textarea
                placeholder="Instructions d'entretien"
                value={formData.careInstructions}
                onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows="2"
              />
            </div>

            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              rows="3"
              required
            />
          </div>

          {/* Tailles */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tailles et Stock</h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Ex: S, M, L, XL"
                  value={newSize.size}
                  onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <input
                  type="number"
                  placeholder="Stock pour cette taille"
                  value={newSize.stock}
                  onChange={(e) => setNewSize({ ...newSize, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </div>

            {sizes.length > 0 ? (
              <div className="space-y-2">
                {sizes.map((size, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{size.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Stock:</label>
                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) => handleUpdateSizeStock(idx, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        min="0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucune taille ajoutée</p>
            )}
          </div>

          {/* Couleurs */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Palette size={20} />
              Couleurs et Stock
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Ex: Noir, Blanc, Rose"
                  value={newColor.colorName}
                  onChange={(e) => setNewColor({ ...newColor, colorName: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor.colorHex}
                    onChange={(e) => setNewColor({ ...newColor, colorHex: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    title="Sélectionner la couleur"
                  />
                  <input
                    type="text"
                    value={newColor.colorHex}
                    onChange={(e) => setNewColor({ ...newColor, colorHex: e.target.value })}
                    placeholder="#000000"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Stock"
                  value={newColor.stock}
                  onChange={(e) => setNewColor({ ...newColor, stock: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  min="0"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </div>

            {colors.length > 0 ? (
              <div className="space-y-2">
                {colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div
                      className="w-8 h-8 rounded border-2 border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.colorHex }}
                      title={color.colorHex}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{color.colorName}</p>
                      <p className="text-xs text-gray-500">{color.colorHex}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Stock:</label>
                      <input
                        type="number"
                        value={color.stock}
                        onChange={(e) => handleUpdateColorStock(idx, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        min="0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucune couleur ajoutée</p>
            )}
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
                    <img
                      src={img.imageUrl}
                      alt={`Product ${index}`}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/160x160?text=Erreur';
                      }}
                    />

                    {img.isMainImage && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold">
                        PRINCIPALE
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {!img.isMainImage && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(index)}
                          className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-bold hover:bg-purple-700 transition whitespace-nowrap"
                        >
                          Principale
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
