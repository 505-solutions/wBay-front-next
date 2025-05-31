const tabs = [
  {
    key: 'browse',
    label: 'Browse',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    key: 'sell',
    label: 'Sell',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  }
];

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-white border-t border-gray-100 flex justify-around items-center h-16 z-50 shadow-lg">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`flex flex-col items-center justify-center flex-1 h-full transition text-xs font-bold rounded-xl mx-1 ${
            activeTab === tab.key 
              ? 'text-gray-900 bg-gray-50' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.icon}
          <span className="mt-1">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}