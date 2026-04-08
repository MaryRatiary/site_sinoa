import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

export const ImageDropZone = ({ onImageSelected, preview, onRemove }) => {
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
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageSelected(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelected(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="h-24 sm:h-32 md:h-40 w-24 sm:w-32 md:w-40 object-cover rounded-lg" />
          <button
            onClick={() => onRemove()}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="py-4 sm:py-6">
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-600 mb-2 text-xs sm:text-sm">Glissez-déposez une image ici</p>
          <p className="text-gray-500 text-xs mb-3 sm:mb-4">ou</p>
          <label className="cursor-pointer">
            <span className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg inline-block text-xs sm:text-sm transition-colors">
              Sélectionner une image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};
