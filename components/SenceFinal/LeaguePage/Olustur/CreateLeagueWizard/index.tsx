import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { categoriesService } from '@/services/categories.service';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Details } from './Step2Details';
import { Step3Payment } from './Step3Payment';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CreateLeagueWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: {
    credits: number;
    tickets: number;
  };
}

export function CreateLeagueWizard({ onClose, onSuccess, currentUser }: CreateLeagueWizardProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCapacityPicker, setShowCapacityPicker] = useState(false);
  const [showCreditPaymentModal, setShowCreditPaymentModal] = useState(false);
  const [showTicketPaymentModal, setShowTicketPaymentModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [backendCategories, setBackendCategories] = useState<any[]>([]);
  
  // Button animations
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;

  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    description: '',
    icon: 'trophy', // Ionicons id olarak saklayacağız
    maxParticipants: 10,
    endDate: new Date(),
    isPrivate: false,
    categories: [] as string[],
    joinCost: 0
  });

  const iconOptions = ['🏆', '⚽', '🏀', '🎯', '👑', '💎', '🔥', '⭐', '🎮', '🎪', '🎨', '🚀'];
  
  const availableCategories = [
    { id: 'futbol', name: 'Futbol', icon: '⚽' },
    { id: 'basketbol', name: 'Basketbol', icon: '🏀' },
    { id: 'tenis', name: 'Tenis', icon: '🎾' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'kripto', name: 'Kripto', icon: '₿' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'ekonomi', name: 'Ekonomi', icon: '📈' },
    { id: 'eğlence', name: 'Eğlence', icon: '🎬' },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setLeagueConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const calculatePrize = () => {
    return leagueConfig.joinCost * leagueConfig.maxParticipants;
  };

  const handleCreateWithCredits = () => {
    if (currentUser.credits >= 5000) {
      setShowCreditModal(false);
      createLeague();
    }
  };

  const handleCreateWithTicket = () => {
    if (currentUser.tickets >= 1) {
      setShowTicketModal(false);
      createLeague();
    }
  };

  const createLeague = async () => {
    if (!user) {
      Alert.alert('Hata', 'Lig oluşturmak için giriş yapmalısınız');
      return;
    }

    try {
      setCreating(true);
      
      const result = await leaguesService.createLeague({
        name: leagueConfig.name,
        description: leagueConfig.description,
        type: leagueConfig.isPrivate ? 'private' : 'public',
        max_members: leagueConfig.maxParticipants,
        entry_fee: leagueConfig.joinCost,
        end_date: leagueConfig.endDate.toISOString(),
      });

      if (result.data) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          onSuccess();
        }, 2500);
      }
    } catch (err) {
      console.error('Create league error:', err);
      Alert.alert('Hata', 'Lig oluşturulurken bir hata oluştu');
    } finally {
      setCreating(false);
    }
  };

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await categoriesService.getActiveCategories();
        
        if (error) {
          console.error('Load categories error:', error);
          return;
        }

        if (data) {
          setBackendCategories(data);
        }
      } catch (error) {
        console.error('Load categories error:', error);
      }
    };

    loadCategories();
  }, []);

  const canProceedStep1 = leagueConfig.name.length >= 3 && leagueConfig.description.length >= 10;
  const canProceedStep2 = leagueConfig.categories.length > 0 && leagueConfig.endDate;
  const canProceedStep3 = true; // Step 3'te modal açılacak, her zaman true

  // Button pulse animation
  useEffect(() => {
    if ((step === 1 && canProceedStep1) || (step === 2 && canProceedStep2) || (step === 3 && canProceedStep3)) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonPulseAnim.setValue(1);
    }
  }, [step, canProceedStep1, canProceedStep2]);

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerTitleRow}>
              {/* Seçili icon göster */}
              {leagueConfig.icon && (
                <View style={styles.headerIconContainer}>
                  <Ionicons 
                    name={
                      leagueConfig.icon === 'trophy' ? 'trophy' :
                      leagueConfig.icon === 'flame' ? 'flame' :
                      leagueConfig.icon === 'flash' ? 'flash' :
                      leagueConfig.icon === 'rocket' ? 'rocket' :
                      leagueConfig.icon === 'diamond' ? 'diamond' :
                      leagueConfig.icon === 'star' ? 'star' :
                      leagueConfig.icon === 'shield' ? 'shield' :
                      leagueConfig.icon === 'medal' ? 'medal' :
                      leagueConfig.icon === 'game' ? 'game-controller' :
                      leagueConfig.icon === 'football' ? 'football' :
                      'trophy'
                    } 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </View>
              )}
              
              {/* Title değişir - name varsa onu göster */}
              <View style={styles.headerTextContainer}>
                {leagueConfig.name ? (
                  <>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                      {leagueConfig.name}
                    </Text>
                    <Text style={styles.headerSubtitle} numberOfLines={1}>
                      {leagueConfig.description || 'Açıklama ekle...'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.headerTitle}>Lig Oluştur</Text>
                    <Text style={styles.headerSubtitle}>Kendi ligini oluştur ve arkadaşlarınla yarış!</Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Progress Steps */}
          <View style={styles.progressSteps}>
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <View style={styles.progressStepContainer}>
                  <View
                    style={[
                      styles.progressStep,
                      step > num && styles.progressStepCompleted,
                      step === num && styles.progressStepActive,
                    ]}
                  >
                    {step > num ? (
                      <Text style={styles.progressStepTextCompleted}>✓</Text>
                    ) : (
                      <Text
                        style={[
                          styles.progressStepText,
                          step === num && styles.progressStepTextActive,
                        ]}
                      >
                        {num}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.progressStepLabel,
                      step >= num && styles.progressStepLabelActive,
                    ]}
                  >
                    {num === 1 ? 'Bilgiler' : num === 2 ? 'Detaylar' : 'Ödeme'}
                  </Text>
                </View>
                {num < 3 && (
                  <View
                    style={[
                      styles.progressLine,
                      step > num && styles.progressLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Step1BasicInfo
              leagueConfig={leagueConfig}
              onConfigChange={setLeagueConfig}
            />
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <Step2Details
              leagueConfig={leagueConfig}
              onConfigChange={setLeagueConfig}
              availableCategories={backendCategories.length > 0 ? backendCategories : availableCategories}
              onShowDatePicker={() => setShowDatePicker(true)}
              onShowCapacityPicker={() => setShowCapacityPicker(true)}
            />
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Step3Payment
              currentUserCredits={currentUser.credits || 10000}
              currentUserTickets={currentUser.tickets || 0}
              joinCost={leagueConfig.joinCost}
              onCreditPayment={() => setShowCreditPaymentModal(true)}
              onTicketPayment={() => setShowTicketPaymentModal(true)}
            />
          )}

          {/* Step 2: OLD - Keep for reference but hidden */}
          {false && step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Kategoriler *</Text>
                <View style={styles.categoryGrid}>
                  {availableCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        leagueConfig.categories.includes(cat.id) && styles.categoryButtonActive,
                      ]}
                      onPress={() => handleCategoryToggle(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.categoryText,
                          leagueConfig.categories.includes(cat.id) && styles.categoryTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formField, styles.formFieldHalf]}>
                  <Text style={styles.formLabel}>Kişi Kapasitesi</Text>
                  <TouchableOpacity
                    style={styles.capacityPickerButton}
                    onPress={() => setShowCapacityPicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.capacityPickerText}>
                      {leagueConfig.maxParticipants} kişi
                    </Text>
                    <Text style={styles.capacityPickerIcon}>▼</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.formField, styles.formFieldHalf]}>
                  <Text style={styles.formLabel}>Bitiş Tarihi *</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.datePickerText}>
                      {leagueConfig.endDate.toLocaleDateString('tr-TR')}
                    </Text>
                    <Text style={styles.datePickerIcon}>📅</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Katılım Ücreti (Kredi)</Text>
                <TextInput
                  style={styles.input}
                  value={leagueConfig.joinCost.toString()}
                  onChangeText={(text) =>
                    setLeagueConfig({ ...leagueConfig, joinCost: Math.max(0, parseInt(text) || 0) })
                  }
                  placeholder="0"
                  placeholderTextColor="rgba(32, 32, 32, 0.5)"
                  keyboardType="numeric"
                />
                {leagueConfig.joinCost > 0 && (
                  <View style={styles.prizePoolCard}>
                    <View style={styles.prizePoolRow}>
                      <Text style={styles.prizePoolLabel}>Toplam Ödül Havuzu:</Text>
                      <Text style={styles.prizePoolValue}>
                        {calculatePrize().toLocaleString('tr-TR')} kredi
                      </Text>
                    </View>
                    <Text style={styles.prizePoolSubtext}>
                      {leagueConfig.joinCost} kredi × {leagueConfig.maxParticipants} kişi
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Lig Türü</Text>
                <View style={styles.leagueTypeRow}>
                  <TouchableOpacity
                    style={[
                      styles.leagueTypeButton,
                      !leagueConfig.isPrivate && styles.leagueTypeButtonActive,
                    ]}
                    onPress={() => setLeagueConfig({ ...leagueConfig, isPrivate: false })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.leagueTypeIcon}>🌍</Text>
                    <Text
                      style={[
                        styles.leagueTypeText,
                        !leagueConfig.isPrivate && styles.leagueTypeTextActive,
                      ]}
                    >
                      Herkese Açık
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.leagueTypeButton,
                      leagueConfig.isPrivate && styles.leagueTypeButtonActive,
                    ]}
                    onPress={() => setLeagueConfig({ ...leagueConfig, isPrivate: true })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.leagueTypeIcon}>🔒</Text>
                    <Text
                      style={[
                        styles.leagueTypeText,
                        leagueConfig.isPrivate && styles.leagueTypeTextActive,
                      ]}
                    >
                      Özel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <View style={styles.paymentSection}>
                <Text style={styles.paymentIcon}>💳</Text>
                <Text style={styles.paymentTitle}>Ödeme Yöntemi Seç</Text>
                <Text style={styles.paymentSubtitle}>Ligini oluşturmak için bir yöntem seç</Text>
              </View>

              {/* Credits Option */}
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  currentUser.credits < 5000 && styles.paymentOptionDisabled,
                ]}
                onPress={() => setShowCreditModal(true)}
                disabled={currentUser.credits < 5000}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.paymentOptionGradient}
                >
                  <View style={styles.paymentOptionContent}>
                    <View style={styles.paymentOptionLeft}>
                      <Text style={styles.paymentOptionTitle}>5,000 Kredi Harca</Text>
                      <Text style={styles.paymentOptionDescription}>Mevcut kredinle oluştur</Text>
                    </View>
                    <Text style={styles.paymentOptionEmoji}>💰</Text>
                  </View>
                  <View style={styles.paymentOptionFooter}>
                    <Text style={styles.paymentOptionCredit}>
                      Kredin: {currentUser.credits.toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Ticket Option */}
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => setShowTicketModal(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#C9F158', '#353831']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.paymentOptionGradient}
                >
                  <View style={styles.paymentOptionContent}>
                    <View style={styles.paymentOptionLeft}>
                      <Text style={styles.paymentOptionTitleDark}>Lig Bileti Kullan</Text>
                      <Text style={styles.paymentOptionDescriptionDark}>Veya yeni bilet satın al</Text>
                    </View>
                    <Text style={styles.paymentOptionEmoji}>🎫</Text>
                  </View>
                  <View style={styles.paymentOptionFooter}>
                    <Text style={styles.paymentOptionCreditDark}>
                      Biletlerin: {currentUser.tickets}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        {!showSuccessAnimation && (
          <View style={styles.navigationButtons}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(step - 1)}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>← Geri</Text>
              </TouchableOpacity>
            )}
            
            {step < 3 && (
              <Animated.View
                style={{
                  flex: 1,
                  transform: [
                    { 
                      scale: ((step === 1 && canProceedStep1) || (step === 2 && canProceedStep2)) 
                        ? buttonPulseAnim 
                        : 1 
                    }
                  ],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    ((step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)) &&
                      styles.continueButtonDisabled,
                  ]}
                  onPress={() => setStep(step + 1)}
                  disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.continueButtonContent,
                      {
                        backgroundColor: (step === 1 && canProceedStep1) || (step === 2 && canProceedStep2)
                          ? '#10B981'
                          : '#21262D'
                      }
                    ]}
                  >
                    <Ionicons 
                      name="arrow-forward-circle" 
                      size={22} 
                      color={
                        (step === 1 && canProceedStep1) || (step === 2 && canProceedStep2)
                          ? '#FFFFFF'
                          : '#9CA3AF'
                      } 
                    />
                    <Text
                      style={[
                        styles.continueButtonText,
                        ((step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)) &&
                          styles.continueButtonTextDisabled,
                      ]}
                    >
                      Devam Et
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}

        {/* Credit Modal */}
        <Modal
          visible={showCreditModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCreditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}>💰</Text>
                <Text style={styles.modalTitle}>Kredi ile Oluştur</Text>
                <Text style={styles.modalSubtitle}>Lig oluşturma için kredi harcanacak</Text>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.creditDetails}>
                  <View style={styles.creditRow}>
                    <Text style={styles.creditLabel}>Mevcut Kredin:</Text>
                    <Text style={styles.creditValue}>{currentUser.credits.toLocaleString('tr-TR')}</Text>
                  </View>
                  <View style={styles.creditRow}>
                    <Text style={styles.creditLabel}>Harcanacak:</Text>
                    <Text style={styles.creditValueRed}>-5,000</Text>
                  </View>
                  <View style={[styles.creditRow, styles.creditRowBorder]}>
                    <Text style={styles.creditLabelBold}>Kalacak:</Text>
                    <Text style={styles.creditValueGreen}>
                      {(currentUser.credits - 5000).toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowCreditModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={handleCreateWithCredits}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalConfirmGradient}
                  >
                    <Text style={styles.modalConfirmText}>Onayla</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Ticket Modal */}
        <Modal
          visible={showTicketModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTicketModal(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.ticketModalScroll}>
              <View style={styles.ticketModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>🎫</Text>
                  <Text style={styles.modalTitle}>Lig Bileti</Text>
                  <Text style={styles.modalSubtitle}>Mevcut biletini kullan veya yeni bilet al</Text>
                </View>

                {currentUser.tickets > 0 ? (
                  <View style={styles.modalBody}>
                    <View style={styles.ticketCard}>
                      <Text style={styles.ticketCardLabel}>Mevcut Biletlerin</Text>
                      <Text style={styles.ticketCardValue}>{currentUser.tickets}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.useTicketButton}
                      onPress={handleCreateWithTicket}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.useTicketGradient}
                      >
                        <Text style={styles.useTicketText}>1 Bilet Kullan ve Oluştur</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.modalBody}>
                    <View style={styles.noTicketCard}>
                      <Text style={styles.noTicketText}>Hiç biletiniz yok</Text>
                    </View>
                  </View>
                )}

                <View style={styles.ticketPurchaseSection}>
                  <Text style={styles.ticketPurchaseTitle}>Lig Bileti Satın Al</Text>
                  <View style={styles.ticketOptions}>
                    <TouchableOpacity style={styles.ticketOption} activeOpacity={0.8}>
                      <View style={styles.ticketOptionLeft}>
                        <Text style={styles.ticketOptionTitle}>1 Lig Bileti</Text>
                        <Text style={styles.ticketOptionSubtitle}>En çok tercih edilen</Text>
                      </View>
                      <Text style={styles.ticketOptionPriceOld}>₺39</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ticketOptionFeatured} activeOpacity={0.8}>
                      <View style={styles.ticketBadge}>
                        <Text style={styles.ticketBadgeText}>%24 İNDİRİM</Text>
                      </View>
                      <View style={styles.ticketOptionLeft}>
                        <Text style={styles.ticketOptionTitle}>2 Lig Bileti</Text>
                        <Text style={styles.ticketOptionSubtitle}>Popüler paket</Text>
                      </View>
                      <View style={styles.ticketOptionRight}>
                        <Text style={styles.ticketOptionOldPrice}>₺78</Text>
                        <Text style={styles.ticketOptionPriceOld}>₺59</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ticketOptionBest} activeOpacity={0.8}>
                      <View style={styles.ticketBadgeBest}>
                        <Text style={styles.ticketBadgeBestText}>✨ EN İYİ DEĞER</Text>
                      </View>
                      <View style={styles.ticketOptionLeft}>
                        <Text style={styles.ticketOptionTitle}>5 Lig Bileti</Text>
                        <Text style={styles.ticketOptionSubtitle}>%39 tasarruf</Text>
                      </View>
                      <View style={styles.ticketOptionRight}>
                        <Text style={styles.ticketOptionOldPrice}>₺195</Text>
                        <Text style={styles.ticketOptionPriceOld}>₺119</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.ticketCloseButton}
                  onPress={() => setShowTicketModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ticketCloseText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Capacity Picker Modal */}
        <Modal visible={showCapacityPicker} transparent animationType="slide">
          <View style={styles.capacityPickerOverlay}>
            <View style={styles.capacityPickerContainer}>
              <View style={styles.capacityPickerHeader}>
                <Text style={styles.capacityPickerHeaderTitle}>Kapasite Seç</Text>
                <TouchableOpacity
                  onPress={() => setShowCapacityPicker(false)}
                  style={styles.capacityPickerCloseButton}
                >
                  <Text style={styles.capacityPickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.capacityPickerContent}>
                <Text style={styles.capacityPickerInfo}>
                  Ligin maksimum katılımcı sayısını seçin.
                </Text>
                
                {[10, 20, 50, 100, 200].map((count) => {
                  const isSelected = leagueConfig.maxParticipants === count;
                  
                  return (
                    <TouchableOpacity
                      key={count}
                      style={[styles.capacityOption, isSelected && styles.capacityOptionSelected]}
                      onPress={() => {
                        setLeagueConfig({ ...leagueConfig, maxParticipants: count });
                        setShowCapacityPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.capacityOptionText}>
                        {count} kişi
                      </Text>
                      <Text style={styles.capacityOptionSubtext}>
                        {count === 5 ? '⚡ Hızlı & Rekabetçi' : 
                         count === 10 ? '🎯 Klasik Lig' : 
                         count === 20 ? '🔥 Popüler Format' : 
                         count === 50 ? '🏆 Büyük Arena' : 
                         '👑 Mega Turnuva'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>

        {/* Credit Payment Modal */}
        <Modal visible={showCreditPaymentModal} transparent animationType="slide">
          <View style={styles.paymentModalOverlay}>
            <View style={styles.paymentModalContainer}>
              <View style={styles.paymentModalHeader}>
                <Text style={styles.paymentModalHeaderTitle}>Kredi ile Ödeme</Text>
                <TouchableOpacity
                  onPress={() => setShowCreditPaymentModal(false)}
                  style={styles.paymentModalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#F0F6FC" />
                </TouchableOpacity>
              </View>

              <View style={styles.paymentModalContent}>
                {/* Current Credit */}
                <View style={styles.paymentInfoCard}>
                  <View style={styles.paymentInfoHeader}>
                    <Ionicons name="diamond" size={24} color="#10B981" />
                    <Text style={styles.paymentInfoLabel}>Mevcut Kredi</Text>
                  </View>
                  <Text style={styles.paymentInfoValue}>
                    {(currentUser.credits || 10000).toLocaleString('tr-TR')}
                  </Text>
                </View>

                {/* Cost Breakdown */}
                <View style={styles.paymentBreakdownCard}>
                  <Text style={styles.paymentBreakdownTitle}>Ödeme Detayları</Text>
                  
                  <View style={styles.paymentBreakdownRow}>
                    <Text style={styles.paymentBreakdownLabel}>Lig Oluşturma</Text>
                    <Text style={styles.paymentBreakdownValue}>
                      {leagueConfig.joinCost > 0 ? leagueConfig.joinCost.toLocaleString('tr-TR') : 'Ücretsiz'}
                    </Text>
                  </View>

                  <View style={styles.paymentBreakdownDivider} />

                  <View style={styles.paymentBreakdownRow}>
                    <Text style={styles.paymentBreakdownLabelTotal}>Harcanacak Kredi</Text>
                    <Text style={styles.paymentBreakdownValueTotal}>
                      {leagueConfig.joinCost.toLocaleString('tr-TR')}
                    </Text>
                  </View>

                  <View style={styles.paymentBreakdownRow}>
                    <Text style={styles.paymentBreakdownLabel}>Kalan Kredi</Text>
                    <Text style={[styles.paymentBreakdownValue, { color: '#10B981', fontWeight: '800' }]}>
                      {((currentUser.credits || 10000) - leagueConfig.joinCost).toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.paymentModalActions}>
                  <TouchableOpacity
                    style={styles.paymentCancelButton}
                    onPress={() => setShowCreditPaymentModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.paymentCancelButtonText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.paymentConfirmButton}
                    onPress={createLeague}
                    disabled={creating || (currentUser.credits || 10000) < leagueConfig.joinCost}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.paymentConfirmButtonGradient}
                    >
                      {creating ? (
                        <View style={styles.loadingContainer}>
                          <View style={styles.spinner} />
                          <Text style={styles.paymentConfirmButtonText}>Oluşturuluyor...</Text>
                        </View>
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                          <Text style={styles.paymentConfirmButtonText}>Onayla ve Oluştur</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Ticket Payment Modal */}
        <Modal visible={showTicketPaymentModal} transparent animationType="slide">
          <View style={styles.paymentModalOverlay}>
            <View style={styles.paymentModalContainer}>
              <View style={styles.paymentModalHeader}>
                <Text style={styles.paymentModalHeaderTitle}>Bilet ile Ödeme</Text>
                <TouchableOpacity
                  onPress={() => setShowTicketPaymentModal(false)}
                  style={styles.paymentModalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#F0F6FC" />
                </TouchableOpacity>
              </View>

              <View style={styles.paymentModalContent}>
                {/* Current Tickets */}
                <View style={styles.paymentInfoCard}>
                  <View style={styles.paymentInfoHeader}>
                    <Ionicons name="ticket" size={24} color="#8B5CF6" />
                    <Text style={styles.paymentInfoLabel}>Mevcut Bilet</Text>
                  </View>
                  <Text style={styles.paymentInfoValue}>
                    {currentUser.tickets || 0}
                  </Text>
                </View>

                {/* Ticket Options - Only if user has no tickets */}
                {!(currentUser.tickets > 0) && (
                  <View style={styles.ticketOptionsContainer}>
                    <Text style={styles.ticketOptionsTitle}>Bilet Satın Al</Text>
                    <View style={styles.ticketOptionsGrid}>
                      {[
                        { count: 1, price: 500, discount: 0 },
                        { count: 2, price: 900, discount: 10 },
                        { count: 5, price: 2000, discount: 20 },
                      ].map((option) => (
                        <TouchableOpacity
                          key={option.count}
                          style={styles.ticketOptionCard}
                          activeOpacity={0.8}
                        >
                          <View style={styles.ticketOptionBadge}>
                            {option.discount > 0 && (
                              <View style={styles.ticketDiscountBadge}>
                                <Text style={styles.ticketDiscountText}>-%{option.discount}</Text>
                              </View>
                            )}
                          </View>
                          <Ionicons name="ticket" size={32} color="#8B5CF6" />
                          <Text style={styles.ticketOptionCount}>{option.count} Bilet</Text>
                          <View style={styles.ticketOptionPriceContainer}>
                            <Ionicons name="diamond" size={16} color="#10B981" />
                            <Text style={styles.ticketOptionPrice}>{option.price.toLocaleString('tr-TR')}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* If user has tickets */}
                {currentUser.tickets > 0 && (
                  <View style={styles.paymentBreakdownCard}>
                    <Text style={styles.paymentBreakdownTitle}>Ödeme Detayları</Text>
                    
                    <View style={styles.paymentBreakdownRow}>
                      <Text style={styles.paymentBreakdownLabel}>Lig Oluşturma</Text>
                      <Text style={styles.paymentBreakdownValue}>1 Bilet</Text>
                    </View>

                    <View style={styles.paymentBreakdownDivider} />

                    <View style={styles.paymentBreakdownRow}>
                      <Text style={styles.paymentBreakdownLabel}>Kalan Bilet</Text>
                      <Text style={[styles.paymentBreakdownValue, { color: '#8B5CF6', fontWeight: '800' }]}>
                        {(currentUser.tickets || 0) - 1}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.paymentModalActions}>
                  <TouchableOpacity
                    style={styles.paymentCancelButton}
                    onPress={() => setShowTicketPaymentModal(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.paymentCancelButtonText}>İptal</Text>
                  </TouchableOpacity>

                  {currentUser.tickets > 0 && (
                    <TouchableOpacity
                      style={styles.paymentConfirmButton}
                      onPress={createLeague}
                      disabled={creating}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.paymentConfirmButtonGradient}
                      >
                        {creating ? (
                          <View style={styles.loadingContainer}>
                            <View style={styles.spinner} />
                            <Text style={styles.paymentConfirmButtonText}>Oluşturuluyor...</Text>
                          </View>
                        ) : (
                          <>
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                            <Text style={styles.paymentConfirmButtonText}>Onayla ve Oluştur</Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerHeaderTitle}>Bitiş Tarihi Seç</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.datePickerCloseButton}
                >
                  <Text style={styles.datePickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerContent}>
                <Text style={styles.datePickerInfo}>
                  Ligin bitiş tarihini seçin. En fazla 1 ay sonrasını seçebilirsiniz.
                </Text>
                
                <View style={styles.calendarGridNew}>
                  {/* Calendar Header */}
                  <View style={styles.calendarHeaderNew}>
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
                      <Text key={day} style={styles.calendarDayHeaderNew}>{day}</Text>
                    ))}
                  </View>
                  
                  {/* Calendar Days */}
                  <View style={styles.calendarDaysNew}>
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i + 1);
                      const isSelected = leagueConfig.endDate.toDateString() === date.toDateString();
                      const dayNumber = date.getDate();
                      const dayOfWeek = date.getDay();
                      
                      // Add empty cells for the first week to align days correctly
                      const emptyCells = i === 0 ? Array.from({ length: dayOfWeek }, (_, idx) => (
                        <View key={`empty-${idx}`} style={styles.calendarEmptyDayNew} />
                      )) : [];
                      
                      return (
                        <React.Fragment key={i}>
                          {emptyCells}
                          <TouchableOpacity
                            style={[styles.calendarDayNew, isSelected && styles.calendarDaySelectedNew]}
                            onPress={() => {
                              setLeagueConfig({ ...leagueConfig, endDate: date });
                              setShowDatePicker(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.calendarDayTextNew, isSelected && styles.calendarDayTextSelectedNew]}>
                              {dayNumber}
                            </Text>
                          </TouchableOpacity>
                        </React.Fragment>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success Animation */}
        <Modal visible={showSuccessAnimation} transparent animationType="fade">
          <View style={styles.successContainer}>
            <LinearGradient
              colors={['#10B981', '#059669', '#34D399']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.successGradient}
            >
              <Text style={styles.successIcon}>🏆</Text>
              <Text style={styles.successTitle}>Lig Oluşturuldu!</Text>
              <Text style={styles.successSubtitle}>Ligine yönlendiriliyorsun...</Text>
            </LinearGradient>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    backgroundColor: '#0D1117',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 18,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStepContainer: {
    alignItems: 'center',
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressStepActive: {
    backgroundColor: '#FFFFFF',
  },
  progressStepCompleted: {
    backgroundColor: '#C9F158',
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressStepTextActive: {
    color: '#10B981',
  },
  progressStepTextCompleted: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  progressStepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressStepLabelActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
    borderRadius: 2,
    marginBottom: 20,
  },
  progressLineActive: {
    backgroundColor: '#C9F158',
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 24,
  },
  formField: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F3F5',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#202020',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    textAlign: 'right',
    marginTop: 4,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: (SCREEN_WIDTH - 96) / 6,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderColor: '#10B981',
  },
  iconText: {
    fontSize: 32,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: (SCREEN_WIDTH - 72) / 2,
    padding: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderColor: '#10B981',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  categoryTextActive: {
    color: '#10B981',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formFieldHalf: {
    flex: 1,
  },
  prizePoolCard: {
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: 'rgba(201, 241, 88, 0.3)',
  },
  prizePoolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prizePoolLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  prizePoolValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  prizePoolSubtext: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  leagueTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  leagueTypeButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  leagueTypeButtonActive: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderColor: '#10B981',
  },
  leagueTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  leagueTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  leagueTypeTextActive: {
    color: '#10B981',
  },
  paymentSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
  },
  paymentOption: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  paymentOptionDisabled: {
    opacity: 0.5,
  },
  paymentOptionGradient: {
    padding: 24,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentOptionLeft: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentOptionTitleDark: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
  },
  paymentOptionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  paymentOptionDescriptionDark: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
  },
  paymentOptionEmoji: {
    fontSize: 32,
  },
  paymentOptionFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 12,
  },
  paymentOptionCredit: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  paymentOptionCreditDark: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.9)',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: '#0D1117',
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    minHeight: 80,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#21262D',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#30363D',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  continueButton: {
    flex: 1,
    borderRadius: 18,
    overflow: 'visible',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 10,
    borderRadius: 18,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 60,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  continueButtonTextDisabled: {
    color: '#8B949E',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8B949E',
    textAlign: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  creditDetails: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditRowBorder: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#30363D',
  },
  creditLabel: {
    fontSize: 14,
    color: '#8B949E',
  },
  creditValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  creditValueRed: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF3B30',
  },
  creditLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  creditValueGreen: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34C759',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#21262D',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ticketModalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  ticketModalContent: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    margin: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  ticketCard: {
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderWidth: 2,
    borderColor: '#C9F158',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketCardLabel: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 4,
  },
  ticketCardValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  useTicketButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  useTicketGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  useTicketText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noTicketCard: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  noTicketText: {
    fontSize: 14,
    color: '#8B949E',
  },
  ticketPurchaseSection: {
    borderTopWidth: 2,
    borderTopColor: '#30363D',
    padding: 24,
  },
  ticketPurchaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
    textAlign: 'center',
    marginBottom: 16,
  },
  ticketOptions: {
    gap: 12,
  },
  ticketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#21262D',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  ticketOptionFeatured: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  ticketOptionBest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderWidth: 2,
    borderColor: '#C9F158',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  ticketBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#C9F158',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#202020',
  },
  ticketBadgeBest: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketBadgeBestText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ticketOptionLeft: {
    flex: 1,
  },
  ticketOptionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 2,
  },
  ticketOptionSubtitle: {
    fontSize: 12,
    color: '#8B949E',
  },
  ticketOptionRight: {
    alignItems: 'flex-end',
  },
  ticketOptionOldPrice: {
    fontSize: 12,
    color: '#8B949E',
    textDecorationLine: 'line-through',
  },
  ticketOptionPriceOld: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  ticketCloseButton: {
    margin: 24,
    marginTop: 0,
    paddingVertical: 12,
    backgroundColor: '#21262D',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  ticketCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  successContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  successGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 96,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePickerText: {
    fontSize: 16,
    color: '#202020',
    fontWeight: '600',
  },
  datePickerIcon: {
    fontSize: 18,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  datePickerHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  datePickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#21262D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerCloseText: {
    fontSize: 18,
    color: '#8B949E',
    fontWeight: '600',
  },
  datePickerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  datePickerInfo: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 20,
    textAlign: 'center',
  },
  capacityPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  capacityPickerText: {
    fontSize: 16,
    color: '#202020',
    fontWeight: '600',
  },
  capacityPickerIcon: {
    fontSize: 14,
    color: '#6B7280',
  },
  capacityPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  capacityPickerContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '50%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  capacityPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  capacityPickerHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  capacityPickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#21262D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capacityPickerCloseText: {
    fontSize: 18,
    color: '#8B949E',
    fontWeight: '600',
  },
  capacityPickerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  capacityPickerInfo: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 20,
    textAlign: 'center',
  },
  capacityOption: {
    backgroundColor: '#21262D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  capacityOptionSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  capacityOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0F6FC',
    marginBottom: 4,
  },
  capacityOptionSubtext: {
    fontSize: 14,
    color: '#8B949E',
  },
  calendarGridNew: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeaderNew: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  calendarDayHeaderNew: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
    paddingVertical: 8,
  },
  calendarDaysNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarEmptyDayNew: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: '14.28%',
  },
  calendarDayNew: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    backgroundColor: '#161B22',
  },
  calendarDaySelectedNew: {
    backgroundColor: '#10B981',
  },
  calendarDayTextNew: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F0F6FC',
  },
  calendarDayTextSelectedNew: {
    color: '#FFFFFF',
  },
  // Payment Modal Styles
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  paymentModalContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  paymentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  paymentModalHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  paymentModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentModalContent: {
    padding: 24,
    gap: 20,
  },
  paymentInfoCard: {
    backgroundColor: '#21262D',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  paymentInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  paymentInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
  },
  paymentInfoValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F0F6FC',
    textAlign: 'center',
  },
  paymentBreakdownCard: {
    backgroundColor: '#0D1117',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#30363D',
    gap: 12,
  },
  paymentBreakdownTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  paymentBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentBreakdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
  },
  paymentBreakdownValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  paymentBreakdownLabelTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  paymentBreakdownValueTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EF4444',
  },
  paymentBreakdownDivider: {
    height: 1,
    backgroundColor: '#30363D',
    marginVertical: 8,
  },
  paymentModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  paymentCancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  paymentCancelButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  paymentConfirmButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentConfirmButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentConfirmButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
  },
  // Ticket Options Styles
  ticketOptionsContainer: {
    gap: 16,
  },
  ticketOptionsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  ticketOptionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  ticketOptionCard: {
    flex: 1,
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#30363D',
    position: 'relative',
  },
  ticketOptionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ticketDiscountBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketDiscountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
  },
  ticketOptionCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  ticketOptionPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketOptionPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
});

