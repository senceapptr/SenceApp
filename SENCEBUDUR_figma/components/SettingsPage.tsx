import { useState } from 'react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
    language: 'tr',
    currency: 'puan'
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const settingSections = [
    {
      title: 'Bildirimler',
      items: [
        {
          key: 'notifications',
          label: 'Bildirimler',
          description: 'Uygulama bildirimleri',
          type: 'toggle'
        },
        {
          key: 'pushNotifications',
          label: 'Push Bildirimleri',
          description: 'Anlık bildirimler',
          type: 'toggle'
        },
        {
          key: 'emailNotifications',
          label: 'E-posta Bildirimleri',
          description: 'E-posta ile bildirim al',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Görünüm',
      items: [
        {
          key: 'darkMode',
          label: 'Karanlık Mod',
          description: 'Koyu tema kullan',
          type: 'toggle'
        },
        {
          key: 'language',
          label: 'Dil',
          description: 'Türkçe',
          type: 'select'
        }
      ]
    },
    {
      title: 'Hesap',
      items: [
        {
          key: 'privacy',
          label: 'Gizlilik Ayarları',
          description: 'Profil gizliliği ve veri ayarları',
          type: 'navigate'
        },
        {
          key: 'security',
          label: 'Güvenlik',
          description: 'Şifre ve güvenlik ayarları',
          type: 'navigate'
        },
        {
          key: 'backup',
          label: 'Veri Yedekleme',
          description: 'Verilerini yedekle',
          type: 'navigate'
        }
      ]
    },
    {
      title: 'Destek',
      items: [
        {
          key: 'help',
          label: 'Yardım Merkezi',
          description: 'SSS ve destek',
          type: 'navigate'
        },
        {
          key: 'feedback',
          label: 'Geri Bildirim',
          description: 'Önerilerin bizim için değerli',
          type: 'navigate'
        },
        {
          key: 'about',
          label: 'Uygulama Hakkında',
          description: 'Sürüm 1.0.0',
          type: 'navigate'
        }
      ]
    }
  ];

  const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        isOn ? 'bg-[#6B46F0]' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${
          isOn ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="flex-1 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-xl text-gray-900">Ayarlar</h1>
      </div>

      {/* User Info */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="Profil"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">@mehmet_k</h3>
              <p className="text-gray-600 text-sm">Premium Üye</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="px-5 space-y-8">
        {settingSections.map((section) => (
          <div key={section.title}>
            <h2 className="font-bold text-gray-900 text-lg mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.key} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    
                    {item.type === 'toggle' && (
                      <ToggleSwitch
                        isOn={settings[item.key as keyof typeof settings] as boolean}
                        onToggle={() => toggleSetting(item.key)}
                      />
                    )}
                    
                    {item.type === 'select' && (
                      <button className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                        {item.description}
                        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    
                    {item.type === 'navigate' && (
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h2 className="font-bold text-red-600 text-lg mb-4">Tehlikeli Bölge</h2>
          <div className="space-y-3">
            <button className="w-full bg-red-50 border border-red-200 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-100 transition-colors text-left px-4">
              Hesabı Dondur
            </button>
            <button className="w-full bg-red-100 border border-red-300 text-red-800 font-semibold py-3 rounded-xl hover:bg-red-200 transition-colors text-left px-4">
              Hesabı Sil
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center text-gray-500 text-sm">
          <p>Sence v1.0.0</p>
          <p>© 2025 Tüm hakları saklıdır</p>
        </div>
      </div>
    </div>
  );
}