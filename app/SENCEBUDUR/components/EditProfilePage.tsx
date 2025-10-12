import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditProfilePageProps {
  onBack: () => void;
}

export function EditProfilePage({ onBack }: EditProfilePageProps) {
  const [displayName, setDisplayName] = useState('Mehmet Kaya');
  const [username, setUsername] = useState('@mehmet_k');
  const [aboutMe, setAboutMe] = useState('Tahmin yapmayı seven spor fanatiği 🏀');
  const [location, setLocation] = useState('İstanbul, Türkiye');
  const [website, setWebsite] = useState('https://www.example.com');

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
          Profili Düzenle
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Profile Picture Section */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#432870',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Ionicons name="person" size={40} color="white" />
            </View>
            
            <TouchableOpacity>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#432870',
                textDecorationLine: 'underline',
              }}>
                Fotoğrafı Değiştir
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={{ gap: 24 }}>
            {/* Display Name */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 8,
              }}>
                Görünen İsim
              </Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={{
                  backgroundColor: '#F2F3F5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                }}
                placeholder="Görünen adınızı girin"
              />
            </View>

            {/* Username */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 8,
              }}>
                Kullanıcı Adı
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={{
                  backgroundColor: '#F2F3F5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                }}
                placeholder="Kullanıcı adınızı girin"
              />
            </View>

            {/* About Me */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 8,
              }}>
                Hakkımda
              </Text>
              <TextInput
                value={aboutMe}
                onChangeText={setAboutMe}
                style={{
                  backgroundColor: '#F2F3F5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                multiline
                maxLength={150}
              />
              <Text style={{
                fontSize: 12,
                color: '#999',
                textAlign: 'right',
                marginTop: 4,
              }}>
                En fazla 150 karakter
              </Text>
            </View>

            {/* Location */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 8,
              }}>
                Konum
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={{
                  backgroundColor: '#F2F3F5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                }}
                placeholder="Konumunuzu girin"
              />
            </View>

            {/* Website */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#202020',
                marginBottom: 8,
              }}>
                Website
              </Text>
              <TextInput
                value={website}
                onChangeText={setWebsite}
                style={{
                  backgroundColor: '#F2F3F5',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#E5E5E5',
                }}
                placeholder="Website adresinizi girin"
                keyboardType="url"
              />
            </View>

            {/* Privacy Settings Section */}
            <View style={{ marginTop: 16 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '900',
                color: '#202020',
                marginBottom: 16,
              }}>
                Gizlilik Ayarları
              </Text>
              
              <TouchableOpacity style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: '#E5E5E5',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
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

          {/* Save Button */}
          <TouchableOpacity style={{
            backgroundColor: '#432870',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 32,
            marginBottom: 20,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
              Değişiklikleri Kaydet
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 