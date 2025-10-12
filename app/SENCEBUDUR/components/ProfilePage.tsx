import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ProfilePageProps {
  onBack: () => void;
  onNotifications: () => void;
  onEditProfile: () => void;
  onFollowersClick?: (tab: 'followers' | 'following' | 'activity') => void;
}

export function ProfilePage({ onBack, onNotifications, onEditProfile, onFollowersClick }: ProfilePageProps) {
  const [showQRModal, setShowQRModal] = useState(false);
  
  const userStats = {
    followers: 1247,
    following: 342,
    totalPredictions: 156,
    successfulPredictions: 89,
    successRate: 85,
    primaryCategory: 'Spor'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
      }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#432870',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 20,
          fontWeight: '900',
          color: '#202020',
        }}>
          Profil
        </Text>
        
        <TouchableOpacity
          onPress={onNotifications}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#432870',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="notifications" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 }}>
          {/* Profile Picture */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 16,
            borderWidth: 4,
            borderColor: '#432870',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#432870',
          }}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          
          {/* Name and Username as Button */}
          <TouchableOpacity 
            style={{ 
              alignItems: 'center',
              marginBottom: 20,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(67, 40, 112, 0.05)',
            }}
            onPress={() => setShowQRModal(true)}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 4,
            }}>
              Mehmet Kaya
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 4,
            }}>
              @mehmet_k
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: '#432870',
              fontWeight: '600',
            }}>
              Profili paylaş
            </Text>
          </TouchableOpacity>
          
          {/* Followers/Following Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <TouchableOpacity 
              style={{
                backgroundColor: '#432870',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 20,
              }}
              onPress={() => onFollowersClick?.('followers')}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
                {userStats.followers.toLocaleString()} Takipçi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                backgroundColor: '#B29EFD',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 20,
              }}
              onPress={() => onFollowersClick?.('following')}
              activeOpacity={0.8}
            >
              <Text style={{
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
                {userStats.following} Takip
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 16,
            color: '#202020',
            lineHeight: 24,
          }}>
            Tahmin tutkunuyum! Spor ve teknoloji konularında deneyimliyim. 🏆⚡
          </Text>
        </View>

        {/* Statistics Section */}
        <View style={{
          backgroundColor: 'white',
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '900',
            color: '#202020',
            marginBottom: 20,
          }}>
            Tahmin İstatistikleri
          </Text>
          
          {/* Stats Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '900',
                color: '#432870',
                marginBottom: 4,
              }}>
                {userStats.totalPredictions}
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#666',
              }}>
                Toplam Tahmin
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '900',
                color: '#432870',
                marginBottom: 4,
              }}>
                {userStats.successfulPredictions}
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#666',
              }}>
                Başarılı Tahmin
              </Text>
            </View>
          </View>
          
          {/* Progress Circle */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#F2F3F5',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Progress Ring */}
              <View style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 8,
                borderColor: '#432870',
                borderTopColor: '#F2F3F5',
                borderLeftColor: '#F2F3F5',
                transform: [{ rotate: `${(userStats.successRate / 100) * 360}deg` }],
              }} />
              
              <Text style={{
                fontSize: 24,
                fontWeight: '900',
                color: 'white',
              }}>
                {userStats.successRate}%
              </Text>
            </View>
          </View>
          
          {/* Primary Category */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 4,
            }}>
              {userStats.primaryCategory}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
            }}>
              Kategori Başarısı
            </Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          onPress={onEditProfile}
          style={{
            backgroundColor: '#432870',
            marginHorizontal: 20,
            marginBottom: 20,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            Profili Düzenle
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* QR Code Share Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 32,
            width: '100%',
            maxWidth: 320,
            alignItems: 'center',
          }}>
            {/* Icon */}
            <LinearGradient
              colors={['#432870', '#B29EFD']}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="qr-code" size={32} color="white" />
            </LinearGradient>

            {/* Title */}
            <Text style={{
              fontSize: 20,
              fontWeight: '900',
              color: '#202020',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Profili Paylaş
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: 'rgba(32, 32, 32, 0.7)',
              marginBottom: 24,
              textAlign: 'center',
            }}>
              QR kodu taratarak seni takip edebilsinler
            </Text>

            {/* QR Code Placeholder */}
            <View style={{
              backgroundColor: '#F2F3F5',
              borderRadius: 16,
              padding: 32,
              marginBottom: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                width: 160,
                height: 160,
                backgroundColor: 'white',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'rgba(67, 40, 112, 0.2)',
              }}>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: 128,
                  height: 128,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {[...Array(64)].map((_, i) => (
                    <View 
                      key={i} 
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: Math.random() > 0.5 ? '#432870' : 'white',
                        margin: 1,
                      }}
                    />
                  ))}
                </View>
                <Text style={{
                  color: '#432870',
                  fontSize: 12,
                  fontWeight: '700',
                  marginTop: 8,
                }}>
                  @mehmet_k
                </Text>
              </View>
            </View>

            {/* User Info */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '900',
                color: '#202020',
              }}>
                Mehmet Kaya
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#432870',
                marginTop: 4,
              }}>
                @mehmet_k
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'rgba(32, 32, 32, 0.7)',
                marginTop: 8,
              }}>
                1,247 takipçi • 342 takip
              </Text>
            </View>

            {/* Actions */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
              width: '100%',
            }}>
              <TouchableOpacity
                onPress={() => setShowQRModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#F2F3F5',
                  paddingVertical: 12,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: '#202020',
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                  Kapat
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Başarılı!', 'Profil linki kopyalandı!');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#432870',
                  paddingVertical: 12,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: '700',
                }}>
                  Linki Kopyala
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 