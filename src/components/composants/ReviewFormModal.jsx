import React, { useState } from 'react';
import { X, Upload, Star, AlertCircle } from 'lucide-react';
import { reviewsAPI } from '../../services/api';

export const ReviewFormModal = ({ product_id, category_name, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    rating: 5,
    title: '',
    content: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const MAX_IMAGES = 3;
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = MAX_IMAGES - images.length;
    
    if (files.length > availableSlots) {
      setError(`Vous pouvez ajouter maximum ${availableSlots} image(s) de plus`);
      return;
    }

    let validFiles = [];
    let hasError = false;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`L'image "${file.name}" dépasse 1MB`);
        hasError = true;
        break;
      }
      validFiles.push(file);
    }

    if (hasError) return;

    // Créer les previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.author.trim() || !formData.email.trim() || !formData.title.trim() || !formData.content.trim()) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      // Convertir les images en base64
      const base64Images = [];
      for (const preview of imagePreviews) {
        base64Images.push(preview);
      }

      const reviewData = {
        author: formData.author.trim(),
        email: formData.email.trim(),
        rating: parseInt(formData.rating),
        title: formData.title.trim(),
        content: formData.content.trim(),
        images: base64Images,
        category_name: category_name
      };

      const response = await reviewsAPI.createReview(product_id, reviewData);

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-[#5E2251] to-[#8B3A62] text-white p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold">Écrire un avis</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4">
            <p className="text-green-800 font-semibold">✓ Votre avis a été envoyé avec succès!</p>
            <p className="text-green-700 text-sm">Merci pour votre retour.</p>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 flex gap-2">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Erreur</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {/* RATING */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Note *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Votre nom *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E2251]"
              placeholder="Ex: Marie D."
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Votre email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E2251]"
              placeholder="votre@email.com"
            />
          </div>

          {/* CONTENT AND IMAGES - HORIZONTAL LAYOUT */}
          <div className="grid grid-cols-4 gap-4 h-[130px]">
            
            {/* IMAGES ON THE LEFT - 1 column */}
            <div className="col-span-1 flex flex-col">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Photos ({images.length}/{MAX_IMAGES})
              </label>

              {/* UPLOAD ZONE */}
              {images.length < MAX_IMAGES && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:border-[#5E2251] hover:bg-purple-50 transition-colors flex-1">
                  <Upload size={16} className="text-gray-400 mb-0.5" />
                  <p className="text-xs font-medium text-gray-700 text-center leading-tight">Ajouter</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={images.length >= MAX_IMAGES}
                    className="hidden"
                  />
                </label>
              )}

              {/* PREVIEW VERTICAL STACK */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-col gap-1 overflow-y-auto">
                  {imagePreviews.slice(0, 3).map((preview, idx) => (
                    <div key={idx} className="relative group flex-shrink-0">
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-[40px] object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CONTENT ON THE RIGHT - 3 columns */}
            <div className="col-span-3 flex flex-col gap-2">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E2251]"
                  placeholder="Ex: Excellent!"
                  maxLength="100"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-semibold text-gray-900 mb-1">
                  Avis *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E2251] resize-none overflow-y-auto"
                  placeholder="Partagez votre expérience..."
                  maxLength="1000"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.content.length}/1000</p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
                loading || success
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#5E2251] hover:bg-[#7a2d64]'
              }`}
            >
              {loading ? 'Envoi...' : success ? 'Avis envoyé! ✓' : 'Publier l\'avis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
