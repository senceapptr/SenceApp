import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Türkçe');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
      }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F2F3F5',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#202020" />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 20,
          fontWeight: '900',
          color: '#202020',
        }}>
          Ayarlar
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* User Profile Summary */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#432870',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 4,
              }}>
                @mehmet_k
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#432870',
                fontWeight: 'bold',
              }}>
                Premium Üye
              </Text>
            </View>
          </View>

          {/* Notifications Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 16,
            }}>
              Bildirimler
            </Text>
            
            <View style={{ gap: 12 }}>
              {/* App Notifications */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    Bildirimler
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                  }}>
                    Uygulama bildirimleri
                  </Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#E5E5E5', true: '#432870' }}
                  thumbColor={notifications ? '#B29EFD' : '#FFFFFF'}
                />
              </View>

              {/* Push Notifications */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    Push Bildirimleri
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                  }}>
                    Anlık bildirimler
                  </Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: '#E5E5E5', true: '#432870' }}
                  thumbColor={pushNotifications ? '#B29EFD' : '#FFFFFF'}
                />
              </View>

              {/* Email Notifications */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    E-posta Bildirimleri
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                  }}>
                    E-posta ile bildirim al
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: '#E5E5E5', true: '#432870' }}
                  thumbColor={emailNotifications ? '#B29EFD' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          {/* Appearance Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 16,
            }}>
              Görünüm
            </Text>
            
            <View style={{ gap: 12 }}>
              {/* Dark Mode */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    Karanlık Mod
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                  }}>
                    Koyu tema kullan
                  </Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E5E5', true: '#432870' }}
                  thumbColor={darkMode ? '#B29EFD' : '#FFFFFF'}
                />
              </View>

              {/* Language */}
              <TouchableOpacity style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4,
                  }}>
                    Dil
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                  }}>
                    {language}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 16,
            }}>
              Hesap
            </Text>
            
            <TouchableOpacity style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#202020',
                  marginBottom: 4,
                }}>
                  Gizlilik Ayarları
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                }}>
                  Profil gizliliği ve veri ayarları
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 