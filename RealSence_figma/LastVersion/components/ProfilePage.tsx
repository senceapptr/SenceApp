import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePageProps {
  onBack: () => void;
  onFollowersClick: (tab: 'followers' | 'following' | 'activity') => void;
}

export function ProfilePage({ onBack, onFollowersClick }: ProfilePageProps) {
  const [selectedSkill, setSelectedSkill] = useState(0);
  const [biography, setBiography] = useState('Tahmin tutkunuyum! Spor ve teknoloji konularında deneyimliyim. 🏆⚡');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const skills = [
    { id: 0, name: 'Spor', value: 85, color: '#432870', trend: '+12%' },
    { id: 1, name: 'Teknoloji', value: 92, color: '#B29EFD', trend: '+8%' },
    { id: 2, name: 'Finans', value: 76, color: '#432870', trend: '+15%' },
    { id: 3, name: 'Müzik', value: 68, color: '#B29EFD', trend: '-2%' },
    { id: 4, name: 'Politika', value: 74, color: '#432870', trend: '+5%' },
    { id: 5, name: 'Magazin', value: 59, color: '#B29EFD', trend: '+3%' }
  ];

  const achievements = [
    { id: 1, title: 'İlk Hafta', description: '7 gün üst üste tahmin yaptın!', icon: '🔥', color: 'from-orange-500 to-red-500', unlocked: true },
    { id: 2, title: 'Spor Uzmanı', description: 'Spor kategorisinde %80+ başarı', icon: '⚽', color: 'from-green-500 to-emerald-500', unlocked: true },
    { id: 3, title: 'Teknoloji Gurusu', description: 'Teknoloji kategorisinde %90+ başarı', icon: '💻', color: 'from-blue-500 to-purple-500', unlocked: true },
    { id: 4, title: 'Sosyal Kelebek', description: '100+ takipçiye ulaştın', icon: '🦋', color: 'from-pink-500 to-purple-500', unlocked: true },
    { id: 5, title: 'Tahmin Makinesi', description: '500+ tahmin yaptın', icon: '🎯', color: 'from-yellow-500 to-orange-500', unlocked: false },
    { id: 6, title: 'Lig Şampiyonu', description: 'Bir ligde 1. oldun', icon: '👑', color: 'from-yellow-400 to-yellow-600', unlocked: false }
  ];

  const currentSkill = skills[selectedSkill];
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (currentSkill.value / 100) * circumference;

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  
  // User stats for motivation
  const userStats = {
    totalPredictions: 156,
    successfulPredictions: 89,
    currentStreak: 7,
    bestStreak: 23,
    totalCredits: 3420,
    level: 12,
    levelProgress: 68,
    rank: 247
  };

  const successRate = Math.round((userStats.successfulPredictions / userStats.totalPredictions) * 100);

  const handleBioSave = () => {
    setIsEditingBio(false);
    // Here you would save the biography to your backend
  };

  const handleProfileShare = () => {
    setShowQRModal(true);
  };

  const motivationalMessages = [
    "Sen harikasın! 🌟",
    "Tahmin gücün arttı! 📈",
    "Başarı hikayeni yazıyorsun! ✨",
    "Hedefine çok yakınsın! 🎯"
  ];

  const [currentMessage] = useState(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#F2F3F5] via-white to-[#432870]/5 relative overflow-hidden">

        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-6 pt-16"
        >
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#432870] flex items-center justify-center text-white hover:bg-[#5A3A8B] transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <h1 className="text-[#202020] font-black text-lg">Profil</h1>
          
          <motion.button 
            className="w-10 h-10 rounded-full bg-[#432870] flex items-center justify-center text-white hover:bg-[#5A3A8B] transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.button>
        </motion.div>



        {/* Profile Section - Centered */}
        <div className="text-center px-6 mb-8">
          {/* Centered Profile Photo */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              onClick={() => setShowProfilePictureModal(true)}
              className="w-32 h-32 rounded-full bg-gradient-to-r from-[#432870] to-[#B29EFD] p-1 group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              {/* Level Badge */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#C9F158] to-[#353831] rounded-full flex items-center justify-center border-2 border-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs font-black">{userStats.level}</span>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Clickable User Info with Background */}
          <motion.button
            onClick={handleProfileShare}
            className="mb-6 bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10 hover:from-[#432870]/20 hover:to-[#B29EFD]/20 rounded-2xl p-4 transition-all group border border-[#432870]/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-[#202020] font-black text-2xl mb-2 group-hover:text-[#432870] transition-colors">Mehmet Kaya</h2>
            <p className="text-[#432870] font-bold text-lg group-hover:text-[#5A3A8B] transition-colors">@mehmet_k</p>
          </motion.button>
          

          
          {/* Follower and Following Buttons */}
          <motion.div 
            className="flex gap-4 justify-center mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => onFollowersClick('followers')}
              className="bg-[#432870] hover:bg-[#5A3A8B] text-white px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              1,247 Takipçi
            </motion.button>
            <motion.button
              onClick={() => onFollowersClick('following')}
              className="bg-[#B29EFD] hover:bg-[#A688F7] text-[#432870] px-6 py-2 rounded-full font-bold text-sm transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              342 Takip
            </motion.button>
          </motion.div>

          {/* Biography Section */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mx-4 mb-6 shadow-lg border border-[#432870]/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-xl p-3 text-[#202020] text-sm resize-none focus:border-[#432870] focus:ring-0 transition-colors"
                  placeholder="Kendinden bahset..."
                  rows={3}
                  maxLength={150}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#202020] rounded-xl font-bold text-sm transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleBioSave}
                    className="px-4 py-2 bg-[#432870] hover:bg-[#5A3A8B] text-white rounded-xl font-bold text-sm transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-[#202020] text-sm leading-relaxed">{biography}</p>
                <motion.button
                  onClick={() => setIsEditingBio(true)}
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 w-6 h-6 bg-[#432870] rounded-full flex items-center justify-center text-white text-xs transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✏️
                </motion.button>
              </motion.div>
            )}
          </motion.div>
          
          {/* Credit Change Graph Placeholder */}
          <motion.div 
            className="mx-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#432870]/10">
              <h3 className="text-[#202020] font-bold text-base mb-3">Kredi Değişimi</h3>
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#B29EFD]/30 rounded-xl">
                <div className="text-center">
                  <svg className="w-8 h-8 text-[#B29EFD]/50 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-[#202020]/60 text-xs">Grafik yakında</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievement Preview */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => setShowAchievements(true)}
            className="w-full bg-gradient-to-r from-[#C9F158]/20 to-[#353831]/20 hover:from-[#C9F158]/30 hover:to-[#353831]/30 rounded-2xl p-4 border border-[#C9F158]/30 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#C9F158] to-[#353831] rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-left">
                  <p className="text-[#202020] font-bold">Başarılarım</p>
                  <p className="text-[#202020]/70 text-sm">{unlockedAchievements}/6 rozet kazandın</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {achievements.slice(0, 3).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r ' + achievement.color 
                        : 'bg-gray-300'
                    }`}
                  >
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                ))}
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          className="mx-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-[#432870]/10">
            <div className="text-center mb-6">
              <h3 className="text-[#202020] font-black text-lg mb-2">Tahmin İstatistikleri</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-[#432870] font-black text-2xl">{userStats.totalPredictions}</div>
                  <div className="text-[#202020]/70 text-sm">Toplam Tahmin</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-[#B29EFD] font-black text-2xl">{userStats.successfulPredictions}</div>
                  <div className="text-[#202020]/70 text-sm">Başarılı Tahmin</div>
                </motion.div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#F2F3F5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={currentSkill.color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#202020] font-black text-2xl">{currentSkill.value}%</span>
                    <div className={`text-xs font-bold ${currentSkill.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {currentSkill.trend}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Skill Info */}
            <div className="text-center mb-4">
              <p className="text-[#202020] font-black text-lg">{currentSkill.name}</p>
              <p className="text-[#202020]/70 text-sm">Kategori Başarısı</p>
            </div>

            {/* Scrollable Skills Navigation */}
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-2 min-w-max">
                {skills.map((skill, index) => (
                  <motion.button
                    key={skill.id}
                    onClick={() => setSelectedSkill(index)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                      selectedSkill === index 
                        ? 'text-white shadow-md' 
                        : 'bg-[#F2F3F5] text-[#202020] hover:bg-[#432870]/20'
                    }`}
                    style={selectedSkill === index ? { backgroundColor: skill.color } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Bottom Padding for Navigation */}
        <div className="h-20"></div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-4 bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-black text-xl">Başarılarım</h2>
                    <p className="text-white/80">{unlockedAchievements}/6 rozet kazandın</p>
                  </div>
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-2xl border-2 ${
                        achievement.unlocked 
                          ? 'border-[#432870]/20 bg-gradient-to-br from-white to-[#432870]/5' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                      whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                    >
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl ${
                          achievement.unlocked 
                            ? `bg-gradient-to-r ${achievement.color}` 
                            : 'bg-gray-300'
                        }`}>
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </div>
                        <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-[#202020]' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-xs ${achievement.unlocked ? 'text-[#202020]/70' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Share Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowQRModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-[#202020] font-black text-xl mb-2">Profili Paylaş</h3>
                <p className="text-[#202020]/70 text-sm">QR kodu taratarak seni takip edebilsinler</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-[#F2F3F5] rounded-2xl p-8 mb-6 flex items-center justify-center">
                <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center border-2 border-[#432870]/20">
                  <div className="text-center">
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      {[...Array(64)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-[#432870]' : 'bg-white'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-[#432870] text-xs font-bold">@mehmet_k</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h4 className="text-[#202020] font-black text-lg">Mehmet Kaya</h4>
                <p className="text-[#432870] font-bold">@mehmet_k • Seviye {userStats.level}</p>
                <p className="text-[#202020]/70 text-sm mt-2">1,247 takipçi • 342 takip</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-[#F2F3F5] hover:bg-gray-200 text-[#202020] font-bold py-3 rounded-2xl transition-colors"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://sence.app/u/mehmet_k');
                    alert('Profil linki kopyalandı!');
                  }}
                  className="flex-1 bg-[#432870] hover:bg-[#5A3A8B] text-white font-bold py-3 rounded-2xl transition-colors"
                >
                  Linki Kopyala
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Profile Picture Options Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowProfilePictureModal(false)} />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-[#202020] font-black text-xl mb-2">Profil Fotoğrafı</h3>
              <p className="text-[#202020]/70">Ne yapmak istiyorsun?</p>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={() => {
                  setShowProfilePictureModal(false);
                  setShowImageViewer(true);
                }}
                className="w-full bg-[#F2F3F5] hover:bg-[#432870]/10 text-[#202020] font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Profil Fotoğrafını Görüntüle
              </motion.button>

              <motion.button
                onClick={() => {
                  setShowProfilePictureModal(false);
                  alert('Fotoğraf seçme özelliği yakında eklenecek!');
                }}
                className="w-full bg-gradient-to-r from-[#432870] to-[#5A3A8B] hover:from-[#5A3A8B] hover:to-[#432870] text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Profil Fotoğrafını Değiştir
              </motion.button>

              <button
                onClick={() => setShowProfilePictureModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-[#202020] font-bold py-4 rounded-2xl transition-colors"
              >
                İptal
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 pt-16 z-10">
            <button
              onClick={() => setShowImageViewer(false)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-white font-bold">Profil Fotoğrafı</h3>
            
            <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center h-full p-6">
            <div className="w-80 h-80 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center">
              <h4 className="text-white font-bold text-lg mb-1">Mehmet Kaya</h4>
              <p className="text-white/80 text-sm">@mehmet_k • Seviye {userStats.level}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}