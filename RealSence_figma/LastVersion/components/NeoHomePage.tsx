import { useState, useEffect } from 'react';

interface NeoHomePageProps {
  onNavigate: (page: string) => void;
  onQuestionClick: (id: number) => void;
  userCoins: number;
  userLevel: number;
  userStreak: number;
}

export function NeoHomePage({ 
  onNavigate, 
  onQuestionClick, 
  userCoins, 
  userLevel = 7,
  userStreak = 12 
}: NeoHomePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState(1247);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const moveParticles = () => {
      setParticlePosition({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });
    };
    const interval = setInterval(moveParticles, 2000);
    return () => clearInterval(interval);
  }, []);

  const trendingTopics = [
    { name: 'Bitcoin Bull Run', emoji: '₿', boost: '+340%' },
    { name: 'NBA Finals', emoji: '🏀', boost: '+156%' },
    { name: 'Tech Stocks', emoji: '📈', boost: '+89%' },
    { name: 'Election 2024', emoji: '🗳️', boost: '+267%' }
  ];

  const socialActivity = [
    { user: '@cryptoking', action: 'just hit a 10x prediction! 🚀', time: '2s', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { user: '@nbalegend', action: 'started a 15-day streak! ⚡', time: '12s', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
    { user: '@techguru', action: 'reached Level 25! 👑', time: '35s', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4e9?w=100&h=100&fit=crop&crop=face' }
  ];

  const quickActions = [
    {
      id: 'predict',
      title: 'Quick Predict',
      subtitle: 'Swipe. Win. Repeat.',
      icon: '⚡',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      page: 'neo-predict',
      glow: 'cyan'
    },
    {
      id: 'leagues',
      title: 'Elite Leagues',
      subtitle: 'Join the legends',
      icon: '👑',
      gradient: 'from-yellow-400 via-orange-500 to-red-600',
      page: 'neo-league',
      glow: 'yellow'
    },
    {
      id: 'discover',
      title: 'AI Discovery',
      subtitle: 'What\'s trending now',
      icon: '🔮',
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      page: 'neo-search',
      glow: 'purple'
    },
    {
      id: 'social',
      title: 'Social Feed',
      subtitle: 'See what\'s hot',
      icon: '🌟',
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      page: 'neo-social',
      glow: 'green'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)]" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pb-28">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-5 pt-12">
          {/* Live Stats */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-30" />
            </div>
            <div>
              <p className="text-green-400 font-bold text-xs">LIVE</p>
              <p className="text-white/60 text-xs">{activeUsers.toLocaleString()} online</p>
            </div>
          </div>

          {/* User Level & Coins */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl border border-yellow-500/30 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">👑</span>
                <span className="text-white font-bold text-sm">LVL {userLevel}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-purple-500/30 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">💎</span>
                <span className="text-white font-bold text-sm">{userCoins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-5 mb-8">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-3xl blur opacity-30" />
            
            <div className="relative">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-black text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome Back, Legend
                </h1>
                <p className="text-white/70 text-sm">
                  {userStreak} day streak • Level {userLevel} Predictor
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-xl p-3 mb-2">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-white font-bold text-lg">{userStreak}</p>
                  <p className="text-white/60 text-xs">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500/20 rounded-xl p-3 mb-2">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-white font-bold text-lg">87%</p>
                  <p className="text-white/60 text-xs">Win Rate</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-xl p-3 mb-2">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <p className="text-white font-bold text-lg">156</p>
                  <p className="text-white/60 text-xs">Total Wins</p>
                </div>
              </div>

              {/* Daily Challenge */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-400 font-bold text-sm">DAILY CHALLENGE</p>
                    <p className="text-white text-sm">Make 5 predictions today</p>
                    <p className="text-white/60 text-xs">Progress: 3/5 • +50 XP reward</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-xl">🔥 Trending Now</h2>
            <button className="text-cyan-400 text-sm font-bold">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 min-w-[140px]"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{topic.emoji}</div>
                  <p className="text-white font-bold text-sm mb-1">{topic.name}</p>
                  <p className="text-green-400 font-bold text-xs">{topic.boost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="px-5 mb-8">
          <h2 className="text-white font-black text-xl mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onNavigate(action.page)}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${action.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-white transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Social Feed */}
        <div className="px-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-xl">🌟 Live Activity</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-bold">LIVE</span>
            </div>
          </div>
          <div className="space-y-3">
            {socialActivity.map((activity, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50">
                    <img src={activity.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="text-purple-400 font-bold">{activity.user}</span>
                      <span className="text-white/80"> {activity.action}</span>
                    </p>
                    <p className="text-white/50 text-xs">{activity.time} ago</p>
                  </div>
                  <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                    <span className="text-xs">❤️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Section */}
        <div className="px-5">
          <div className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-6 border border-yellow-500/30 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-yellow-400 font-black text-xl mb-1">👑 VIP ACCESS</h3>
                  <p className="text-white/80 text-sm">Unlock exclusive predictions & rewards</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center animate-bounce">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-lg">5x</p>
                  <p className="text-white/60 text-xs">Multiplier</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 font-bold text-lg">24/7</p>
                  <p className="text-white/60 text-xs">AI Support</p>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
                Upgrade to VIP • $9.99/month
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}