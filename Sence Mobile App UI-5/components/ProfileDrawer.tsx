import { useState } from "react";
import { FollowersPage } from "./FollowersPage";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNotifications: () => void;
  onWriteQuestion: () => void;
  onLogout?: () => void;
  hasNotifications?: boolean;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  onEditProfile,
  onSettings,
  onNotifications,
  onWriteQuestion,
  onLogout,
  hasNotifications,
}: ProfileDrawerProps) {
  const [showFollowersPage, setShowFollowersPage] =
    useState(false);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profili Düzenle",
      onClick: onEditProfile,
      color: "text-blue-600",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      label: "Bildirimler",
      onClick: onNotifications,
      color: "text-orange-600",
      badge: hasNotifications,
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4l1-12z"
          />
        </svg>
      ),
      label: "Market",
      onClick: () => {}, // Will be handled by parent
      color: "text-green-600",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      label: "Soru Yaz",
      onClick: onWriteQuestion,
      color: "text-purple-600",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: "Ayarlar",
      onClick: onSettings,
      color: "text-gray-600",
    },
  ];

  const handleFollowersClick = () => {
    setShowFollowersPage(true);
  };

  const handleProfileClick = (username: string) => {
    setShowFollowersPage(false);
    console.log("Navigate to profile:", username);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Profile Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Handle */}
          <div className="w-10 h-1 bg-[#F2F3F5] rounded-full mx-auto mt-3 mb-4" />

          {/* Profile Header */}
          <div className="relative bg-gradient-to-br from-[#F2F3F5] via-white to-[#F2F3F5] px-6 py-6 border-b border-[#F2F3F5]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F2F3F5] flex items-center justify-center text-[#202020] hover:bg-white transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Premium Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-white text-xs">✨</span>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="font-black text-lg text-[#202020] mb-1">
                  @mehmet_k
                </h1>
                <div className="bg-[#432870]/20 text-[#432870] rounded-full px-3 py-1 mb-2 inline-block">
                  <span className="font-bold text-xs">
                    Premium Üye
                  </span>
                </div>
                <button
                  onClick={handleFollowersClick}
                  className="text-[#432870] hover:text-[#5A3A8B] font-bold text-sm transition-colors"
                >
                  127 takipçi →
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-b border-[#F2F3F5]">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-[#C9F158] to-[#B8E146] rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-lg">💎</span>
                  <span className="font-black text-lg">
                    2,450
                  </span>
                </div>
                <p className="text-white/90 text-xs font-bold">
                  Toplam Puan
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-xl p-3 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-lg">🎯</span>
                  <span className="font-black text-lg">47</span>
                </div>
                <p className="text-white/90 text-xs font-bold">
                  Doğru Tahmin
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 py-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-[#F2F3F5] transition-all duration-200 group"
                >
                  <div
                    className={`${item.color} group-hover:scale-110 transition-transform duration-200`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[#202020] font-bold flex-1 text-left">
                    {item.label}
                  </span>
                  {item.badge && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <svg
                    className="w-4 h-4 text-[#202020]/30 group-hover:text-[#202020]/50 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>



          {/* Version Info */}
          <div className="px-6 py-3 bg-[#F2F3F5] text-center">
            <p className="text-[#202020]/50 text-xs">
              Sence v1.2.0 • Premium ✨
            </p>
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