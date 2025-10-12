import { useState, useEffect } from 'react';

interface ElegantBottomTabsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function ElegantBottomTabs({ currentPage, onPageChange }: ElegantBottomTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tapAnimation, setTapAnimation] = useState<number | null>(null);

  const tabs = [
    { 
      id: 'elegant-home', 
      label: 'Home', 
      icon: '🏠', 
      activeIcon: '🏡',
      color: 'blue'
    },
    { 
      id: 'elegant-predict', 
      label: 'Predict', 
      icon: '⚡', 
      activeIcon: '⚡',
      color: 'purple'
    },
    { 
      id: 'elegant-search', 
      label: 'Discover', 
      icon: '🔮', 
      activeIcon: '🔮',
      color: 'cyan'
    },
    { 
      id: 'elegant-league', 
      label: 'Leagues', 
      icon: '🏆', 
      activeIcon: '🏆',
      color: 'orange'
    },
    { 
      id: 'elegant-profile', 
      label: 'Profile', 
      icon: '👤', 
      activeIcon: '👤',
      color: 'green'
    }
  ];

  useEffect(() => {
    const currentTab = tabs.findIndex(tab => tab.id === currentPage);
    if (currentTab !== -1) {
      setActiveIndex(currentTab);
    }
  }, [currentPage]);

  const handleTabClick = (tabId: string, index: number) => {
    setActiveIndex(index);
    setTapAnimation(index);
    onPageChange(tabId);
    
    // Remove tap animation after delay
    setTimeout(() => setTapAnimation(null), 200);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'from-blue-400 to-cyan-400' : 'from-gray-300 to-gray-400',
      purple: isActive ? 'from-purple-400 to-pink-400' : 'from-gray-300 to-gray-400',
      cyan: isActive ? 'from-cyan-400 to-teal-400' : 'from-gray-300 to-gray-400',
      orange: isActive ? 'from-orange-400 to-yellow-400' : 'from-gray-300 to-gray-400',
      green: isActive ? 'from-green-400 to-emerald-400' : 'from-gray-300 to-gray-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTabShadow = (color: string, isActive: boolean) => {
    if (!isActive) return '0 4px 15px rgba(0,0,0,0.1)';
    
    const shadows = {
      blue: '0 10px 25px rgba(59, 130, 246, 0.4)',
      purple: '0 10px 25px rgba(168, 85, 247, 0.4)',
      cyan: '0 10px 25px rgba(6, 182, 212, 0.4)',
      orange: '0 10px 25px rgba(251, 146, 60, 0.4)',
      green: '0 10px 25px rgba(16, 185, 129, 0.4)'
    };
    return shadows[color as keyof typeof shadows] || shadows.blue;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-sm mx-auto relative px-6 pb-6">
        {/* Floating Tab Container */}
        <div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-cyan-50/50" />
          
          {/* Active Tab Indicator */}
          <div 
            className="absolute top-2 w-16 h-12 rounded-2xl transition-all duration-500 ease-out"
            style={{
              left: `${12 + (activeIndex * 64)}px`,
              background: `linear-gradient(135deg, ${
                tabs[activeIndex]?.color === 'blue' ? '#60a5fa, #06b6d4' :
                tabs[activeIndex]?.color === 'purple' ? '#a855f7, #ec4899' :
                tabs[activeIndex]?.color === 'cyan' ? '#06b6d4, #14b8a6' :
                tabs[activeIndex]?.color === 'orange' ? '#fb923c, #facc15' :
                '#10b981, #059669'
              })`,
              opacity: 0.15,
              transform: tapAnimation === activeIndex ? 'scale(1.1)' : 'scale(1)'
            }}
          />

          {/* Navigation Items */}
          <div className="flex justify-between items-center p-3 relative z-10">
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;
              const isTapping = tapAnimation === index;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id, index)}
                  className="relative group flex flex-col items-center gap-1 p-2 transition-all duration-300 rounded-2xl"
                  style={{
                    transform: isTapping ? 'scale(0.95)' : isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {/* Icon Container */}
                  <div 
                    className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${getTabColor(tab.color, true)}` 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    style={{
                      boxShadow: isActive ? getTabShadow(tab.color, true) : '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Glow Effect for Active Tab */}
                    {isActive && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${getTabColor(tab.color, true)} rounded-2xl blur opacity-40 animate-pulse`} />
                    )}
                    
                    <span className={`relative text-lg transition-all duration-300 ${
                      isActive ? 'scale-110 filter drop-shadow-sm' : 'group-hover:scale-105'
                    }`}>
                      {isActive ? tab.activeIcon : tab.icon}
                    </span>
                    
                    {/* Active Pulse */}
                    {isActive && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    isActive 
                      ? 'text-gray-800 font-bold scale-105' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    {tab.label}
                  </span>

                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getTabColor(tab.color, true)} transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl opacity-20`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        </div>

        {/* Floating Dots Decoration */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-1 h-1 bg-white/40 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}