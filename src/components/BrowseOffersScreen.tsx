'use client';
import React, { useEffect, useState } from 'react';
import { fetchOffers, Offer } from '@/lib/api/offers';
import OfferCard from './OfferCard';
import OfferDetailsModal from './OfferDetailsModal';
import { MiniKit } from '@worldcoin/minikit-js';

export default function BrowseOffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetchOffers().then((data) => {
      setOffers(data);
      setLoading(false);
    });
  }, []);

  const connectWallet2 = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
  }

  return (
    <div className="browse-screen">
      <header className="header">
        <h1 className="logo">wBay 🛍️</h1>
        <button onClick={connectWallet2} className="connect-wallet-btn">Wallet connected 💰</button>
      </header>

      <div className="p-4 pb-24">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No offers found.</div>
        ) : (
          <div>
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                expanded={expandedOfferId === offer.id}
                onExpand={() => setExpandedOfferId(expandedOfferId === offer.id ? null : offer.id)}
                onBuy={() => {
                  setOffers(offers.filter((o) => o.id !== offer.id));
                }}
              />
            ))}
            <div className="pb-24"></div> {/* Added padding after the last item */}
          </div>
        )}
      </div>

      <OfferDetailsModal
        offer={selectedOffer}
        open={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />

      <style jsx>{`
        .browse-screen {
          min-height: 100vh;
          background: #ffffff;
        }

        .header {
          padding: 20px 24px; /* Reduced padding for a shorter header */
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px; /* Reduced font size for a shorter header */
          font-weight: 300;
          letter-spacing: -0.5px;
          color: #2d3748;
          margin-bottom: 8px;
          margin: 0;
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
      `}</style>
    </div>
  );
}