import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FollowersModal } from './FollowersModal';
import { CouponDrawer } from './CouponDrawer';
import { ProfilePage } from './ProfilePage';

export function DemoPage() {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showCouponDrawer, setShowCouponDrawer] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'activity'>('followers');

  // Mock data for coupon drawer
  const mockSelections = [
    {
      id: 1,
      title: "Erdoğan sonraki mitinginde saçını sağa tarar mı?",
      vote: 'yes',
      odds: 1.47,
      boosted: false
    },
    {
      id: 2,
      title: "Netflix yeni dizi sayısını artıracak mı?",
      vote: 'no',
      odds: 2.65,
      boosted: false
    },
    {
      id: 3,
      title: "Spotify podcast yatırımını artıracak mı?",
      vote: 'yes',
      odds: 1.85,
      boosted: true
    }
  ];

  const handleRemoveSelection = (id: number) => {
    console.log('Remove selection:', id);
  };

  const handleClearAll = () => {
    console.log('Clear all selections');
  };

  const handleBack = () => {
    setShowProfilePage(false);
  };

  const handleNotifications = () => {
    console.log('Notifications pressed');
  };

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
  };

  if (showProfilePage) {
    return (
      <ProfilePage
        onBack={handleBack}
        onNotifications={handleNotifications}
        onEditProfile={handleEditProfile}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Demo Sayfası</Text>
        <Text style={styles.headerSubtitle}>Oluşturulan Komponentler</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Followers Modal Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Takipçiler Modal</Text>
          <Text style={styles.sectionDescription}>
            Profil sayfasında takipçi sayısına tıklayınca açılan modal. 
            Takipçiler, Takip Edilenler ve Hareketler sekmeleri içerir.
          </Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setActiveTab('followers');
                setShowFollowersModal(true);
              }}
            >
              <Ionicons name="people" size={20} color="white" />
              <Text style={styles.buttonText}>Takipçiler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setActiveTab('following');
                setShowFollowersModal(true);
              }}
            >
              <Ionicons name="person-add" size={20} color="white" />
              <Text style={styles.buttonText}>Takip Edilenler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setActiveTab('activity');
                setShowFollowersModal(true);
              }}
            >
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.buttonText}>Hareketler</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Share Modal Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Profil Paylaşım Modal</Text>
          <Text style={styles.sectionDescription}>
            Profil sayfasında isim ve kullanıcı adına tıklayınca açılan QR kodlu profil paylaşım penceresi.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowProfilePage(true)}
          >
            <Ionicons name="qr-code" size={20} color="white" />
            <Text style={styles.buttonText}>Profil Sayfasını Aç</Text>
          </TouchableOpacity>
        </View>

        {/* Coupon Drawer Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Kupon Oluşturma Drawer</Text>
          <Text style={styles.sectionDescription}>
            Soru kutucuklarında Evet ve Hayır butonlarına tıklayınca açılan kupon oluşturma penceresi.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowCouponDrawer(true)}
          >
            <Ionicons name="ticket" size={20} color="white" />
            <Text style={styles.buttonText}>Kupon Drawer'ı Aç</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kullanım Talimatları</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <Text style={styles.instructionText}>
              Takipçiler Modal: Üç farklı sekme ile kullanıcı listelerini ve aktiviteleri gösterir
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <Text style={styles.instructionText}>
              Profil Paylaşım: QR kod ile profil paylaşımı ve link kopyalama özelliği
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            <Text style={styles.instructionText}>
              Kupon Drawer: Seçilen tahminleri listeler, toplam oran hesaplar ve kupon oluşturur
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        initialTab={activeTab}
      />

      <CouponDrawer
        isOpen={showCouponDrawer}
        onClose={() => setShowCouponDrawer(false)}
        selections={mockSelections}
        onRemoveSelection={handleRemoveSelection}
        onClearAll={handleClearAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#432870',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 