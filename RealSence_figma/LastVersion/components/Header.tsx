interface HeaderProps {
  onProfileClick: () => void;
  onNotificationClick: () => void;
}

export function Header({ onProfileClick, onNotificationClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center">
        <h1 
          className="font-bold text-3xl bg-gradient-to-r from-[#8980F5] via-[#6B46F0] to-[#5B3EE0] bg-clip-text text-transparent drop-shadow-sm"
          style={{ 
            fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          Sence
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <button 
          onClick={onNotificationClick}
          className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs">3</span>
          </div>
        </button>

        {/* Profile Section - Küçültülmüş */}
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-full pl-2 pr-3 py-2 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <span className="font-semibold text-sm text-gray-900 block leading-tight">@mehmet_k</span>
          </div>
        </button>
      </div>
    </div>
  );
}