'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/utils/images';

interface ImageDisplayProps {
  imageId: string;
  className?: string;
}

export default function ImageDisplay({ imageId, className = '' }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkImage = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/images/${imageId}`);
        if (!response.ok) {
          throw new Error('Image not found');
        }
        setError(null);
      } catch (err) {
        setError('Failed to load image');
      } finally {
        setIsLoading(false);
      }
    };

    checkImage();
  }, [imageId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-placeholder" style={{
        height: '200px',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div className="placeholder-content" style={{
          width: '80px',
          height: '80px', 
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="placeholder-icon" style={{
            fontSize: '24px'
          }}>📱</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(imageId)}
      alt={`Image ${imageId}`}
      className={`w-full h-auto rounded-lg ${className}`}
    />
  );
} 