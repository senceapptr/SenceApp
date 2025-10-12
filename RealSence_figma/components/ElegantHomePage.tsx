import { useState, useEffect } from 'react';

interface ElegantHomePageProps {
  onNavigate: (page: string) => void;
  onQuestionClick: (id: number) => void;
  userCoins: number;
  userLevel: number;
  userStreak: number;
}

export function ElegantHomePage({ 
  onNavigate, 
  onQuestionClick, 
  userCoins, 
  userLevel = 7,
  userStreak = 12 
}: ElegantHomePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide welcome message after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      id: 'elegant-predict',
      title: 'Quick Predict',
      subtitle: 'Swipe & Win',
      icon: '⚡',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-50',
      page: 'elegant-predict'
    },
    {
      id: 'elegant-discover',
      title: 'Discover',
      subtitle: 'Trending Now',
      icon: '🔮',
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
      page: 'elegant-search'
    },
    {
      id: 'elegant-leagues',
      title: 'Leagues',
      subtitle: 'Compete',
      icon: '🏆',
      color: 'from-orange-400 to-yellow-400',
      bgColor: 'bg-orange-50',
      page: 'elegant-league'
    },
    {
      id: 'elegant-social',
      title: 'Social',
      subtitle: 'Connect',
      icon: '✨',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50',
      page: 'elegant-social'
    }
  ];

  const recentActivity = [
    { user: '@alex_crypto', action: 'hit a 5x prediction! 🚀', time: '2m', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', type: 'win' },
    { user: '@sarah_sports', action: 'started following you', time: '5m', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4e9?w=100&h=100&fit=crop&crop=face', type: 'follow' },
    { user: '@mike_tech', action: 'shared a prediction', time: '12m', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', type: 'share' }
  ];

  const handlePullToRefresh = (startY: number, currentY: number) => {
    const distance = Math.max(0, (currentY - startY) / 3);
    setPullDistance(distance);
    setIsPulling(distance > 0);
    
    if (distance > 80) {
      // Trigger refresh
      setTimeout(() => {
        setIsPulling(false);
        setPullDistance(0);
      }, 1000);
    }
  };

  const timeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="absolute top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-40 -left-20 w-60 h-60 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="pb-28 relative z-10">
        {/* Pull to Refresh Indicator */}
        {isPulling && (
          <div 
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
            style={{ transform: `translateX(-50%) translateY(${Math.min(pullDistance, 60)}px)` }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600 text-sm font-medium">Pull to refresh</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar Area */}
        <div className="h-12" />

        {/* Header */}
        <div className="px-6 mb-8">
          {/* Welcome Message */}
          {showWelcome && (
            <div className="mb-6 animate-in slide-in-from-top-4 fade-in-0 duration-700">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{timeGreeting()} ✨</h1>
                    <p className="text-blue-100 text-sm">Ready to make some predictions?</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div 
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white">💎</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{userCoins}</p>
                <p className="text-gray-500 text-xs font-medium">Coins</p>
              </div>
            </div>

            <div 
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white">🔥</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{userStreak}</p>
                <p className="text-gray-500 text-xs font-medium">Day Streak</p>
              </div>
            </div>

            <div 
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 hover:scale-105 transition-transform duration-300"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white">👑</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{userLevel}</p>
                <p className="text-gray-500 text-xs font-medium">Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.page)}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative ${action.bgColor} rounded-3xl p-6 border border-white/40 hover:border-white/60 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                style={{ 
                  boxShadow: activeCard === index 
                    ? '0 20px 40px rgba(0,0,0,0.15)' 
                    : '0 10px 25px rgba(0,0,0,0.08)',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-gray-900 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors">
                    {action.subtitle}
                  </p>
                </div>

                {/* Hover Effect Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-20 blur-xl rounded-3xl transition-opacity duration-500`} />
              </button>
            ))}
          </div>
        </div>

        {/* Today's Challenge */}
        <div className="px-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-20 h-20 border border-white/30 rounded-full" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-white/30 rounded-full" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Daily Challenge 🎯</h3>
                  <p className="text-blue-100 text-sm">Complete 5 predictions today</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-blue-100 mb-2">
                  <span>Progress: 3/5</span>
                  <span>+100 XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                  <div className="bg-white h-3 rounded-full shadow-sm transition-all duration-700" style={{ width: '60%' }} />
                </div>
              </div>
              
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl py-3 px-4 font-bold transition-all duration-300 border border-white/30">
                Continue Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Social Activity Feed */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              See All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white">
                      <img src={activity.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    {/* Activity Type Indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs ${
                      activity.type === 'win' ? 'bg-green-500' :
                      activity.type === 'follow' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}>
                      {activity.type === 'win' ? '🎉' : activity.type === 'follow' ? '👤' : '📤'}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">
                      <span className="font-bold text-blue-600">{activity.user}</span>
                      <span className="text-gray-600"> {activity.action}</span>
                    </p>
                    <p className="text-gray-400 text-xs">{activity.time} ago</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors duration-200">
                      <span className="text-xs">❤️</span>
                    </button>
                    <button className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200">
                      <span className="text-xs">💬</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Hint */}
        <div className="fixed bottom-32 right-6 z-20">
          <button
            onClick={() => onNavigate('elegant-predict')}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-300 animate-bounce"
            style={{ boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)' }}
          >
            <span className="text-white text-2xl">⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
}