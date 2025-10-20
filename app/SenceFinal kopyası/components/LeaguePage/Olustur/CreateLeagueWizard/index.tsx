import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [step, setStep] = useState(1);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCapacityPicker, setShowCapacityPicker] = useState(false);

  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    description: '',
    icon: '🏆',
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

  const createLeague = () => {
    setShowSuccessAnimation(true);
    setTimeout(() => {
      onSuccess();
    }, 2500);
  };

  const canProceedStep1 = leagueConfig.name.length >= 3 && leagueConfig.description.length >= 10;
  const canProceedStep2 = leagueConfig.categories.length > 0 && leagueConfig.endDate;

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#432870', '#5A3A8B', '#B29EFD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.headerIcon}>{leagueConfig.icon}</Text>
          <Text style={styles.headerTitle}>Lig Oluştur</Text>
          <Text style={styles.headerSubtitle}>Kendi ligini oluştur ve arkadaşlarınla yarış!</Text>

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
        </LinearGradient>

        {/* Step Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Lig İkonu</Text>
                <View style={styles.iconGrid}>
                  {iconOptions.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        leagueConfig.icon === icon && styles.iconButtonActive,
                      ]}
                      onPress={() => setLeagueConfig({ ...leagueConfig, icon })}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Lig Adı *</Text>
                <TextInput
                  style={styles.input}
                  value={leagueConfig.name}
                  onChangeText={(text) => setLeagueConfig({ ...leagueConfig, name: text })}
                  placeholder="Örn: Süper Tahminler Ligi"
                  placeholderTextColor="rgba(32, 32, 32, 0.5)"
                  maxLength={50}
                />
                <Text style={styles.charCount}>{leagueConfig.name.length}/50</Text>
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Açıklama *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={leagueConfig.description}
                  onChangeText={(text) => setLeagueConfig({ ...leagueConfig, description: text })}
                  placeholder="Liginin amacını ve kurallarını açıkla..."
                  placeholderTextColor="rgba(32, 32, 32, 0.5)"
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
                <Text style={styles.charCount}>{leagueConfig.description.length}/200</Text>
              </View>
            </View>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
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
                  colors={['#432870', '#B29EFD']}
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
                <LinearGradient
                  colors={
                    (step === 1 && canProceedStep1) || (step === 2 && canProceedStep2)
                      ? ['#432870', '#B29EFD']
                      : ['#F3F4F6', '#E5E7EB']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueButtonGradient}
                >
                  <Text
                    style={[
                      styles.continueButtonText,
                      ((step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)) &&
                        styles.continueButtonTextDisabled,
                    ]}
                  >
                    Devam Et →
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
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
                    colors={['#432870', '#B29EFD']}
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
                        colors={['#432870', '#B29EFD']}
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
                      <Text style={styles.ticketOptionPrice}>₺39</Text>
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
                        <Text style={styles.ticketOptionPrice}>₺59</Text>
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
                        <Text style={styles.ticketOptionPrice}>₺119</Text>
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
                        {count <= 20 ? 'Küçük lig' : count <= 100 ? 'Orta lig' : 'Büyük lig'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
              colors={['#432870', '#5A3A8B', '#B29EFD']}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
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
    color: '#432870',
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
    borderColor: '#432870',
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
    borderColor: '#432870',
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
    color: '#432870',
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
    color: '#432870',
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
    borderColor: '#432870',
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
    color: '#432870',
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
    paddingBottom: 24,
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  continueButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: 'rgba(32, 32, 32, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
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
    color: '#202020',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  creditDetails: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
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
    borderTopColor: '#FFFFFF',
  },
  creditLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  creditValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  creditValueRed: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF3B30',
  },
  creditLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
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
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    margin: 16,
    overflow: 'hidden',
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
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 4,
  },
  ticketCardValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#202020',
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
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  noTicketText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  ticketPurchaseSection: {
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    padding: 24,
  },
  ticketPurchaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
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
    backgroundColor: '#F2F3F5',
    padding: 16,
    borderRadius: 16,
  },
  ticketOptionFeatured: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.3)',
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
    backgroundColor: '#432870',
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
    color: '#202020',
    marginBottom: 2,
  },
  ticketOptionSubtitle: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  ticketOptionRight: {
    alignItems: 'flex-end',
  },
  ticketOptionOldPrice: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    textDecorationLine: 'line-through',
  },
  ticketOptionPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  ticketCloseButton: {
    margin: 24,
    marginTop: 0,
    paddingVertical: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  ticketCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  datePickerHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  datePickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerCloseText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  datePickerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  datePickerInfo: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '50%',
  },
  capacityPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  capacityPickerHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  capacityPickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capacityPickerCloseText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  capacityPickerContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  capacityPickerInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  capacityOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  capacityOptionSelected: {
    backgroundColor: '#FDF4FF',
    borderColor: '#432870',
    borderWidth: 2,
  },
  capacityOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
    marginBottom: 4,
  },
  capacityOptionSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  calendarGridNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#6B7280',
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
    backgroundColor: '#F8F9FA',
  },
  calendarDaySelectedNew: {
    backgroundColor: '#432870',
  },
  calendarDayTextNew: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202020',
  },
  calendarDayTextSelectedNew: {
    color: '#FFFFFF',
  },
});

