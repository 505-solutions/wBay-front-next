'use client';
import React, { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import BrowseOffersScreen from '@/components/BrowseOffersScreen';
import BottomNav from '@/components/BottomNav';
import AddOfferScreen from '@/components/AddOfferScreen';

function AddOfferScreenPlaceholder() {
  return (
    <div className="p-4 pb-24">Add Offer Screen (form coming soon)</div>
  );
}

function PurchasesScreen() {
  return (
    <div className="p-4 pb-24">Purchases Screen (list coming soon)</div>
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

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Profile</h2>
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <div className="font-semibold text-gray-700 mb-1">Location: <span className="font-normal">{user.location}</span></div>
        <div className="font-semibold text-gray-700">Bio: <span className="font-normal">{user.bio}</span></div>
      </div>
      <h3 className="text-lg font-bold mb-2">Purchases</h3>
      <div className="space-y-2 mb-6">
        {purchases.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow border border-gray-100 flex items-center px-4 py-3">
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{p.name}</div>
              <div className="text-gray-400 text-xs">{p.date}</div>
            </div>
            <div className="text-right min-w-[70px] font-bold text-blue-600">${p.price}</div>
            <button
              className="ml-3 p-2 rounded hover:bg-blue-50"
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              title="Show Details"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className={`transition-transform ${expandedId === p.id ? 'rotate-90' : ''}`}><path d="M9 6l6 6-6 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {expandedId === p.id && (
              <div className="absolute left-0 right-0 bg-white rounded-b-xl shadow px-4 pb-4 mt-2">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover rounded mb-2" />}
                <div className="text-gray-700 text-sm mb-2">{p.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold mb-2">My Offers</h3>
      <div className="space-y-2">
        {myOffers.map(o => (
          <div key={o.id} className="bg-white rounded-xl shadow border border-gray-100">
            <div className="flex items-center px-4 py-3">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{o.name}</div>
                <div className="text-gray-400 text-xs">{o.date}</div>
              </div>
              <div className="text-right min-w-[70px] font-bold text-blue-600">${o.price}</div>
              <button className="ml-3 p-2 rounded hover:bg-blue-50" title="Edit Offer" onClick={() => startEdit(o)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 0 0 .707-.293l9.414-9.414a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0l-9.414 9.414A1 1 0 0 0 4 20z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            {editId === o.id && (
              <div className="px-4 pb-4">
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Product Name</label>
                  <input className="w-full rounded border px-2 py-1" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Price</label>
                  <input type="number" className="w-full rounded border px-2 py-1" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: Number(e.target.value) }))} />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold mb-1">Description</label>
                  <textarea className="w-full rounded border px-2 py-1" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="flex gap-2">
                  <button type="button" className="flex-1 py-2 rounded bg-blue-600 text-white font-bold" onClick={saveEdit}>Save</button>
                  <button type="button" className="flex-1 py-2 rounded bg-gray-200 text-gray-600 font-bold" onClick={cancelEdit}>Cancel</button>
                  <button type="button" className="flex-1 py-2 rounded bg-red-500 text-white font-bold" onClick={deleteOffer}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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
