'use client';
import React, { useRef, useState } from 'react';

export default function AddOfferScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setReceipt(file);
  };

  const handleVerify = async () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <form className="pb-24 px-4 pt-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Create New Offer</h2>
      <p className="text-gray-500 mb-4">List your item for sale</p>
      {/* Product Image */}
      <label className="block font-semibold mb-2">Product Image</label>
      <div
        className="w-full h-36 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 mb-4 cursor-pointer bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        {image ? (
          <img src={image} alt="Product" className="object-cover w-full h-full rounded-xl" />
        ) : (
          <>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 16v-4M12 8h.01" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#2563eb" strokeWidth="2"/></svg>
            <span className="text-sm mt-2">Tap to add product image</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      {/* Product Title */}
      <label className="block font-semibold mb-1">Product Title</label>
      <input type="text" placeholder="Enter product title" className="w-full mb-4 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
      {/* Description */}
      <label className="block font-semibold mb-1">Description</label>
      <textarea placeholder="Describe your product" className="w-full mb-4 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" rows={3} required />
      {/* Prices */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block font-semibold mb-1">Current Price</label>
          <div className="flex items-center rounded-xl border border-gray-200 px-2">
            <span className="text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" className="w-full px-2 py-3 bg-transparent focus:outline-none" required />
          </div>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Original Price</label>
          <div className="flex items-center rounded-xl border border-gray-200 px-2">
            <span className="text-gray-400">$</span>
            <input type="number" min="0" step="0.01" placeholder="0.00" className="w-full px-2 py-3 bg-transparent focus:outline-none" required />
          </div>
        </div>
      </div>
      {/* Purchase Date */}
      <label className="block font-semibold mb-1">Purchase Date</label>
      <input type="date" className="w-full mb-4 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
      {/* Location */}
      <label className="block font-semibold mb-1">Location</label>
      <input type="text" placeholder="Enter your location" className="w-full mb-4 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200" required />
      {/* Email Receipt */}
      <label className="block font-semibold mb-1">Email Receipt (.eml file)</label>
      <div
        className="w-full rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 mb-4 cursor-pointer bg-gray-50 py-6"
        onClick={() => receiptInputRef.current?.click()}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#2563eb" strokeWidth="2"/><path d="M3 7l9 6 9-6" stroke="#2563eb" strokeWidth="2"/></svg>
        <span className="text-sm mt-2">Upload receipt file</span>
        <input
          ref={receiptInputRef}
          type="file"
          accept=".eml"
          className="hidden"
          onChange={handleReceiptChange}
        />
        {receipt && <span className="text-xs text-blue-600 mt-1">{receipt.name}</span>}
      </div>
      <button
        type="button"
        className={`w-full mb-4 py-3 rounded-xl font-bold text-white text-lg shadow-md transition ${verifying ? 'bg-blue-300' : verified ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-700'}`}
        onClick={handleVerify}
        disabled={verifying || verified}
      >
        {verifying ? 'Verifying...' : verified ? 'Verified!' : 'Verify Receipt'}
      </button>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gray-200 text-gray-400 font-bold text-lg shadow-md cursor-not-allowed"
        disabled
      >
        Create Offer
      </button>
    </form>
  );
} 