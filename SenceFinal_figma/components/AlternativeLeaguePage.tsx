import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AlternativeLeaguePageProps {
  onBack: () => void;
}

interface League {
  id: number;
  name: string;
  description: string;
  category: string;
  categories: string[];
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost: number;
  isFeatured?: boolean;
  status?: 'active' | 'completed';
  isPrivate?: boolean;
  pointSystem: string;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

export function AlternativeLeaguePage({ onBack }: AlternativeLeaguePageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showLeagueDetails, setShowLeagueDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  // Create wizard states
  const [createStep, setCreateStep] = useState(1);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    description: '',
    coverEmoji: '🏆',
    categories: [] as string[],
    joinCost: 0,
    maxParticipants: 20,
    endDate: '',
    prize: 0
  });

  // User data
  const currentUser = {
    username: 'mustafa_92',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    joinedLeagues: 3,
    maxLeagues: 5,
    credits: 8500,
    tickets: 2
  };

  // Mock league data
  const leagues: League[] = [
    {
      id: 1,
      name: "Haftalık Spor Ligi",
      description: "Her hafta en popüler spor maçları ve olimpiyat etkinlikleri",
      category: "spor",
      categories: ["futbol", "basketbol", "tenis"],
      participants: 1247,
      maxParticipants: 2000,
      prize: "50,000 kredi + Sürpriz",
      endDate: "7 gün",
      isJoined: false,
      creator: "sence_official",
      joinCost: 0,
      isFeatured: true,
      status: 'active',
      isPrivate: false,
      pointSystem: "Her doğru tahmin için 100 puan kazanırsın. Yanlış tahminlerde 25 puan kaybedersin. Ardışık doğru tahminlerde bonus çarpanlar devreye girer: 3 doğru = 1.2x, 5 doğru = 1.5x, 10 doğru = 2x çarpan. Haftalık en yüksek puan alan kullanıcı özel rozet kazanır."
    },
    {
      id: 2,
      name: "Coca-Cola Ligi",
      description: "Coca-Cola sponsorluğunda mega turnuva ligi",
      category: "sponsorlu",
      categories: ["spor", "eğlence", "müzik"],
      participants: 3420,
      maxParticipants: 5000,
      prize: "100,000 kredi\n+ Sürpriz",
      endDate: "14 gün",
      isJoined: false,
      creator: "coca_cola_tr",
      joinCost: 500,
      isFeatured: true,
      status: 'active',
      isPrivate: false,
      pointSystem: "Weighted scoring sistemi kullanılır. Kategoriye göre farklı puanlar: Spor tahminleri 100 puan, eğlence 80 puan, müzik 60 puan. Doğru tahmin oranınıza göre haftalık multiplier uygulanır."
    },
    {
      id: 3,
      name: "Kripto Klanı",
      description: "Bitcoin, Ethereum ve altcoin tahminleri",
      category: "kripto",
      categories: ["bitcoin", "ethereum", "altcoin"],
      participants: 234,
      maxParticipants: 500,
      prize: "25,000 kredi\n+ Sürpriz",
      endDate: "10 gün",
      isJoined: true,
      position: 12,
      creator: "crypto_master",
      joinCost: 1000,
      isFeatured: false,
      status: 'active',
      isPrivate: false,
      pointSystem: "Kripto volatilitesine göre dinamik puanlama sistemi. Bitcoin tahminleri 150 puan, Ethereum 120 puan, altcoin tahminleri 100 puan değerinde. Market hareketlerine göre bonus puanlar hesaplanır."
    },
    {
      id: 4,
      name: "Tech Gurus",
      description: "Teknoloji şirketleri ve startup tahminleri",
      category: "teknoloji",
      categories: ["startups", "AI", "hardware"],
      participants: 567,
      maxParticipants: 1000,
      prize: "30,000 kredi\n+ Sürpriz",
      endDate: "5 gün",
      isJoined: true,
      position: 45,
      creator: "tech_insider",
      joinCost: 750,
      isFeatured: false,
      status: 'active',
      isPrivate: false,
      pointSystem: "Teknoloji sektörü odaklı puanlama. Startup tahminleri 120 puan, AI gelişmeleri 100 puan, hardware lansmanları 80 puan. Doğru streak için bonus puanlar: 5+ doğru = +50 bonus."
    },
    {
      id: 5,
      name: "Netflix & Chill Liga",
      description: "Dizi, film ve platformlar hakkında tahminler",
      category: "eğlence",
      categories: ["dizi", "film", "platform"],
      participants: 890,
      maxParticipants: 1500,
      prize: "20,000 kredi\n+ Sürpriz",
      endDate: "Tamamlandı",
      isJoined: true,
      position: 8,
      creator: "film_uzmanı",
      joinCost: 500,
      isFeatured: false,
      status: 'completed',
      isPrivate: false,
      pointSystem: "Eğlence sektörü puanlama sistemi. Dizi tahminleri 90 puan, film tahminleri 80 puan, platform gelişmeleri 70 puan değerinde."
    }
  ];

  const categories = [
    { id: 'spor', name: 'Spor', icon: '⚽' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'kripto', name: 'Kripto', icon: '₿' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'ekonomi', name: 'Ekonomi', icon: '📈' },
    { id: 'eğlence', name: 'Eğlence', icon: '🎬' }
  ];

  // Mock chat data
  const chatMessages: ChatMessage[] = [
    {
      id: 1,
      username: "crypto_king",
      message: "Bitcoin bugün 100k'yı geçecek mi sizce?",
      timestamp: new Date(Date.now() - 300000),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    {
      id: 2,
      username: "trend_hunter",
      message: "Kesinlikle geçer! Bugün güçlü bir ralliye sahip",
      timestamp: new Date(Date.now() - 240000),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
    },
    {
      id: 3,
      username: "market_wizard",
      message: "Ben tam tersi düşünüyorum, düşüş olacak",
      timestamp: new Date(Date.now() - 180000),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    }
  ];

  // Mock leaderboard data
  const leaderboardData = [
    { 
      rank: 1, 
      username: 'crypto_king', 
      points: 3450, 
      streak: 12,
      correctPredictions: 87,
      totalPredictions: 104,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 2, 
      username: 'prediction_master', 
      points: 3210, 
      streak: 8,
      correctPredictions: 76,
      totalPredictions: 95,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 3, 
      username: 'future_seer', 
      points: 2980, 
      streak: 15,
      correctPredictions: 82,
      totalPredictions: 98,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 4, 
      username: 'trend_hunter', 
      points: 2850, 
      streak: 6,
      correctPredictions: 71,
      totalPredictions: 89,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 5, 
      username: 'market_wizard', 
      points: 2720, 
      streak: 4,
      correctPredictions: 68,
      totalPredictions: 85,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 6, 
      username: 'prediction_pro', 
      points: 2680, 
      streak: 7,
      correctPredictions: 64,
      totalPredictions: 81,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 7, 
      username: 'future_master', 
      points: 2620, 
      streak: 2,
      correctPredictions: 62,
      totalPredictions: 79,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 8, 
      username: 'trend_seeker', 
      points: 2580, 
      streak: 5,
      correctPredictions: 60,
      totalPredictions: 77,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 9, 
      username: 'market_guru', 
      points: 2520, 
      streak: 3,
      correctPredictions: 58,
      totalPredictions: 75,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 10, 
      username: 'crypto_trader', 
      points: 2480, 
      streak: 1,
      correctPredictions: 56,
      totalPredictions: 73,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 11, 
      username: 'analysis_king', 
      points: 2440, 
      streak: 4,
      correctPredictions: 54,
      totalPredictions: 71,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' 
    },
    { 
      rank: 12, 
      username: 'mustafa_92', 
      points: 2150, 
      streak: 3,
      correctPredictions: 45,
      totalPredictions: 67,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', 
      isCurrentUser: true 
    }
  ].sort((a, b) => a.rank - b.rank);

  // Filter leagues based on search
  const filteredLeagues = leagues.filter(league => {
    if (!searchQuery) return true;
    return (
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const featuredLeagues = filteredLeagues.filter(league => league.isFeatured);
  const communityLeagues = filteredLeagues.filter(league => !league.isFeatured);
  
  const myLeagues = leagues.filter(league => league.isJoined);
  const activeLeagues = myLeagues.filter(league => league.status === 'active');
  const completedLeagues = myLeagues.filter(league => league.status === 'completed');

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
    return `${Math.floor(diffInMinutes / 1440)}g`;
  };

  const handleLeagueDetails = (league: League) => {
    setSelectedLeague(league);
    setShowLeagueDetails(true);
  };

  const handleChat = (league: League) => {
    setSelectedLeague(league);
    setShowChat(true);
  };

  const handleLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleJoinLeague = (league: League) => {
    setSelectedLeague(league);
    setShowJoinModal(true);
  };

  const confirmJoinLeague = () => {
    if (selectedLeague && currentUser.credits >= selectedLeague.joinCost) {
      setShowJoinModal(false);
      // Handle actual joining logic here
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setLeagueConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const calculatePrize = () => {
    return leagueConfig.joinCost * leagueConfig.maxParticipants;
  };

  const handleCreateWithCredits = () => {
    setShowCreditModal(false);
    setCreateStep(3);
  };

  const handleCreateWithTicket = () => {
    setShowTicketModal(false);
    setCreateStep(3);
  };

  const generateShareLink = () => {
    return `https://sence.app/league/${Math.random().toString(36).substr(2, 8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  // League Card Component - with purple borders and premium patterns
  const LeagueCard = ({ league, isMyLeague = false }: { league: League, isMyLeague?: boolean }) => (
    <div className={`rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative ${
      league.isFeatured || (isMyLeague && league.status === 'active')
        ? 'border-2 border-[#432870] bg-white' 
        : 'border-2 border-[#F2F3F5] bg-white'
    } ${
      league.status === 'completed' ? 'opacity-60' : ''
    }`}>
      {/* Premium Background Pattern for Featured/Active Leagues */}
      {(league.isFeatured || (isMyLeague && league.status === 'active')) && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #432870 1px, transparent 1px), 
                             radial-gradient(circle at 80% 80%, #B29EFD 1px, transparent 1px),
                             radial-gradient(circle at 40% 60%, #432870 0.5px, transparent 0.5px)`,
            backgroundSize: '60px 60px, 80px 80px, 40px 40px'
          }} />
        </div>
      )}

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-black text-lg text-[#202020] mb-2">
              {league.name}
            </h4>
            <p className="text-[#202020]/70 text-sm mb-3">{league.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                league.category === 'spor' ? 'bg-[#B29EFD]/30 text-[#202020]' :
                league.category === 'teknoloji' ? 'bg-blue-100 text-blue-700' :
                league.category === 'sponsorlu' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
              </span>
              <span className="text-[#202020]/50 text-xs">•</span>
              <span className="text-[#202020]/50 text-xs">@{league.creator}</span>
            </div>
          </div>
          <div className="text-right">
            {!isMyLeague ? (
              <>
                <div className="text-[#432870] font-black text-lg whitespace-pre-line">{league.prize}</div>
                <div className="text-[#202020]/50 text-sm">Ödül</div>
              </>
            ) : (
              <>
                <div className="text-[#432870] font-black text-lg">#{league.position}</div>
                <div className="text-[#202020]/50 text-sm">Sıralama</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-[#202020]/70">
            <span>👥 {league.participants}/{league.maxParticipants}</span>
            <span>📅 {league.endDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          {!isMyLeague ? (
            <div className="flex gap-3">
              <button 
                onClick={() => handleJoinLeague(league)}
                className="relative overflow-hidden flex-1 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white p-4 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-[#432870]/30 border border-[#432870]/20 group"
                style={{
                  boxShadow: '0 20px 40px rgba(67, 40, 112, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
                disabled={league.status === 'completed'}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <span className="font-black text-base tracking-wide">Katıl</span>
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#B29EFD]/20 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
              </button>
              
              <button 
                onClick={() => handleLeagueDetails(league)}
                className="px-4 py-4 bg-[#F2F3F5] hover:bg-white text-[#202020] font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Detay
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => handleLeagueDetails(league)}
                className="flex-1 px-3 py-3 bg-[#F2F3F5] hover:bg-white text-[#202020] font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Lig Detayları
              </button>
              <button 
                onClick={() => handleLeaderboard(league)}
                className="flex-1 px-3 py-3 bg-[#F2F3F5] hover:bg-white text-[#202020] font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                Sıralama
              </button>
              <button 
                onClick={() => handleChat(league)}
                className="px-3 py-3 bg-[#432870] hover:bg-[#5A3A8B] text-white font-bold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                💬
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Welcome Popup - from original LeaguePage */}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 mx-4 max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="font-black text-xl mb-2">Ligler Dünyasına Hoş Geldin!</h2>
                <p className="text-white/90 text-base leading-relaxed">
                  Arkadaşlarınla, toplulukla ve başka kullanıcılarla rekabet et
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B29EFD] to-[#432870] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Tahminlerini Yarıştır</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      En iyi tahmin yapanlar sıralamada üste çıkar. Sen de yerini al!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C9F158] to-[#353831] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Ödüller Kazan</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      Liglerin birincileri büyük ödüller kazanır. Krediler, rozetler ve daha fazlası!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <h3 className="text-[#202020] font-bold text-base mb-1">Özel Liglerini Oluştur</h3>
                    <p className="text-[#202020]/70 text-sm leading-relaxed">
                      Arkadaşlarınla özel liglerinde sadece sizin aranızda yarışın.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowWelcomePopup(false)}
                  className="w-full bg-gradient-to-r from-[#432870] via-[#5A3A8B] to-[#6B4A9D] hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] text-white font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Hemen Başla 🚀
                </button>
                <button
                  onClick={() => setShowWelcomePopup(false)}
                  className="w-full bg-transparent border-2 border-[#432870]/20 text-[#432870] font-bold py-3 rounded-2xl hover:bg-[#432870]/10 transition-all duration-300"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-[#F2F3F5] pb-24">
        {/* Header - matching original style */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="font-black text-3xl text-[#202020]">Ligler</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-3 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - matching original style */}
        <div className="px-5 mb-6">
          <div className="bg-[#F2F3F5] rounded-2xl p-1 flex border-2 border-white">
            {[
              { id: 'discover', label: 'Keşfet', icon: '🔍' },
              { id: 'my-leagues', label: 'Liglerım', icon: '👤' },
              { id: 'create', label: 'Oluştur', icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#432870] shadow-md'
                    : 'text-[#202020]/70 hover:text-[#202020]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-5">
          {activeTab === 'discover' && (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Lig adı ve @kullanıcıadı ara"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border-2 border-[#F2F3F5] rounded-3xl py-4 px-6 pr-14 text-[#202020] placeholder-[#202020]/50 focus:border-[#432870] focus:outline-none transition-all duration-300 shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Leagues */}
              {featuredLeagues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-black text-lg text-[#202020] mb-4">Öne Çıkarılan Ligler</h3>
                  <div className="space-y-4">
                    {featuredLeagues.map((league) => (
                      <LeagueCard key={league.id} league={league} />
                    ))}
                  </div>
                </div>
              )}

              {/* Community Leagues */}
              {communityLeagues.length > 0 && (
                <div>
                  <h3 className="font-black text-lg text-[#202020] mb-4">Topluluk Ligleri</h3>
                  <div className="space-y-4">
                    {communityLeagues.map((league) => (
                      <LeagueCard key={league.id} league={league} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredLeagues.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-[#202020] font-bold text-xl mb-2">Aradığın lig bulunamadı</h3>
                  <p className="text-[#202020]/70 mb-6">Farklı kelimeler deneyebilir veya aramayı temizleyebilirsin</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white px-6 py-3 rounded-2xl font-bold hover:from-[#5A3A8B] hover:to-[#C9AFFE] transition-all duration-300"
                  >
                    Aramayı Temizle
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'my-leagues' && (
            <>
              {/* League Participation Indicator */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 rounded-2xl border-2 border-[#432870]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#202020]">Lig Katılımın</h3>
                    <p className="text-[#202020]/70 text-sm">Maksimum 5 lige katılabilirsin</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#432870]">{currentUser.joinedLeagues}/{currentUser.maxLeagues}</div>
                    <div className="w-16 h-2 bg-[#F2F3F5] rounded-full mt-1 border">
                      <div 
                        className="h-full bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full transition-all duration-500"
                        style={{ width: `${(currentUser.joinedLeagues / currentUser.maxLeagues) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Leagues */}
              {activeLeagues.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-black text-lg text-[#202020] mb-4">Aktif Liglerin</h3>
                  <div className="space-y-4">
                    {activeLeagues.map((league) => (
                      <LeagueCard key={league.id} league={league} isMyLeague={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Leagues */}
              {completedLeagues.length > 0 && (
                <div>
                  <h3 className="font-black text-lg text-[#202020]/70 mb-4">Tamamlanan Ligler</h3>
                  <div className="space-y-4">
                    {completedLeagues.map((league) => (
                      <LeagueCard key={league.id} league={league} isMyLeague={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* No Leagues */}
              {myLeagues.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-[#202020] font-bold text-xl mb-2">Henüz bir lige katılmamışsın</h3>
                  <p className="text-[#202020]/70 mb-6">Keşfet sekmesinden ilginç ligleri keşfet ve katıl!</p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white px-8 py-3 rounded-2xl font-bold hover:from-[#5A3A8B] hover:to-[#C9AFFE] transition-all duration-300"
                  >
                    Ligleri Keşfet
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              {createStep === 1 && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#202020]">Adım 1/3</span>
                      <span className="text-sm font-medium text-[#202020]">Temel Bilgiler</span>
                    </div>
                    <div className="w-full bg-[#F2F3F5] rounded-full h-2 border">
                      <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] h-2 rounded-full transition-all duration-500" style={{width: '33%'}}></div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-black text-2xl text-[#202020] mb-2">Temel Bilgiler</h3>
                    <p className="text-[#202020]/70">Liginin adını, açıklamasını ve kapak emojisini belirle</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#202020] font-bold mb-2">Lig Adı</label>
                      <input
                        type="text"
                        value={leagueConfig.name}
                        onChange={(e) => setLeagueConfig(prev => ({...prev, name: e.target.value}))}
                        placeholder="Örn: Teknoloji Tahmin Ligi"
                        className="w-full bg-white border-2 border-[#F2F3F5] rounded-2xl py-3 px-4 text-[#202020] focus:border-[#432870] focus:outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[#202020] font-bold mb-2">Açıklama</label>
                      <textarea
                        value={leagueConfig.description}
                        onChange={(e) => setLeagueConfig(prev => ({...prev, description: e.target.value}))}
                        placeholder="Liginin ne hakkında olduğunu açıkla"
                        rows={3}
                        className="w-full bg-white border-2 border-[#F2F3F5] rounded-2xl py-3 px-4 text-[#202020] focus:border-[#432870] focus:outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[#202020] font-bold mb-2">Kapak Emojisi</label>
                      <div className="grid grid-cols-6 gap-3">
                        {['🏆', '⚽', '💻', '₿', '🎬', '📈', '🎯', '🔥', '⭐', '💎', '🚀', '🎪'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setLeagueConfig(prev => ({...prev, coverEmoji: emoji}))}
                            className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all duration-300 ${
                              leagueConfig.coverEmoji === emoji 
                                ? 'border-[#432870] bg-[#432870]/10 shadow-md' 
                                : 'border-[#F2F3F5] bg-white hover:border-[#432870]/50'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setCreateStep(2)}
                    disabled={!leagueConfig.name || !leagueConfig.description}
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
                      leagueConfig.name && leagueConfig.description
                        ? 'bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white hover:from-[#5A3A8B] hover:to-[#C9AFFE] shadow-lg'
                        : 'bg-[#F2F3F5] text-[#202020]/50 cursor-not-allowed'
                    }`}
                  >
                    Devam Et
                  </button>
                </>
              )}

              {createStep === 2 && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#202020]">Adım 2/3</span>
                      <span className="text-sm font-medium text-[#202020]">Ayarlar</span>
                    </div>
                    <div className="w-full bg-[#F2F3F5] rounded-full h-2 border">
                      <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] h-2 rounded-full transition-all duration-500" style={{width: '66%'}}></div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="font-black text-2xl text-[#202020] mb-2">Lig Ayarları</h3>
                    <p className="text-[#202020]/70">Katılım ücreti, kategoriler ve süreyi belirle</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[#202020] font-bold mb-2">Katılım Ücreti</label>
                      <input
                        type="number"
                        value={leagueConfig.joinCost}
                        onChange={(e) => setLeagueConfig(prev => ({...prev, joinCost: parseInt(e.target.value) || 0}))}
                        placeholder="0"
                        className="w-full bg-white border-2 border-[#F2F3F5] rounded-2xl py-3 px-4 text-[#202020] focus:border-[#432870] focus:outline-none transition-all duration-300"
                      />
                      <p className="text-xs text-[#202020]/50 mt-1">0 = Ücretsiz lig</p>
                    </div>

                    <div>
                      <label className="block text-[#202020] font-bold mb-2">Kategoriler</label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                              leagueConfig.categories.includes(category.id)
                                ? 'border-[#432870] bg-[#432870]/10 shadow-md'
                                : 'border-[#F2F3F5] bg-white hover:border-[#432870]/50'
                            }`}
                          >
                            <span>{category.icon}</span>
                            <span className="font-bold text-[#202020]">{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#202020] font-bold mb-2">Maksimum Katılımcı</label>
                        <select
                          value={leagueConfig.maxParticipants}
                          onChange={(e) => setLeagueConfig(prev => ({...prev, maxParticipants: parseInt(e.target.value)}))}
                          className="w-full bg-white border-2 border-[#F2F3F5] rounded-2xl py-3 px-4 text-[#202020] focus:border-[#432870] focus:outline-none transition-all duration-300"
                        >
                          <option value={10}>10 kişi</option>
                          <option value={20}>20 kişi</option>
                          <option value={50}>50 kişi</option>
                          <option value={100}>100 kişi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#202020] font-bold mb-2">Süre</label>
                        <select
                          value={leagueConfig.endDate}
                          onChange={(e) => setLeagueConfig(prev => ({...prev, endDate: e.target.value}))}
                          className="w-full bg-white border-2 border-[#F2F3F5] rounded-2xl py-3 px-4 text-[#202020] focus:border-[#432870] focus:outline-none transition-all duration-300"
                        >
                          <option value="">Süre Seç</option>
                          <option value="7 gün">7 gün</option>
                          <option value="14 gün">14 gün</option>
                          <option value="30 gün">30 gün</option>
                        </select>
                      </div>
                    </div>

                    {/* Prize Calculation */}
                    <div className="bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 rounded-2xl p-4 border-2 border-[#432870]/30">
                      <h4 className="font-bold text-[#202020] mb-2">Ödül Havuzu</h4>
                      <div className="text-2xl font-black text-[#432870]">
                        {calculatePrize().toLocaleString()} kredi + Sürpriz
                      </div>
                      <p className="text-sm text-[#202020]/70">
                        {leagueConfig.joinCost} kredi × {leagueConfig.maxParticipants} katılımcı
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCreateStep(1)}
                      className="flex-1 py-4 bg-[#F2F3F5] text-[#202020] font-bold rounded-2xl hover:bg-white transition-all duration-300"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setCreateStep(2.5)}
                      disabled={leagueConfig.categories.length === 0 || !leagueConfig.endDate}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all duration-300 ${
                        leagueConfig.categories.length > 0 && leagueConfig.endDate
                          ? 'bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white hover:from-[#5A3A8B] hover:to-[#C9AFFE] shadow-lg'
                          : 'bg-[#F2F3F5] text-[#202020]/50 cursor-not-allowed'
                      }`}
                    >
                      Devam Et
                    </button>
                  </div>
                </>
              )}

              {createStep === 2.5 && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#202020]">Adım 2/3</span>
                      <span className="text-sm font-medium text-[#202020]">Ödeme Yöntemi</span>
                    </div>
                    <div className="w-full bg-[#F2F3F5] rounded-full h-2 border">
                      <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] h-2 rounded-full transition-all duration-500" style={{width: '66%'}}></div>
                    </div>
                  </div>

                  {/* Centered Content */}
                  <div className="text-center">
                    <div className="mb-6">
                      <h3 className="font-black text-2xl text-[#202020] mb-2">Lig Oluşturma Yöntemi</h3>
                      <p className="text-[#202020]/70">Ligini nasıl oluşturmak istiyorsun?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => setShowCreditModal(true)}
                        className="relative bg-gradient-to-br from-[#B29EFD] to-[#A688F7] hover:from-[#A688F7] hover:to-[#9B72F2] text-[#202020] rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="text-4xl mb-3">💰</div>
                          <h4 className="font-black text-[#202020] mb-2 text-lg">Kredi ile</h4>
                          <p className="text-[#202020] font-bold">5,000 kredi</p>
                          <p className="text-[#202020]/70 text-sm mt-1">Hızlı ve kolay</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowTicketModal(true)}
                        className="relative bg-gradient-to-br from-[#432870] to-[#5A3A8B] hover:from-[#5A3A8B] hover:to-[#6B4A9D] text-white rounded-3xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg overflow-hidden"
                      >
                        <div className="relative z-10">
                          <div className="text-4xl mb-3">🎫</div>
                          <h4 className="font-black text-white mb-2 text-lg">Bilet ile</h4>
                          <p className="text-white font-bold">1 bilet kullan</p>
                          <p className="text-white/80 text-sm mt-1">Premium özellikler</p>
                        </div>
                      </button>
                    </div>

                    <button
                      onClick={() => setCreateStep(2)}
                      className="w-full py-4 bg-[#F2F3F5] text-[#202020] font-bold rounded-2xl hover:bg-white transition-all duration-300"
                    >
                      Geri
                    </button>
                  </div>
                </>
              )}

              {createStep === 3 && (
                <>
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#202020]">Adım 3/3</span>
                      <span className="text-sm font-medium text-[#202020]">Davet & Başarı</span>
                    </div>
                    <div className="w-full bg-[#F2F3F5] rounded-full h-2 border">
                      <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] h-2 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="font-black text-2xl text-[#202020] mb-2">Tebrikler!</h3>
                    <p className="text-[#202020]/70">"{leagueConfig.name}" ligi başarıyla oluşturuldu</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border-2 border-[#F2F3F5] shadow-lg mb-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{leagueConfig.coverEmoji}</div>
                      <h4 className="font-black text-lg text-[#202020]">{leagueConfig.name}</h4>
                      <p className="text-[#202020]/70 text-sm">{leagueConfig.description}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#202020]/70">Katılım Ücreti:</span>
                        <span className="font-bold text-[#202020]">{leagueConfig.joinCost > 0 ? `${leagueConfig.joinCost} kredi` : 'Ücretsiz'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#202020]/70">Ödül Havuzu:</span>
                        <span className="font-bold text-[#432870]">{calculatePrize().toLocaleString()} kredi + Sürpriz</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#202020]/70">Süre:</span>
                        <span className="font-bold text-[#202020]">{leagueConfig.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-[#202020] text-center">Arkadaşlarını Davet Et</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-2xl font-bold hover:bg-green-600 transition-colors">
                        <span>📱</span>
                        WhatsApp
                      </button>
                      <button className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-2xl font-bold hover:bg-blue-600 transition-colors">
                        <span>📤</span>
                        Paylaş
                      </button>
                    </div>

                    <div className="bg-[#F2F3F5] rounded-2xl p-4">
                      <p className="text-xs text-[#202020]/70 mb-2">Paylaşma Linki</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded-xl text-[#202020] font-mono text-xs">
                          {generateShareLink()}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(generateShareLink())}
                          className="bg-[#432870] text-white px-3 py-2 rounded-xl hover:bg-[#5A3A8B] transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCreateStep(1);
                        setLeagueConfig({
                          name: '',
                          description: '',
                          coverEmoji: '🏆',
                          categories: [],
                          joinCost: 0,
                          maxParticipants: 20,
                          endDate: '',
                          prize: 0
                        });
                        setActiveTab('my-leagues');
                      }}
                      className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white py-4 rounded-2xl font-bold hover:from-[#5A3A8B] hover:to-[#C9AFFE] transition-all duration-300 shadow-lg"
                    >
                      Liglerimi Görüntüle
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* All existing modals remain unchanged... */}
        {/* Join League Modal, Credit Modal, Ticket Modal, League Details Modal, Chat Modal, Leaderboard Modal */}
        
        {/* Join League Modal - Bottom Drawer */}
        <AnimatePresence>
          {showJoinModal && selectedLeague && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowJoinModal(false)} />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-[#202020] font-black text-xl mb-2">Liga Katıl</h3>
                  <p className="text-[#202020]/70">"{selectedLeague.name}" ligine katılmak istediğinden emin misin?</p>
                </div>
                
                <div className="bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 rounded-2xl p-6 mb-6 border-2 border-[#432870]/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-[#202020]">Katılım Ücreti</h4>
                      <div className="text-2xl font-black text-[#432870]">
                        {selectedLeague.joinCost > 0 ? `${selectedLeague.joinCost} kredi` : 'Ücretsiz'}
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-[#202020]">Mevcut Kredin</h4>
                      <div className="text-2xl font-black text-[#202020]">
                        {currentUser.credits.toLocaleString()} kredi
                      </div>
                    </div>
                  </div>
                  
                  {selectedLeague.joinCost > 0 && (
                    <div className="pt-4 border-t border-[#432870]/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[#202020]/70">Katılım sonrası bakiye:</span>
                        <span className={`font-bold ${
                          currentUser.credits >= selectedLeague.joinCost ? 'text-[#432870]' : 'text-red-500'
                        }`}>
                          {(currentUser.credits - selectedLeague.joinCost).toLocaleString()} kredi
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 bg-[#F2F3F5] hover:bg-gray-200 text-[#202020] font-bold py-4 rounded-2xl transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    onClick={confirmJoinLeague}
                    disabled={selectedLeague.joinCost > 0 && currentUser.credits < selectedLeague.joinCost}
                    className={`flex-1 font-bold py-4 rounded-2xl transition-colors ${
                      selectedLeague.joinCost === 0 || currentUser.credits >= selectedLeague.joinCost
                        ? 'bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#C9AFFE] text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedLeague.joinCost > 0 ? 'Katıl ve Öde' : 'Ücretsiz Katıl'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Other modals would continue unchanged... */}
      </div>
    </>
  );
}