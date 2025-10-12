interface BottomTabsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function BottomTabs({ currentPage, onPageChange }: BottomTabsProps) {
  const tabs = [
    { id: 'home', name: 'Ana Sayfa', icon: 'home' },
    { id: 'search', name: 'Ara', icon: 'search' },
    { id: 'predict', name: 'Tahmin', icon: 'lightning' },
    { id: 'my-bets', name: 'Kuponlarım', icon: 'bets' },
    { id: 'league', name: 'Lig', icon: 'league' }
  ];

  const getTabIcon = (iconType: string, active: boolean) => {
    const iconClass = active ? 'text-white' : 'text-gray-600';
    
    switch (iconType) {
      case 'home':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3l8 7v11h-6v-6h-4v6H4V10l8-7z"/>
          </svg>
        );
      case 'search':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        );
      case 'lightning':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z"/>
          </svg>
        );
      case 'bets':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
        );
      case 'league':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="max-w-sm mx-auto">
        <div className="grid grid-cols-5 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`
                flex flex-col items-center justify-center px-2 py-3 rounded-2xl transition-all duration-300 text-xs h-16 mx-1
                transform hover:scale-105 active:scale-95
                ${tab.id === currentPage 
                  ? 'bg-gradient-to-r from-[#6B46F0] to-purple-600 shadow-lg shadow-purple-200' 
                  : 'bg-transparent hover:bg-gray-50'
                }
              `}
            >
              <div className="mb-1 transition-transform duration-200">
                {getTabIcon(tab.icon, tab.id === currentPage)}
              </div>
              <span className={`font-medium truncate leading-tight transition-colors duration-200 ${
                tab.id === currentPage ? 'text-white' : 'text-gray-600'
              }`}>
                {tab.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}