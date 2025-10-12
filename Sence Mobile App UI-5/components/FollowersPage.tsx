import { useState } from 'react';

interface FollowersPageProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick: (username: string) => void;
}

interface Follower {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isFollowing: boolean;
  mutualFollowers: number;
}

interface Activity {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  action: 'voted_yes' | 'voted_no' | 'created_question' | 'joined_league';
  target: string;
  timestamp: string;
}

export function FollowersPage({ isOpen, onClose, onProfileClick }: FollowersPageProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'activities'>('followers');

  const followers: Follower[] = [
    {
      id: '1',
      username: 'crypto_king',
      displayName: 'Ahmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      isFollowing: true,
      mutualFollowers: 5
    },
    {
      id: '2',
      username: 'prediction_master',
      displayName: 'Zeynep Demir',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face',
      isFollowing: false,
      mutualFollowers: 12
    },
    {
      id: '3',
      username: 'tech_guru',
      displayName: 'Can Özkan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      isFollowing: true,
      mutualFollowers: 3
    },
    {
      id: '4',
      username: 'future_seer',
      displayName: 'Elif Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      isFollowing: false,
      mutualFollowers: 8
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      username: 'crypto_king',
      displayName: 'Ahmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      action: 'voted_yes',
      target: 'Bitcoin 100.000$ geçecek mi?',
      timestamp: '2 dakika önce'
    },
    {
      id: '2',
      username: 'prediction_master',
      displayName: 'Zeynep Demir',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face',
      action: 'voted_no',
      target: 'Tesla yeni model açıklayacak mı?',
      timestamp: '15 dakika önce'
    },
    {
      id: '3',
      username: 'tech_guru',
      displayName: 'Can Özkan',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
      action: 'joined_league',
      target: 'Teknoloji Geleceği Ligi',
      timestamp: '1 saat önce'
    },
    {
      id: '4',
      username: 'future_seer',
      displayName: 'Elif Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      action: 'created_question',
      target: 'Netflix fiyat artışı yapacak mı?',
      timestamp: '3 saat önce'
    }
  ];

  const getActionText = (activity: Activity) => {
    switch (activity.action) {
      case 'voted_yes':
        return `${activity.target} sorusuna Evet dedi`;
      case 'voted_no':
        return `${activity.target} sorusuna Hayır dedi`;
      case 'joined_league':
        return `${activity.target} ligine katıldı`;
      case 'created_question':
        return `${activity.target} sorusunu oluşturdu`;
      default:
        return '';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'voted_yes': return '✅';
      case 'voted_no': return '❌';
      case 'joined_league': return '🏆';
      case 'created_question': return '❓';
      default: return '📝';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Followers Page */}
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-sm mx-auto">
        <div className="bg-white rounded-t-3xl shadow-2xl h-[85vh] flex flex-col overflow-hidden">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Takipçiler</h1>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Tabs */}
            <div className="bg-gray-100 rounded-2xl p-1 flex">
              <button
                onClick={() => setActiveTab('followers')}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'followers'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                👥 Takipçiler ({followers.length})
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'activities'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📈 Aktiviteler
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeTab === 'followers' ? (
              <div className="space-y-3">
                {followers.map((follower, index) => (
                  <div
                    key={follower.id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer hover:scale-102 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => onProfileClick(follower.username)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={follower.avatar} 
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          {follower.isFollowing && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-white text-xs">↔️</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{follower.displayName}</h3>
                          <p className="text-gray-600 text-sm">@{follower.username}</p>
                          {follower.mutualFollowers > 0 && (
                            <p className="text-purple-600 text-xs font-medium">
                              {follower.mutualFollowers} ortak takipçi
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                          follower.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transform hover:scale-105'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle follow/unfollow
                        }}
                      >
                        {follower.isFollowing ? 'Takiptesin' : 'Takip Et'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100 hover:border-purple-200 transition-all duration-300 cursor-pointer hover:scale-102 animate-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => onProfileClick(activity.username)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img 
                          src={activity.avatar} 
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 text-sm">
                          {getActionIcon(activity.action)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{activity.displayName}</span>
                          <span className="text-gray-400 text-xs">@{activity.username}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-1">
                          {getActionText(activity)}
                        </p>
                        <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}