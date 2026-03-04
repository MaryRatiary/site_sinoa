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
              isMainImage: images.length === 0,
              isHoverImage: false,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    // Si c'était l'image principale, désigner la première comme principale
    if (updatedImages.length > 0 && images.find((img) => img.id === id).isMainImage) {
      updatedImages[0].isMainImage = true;
    }
    onImagesChange(updatedImages);
  };

  const setMainImage = (id) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isMainImage: img.id === id,
    }));
    onImagesChange(updatedImages);
  };

  const setHoverImage = (id) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isHoverImage: img.id === id ? !img.isHoverImage : false,
    }));
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-purple-600 bg-purple-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        <div className="py-6">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600 mb-2">Glissez-déposez les images ici</p>
          <p className="text-gray-500 text-sm mb-4">ou</p>
          <label className="cursor-pointer">
            <span className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg inline-block">
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
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Images sélectionnées ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-600 transition-colors"
              >
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-24 object-cover"
                />

                {/* Badge Principal */}
                {image.isMainImage && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Principale
                  </div>
                )}

                {/* Badge Hover */}
                {image.isHoverImage && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Hover
                  </div>
                )}

                {/* Overlay avec boutons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!image.isMainImage && (
                    <button
                      type="button"
                      onClick={() => setMainImage(image.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full tooltip"
                      title="Définir comme image principale"
                    >
                      ⭐
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setHoverImage(image.id)}
                    className={`${
                      image.isHoverImage
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white p-2 rounded-full tooltip`}
                    title={image.isHoverImage ? 'Retirer du hover' : 'Définir comme image hover'}
                  >
                    👁️
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p className="font-semibold mb-1">💡 Conseils :</p>
            <ul className="list-disc list-inside space-y-1">
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
