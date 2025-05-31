'use client';
import React from 'react';

const tabs = [
  { key: 'browse', label: 'Browse', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
  ) },
  { key: 'sell', label: 'Sell', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
  ) },
  { key: 'profile', label: 'Profile', icon: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#2563eb" strokeWidth="2"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" stroke="#2563eb" strokeWidth="2"/></svg>
  ) },
];

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`flex flex-col items-center justify-center flex-1 h-full transition text-xs font-medium ${activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.icon}
          <span className="mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
} 