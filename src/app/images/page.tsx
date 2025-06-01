'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ImageDisplay from '@/components/ImageDisplay';
import { getImageUrl } from '@/utils/images';

interface ImageData {
  id: string;
  contentType: string;
  createdAt: string;
}

export default function ImagesPage() {
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadComplete = (imageId: string) => {
    setUploadedImageId(imageId);
    setError(null);
    fetchImages(); // Refresh the image list after upload
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Image Upload</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <ImageUpload
          id={`image-${Date.now()}`}
          onUploadComplete={handleUploadComplete}
          onError={(error) => {
            setError(error);
            setUploadedImageId(null);
          }}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {uploadedImageId && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Uploaded Image:</h2>
            <ImageDisplay imageId={uploadedImageId} />
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Images</h2>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : images.length === 0 ? (
          <p className="text-gray-500 text-center">No images uploaded yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <div className="h-48">
                  <ImageDisplay imageId={image.id} className="h-full object-cover" />
                </div>
                <div className="p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 