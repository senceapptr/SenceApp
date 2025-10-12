import React from 'react';

interface UnifiedHeaderProps {
  title: string;
  onProfileClick: () => void;
  showProfileDropdown: boolean;
  onCloseDropdown: () => void;
  onProfilePageClick: () => void;
  onNotificationsClick: () => void;
  onTriviaClick: () => void;
  onSwipeClick: () => void;
  onTasksClick: () => void;
  onMarketClick: () => void;
  onWriteQuestionClick: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
}

export function UnifiedHeader({ 
  title, 
  onProfileClick,
  showProfileDropdown,
  onCloseDropdown,
  onProfilePageClick,
  onNotificationsClick,
  onTriviaClick,
  onSwipeClick,
  onTasksClick,
  onMarketClick,
  onWriteQuestionClick,
  onEditProfileClick,
  onSettingsClick
}: UnifiedHeaderProps) {
  const currentUser = {
    username: 'mustafa_92',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    credits: 8500
  };

  return (
    <>
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-black text-3xl text-[#202020]">{title}</h1>
          </div>
          
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={onProfileClick}
              className="w-12 h-12 rounded-full overflow-hidden border-3 border-[#432870] hover:border-[#5A3A8B] transition-colors shadow-lg"
            >
              <img 
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full object-cover"
              />
            </button>
            
            {/* Profile Dropdown - Made smaller */}
            {showProfileDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={onCloseDropdown}
                />
                
                {/* Dropdown Menu - Reduced width and adjusted spacing */}
                <div className="absolute top-16 right-0 w-72 bg-white rounded-3xl shadow-2xl border-2 border-[#F2F3F5] z-50 overflow-hidden">
                  {/* User Profile Section */}
                  <button
                    onClick={onProfilePageClick}
                    className="w-full p-5 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] text-white hover:from-[#5A3A8B] hover:via-[#6B4A9D] hover:to-[#7C5AA8] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-14 h-14 rounded-full border-3 border-white/50"
                      />
                      <div className="text-left flex-1">
                        <h3 className="font-black text-base">@{currentUser.username}</h3>
                        <p className="text-white/90 font-bold text-sm">{currentUser.credits.toLocaleString()} kredi</p>
                      </div>
                      <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Menu Items - Reduced padding */}
                  <div className="p-3 space-y-1">
                    {/* Notifications */}
                    <button
                      onClick={onNotificationsClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Bildirimler</span>
                    </button>

                    {/* Trivia - Made more prominent with orange gradient */}
                    <button
                      onClick={onTriviaClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">🧠</span>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-orange-600 transition-colors text-sm">Trivia</span>
                    </button>

                    {/* Swipe - Made more prominent with pink gradient */}
                    <button
                      onClick={onSwipeClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">👆</span>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-pink-600 transition-colors text-sm">Swipe</span>
                    </button>

                    {/* Tasks */}
                    <button
                      onClick={onTasksClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Görevler</span>
                    </button>

                    {/* Market */}
                    <button
                      onClick={onMarketClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Market</span>
                    </button>

                    {/* Write Question */}
                    <button
                      onClick={onWriteQuestionClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Soru Yaz</span>
                    </button>

                    {/* Edit Profile */}
                    <button
                      onClick={onEditProfileClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Profil Düzenle</span>
                    </button>

                    {/* Settings */}
                    <button
                      onClick={onSettingsClick}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#F2F3F5] transition-colors group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#202020] group-hover:text-[#432870] transition-colors text-sm">Ayarlar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}