'use client';
import React, { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import BrowseOffersScreen from '@/components/BrowseOffersScreen';
import BottomNav from '@/components/BottomNav';
import AddOfferScreen from '@/components/AddOfferScreen';
import { MiniKit } from '@worldcoin/minikit-js';

function PurchasesScreen() {
  return (
    <div className="purchases-screen">
      <header className="header">
        <h1 className="logo">wBay</h1>
        <p className="subtitle">Your Purchases</p>
      </header>

      <div className="content">
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <p>No purchases yet</p>
          <span className="empty-subtitle">Start browsing to make your first purchase</span>
        </div>
      </div>

      <style jsx>{`
        .purchases-screen {
          min-height: 100vh;
          background: #ffffff;
        }

        .header {
          padding: 20px 24px; /* Reduced padding for a shorter header */
          text-align: center;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
        }

        .logo {
          font-size: 32px;
          font-weight: 300;
          letter-spacing: -0.5px;
          color: #2d3748;
          margin-bottom: 8px;
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .empty-subtitle {
          color: #718096;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

function ProfileScreen() {
  // Mock user, purchases, and offers
  const user = { location: 'San Francisco, CA', bio: 'Web3 enthusiast. Love gadgets.' };
  const purchases = [
    { id: '1', name: 'iPhone 14 Pro Max', price: 899, date: '2024-06-01', description: 'Excellent condition, barely used. Comes with original box and charger.', imageUrl: '', },
    { id: '2', name: 'MacBook Air M2', price: 999, date: '2024-05-20', description: 'Perfect for students and professionals. 8GB RAM, 256GB SSD.', imageUrl: '', },
  ];
  const [myOffers, setMyOffers] = React.useState([
    { id: '3', name: 'Sony WH-1000XM4 Headphones', price: 250, date: '2024-06-10', description: 'Noise-canceling wireless headphones. Great sound.', imageUrl: '', },
    { id: '4', name: 'Kindle Paperwhite', price: 120, date: '2024-06-12', description: 'E-reader in excellent condition.', imageUrl: '', },
  ]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<{ name: string; price: number; description: string }>({ name: '', price: 0, description: '' });

  const startEdit = (offer: any) => {
    setEditId(offer.id);
    setEditForm({ name: offer.name, price: offer.price, description: offer.description });
  };
  const cancelEdit = () => setEditId(null);
  const saveEdit = () => {
    setMyOffers(myOffers.map(o => o.id === editId ? { ...o, ...editForm } : o));
    setEditId(null);
  };
  const deleteOffer = () => {
    setMyOffers(myOffers.filter(o => o.id !== editId));
    setEditId(null);
  };

  const connectWallet2 = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: '12344566787',
      statement: 'Sign in to access the Mini App',
    });
  }

  return (
    <div className="profile-screen">
      <header className="header">
        <h1 className="logo">wBay 🛍️</h1>
        <button onClick={connectWallet2} className="connect-wallet-btn">Wallet connected 💰</button>
      </header>

      <div className="content">
        {/* Purchases Section */}
        <section className="profile-section">
          <h3 className="section-title">Recent Purchases</h3>
          <div className="items-list">
            {purchases.map(p => (
              <div key={p.id} className="item-card">
                <div className="item-header">
                  <div className="item-info">
                    <div className="item-name">{p.name}</div>
                    <div className="item-date">{p.date}</div>
                  </div>
                  <div className="item-price">${p.price}</div>
                  <button
                    className="expand-button"
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className={`expand-icon ${expandedId === p.id ? 'expanded' : ''}`}>
                      <path d="M6 9l6 6 6-6" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {expandedId === p.id && (
                  <div className="item-details">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="item-image" />}
                    <div className="item-description">{p.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* My Offers Section */}
        <section className="profile-section">
          <h3 className="section-title">My Offers</h3>
          <div className="items-list">
            {myOffers.map(o => (
              <div key={o.id} className="item-card">
                <div className="item-header">
                  <div className="item-info">
                    <div className="item-name">{o.name}</div>
                    <div className="item-date">{o.date}</div>
                  </div>
                  <div className="item-price">${o.price}</div>
                  <button className="edit-button" onClick={() => startEdit(o)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 5l4 4-12 12H3v-4L15 5z"
                        fill="#4A5568" />

                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L20 7l-3-3 1.5-1.5z"
                        fill="#4A5568" />

                      <path d="M15 5l4 4"
                        stroke="#4A5568"
                        stroke-width="0.5" />
                    </svg>
                  </button>
                </div>
                {editId === o.id && (
                  <div className="edit-form">
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <input
                        className="form-input"
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-input"
                        value={editForm.price}
                        onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        value={editForm.description}
                        onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div className="form-actions">
                      <button className="save-button" onClick={saveEdit}>Save</button>
                      <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
                      <button className="delete-button" onClick={deleteOffer}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .profile-screen {
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

        .profile-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 16px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .info-item {
          display: flex;
          margin-bottom: 12px;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 600;
          color: #4a5568;
          margin-right: 8px;
        }

        .info-value {
          color: #2d3748;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .item-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 15px;
        }

        .item-date {
          color: #718096;
          font-size: 12px;
          margin-top: 2px;
        }

        .item-price {
          font-weight: 700;
          color: #2d3748;
          font-size: 16px;
          margin-right: 12px;
        }

        .expand-button, .edit-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .expand-button:hover, .edit-button:hover {
          background: #f7fafc;
        }

        .expand-icon {
          transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
          transform: rotate(180deg);
        }

        .item-details {
          padding: 0 20px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .item-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .item-description {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
        }

        .edit-form {
          padding: 20px;
          border-top: 1px solid #f1f5f9;
          background: #f7fafc;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group:last-of-type {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 6px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #2d3748;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 60px;
        }

        .form-actions {
          display: flex;
          gap: 8px;
        }

        .save-button, .cancel-button, .delete-button {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .save-button {
          background: linear-gradient(135deg, #4299e1 0%, #667eea 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(66, 153, 225, 0.3);
        }

        .save-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(66, 153, 225, 0.4);
        }

        .cancel-button {
          background: #e2e8f0;
          color: #4a5568;
        }

        .cancel-button:hover {
          background: #cbd5e0;
        }

        .delete-button {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(245, 101, 101, 0.3);
        }

        .delete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(245, 101, 101, 0.4);
        }

        @media (max-width: 768px) {
          .content {
            padding: 24px 16px 100px;
          }
          
          .header {
            padding: 50px 16px 32px;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default function RootPage() {
  const [tab, setTab] = useState('browse');

  let content;
  if (tab === 'browse') content = <BrowseOffersScreen />;
  else if (tab === 'sell') content = <AddOfferScreen />;
  else if (tab === 'purchases') content = <PurchasesScreen />;
  else if (tab === 'profile') content = <ProfileScreen />;

  return (
    <MobileLayout>
      {content}
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </MobileLayout>
  );
}