import { useState } from 'react';
import { FollowersPage } from './FollowersPage';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNotifications: () => void;
  onLogout?: () => void;
  hasNotifications?: boolean;
}

export function ProfileDrawer({ isOpen, onClose, onEditProfile, onSettings, onNotifications, onLogout, hasNotifications }: ProfileDrawerProps) {
  const [showFollowersPage, setShowFollowersPage] = useState(false);
  const [biography, setBiography] = useState("Tahmin ustası 🎯 | Kripto meraklısı ₿ | Her gün yeni trendleri takip ediyorum 📈");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(biography);

  if (!isOpen) return null;

  const stats = [
    { label: 'Toplam Puan', value: '2,450', icon: '💎', color: 'from-yellow-400 to-orange-500' },
    { label: 'Doğru Tahmin', value: '47', icon: '🎯', color: 'from-green-400 to-emerald-500' }
  ];

  const handleFollowersClick = () => {
    setShowFollowersPage(true);
  };

  const handleShareClick = () => {
    console.log('Share profile');
  };

  const handleProfileClick = (username: string) => {
    setShowFollowersPage(false);
    console.log('Navigate to profile:', username);
  };

  const handleBioSave = () => {
    setBiography(tempBio);
    setIsEditingBio(false);
  };

  const handleBioCancel = () => {
    setTempBio(biography);
    setIsEditingBio(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Redesigned Apple-Style Profile Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl h-[88vh] flex flex-col overflow-hidden" style={{
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}>
          {/* Elegant Handle */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4 flex-shrink-0" />
          
          {/* Clean Header Section */}
          <div className="relative bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] px-6 py-6 flex-shrink-0 border-b border-gray-100">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-gray-200/80 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center text-center">
              {/* Large Profile Photo with Clean Design */}
              <div className="relative group cursor-pointer mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white shadow-xl bg-white">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {/* Premium Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-white text-xs">✨</span>
                </div>
              </div>
              
              <h1 className="font-black text-xl text-gray-900 mb-1 tracking-tight">@mehmet_k</h1>
              <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 mb-4">
                <span className="font-bold text-sm">Premium Üye</span>
              </div>
              
              {/* Clean Action Bar */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleFollowersClick}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-gray-900 font-bold text-sm">127 takipçi</span>
                </button>
                
                <button
                  onClick={onNotifications}
                  className="relative w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  )}
                </button>
                
                <button
                  onClick={handleShareClick}
                  className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Elegant Biography Section - No Label */}
          <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
            {isEditingBio ? (
              <div className="space-y-4">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 text-sm leading-relaxed"
                  rows={3}
                  maxLength={150}
                  placeholder="Biyografinizi yazın..."
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{tempBio.length}/150</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBioCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors rounded-xl hover:bg-gray-100"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleBioSave}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <p className="text-gray-700 text-sm leading-relaxed text-center italic">
                  "{biography}"
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Clean Stats Grid */}
          <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="font-black text-xl">{stat.value}</span>
                  </div>
                  <p className="text-white/90 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="px-6 py-4 flex-1 flex flex-col justify-center">
            <div className="space-y-3">
              <button
                onClick={onEditProfile}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">Profili Düzenle</span>
                  <p className="text-sm text-gray-600">Bilgilerini güncelle</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={onSettings}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  ⚙️
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">Ayarlar</span>
                  <p className="text-sm text-gray-600">Uygulama ayarları</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Clean Footer */}
          <div className="border-t border-gray-100 px-6 py-3 flex-shrink-0 bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Sence v1.2.0</p>
              <p className="text-purple-600 text-xs font-medium">Premium deneyim aktif ✨</p>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Page Component */}
      {showFollowersPage && (
        <FollowersPage
          isOpen={showFollowersPage}
          onClose={() => setShowFollowersPage(false)}
          onProfileClick={handleProfileClick}
        />
      )}
    </>
  );
}