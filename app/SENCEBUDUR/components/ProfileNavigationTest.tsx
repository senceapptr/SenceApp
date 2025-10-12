import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface ProfileNavigationTestProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

export function ProfileNavigationTest({ onNavigate, onClose }: ProfileNavigationTestProps) {
  const testPages = [
    { id: 'profile', name: 'Profil Sayfası', description: 'Ana profil sayfası (Kullanıcı adı tıklama)' },
    { id: 'market', name: 'Market Sayfası', description: 'Kredi ile ürün satın alma' },
    { id: 'write-question', name: 'Soru Yaz Sayfası', description: 'Soru oluşturma ve durum takip' },
    { id: 'edit-profile', name: 'Profil Düzenle Sayfası', description: 'Profil bilgilerini düzenleme' },
    { id: 'settings', name: 'Ayarlar Sayfası', description: 'Uygulama ayarları' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F5', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Profil Navigasyon Testi
      </Text>
      
      <ScrollView>
        {testPages.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => {
              onNavigate(page.id);
              onClose();
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
              {page.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {page.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={{
          backgroundColor: '#432870',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={onClose}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Testi Kapat
        </Text>
      </TouchableOpacity>
    </View>
  );
} 