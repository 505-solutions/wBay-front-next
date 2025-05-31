'use client';
import React from 'react';
import { Offer } from '@/lib/api/offers';

export default function OfferDetailsContent({
  offer,
  onBuy,
  buying,
  success,
}: {
  offer: Offer;
  onBuy: () => void;
  buying: boolean;
  success: boolean;
}) {
  return (
    <>
      <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative">
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt={offer.title} className="object-cover w-full h-full" />
        ) : (
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 7v6l4 2"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
        )}
        <span className="absolute top-4 right-4 bg-blue-600 text-white text-lg font-bold px-4 py-2 rounded-full shadow">${offer.price}</span>
      </div>
      <div className="font-bold text-xl mb-1 text-gray-900">{offer.title}</div>
      <div className="text-gray-500 mb-2">{offer.description}</div>
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
        <span className="ml-1">{offer.location}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400 line-through">${offer.originalPrice}</span>
        <span className="text-green-600 font-semibold">{offer.discount}% off</span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1 text-yellow-500 font-medium">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          {offer.rating}
        </span>
      </div>
      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-md active:scale-95 transition disabled:opacity-60 border-2 border-blue-600"
        onClick={onBuy}
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
    </>
  );
} 