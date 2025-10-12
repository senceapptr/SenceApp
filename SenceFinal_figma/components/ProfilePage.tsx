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

  // Weekly prediction data for chart
  const weeklyData = [
    { day: 'Pzt', correct: 8, total: 12, credits: 150 },
    { day: 'Sal', correct: 15, total: 18, credits: 280 },
    { day: 'Çar', correct: 22, total: 25, credits: 420 },
    { day: 'Per', correct: 18, total: 24, credits: 350 },
    { day: 'Cum', correct: 12, total: 16, credits: 190 },
    { day: 'Cmt', correct: 9, total: 14, credits: 140 },
    { day: 'Paz', correct: 5, total: 8, credits: 80 }
  ];

  return (
    <>
      {/* Light Theme Profile Page */}
      <div className="min-h-screen bg-[#F2F3F5] relative overflow-hidden">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-6 pt-16 relative z-10"
        >
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="text-center">
            <p className="text-gray-700 font-bold">@mehmet_k</p>
          </div>
          
          <motion.button 
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Large Profile Info Card with Photo Inside */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={handleProfileShare}
            className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-3xl p-6 relative overflow-hidden group shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="w-full h-full rounded-full bg-white/20 transform translate-x-8 -translate-y-8"></div>
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10 transform translate-x-4 -translate-y-4"></div>
            </div>
            
            <div className="flex items-center gap-6 relative z-10">
              {/* Profile Photo - Left Side */}
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfilePictureModal(true);
                }}
              >
                {/* Profile photo with subtle border */}
                <div className="w-20 h-20 rounded-2xl p-0.5 bg-white/20 backdrop-blur-sm">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#C9F158] rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-[#432870] text-xs font-black">{userStats.level}</span>
                </div>

                {/* Camera icon overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </motion.div>
              
              {/* Profile Info - Right Side */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-black text-xl">Mehmet Kaya</h2>
                  <div className="w-6 h-6 bg-[#C9F158] rounded-full flex items-center justify-center">
                    <span className="text-[#432870] text-xs font-black">{userStats.level}</span>
                  </div>
                </div>
                <p className="text-white/90 font-bold text-lg">@mehmet_k</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-white/90 text-sm font-bold">{successRate}%</span>
                  <span className="text-[#C9F158] text-sm font-bold">↗ Başarı oranı</span>
                </div>
              </div>
              
              {/* Success Rate Number - Far Right */}
              <div className="text-right">
                <div className="text-3xl font-black text-white">{successRate}<span className="text-xl">%</span></div>
                <p className="text-white/80 text-sm">+5.4%</p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Two Column Stats */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mx-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Followers Card */}
          <motion.button
            onClick={() => onFollowersClick('followers')}
            className="bg-white rounded-2xl p-4 text-left shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-gray-600 text-sm">Takipçi</span>
            </div>
            <div className="text-2xl font-black text-gray-900">1,247</div>
            <p className="text-gray-500 text-xs">kişi</p>
          </motion.button>

          {/* Following Card */}
          <motion.button
            onClick={() => onFollowersClick('following')}
            className="bg-white rounded-2xl p-4 text-left shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </div>
              <span className="text-gray-600 text-sm">Takip</span>
            </div>
            <div className="text-2xl font-black text-gray-900">342</div>
            <p className="text-gray-500 text-xs">kişi</p>
          </motion.button>
        </motion.div>

        {/* Bio Section */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-900 font-bold">Hakkında</span>
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-[#B29EFD] text-sm hover:text-[#A688F7] transition-colors"
                >
                  Düzenle
                </button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="w-full bg-[#F2F3F5] border border-gray-200 rounded-xl p-3 text-gray-900 text-sm resize-none focus:border-[#432870] focus:ring-0 transition-colors"
                  placeholder="Kendinden bahset..."
                  rows={3}
                  maxLength={150}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-sm transition-colors"
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
              <p className="text-gray-700 text-sm leading-relaxed">{biography}</p>
            )}
          </div>
        </motion.div>

        {/* Credit Change Chart - Above Achievements */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">Kredi Değişim Grafiği</span>
                </div>
                <div className="text-2xl font-black text-gray-900">1,615<span className="text-lg text-gray-500"> kredi</span></div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-gray-900">{successRate}<span className="text-sm text-gray-500">%</span></div>
                <p className="text-green-500 text-sm font-bold">+5.4%</p>
              </div>
            </div>
            
            {/* Mini Bar Chart */}
            <div className="flex items-end gap-2 h-20">
              {weeklyData.map((data, index) => {
                const height = (data.credits / 450) * 100; // Normalize to max 450 credits
                const isToday = index === 2; // Wednesday is today
                
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '60px' }}>
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                          isToday ? 'bg-gradient-to-t from-[#432870] to-[#B29EFD]' : 'bg-gray-300'
                        }`}
                        style={{ height: `${height}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          className="mx-6 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => setShowAchievements(true)}
            className="w-full bg-white rounded-2xl p-4 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#C9F158] to-[#353831] rounded-lg flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
                <div className="text-left">
                  <p className="text-gray-900 font-bold">Başarılarım</p>
                  <p className="text-gray-600 text-sm">{unlockedAchievements}/6 rozet</p>
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

        {/* Skills Progress */}
        <motion.div 
          className="mx-6 mb-32"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-gray-900 font-bold text-lg mb-6 text-center">Kategori Performansı</h3>
            
            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="transparent"
                  />
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
                    <span className="text-gray-900 font-black text-2xl">{currentSkill.value}%</span>
                    <div className={`text-xs font-bold ${currentSkill.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {currentSkill.trend}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Skill Info */}
            <div className="text-center mb-4">
              <p className="text-gray-900 font-black text-lg">{currentSkill.name}</p>
              <p className="text-gray-600 text-sm">Kategori Başarısı</p>
            </div>

            {/* Skills Navigation */}
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-2 min-w-max">
                {skills.map((skill, index) => (
                  <motion.button
                    key={skill.id}
                    onClick={() => setSelectedSkill(index)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                      selectedSkill === index 
                        ? 'text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      </div>

      {/* Achievements Modal - Light themed */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-4 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl"
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
                          ? 'border-[#432870]/20 bg-white' 
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
                        <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
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

      {/* Profile Picture Modal */}
      <AnimatePresence>
        {showProfilePictureModal && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-4 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-black text-xl">Profil Fotoğrafı</h2>
                    <p className="text-white/80">Fotoğrafını görüntüle veya değiştir</p>
                  </div>
                  <button
                    onClick={() => setShowProfilePictureModal(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Large Profile Photo Display */}
                <div className="flex justify-center mb-8">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-48 h-48 rounded-3xl p-1 bg-gradient-to-r from-[#432870] to-[#B29EFD] shadow-2xl">
                      <div className="w-full h-full rounded-3xl overflow-hidden bg-white">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face" 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Level badge */}
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#C9F158] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-[#432870] font-black text-lg">{userStats.level}</span>
                    </div>
                  </motion.div>
                </div>

                {/* User Info */}
                <div className="text-center mb-8">
                  <h3 className="text-gray-900 font-black text-2xl mb-1">Mehmet Kaya</h3>
                  <p className="text-[#B29EFD] font-bold text-lg mb-2">@mehmet_k</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <span>📸 Son güncelleme: 2 gün önce</span>
                    <span>👁️ Profil görüntülenme: 1,247</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    onClick={() => {
                      // Handle view full size
                      setShowImageViewer(true);
                      setShowProfilePictureModal(false);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Tam Boyut Görüntüle
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      // Handle change photo - you could open a file picker here
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Handle file upload logic here
                          console.log('Selected file:', file);
                          alert('Fotoğraf yükleme özelliği yakında gelecek!');
                        }
                      };
                      input.click();
                    }}
                    className="bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#C5B4FF] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Fotoğraf Değiştir
                  </motion.button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://sence.app/u/mehmet_k');
                      alert('Profil linki kopyalandı!');
                    }}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    🔗 Link Kopyala
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowProfilePictureModal(false);
                      setShowQRModal(true);
                    }}
                    className="bg-green-50 hover:bg-green-100 text-green-600 font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    📱 QR Kod
                  </button>
                  
                  <button
                    onClick={() => setShowProfilePictureModal(false)}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    ✖️ Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Size Image Viewer */}
      <AnimatePresence>
        {showImageViewer && (
          <motion.div 
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <motion.div 
                className="relative max-w-lg w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowImageViewer(false)}
                  className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Full size image */}
                <div className="w-full aspect-square rounded-3xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face" 
                    alt="Profile Full Size"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image info */}
                <div className="mt-4 text-center">
                  <p className="text-white font-bold text-lg">Mehmet Kaya</p>
                  <p className="text-white/70 text-sm">Profil Fotoğrafı</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Share Modal - Light themed */}
      {showQRModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowQRModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div 
              className="bg-white border border-gray-200 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-2">Profili Paylaş</h3>
                <p className="text-gray-600 text-sm">QR kodu taratarak seni takip edebilsinler</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-2xl p-8 mb-6 flex items-center justify-center">
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
                <h4 className="text-gray-900 font-black text-lg">Mehmet Kaya</h4>
                <p className="text-[#B29EFD] font-bold">@mehmet_k • Seviye {userStats.level}</p>
                <p className="text-gray-600 text-sm mt-2">1,247 takipçi • 342 takip</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-2xl transition-colors"
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
    </>
  );
}