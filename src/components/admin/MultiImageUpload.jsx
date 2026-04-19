import React, { useState } from 'react';
import { Upload, X, Trash2 } from 'lucide-react';

export const MultiImageUpload = ({ images, onImagesChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    processFiles(files);
  };

  const processFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImagesChange([
            ...images,
            {
              id: Date.now() + Math.random(),
              url: event.target.result,
              is_main_image: images.length === 0,
              is_hover_image: false,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    if (updatedImages.length > 0 && images.find((img) => img.id === id).is_main_image) {
      updatedImages[0].is_main_image = true;
    }
    onImagesChange(updatedImages);
  };

  const setMainImage = (id) => {
    const updatedImages = images.map((img) => ({
      ...img,
      is_main_image: img.id === id,
    }));
    onImagesChange(updatedImages);
  };

  const setHoverImage = (id) => {
    const updatedImages = images.map((img) => ({
      ...img,
      is_hover_image: img.id === id ? !img.is_hover_image : false,
    }));
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
          isDragging
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <div className="py-4 sm:py-6">
          <Upload className="mx-auto mb-2 text-gray-400" size={28} />
          <p className="text-gray-600 mb-2 text-xs sm:text-sm">Glissez-déposez les images ici</p>
          <p className="text-gray-500 text-xs mb-3 sm:mb-4">ou</p>
          <label className="cursor-pointer">
            <span className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg inline-block text-xs sm:text-sm transition-colors">
              Sélectionner des images
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              multiple
            />
          </label>
        </div>
      </div>

      {/* Images Gallery */}
      {images.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Images sélectionnées ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-600 transition-colors"
              >
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-20 sm:h-24 md:h-28 object-cover"
                />

                {/* Badge Principal */}
                {image.is_main_image && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Principale
                  </div>
                )}

                {/* Badge Hover */}
                {image.is_hover_image && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Hover
                  </div>
                )}

                {/* Overlay avec boutons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100">
                  {!image.is_main_image && (
                    <button
                      type="button"
                      onClick={() => setMainImage(image.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-1.5 sm:p-2 rounded-full transition-colors text-sm sm:text-base"
                      title="Définir comme image principale"
                    >
                      ⭐
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setHoverImage(image.id)}
                    className={`${
                      image.is_hover_image
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white p-1.5 sm:p-2 rounded-full transition-colors text-sm sm:text-base`}
                    title={image.is_hover_image ? 'Retirer du hover' : 'Définir comme image hover'}
                  >
                    👁️
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-blue-700">
            <p className="font-semibold mb-2">💡 Conseils :</p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>La première image sera l'image principale</li>
              <li>Vous pouvez définir une image pour le hover (survolé)</li>
              <li>Ajoutez autant d'images que vous voulez</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
