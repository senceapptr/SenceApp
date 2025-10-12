import { useState, useEffect } from 'react';

interface NeoBottomTabsProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function NeoBottomTabs({ currentPage, onPageChange }: NeoBottomTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const tabs = [
    { 
      id: 'neo-home', 
      label: 'Home', 
      icon: '🏠', 
      activeIcon: '🏡',
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'cyan'
    },
    { 
      id: 'neo-predict', 
      label: 'Predict', 
      icon: '⚡', 
      activeIcon: '⚡',
      gradient: 'from-purple-400 to-pink-500',
      glow: 'purple'
    },
    { 
      id: 'neo-search', 
      label: 'Discover', 
      icon: '🔮', 
      activeIcon: '🔮',
      gradient: 'from-green-400 to-emerald-500',
      glow: 'green'
    },
    { 
      id: 'neo-league', 
      label: 'Leagues', 
      icon: '👑', 
      activeIcon: '👑',
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'yellow'
    },
    { 
      id: 'neo-profile', 
      label: 'Profile', 
      icon: '👤', 
      activeIcon: '👤',
      gradient: 'from-pink-400 to-red-500',
      glow: 'pink'
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
    onPageChange(tabId);
    
    // Create particle explosion effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (index * 80) + 40,
      y: 30
    }));
    setParticles(newParticles);
    
    // Remove particles after animation
    setTimeout(() => setParticles([]), 1000);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      {/* Particle Effects */}
      <div className="fixed bottom-20 left-0 right-0 pointer-events-none z-40">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-sm mx-auto relative">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-gray-900/80 to-transparent backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10" />
          
          {/* Navigation Container */}
          <div className="relative px-5 py-4">
            {/* Active Tab Glow Background */}
            <div 
              className="absolute top-2 w-16 h-16 rounded-2xl transition-all duration-500 ease-out"
              style={{
                left: `${20 + (activeIndex * 80)}px`,
                background: `linear-gradient(135deg, ${
                  tabs[activeIndex]?.glow === 'cyan' ? '#06b6d4, #3b82f6' :
                  tabs[activeIndex]?.glow === 'purple' ? '#a855f7, #ec4899' :
                  tabs[activeIndex]?.glow === 'green' ? '#10b981, #059669' :
                  tabs[activeIndex]?.glow === 'yellow' ? '#f59e0b, #ea580c' :
                  '#ec4899, #ef4444'
                })`,
                opacity: 0.2,
                filter: 'blur(8px)'
              }}
            />

            {/* Navigation Items */}
            <div className="flex justify-between items-center relative">
              {tabs.map((tab, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, index)}
                    className="relative group flex flex-col items-center gap-1 p-3 transition-all duration-300"
                  >
                    {/* Icon Container */}
                    <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.gradient} shadow-lg scale-110 shadow-${tab.glow}-500/50` 
                        : 'bg-white/10 hover:bg-white/20 group-hover:scale-105'
                    }`}>
                      {/* Glow Effect for Active Tab */}
                      {isActive && (
                        <div className={`absolute -inset-1 bg-gradient-to-r ${tab.gradient} rounded-2xl blur opacity-50 animate-pulse`} />
                      )}
                      
                      <span className={`relative text-lg transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}>
                        {isActive ? tab.activeIcon : tab.icon}
                      </span>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-gray-900 animate-pulse" />
                      )}
                    </div>

                    {/* Label */}
                    <span className={`text-xs font-bold transition-all duration-300 ${
                      isActive 
                        ? 'text-white scale-105' 
                        : 'text-white/60 group-hover:text-white/80'
                    }`}>
                      {tab.label}
                    </span>

                    {/* Ripple Effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className={`absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}