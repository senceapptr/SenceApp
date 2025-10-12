import { useState } from 'react';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'followers' | 'following' | 'activity';
}

export function FollowersModal({ isOpen, onClose, initialTab }: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock data
  const followers = [
    { id: 1, username: 'ahmet_bey', name: 'Ahmet Demir', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 2, username: 'zeynep_k', name: 'Zeynep Kılıç', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 3, username: 'crypto_king', name: 'Crypto King', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 4, username: 'spor_guru', name: 'Spor Guru', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 5, username: 'tech_master', name: 'Tech Master', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', verified: true }
  ];

  const following = [
    { id: 1, username: 'prediction_pro', name: 'Prediction Pro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', verified: true },
    { id: 2, username: 'market_wizard', name: 'Market Wizard', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', verified: false },
    { id: 3, username: 'future_seer', name: 'Future Seer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face', verified: true }
  ];

  const activities = [
    { id: 1, user: 'ahmet_bey', action: '"Galatasaray şampiyonluk yaşayabilir mi?" tahminine', vote: 'Evet', time: '2 dk önce', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
    { id: 2, user: 'zeynep_k', action: '"Bitcoin 100K doları geçecek mi?" tahminine', vote: 'Hayır', time: '5 dk önce', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face' },
    { id: 3, user: 'crypto_king', action: '"Apple\'ın yeni ürünü başarılı olacak mı?" tahminine', vote: 'Evet', time: '12 dk önce', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' },
    { id: 4, user: 'spor_guru', action: '"Fenerbahçe Avrupa\'da ilerleyecek mi?" tahminine', vote: 'Evet', time: '18 dk önce', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
    { id: 5, user: 'tech_master', action: '"Yapay zeka işsizliği artıracak mı?" tahminine', vote: 'Hayır', time: '25 dk önce', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
  ];

  if (!isOpen) return null;

  const UserItem = ({ user, showFollowButton = false }: { user: any; showFollowButton?: boolean }) => (
    <div className="flex items-center justify-between p-4 hover:bg-[#F2F3F5] transition-colors rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-[#432870] to-[#B29EFD] p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[#202020] font-bold text-sm">{user.name}</p>
            {user.verified && (
              <div className="w-4 h-4 bg-[#432870] rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-[#202020]/70 text-xs">@{user.username}</p>
        </div>
      </div>
      {showFollowButton && (
        <button className="bg-[#432870] hover:bg-[#5A3A8B] text-white px-4 py-2 rounded-full font-bold text-xs transition-colors">
          Takip Et
        </button>
      )}
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="p-4 hover:bg-[#F2F3F5] transition-colors rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#432870] to-[#B29EFD] p-0.5 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img 
              src={activity.avatar} 
              alt={activity.user}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[#202020] text-sm leading-relaxed">
            <span className="font-bold">@{activity.user}</span> {activity.action} 
            <span className={`font-bold ml-1 ${activity.vote === 'Evet' ? 'text-green-600' : 'text-red-600'}`}>
              {activity.vote}
            </span> dedi.
          </p>
          <p className="text-[#202020]/50 text-xs mt-1">{activity.time}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-2">
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1.5 bg-[#F2F3F5] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-[#202020] font-black text-xl">Sosyal</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F3F5] flex items-center justify-center text-[#202020] hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="flex bg-[#F2F3F5] rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'followers'
                  ? 'bg-white text-[#432870] shadow-md'
                  : 'text-[#202020]/70 hover:text-[#202020]'
              }`}
            >
              Takipçiler
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'following'
                  ? 'bg-white text-[#432870] shadow-md'
                  : 'text-[#202020]/70 hover:text-[#202020]'
              }`}
            >
              Takip Edilenler
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === 'activity'
                  ? 'bg-white text-[#432870] shadow-md'
                  : 'text-[#202020]/70 hover:text-[#202020]'
              }`}
            >
              Hareketler
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'followers' && (
            <div className="space-y-2">
              <p className="text-[#202020]/70 text-sm mb-4">{followers.length} takipçi</p>
              {followers.map((user) => (
                <UserItem key={user.id} user={user} />
              ))}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="space-y-2">
              <p className="text-[#202020]/70 text-sm mb-4">{following.length} takip edilen</p>
              {following.map((user) => (
                <UserItem key={user.id} user={user} showFollowButton />
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-2">
              <p className="text-[#202020]/70 text-sm mb-4">Son hareketler</p>
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}