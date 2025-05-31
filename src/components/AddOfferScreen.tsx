'use client';
import { ISuccessResult, MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import React, { useRef, useState } from 'react';
import { parseAbiParameters } from 'viem';
import { decodeAbiParameters } from 'viem';
import abi2 from './Transaction/ItemManager.json';

const categories = [
  '',
  'Electronics',
  'Fashion',
  'Books',
  'Home',
  'Sports',
  'Other',
];

export default function AddOfferScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
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

  const connectWallet2 = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
  }

  const handleVerify = async () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  const addMockItem = async (title: string, description: string, category: string, timestamp: number, price: number, originalPrice: number, author: string) => {
    const { finalPayload: authPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
   
    const { finalPayload } = await MiniKit.commandsAsync.verify({
      action: 'test-action', // Make sure to create this in the developer portal -> incognito actions
      verification_level: VerificationLevel.Orb,
      signal: MiniKit.user.walletAddress,
    });

    const proof = finalPayload as ISuccessResult;



    console.log("address", MiniKit.user.walletAddress);

    const result = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: abi2,
          functionName: 'addItem',
          args: [
            title,
            author,
            BigInt(originalPrice * 1000000000000000000),
            BigInt(price * 1000000000000000000),
            description,
            BigInt(proof!.merkle_root),
            BigInt(proof!.nullifier_hash),
            decodeAbiParameters(
              parseAbiParameters('uint256[8]'),
              proof!.proof as `0x${string}`
            )[0]
          ],
        },
      ],
    })

    console.log("result", result);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get all form data
    const formData = {
      title,
      description,
      category,
      image,
      receipt,
      verified,
      price,
      originalPrice
    };

    console.log("formData", formData);
    // TODO: Add your form submission logic here

    await addMockItem(title, description, category, 0, price, originalPrice, MiniKit.user.walletAddress || '');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <button onClick={connectWallet2}>Connect Wallet 2</button>
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 flex items-center px-4 py-4 mb-4">
        <button className="mr-2 p-2 rounded-full hover:bg-gray-100 transition">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Add New Offer</h2>
      </header>
      <form className="max-w-md mx-auto space-y-4 px-4" onSubmit={handleSubmit}>
        {/* Product Image */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Product Image</label>
          <div
            className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} alt="Product" className="object-cover w-full h-full rounded-2xl" />
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="rounded-full border-2 border-gray-300 bg-white p-2 mb-2">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 16v-4M12 8h.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="#6b7280" strokeWidth="2"/></svg>
                  </div>
                  <span className="text-base font-medium text-gray-400">Tap to upload image</span>
                </div>
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
        </section>
        
        {/* Product Details */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Product Details</label>
          <div className="mb-3">
            <label className="block font-bold mb-1">Product Title</label>
            <input 
              type="text" 
              placeholder="Enter product title" 
              className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block font-bold mb-1">Description</label>
            <textarea 
              placeholder="Describe your product" 
              className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
              rows={3} 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block font-bold mb-1">Category</label>
            <div className="relative">
              <select
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 appearance-none pr-10 text-gray-700"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => <option key={cat} value={cat} disabled={cat === ''}>{cat === '' ? 'Select category' : cat}</option>)}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
        </section>
        
        {/* Pricing Information */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <label className="block font-extrabold text-lg mb-3">Pricing Information</label>
          <div className="flex gap-4 mb-3">
            <div className="flex-1">
              <label className="block font-bold mb-1">Current Price</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
                required 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-1">Original Price</label>
              <input 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50 placeholder:text-gray-300" 
                required 
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mb-0">
            <label className="block font-bold mb-1">Purchase Date</label>
            <input type="date" className="w-full rounded-xl border border-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50" required />
          </div>
        </section>
        
        {/* Receipt Verification */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4 mb-4">
          <label className="block font-extrabold text-lg mb-3">Receipt Verification</label>
          <div
            className="w-full rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 mb-4 cursor-pointer bg-gray-50 py-4 hover:bg-gray-100 transition"
            onClick={() => receiptInputRef.current?.click()}
          >
            <div className="rounded-full border-2 border-gray-300 bg-white p-1 mb-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 16v-4M12 8h.01" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M3 7l9 6 9-6" stroke="#6b7280" strokeWidth="2"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-400">Upload email receipt (.eml)</span>
            <input
              ref={receiptInputRef}
              type="file"
              accept=".eml"
              className="hidden"
              onChange={handleReceiptChange}
            />
            {receipt && <span className="text-xs text-gray-600 mt-1">{receipt.name}</span>}
          </div>
          <button
            type="button"
            className={`w-full mb-2 py-3 rounded-xl font-bold text-white text-lg shadow-md transition ${verifying ? 'bg-gray-300' : verified ? 'bg-green-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'}`}
            onClick={handleVerify}
            disabled={verifying || verified}
          >
            {verifying ? 'Verifying...' : verified ? 'Verified!' : 'Verify Receipt'}
          </button>
        </section>
        
        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-bold text-lg shadow-md hover:bg-gray-700 transition"
          onClick={handleSubmit}
        >
          Create Offer
        </button>
      </form>
    </div>
  );
}