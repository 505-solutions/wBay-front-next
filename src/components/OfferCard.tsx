import React, { useState } from 'react';
import ImageDisplay from './ImageDisplay';
import { MiniKit, Tokens } from '@worldcoin/minikit-js';
import { PayCommandInput, tokenToDecimals } from '@worldcoin/minikit-js';

export default function OfferCard({
  offer = undefined,
  expanded = false,
  onExpand,
  onBuy,
}: {
  offer?: any;
  expanded?: boolean;
  onExpand?: () => void;
  onBuy: () => void;
}) {
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = async () => {
    setBuying(true);
    // setSuccess(false);

    const payload: PayCommandInput = {
      reference: "1234567890",
      to: '0x4c44a6a5af7206b27d37d49e896b67a086e80042', // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
        },
        // {
        //   symbol: Tokens.USDCE,
        //   token_amount: tokenToDecimals(3, Tokens.USDCE).toString(),
        // },
      ],
      description: 'Test example payment for minikit',
    }

    if (!MiniKit.isInstalled()) {
      return
    }

    const { finalPayload } = await MiniKit.commandsAsync.pay(payload)

    console.log("finalPayload", finalPayload);

    // await new Promise((r) => setTimeout(r, 1200));
    setBuying(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    onBuy();
  };

  return (
    <div className="offer-card">
      {/* Image */}
      {/* {offer?.imageUrl ? (
        <div className="image-container">
          <ImageDisplay 
            // imageId={offer.imageUrl}   
            imageId={"blablabla-test"}
            className="product-image"
          />
        </div>
      ) : (
        <div className="image-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📱</div>
          </div>
        </div>
      )} */}
        <ImageDisplay 
          imageId={offer?.seller + "-" + offer?.title}
          className="product-image"
        />

        <p>Success: {success.toString()}</p>
      {/* Card content */}
      <div className="card-content">
        <div className="card-header">
          <span className="category-badge">{offer?.category || 'UI/UX Design'}</span>
        </div>

        <h3 className="product-title">{offer?.title || 'MacBook M3'}</h3>

        <div className="location">{offer?.location || 'Cupertino, CA'}</div>

        <p className="description">
          {offer?.description || 'Premium laptop with cutting-edge performance and stunning design'}
          <br />
          <span className="original-price">Original Price: ${offer?.originalPrice || '1,299'}</span>
        </p>

        <div className="product-footer">
          <span className="price">${offer?.price || '1,299'}</span>
          <button
            className={`buy-button ${buying ? 'buying' : ''} ${success ? 'success' : ''}`}
            onClick={handleBuy}
            disabled={buying || success}
          >
            {buying ? 'Processing...' : success ? 'Added!' : 'Buy Now'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .offer-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          max-width: 400px;
          margin: 0 auto 24px;
        }

        .offer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
        }

        .image-container {
          height: 200px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          height: 200px;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .placeholder-content {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 24px;
        }

        .card-content {
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 12px;
        }

        .category-badge {
          display: inline-block;
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .product-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .location {
          font-size: 14px;
          color: #718096;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .description {
          font-size: 15px;
          color: #718096;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          letter-spacing: -0.5px;
        }

        .buy-button {
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);
          position: relative;
          overflow: hidden;
          min-width: 100px;
        }

        .buy-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 153, 225, 0.4);
        }

        .buy-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .buy-button.buying {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
          cursor: not-allowed;
          animation: pulse 1.5s infinite;
        }

        .buy-button.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          box-shadow: 0 4px 16px rgba(72, 187, 120, 0.3);
        }

        .buy-button:disabled {
          cursor: not-allowed;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}