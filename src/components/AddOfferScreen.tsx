'use client';
import { ISuccessResult, MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import React, { useRef, useState } from 'react';
import { parseAbiParameters } from 'viem';
import { decodeAbiParameters } from 'viem';
import abi2 from './Transaction/ItemManager.json';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>();
  const [originalPrice, setOriginalPrice] = useState<number>();
  const [purchaseDate, setPurchaseDate] = useState<string>('12/12/2024');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [, setImageUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verifyTransaction, setVerifyTransaction] = useState<string | null>(null);

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
    const response = await fetch('/api/eml');
    const data = await response.json();
    
    console.log("DATA", data);
    console.log("TRANSACTION HASH", data.message);

    setVerifyTransaction(data.message)
    // setVerifying(true);
    // setTimeout(() => {
    //   setVerifying(false);
    //   setVerified(true);
    // }, 1200);
  };

  const addItem = async (title: string, description: string, category: string, timestamp: number, price: number, originalPrice: number, author: string) => {
    // TODO: Implement this
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
    console.log("proof", proof);
    console.log("proof.merkle_root", proof.merkle_root);
    console.log("proof.nullifier_hash", proof.nullifier_hash);
    console.log("proof.proof", proof.proof);

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
    setIsSubmitting(true);

    if (!fileInputRef.current?.files?.[0]) {
      console.error('No image selected');
      setIsSubmitting(false);
      return;
    }

    if (!price || !originalPrice) {
      console.error('Price is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const file = fileInputRef.current.files[0];
      const author = MiniKit.user.walletAddress || '0x0f6652c713a946A80E519793B339A3Bc897730c3';
      const imageId = `${author}-${title}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      console.log("imageId", imageId);

      // Upload image
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', imageId);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setImageUrl(data.id);

      // Proceed with adding the item
      console.log("Adding item");
      console.log(title, description, category, 0, price, originalPrice, author);
      await addItem(title, description, category, 0, price, originalPrice, author);
      
      // Show success message
      setShowSuccess(true);
      console.log("Showing success message");

    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const testEml = async () => {
    const response = await fetch('/api/eml');
    const data = await response.json();
    console.log("data", data);
  }

  return (
    <div className="add-offer-screen">
      <header className="header">
        <h1 className="logo">wBay</h1>
        <button onClick={connectWallet2} className="connect-wallet-btn">Connect Wallet: {MiniKit.user.walletAddress}</button>
        <button onClick={testEml} className="connect-wallet-btn">Test EML</button>
      </header>

      <div className="content">
        
        <form className="form" onSubmit={handleSubmit}>
          {/* Product Image */}
          <section className="form-section">
            <label className="section-title">Product Image</label>
            <div className="image-upload" onClick={() => fileInputRef.current?.click()}>
              {image ? (
                <img src={image} alt="Product" className="uploaded-image" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <span>Tap to upload image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-input"
                onChange={handleImageChange}
              />
            </div>
          </section>
          
          {/* Product Details */}
          <section className="form-section">
            <label className="section-title">Product Details</label>
            <div className="input-group">
              <label className="input-label">Product Title</label>
              <input 
                type="text" 
                placeholder="Enter product title" 
                className="form-input"
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea 
                placeholder="Describe your product" 
                className="form-textarea"
                rows={3} 
                required 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <div className="select-wrapper">
                <select
                  className="form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  {categories.map(cat => <option key={cat} value={cat} disabled={cat === ''}>{cat === '' ? 'Select category' : cat}</option>)}
                </select>
                <span className="select-arrow">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </section>
          
          {/* Pricing Information */}
          <section className="form-section">
            <label className="section-title">Pricing Information</label>
            
            <div className="price-inputs">
              <div className="input-group">
                <label className="input-label">Current Price</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="form-input"
                  required 
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Original Price</label>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00" 
                  className="form-input"
                  required 
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Purchase Date</label>
              <input type="date" className="form-input date-input" required value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}/>
            </div>
          </section>
          
          {/* Receipt Verification */}
          <section className="form-section">
            <label className="section-title">Receipt Verification</label>
            <div className="receipt-upload" onClick={() => receiptInputRef.current?.click()}>
              <div className="upload-icon">📄</div>
              <span>Upload email receipt (.eml)</span>
              <input
                ref={receiptInputRef}
                type="file"
                accept=".eml"
                className="hidden-input"
                onChange={handleReceiptChange}
              />
              {receipt && <span className="file-name">{receipt.name}</span>}
            </div>
            <button
              type="button"
              className={`verify-button ${verifying ? 'verifying' : verified ? 'verified' : ''}`}
              onClick={handleVerify}
            >
              {verifying ? 'Verifying...' : verified ? 'Verified!' : 'Verify Receipt'}
            </button>
            {verifyTransaction && (
              <div className="verify-transaction">
                <span style={{ color: 'black' }}>
                  Transaction Hash:{' '}
                  <a 
                    href={`https://sepolia-optimism.etherscan.io/tx/${verifyTransaction}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {verifyTransaction}
                  </a>
                </span>
              </div>
            )}
          </section>

          {showSuccess && (
          <div className="success-message">
            Offer successfully created! See it in the browse tab
          </div>
        )}
          
          <button 
            type="submit" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Offer...' : 'Create Offer'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .add-offer-screen {
          min-height: 100vh;
          background: #ffffff;
        }

        .success-message {
          background: #48bb78;
          color: white;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .header {
          padding: 20px 24px; /* Reduced padding for a shorter header */
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 300;
          letter-spacing: -0.5px;
          color: #2d3748;
          margin: 0;
        }

        .subtitle {
          font-size: 14px;
          color: #718096;
          font-weight: 400;
          margin: 8px 0 0 0;
        }

        .content {
          padding: 32px 24px 100px;
          max-width: 400px;
          margin: 0 auto;
        }

        .connect-wallet-btn {
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);
        }

        .connect-wallet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 153, 225, 0.4);
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 16px;
          display: block;
        }

        .input-group {
          margin-bottom: 16px;
        }

        .input-group:last-child {
          margin-bottom: 0;
        }

        .input-label {
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 8px;
          display: block;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f7fafc;
          color: #2d3748;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          background: white;
        }

        .date-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f7fafc;
          color: #2d3748;
          transition: all 0.3s ease;
          box-sizing: border-box;
          height: 47px; /* Match the height of other inputs */
        }

        .date-input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          background: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: none;
          padding-right: 40px;
        }

        .select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .price-inputs {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .price-inputs .input-group {
          flex: 1;
          margin-bottom: 0;
        }

        .image-upload, .receipt-upload {
          border: 2px dashed #cbd5e0;
          border-radius: 16px;
          padding: 10px 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f7fafc;
        }

        .image-upload:hover, .receipt-upload:hover {
          border-color: #4299e1;
          background: #edf2f7;
        }

        .image-upload {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .receipt-upload {
          margin-bottom: 16px;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .upload-placeholder span {
          color: #718096;
          font-weight: 500;
        }

        .uploaded-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .file-name {
          font-size: 12px;
          color: #4a5568;
          margin-top: 8px;
          display: block;
        }

        .hidden-input {
          display: none;
        }

        .verify-button {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(160, 174, 192, 0.3);
        }

        .verify-button.verifying {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
          cursor: not-allowed;
          animation: pulse 1.5s infinite;
        }

        .verify-button.verified {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          box-shadow: 0 4px 16px rgba(72, 187, 120, 0.3);
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(160, 174, 192, 0.4);
        }

        .submit-button {
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);
          margin-top: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 153, 225, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-button.submitting {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 24px 16px 100px;
          }
          
          .header {
            padding: 20px 16px;
          }

          .price-inputs {
            flex-direction: column;
            gap: 0;
          }

          .price-inputs .input-group {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}