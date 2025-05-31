'use client';
import React, { useEffect, useState } from 'react';
import { fetchOffers, Offer } from '@/lib/api/offers';
import OfferCard from './OfferCard';
import OfferDetailsModal from './OfferDetailsModal';

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

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Offers</h1>
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
            />
          ))}
        </div>
      )}
      <OfferDetailsModal
        offer={selectedOffer}
        open={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />
    </div>
  );
} 