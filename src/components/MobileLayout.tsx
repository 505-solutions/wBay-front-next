import React from 'react';

const MOBILE_MAX_WIDTH = 430;

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-blue-100 via-white to-blue-200"
      style={{ minHeight: '100dvh' }}
    >
      <div
        className="w-full min-h-screen bg-white shadow-xl"
        style={{ maxWidth: MOBILE_MAX_WIDTH }}
      >
        {children}
      </div>
    </div>
  );
} 