import { useState } from 'react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
}

export function ProfileDrawer({ isOpen, onClose, onEditProfile, onSettings }: ProfileDrawerProps) {
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl p-6 shadow-2xl">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
          
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div 
                className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:ring-4 hover:ring-purple-100 transition-all"
                onMouseEnter={() => setShowPhotoOptions(true)}
                onMouseLeave={() => setShowPhotoOptions(false)}
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" 
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Photo Options Popup */}
              {showPhotoOptions && (
                <div 
                  className="absolute top-0 left-24 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-10 whitespace-nowrap"
                  onMouseEnter={() => setShowPhotoOptions(true)}
                  onMouseLeave={() => setShowPhotoOptions(false)}
                >
                  <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-gray-700">
                    Profil Fotoğrafını Görüntüle
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-gray-700">
                    Fotoğrafı Değiştir
                  </button>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">@mehmet_k</h2>
              <p className="text-gray-600">Mehmet Kaya</p>
              <p className="text-[#6B46F0] font-semibold">2,450 puan</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="font-bold text-2xl text-gray-900">127</div>
              <div className="text-gray-600">Tahmin</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="font-bold text-2xl text-[#00AF54]">68%</div>
              <div className="text-gray-600">Doğruluk</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="font-bold text-2xl text-[#F5A623]">12</div>
              <div className="text-gray-600">Kazanılan</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <div className="font-bold text-2xl text-gray-900">#248</div>
              <div className="text-gray-600">Sıralama</div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Rozetler</h3>
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏆</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🎯</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">⭐</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={onEditProfile}
              className="w-full bg-[#6B46F0] text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Profili Düzenle
            </button>
            <button 
              onClick={onSettings}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Ayarlar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}