import React, { useState } from 'react';
import { Offer } from '@/lib/api/offers';

export default function OfferCard({
  offer,
  expanded = false,
  onExpand,
}: {
  offer: Offer;
  expanded?: boolean;
  onExpand?: () => void;
}) {
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = async () => {
    setBuying(true);
    setSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    setBuying(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 1200);
  };

  return (
    <div
      className={`rounded-2xl bg-white shadow-sm mb-4 overflow-hidden border border-gray-100 touch-manipulation transition-all duration-300 ${expanded ? 'ring-2 ring-blue-300' : ''}`}
      style={{ minHeight: 160 }}
    >
      <div className="relative w-full h-36 bg-gray-100 flex items-center justify-center">
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt={offer.title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 7v6l4 2"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
            <span className="text-xs mt-2">No image</span>
          </div>
        )}
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow">${offer.price}</span>
        <button
          className="absolute top-2 left-2 bg-white/80 rounded-full p-1 shadow border border-gray-200"
          onClick={onExpand}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          >
            <path d="M9 6l6 6-6 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg mb-1 text-gray-900 truncate">{offer.title}</div>
        <div className="text-gray-500 text-sm mb-2 truncate">{offer.description}</div>
        <div className="flex items-center text-xs text-gray-400 mb-1">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
          <span className="ml-1">{offer.location}</span>
        </div>
        {expanded && (
          <div className="mt-4">
            <div className="text-gray-700 text-sm mb-2">{offer.description}</div>
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-md active:scale-95 transition disabled:opacity-60 border-2 border-blue-600"
              onClick={handleBuy}
              disabled={buying || success}
            >
              {buying ? 'Processing...' : success ? 'Success!' : (
                <span className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path d="M12 7v5l3 2" stroke="white" strokeWidth="2"/></svg>
                  Buy with Worldcoin
                </span>
              )}
            </button>
            <div className="text-xs text-gray-400 text-center mt-2">Secure payment powered by Worldcoin verification</div>
          </div>
        )}
      </div>
    </div>
  );
} 