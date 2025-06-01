'use client';

import { useState } from 'react';
import ImageDisplay from '@/components/ImageDisplay';

export default function TestUploadPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customId, setCustomId] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!customId) {
      setError('Please enter an image ID');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Show preview
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);

      // Upload image
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', customId);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageId(data.id);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Test Image Upload</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image ID
          </label>
          <input
            type="text"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="Enter image ID (e.g., author-title)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isUploading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        )}

        {imageId && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Uploaded Image:</h2>
            <div className="h-64">
              <ImageDisplay 
                imageId={imageId}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Image ID: {imageId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 