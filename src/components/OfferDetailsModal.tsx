'use client';
import React, { useState } from 'react';
import { Offer } from '@/lib/api/offers';
import OfferDetailsContent from './OfferDetailsContent';

export default function OfferDetailsModal({
  offer,
  open,
  onClose,
}: {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
}) {
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open || !offer) return null;

  const handleBuy = async () => {
    setBuying(true);
    setSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    setBuying(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-white/5 backdrop-blur-3xl">
      <div className="w-full max-w-xs rounded-2xl bg-white p-4 pt-10 shadow-2xl relative animate-fade-in" style={{ minWidth: 0 }}>
        <button
          className="absolute top-3 right-4 text-gray-400 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <OfferDetailsContent
          offer={offer}
          onBuy={handleBuy}
          buying={buying}
          success={success}
        />
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.18s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
} 