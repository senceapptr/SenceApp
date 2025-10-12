interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  gameCredits: number;
  hasNotifications: boolean;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMarketClick: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onWriteQuestionClick: () => void;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  gameCredits,
  hasNotifications,
  onProfileClick,
  onNotificationsClick,
  onMarketClick,
  onEditProfileClick,
  onSettingsClick,
  onLogoutClick,
  onWriteQuestionClick
}: ProfileDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-[#F2F3F5] z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
      {/* User Info Section */}
      <div className="p-4 bg-gradient-to-r from-[#432870]/10 to-[#432870]/20 border-b border-[#F2F3F5]">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 w-full text-left hover:bg-white/50 rounded-xl p-2 transition-colors"
        >
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" 
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <div>
            <p className="text-[#202020] font-black text-sm">@mehmet_k</p>
            <p className="text-[#432870] text-xs font-bold">{gameCredits} kredi</p>
          </div>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-2">
        <button
          onClick={onNotificationsClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F3F5] rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-[#432870] rounded-full flex items-center justify-center relative">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#B29EFD] rounded-full border border-white"></div>
            )}
          </div>
          <span className="text-[#202020] font-bold text-sm">Bildirimler</span>
        </button>

        <button
          onClick={onMarketClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F3F5] rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#B29EFD] to-[#432870] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 6a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
            </svg>
          </div>
          <span className="text-[#202020] font-bold text-sm">Market</span>
        </button>

        <button
          onClick={onWriteQuestionClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F3F5] rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-[#202020] font-bold text-sm">Soru Yaz</span>
        </button>

        <button
          onClick={onEditProfileClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F3F5] rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-[#B29EFD] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-[#202020] font-bold text-sm">Profili Düzenle</span>
        </button>

        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-[#F2F3F5] rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-[#202020] font-bold text-sm">Ayarlar</span>
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-2 border-t border-[#F2F3F5]">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-left"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="text-red-600 font-bold text-sm">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}