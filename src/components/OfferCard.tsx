import React, { useState } from 'react';

export default function OfferCard({
  offer = mockOffer,
  expanded = false,
  onExpand,
}: {
  offer?: any;
  expanded?: boolean;
  onExpand?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onExpand?.();
  };

  const handleBuy = async () => {
    setBuying(true);
    setSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    setBuying(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  return (
    <div className="rounded-3xl bg-white shadow-lg mb-6 overflow-hidden border border-gray-100 max-w-md mx-auto transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      {offer.imageUrl ? (
        <div className="w-full h-48 overflow-hidden flex items-center justify-center">
          <img src={offer.imageUrl} alt={offer.title} className="object-cover w-full h-full" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M12 7v6l4 2"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-base mt-2 font-medium">No image</span>
          </div>
        </div>
      )}
      
      {/* Card content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-black text-white text-sm font-medium px-4 py-2 rounded-full">
            UI/UX Design
          </span>
          <span className="text-2xl font-bold text-gray-900">${offer.price}</span>
        </div>
        
        <div className="font-bold text-xl mb-3 text-gray-900 leading-tight">{offer.title}</div>
        <div className="text-gray-600 text-base mb-4 leading-relaxed">{offer.description}</div>
    
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{offer.location}</span>
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:border-gray-300"
            onClick={handleExpand}
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              fill="none" 
              viewBox="0 0 16 16"
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path 
                d="M12 6l-4 4-4-4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-6 animate-fade-in">
            <div className="text-gray-600 mb-4 leading-relaxed">{offer.description}</div>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="ml-2">{offer.location}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-400 line-through text-sm">${offer.originalPrice}</span>
              <span className="text-green-600 font-semibold text-sm">{offer.discount}% off</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                {offer.rating}
              </span>
            </div>
            
            <button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              onClick={handleBuy}
              disabled={buying || success}
            >
              {buying ? 'Processing...' : success ? 'Success!' : (
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
            
            <div className="text-xs text-gray-500 text-center mt-3">
              Secure payment powered by Worldcoin verification
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
      `}</style>
    </div>
  );
}