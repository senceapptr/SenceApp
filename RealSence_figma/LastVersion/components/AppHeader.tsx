import { ProfileDropdown } from './ProfileDropdown';

interface AppHeaderProps {
  title: string;
  isHomePage: boolean;
  showProfileDropdown: boolean;
  onToggleProfileDropdown: () => void;
  gameCredits: number;
  hasNotifications: boolean;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onMarketClick: () => void;
  onEditProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onWriteQuestionClick: () => void;
  onTasksClick: () => void;
}

export function AppHeader({
  title,
  isHomePage,
  showProfileDropdown,
  onToggleProfileDropdown,
  gameCredits,
  hasNotifications,
  onProfileClick,
  onNotificationsClick,
  onMarketClick,
  onEditProfileClick,
  onSettingsClick,
  onLogoutClick,
  onWriteQuestionClick,
  onTasksClick
}: AppHeaderProps) {
  return (
    <div className="bg-[#F2F3F5] px-5 pt-12 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {isHomePage ? (
            <div>
              <h1 className="text-[#432870] text-4xl font-black tracking-wide">
                Sence
              </h1>
            </div>
          ) : (
            <h1 className="text-[#202020] text-3xl font-black">{title}</h1>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={onToggleProfileDropdown}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-all duration-300 relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#B29EFD] rounded-full border-2 border-white flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-[#202020] rounded-full"></div>
              </div>
            )}
          </button>

          <ProfileDropdown
            isOpen={showProfileDropdown}
            onClose={() => onToggleProfileDropdown()}
            gameCredits={gameCredits}
            hasNotifications={hasNotifications}
            onProfileClick={onProfileClick}
            onNotificationsClick={onNotificationsClick}
            onMarketClick={onMarketClick}
            onEditProfileClick={onEditProfileClick}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
            onWriteQuestionClick={onWriteQuestionClick}
            onTasksClick={onTasksClick}
          />
        </div>
      </div>
    </div>
  );
}