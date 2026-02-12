import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { categoriesService } from '@/services/categories.service';
import {
  LEAGUE_TICKET_PACKAGES,
  LeagueTicketPackageId,
  leagueTicketPurchaseService,
} from '@/services/league-ticket-purchase.service';

import { PRIMARY_BLUE } from '../../shared/theme';
import { LEAGUE_ICON_OPTIONS } from '../../shared/leagueIcons';

interface CreateLeagueWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: {
    credits: number;
    tickets: number;
  };
}

const ICONS = LEAGUE_ICON_OPTIONS;
const LEAGUE_CREATE_CREDIT_COST = 5000;

// Capacity options
const CAPACITIES = [5, 10, 20, 50, 100];

const CATEGORY_ICON_BY_SLUG: Record<string, keyof typeof Ionicons.glyphMap> = {
  eglence: 'happy-outline',
  finans: 'cash-outline',
  global: 'globe-outline',
  magazin: 'sparkles-outline',
  politika: 'megaphone-outline',
  sinema: 'film-outline',
  sosyalmedya: 'chatbubble-ellipses-outline',
  sosyalmedya2: 'chatbubble-ellipses-outline',
  spor: 'football-outline',
  teknoloji: 'hardware-chip-outline',
};

const resolveCategoryIconName = (category: any): keyof typeof Ionicons.glyphMap => {
  const rawSlug = String(category?.slug || category?.name || '')
    .toLowerCase()
    .replace(/[\s-_]/g, '');

  return CATEGORY_ICON_BY_SLUG[rawSlug] || 'apps-outline';
};

export function CreateLeagueWizard({ currentUser, onClose, onSuccess }: CreateLeagueWizardProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [activePackageId, setActivePackageId] = useState<LeagueTicketPackageId | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showCreditConfirm, setShowCreditConfirm] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [config, setConfig] = useState({
    categories: [] as string[],
    description: '',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    icon: 'trophy',
    isPrivate: false,
    joinCost: 0,
    maxParticipants: 10,
    name: '',
  });

  useEffect(() => {
    categoriesService.getActiveCategories().then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const toggleCategory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(id) ? prev.categories.filter(c => c !== id) : [...prev.categories, id],
    }));
  };

  const validateStep1 = () => {
    return config.name.trim().length >= 3 && config.description.trim().length >= 3;
  };

  const validateStep2 = () => {
    return config.categories.length > 0;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep > step) {
      if (step === 1 && !validateStep1()) return;
      if (step === 2 && !validateStep2()) return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        duration: 200,
        toValue: targetStep > step ? -50 : 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(targetStep);
      slideAnim.setValue(targetStep > step ? 50 : -50);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const selectedIcon = ICONS.find(i => i.id === config.icon) || ICONS[0];
  const canUseCredits = currentUser.credits >= LEAGUE_CREATE_CREDIT_COST;
  const canUseTicket = currentUser.tickets >= 1;

  const handleCreate = async () => {
    if (!user) return;

    try {
      setCreating(true);
      const result = await leaguesService.createLeague({
        category_id: config.categories[0],
        category_ids: config.categories,
        description: config.description.trim(),
        end_date: config.endDate.toISOString(),
        entry_fee: config.joinCost,
        icon_color: selectedIcon.color,
        icon_name: config.icon,
        max_members: config.maxParticipants,
        name: config.name,
        type: config.isPrivate ? 'invite_only' : 'public',
      });

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        setShowCreateSuccess(true);
        setTimeout(() => {
          setShowCreateSuccess(false);
          onSuccess();
        }, 1500);
        return;
      }

      throw new Error('Lig oluşturulamadı. Lütfen tekrar deneyin.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lig oluşturulurken bir hata oluştu';
      Alert.alert('Hata', message);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateWithCredits = async () => {
    setShowCreditConfirm(false);
    await handleCreate();
  };

  const handleCreateWithTicket = async () => {
    setShowTicketModal(false);
    await handleCreate();
  };

  const handlePurchaseTicketPackage = async (packageId: LeagueTicketPackageId) => {
    if (!user) return;

    try {
      setActivePackageId(packageId);
      const result = await leagueTicketPurchaseService.purchasePackage(packageId, user.id);

      if (result.error) {
        Alert.alert('Ödeme Altyapısı Hazır Değil', result.error.message);
        return;
      }

      Alert.alert('Başarılı', 'Bilet paketi satın alındı.');
    } finally {
      setActivePackageId(null);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepIndicatorHeader}>
        <Text style={styles.stepIndicatorTitle}>Adım {step}/3</Text>
        <Text style={styles.stepIndicatorSubtitle}>
          {step === 1 ? 'Temel Bilgiler' : step === 2 ? 'Ayarlar' : 'Onay ve Ödeme'}
        </Text>
      </View>
      <View style={styles.stepSegments}>
        {[1, 2, 3].map(s => (
          <View key={s} style={[styles.stepSegment, s <= step && styles.stepSegmentActive]} />
        ))}
      </View>
      <View style={styles.stepLabelsRow}>
        <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>Bilgiler</Text>
        <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>Ayarlar</Text>
        <Text style={[styles.stepLabel, step === 3 && styles.stepLabelActive]}>Onay</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.section}>
        <Text style={styles.label}>Lig İkonu</Text>
        <View style={styles.iconRow}>
          {ICONS.map(icon => (
            <TouchableOpacity
              key={icon.id}
              style={[styles.iconBtn, config.icon === icon.id && { backgroundColor: icon.color }]}
              onPress={() => setConfig(p => ({ ...p, icon: icon.id }))}
            >
              <Ionicons name={icon.id as any} size={24} color={config.icon === icon.id ? '#fff' : icon.color} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Lig Adı</Text>
        <TextInput
          style={styles.input}
          value={config.name}
          onChangeText={t => setConfig(p => ({ ...p, name: t }))}
          placeholder="Örn: Süper Tahminler Ligi"
          placeholderTextColor="rgba(255,255,255,0.3)"
          maxLength={50}
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={config.description}
          onChangeText={t => setConfig(p => ({ ...p, description: t }))}
          placeholder="Liginin amacını ve kurallarını yaz..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          multiline
          maxLength={200}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.section}>
        <Text style={styles.label}>Kategoriler</Text>
        <View style={styles.catGrid}>
          {categories.map(cat => {
            const iconName = resolveCategoryIconName(cat);
            const iconColor = config.categories.includes(cat.id) ? '#FFFFFF' : cat.color || '#8B949E';

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catBtn, config.categories.includes(cat.id) && styles.catBtnActive]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Ionicons name={iconName} size={17} color={iconColor} />
                <Text style={[styles.catText, config.categories.includes(cat.id) && styles.catTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.settingsRow}>
        <View style={styles.settingBox}>
          <Text style={styles.settingLabel}>Kapasite</Text>
          <View style={styles.capacityRow}>
            {CAPACITIES.map(cap => (
              <TouchableOpacity
                key={cap}
                style={[styles.capBtn, config.maxParticipants === cap && styles.capBtnActive]}
                onPress={() => setConfig(p => ({ ...p, maxParticipants: cap }))}
              >
                <Text style={[styles.capText, config.maxParticipants === cap && styles.capTextActive]}>{cap}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingBox}>
          <Text style={styles.settingLabel}>Tür</Text>
          <View style={styles.privacyRow}>
            <TouchableOpacity
              style={[styles.privBtn, !config.isPrivate && styles.privBtnActive]}
              onPress={() => setConfig(p => ({ ...p, isPrivate: false }))}
            >
              <Ionicons name="globe" size={16} color={!config.isPrivate ? '#fff' : '#666'} />
              <Text style={[styles.privText, !config.isPrivate && styles.privTextActive]}>Açık</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.privBtn, config.isPrivate && styles.privBtnActive]}
              onPress={() => setConfig(p => ({ ...p, isPrivate: true }))}
            >
              <Ionicons name="lock-closed" size={16} color={config.isPrivate ? '#fff' : '#666'} />
              <Text style={[styles.privText, config.isPrivate && styles.privTextActive]}>Özel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Katılım Ücreti (Kredi)</Text>
        <View style={styles.feeRow}>
          <View style={styles.feeInputContainer}>
            <TextInput
              style={styles.feeInput}
              value={config.joinCost.toString()}
              onChangeText={t => setConfig(p => ({ ...p, joinCost: Math.max(0, parseInt(t, 10) || 0) }))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
            <Text style={styles.feeInputSuffix}>kredi</Text>
          </View>

          {config.joinCost > 0 && (
            <View style={styles.prizePreview}>
              <Text style={styles.prizeLabel}>Maksimum Ödül Havuzu</Text>
              <Text style={styles.prizeValue}>
                {(config.joinCost * config.maxParticipants).toLocaleString('tr-TR')} kredi
              </Text>
              <Text style={styles.prizeFormula}>
                {config.joinCost} x {config.maxParticipants} (Katılım Ücreti x Kapasite)
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={[styles.stepContent, styles.stepContentFinal]}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={[styles.summaryIcon, { backgroundColor: selectedIcon.color }]}>
            <Ionicons name={selectedIcon.id as any} size={32} color="#fff" />
          </View>
          <Text style={styles.summaryTitle}>{config.name}</Text>
          <Text style={styles.summaryDesc}>{config.description.trim()}</Text>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Kapasite</Text>
            <Text style={styles.summaryValue}>{config.maxParticipants} Kişi</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Tür</Text>
            <Text style={styles.summaryValue}>{config.isPrivate ? 'Özel' : 'Genel'}</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryLabel}>Giriş</Text>
            <Text style={[styles.summaryValue, { color: PRIMARY_BLUE }]}>
              {config.joinCost > 0 ? `${config.joinCost} Kredi` : 'Ücretsiz'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.paymentTitle}>Nasıl oluşturmak istersin?</Text>

      <TouchableOpacity
        style={[styles.paymentMethod, (!canUseCredits || creating) && styles.paymentMethodDisabled]}
        onPress={() => setShowCreditConfirm(true)}
        disabled={creating || !canUseCredits}
      >
        <LinearGradient colors={['rgba(37, 110, 255,0.1)', 'rgba(37, 110, 255,0.05)']} style={styles.paymentGradient}>
          <View style={[styles.paymentIcon, { backgroundColor: 'rgba(37, 110, 255,0.2)' }]}>
            <Ionicons name="wallet" size={24} color={PRIMARY_BLUE} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Kredi ile Oluştur</Text>
            <Text style={styles.paymentCost}>{LEAGUE_CREATE_CREDIT_COST.toLocaleString('tr-TR')} Kredi</Text>
          </View>
          {canUseCredits ? (
            <Ionicons name="chevron-forward" size={24} color={PRIMARY_BLUE} />
          ) : (
            <Text style={styles.insufficient}>Yetersiz</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.paymentMethod, creating && styles.paymentMethodDisabled]}
        onPress={() => setShowTicketModal(true)}
        disabled={creating}
      >
        <LinearGradient colors={['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.05)']} style={styles.paymentGradient}>
          <View style={[styles.paymentIcon, { backgroundColor: 'rgba(245,158,11,0.2)' }]}>
            <Ionicons name="ticket" size={24} color="#F59E0B" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Bilet Kullan</Text>
            <Text style={styles.paymentCost}>
              {canUseTicket ? `${currentUser.tickets} biletin hazır` : 'Biletin yoksa satın al'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#F59E0B" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const scrollContentStyle = [
    styles.scrollContent,
    step === 3 && styles.scrollContentFinal,
    { paddingBottom: step === 3 ? Math.max(insets.bottom + 12, 24) : 16 },
  ];

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.safeArea}>
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => (step > 1 ? goToStep(step - 1) : onClose())}>
              <Ionicons name={step > 1 ? 'arrow-back' : 'close'} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Lig Oluştur</Text>
            <View style={styles.headerSpacer} />
          </View>

          {renderStepIndicator()}

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={scrollContentStyle}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View
                style={[
                  styles.animatedStepContainer,
                  step === 3 && styles.animatedStepContainerFinal,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>

          {step < 3 && (
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  ((step === 1 && !validateStep1()) || (step === 2 && !validateStep2())) && styles.nextBtnDisabled,
                ]}
                onPress={() => goToStep(step + 1)}
                disabled={(step === 1 && !validateStep1()) || (step === 2 && !validateStep2())}
              >
                <LinearGradient colors={[PRIMARY_BLUE, PRIMARY_BLUE]} style={styles.nextGradient}>
                  <Text style={styles.nextText}>Devam Et</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={showCreditConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreditConfirm(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Kredi ile Oluştur</Text>
            <Text style={styles.confirmSubtitle}>Lig oluşturma ücreti onayı</Text>

            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Mevcut kredi</Text>
              <Text style={styles.confirmValue}>{currentUser.credits.toLocaleString('tr-TR')}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Oluşturma bedeli</Text>
              <Text style={styles.confirmValueNegative}>-{LEAGUE_CREATE_CREDIT_COST.toLocaleString('tr-TR')}</Text>
            </View>
            <View style={[styles.confirmRow, styles.confirmRowFinal]}>
              <Text style={styles.confirmLabelStrong}>Kalan</Text>
              <Text style={styles.confirmValueStrong}>
                {(currentUser.credits - LEAGUE_CREATE_CREDIT_COST).toLocaleString('tr-TR')}
              </Text>
            </View>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setShowCreditConfirm(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmApproveButton, !canUseCredits && styles.confirmApproveButtonDisabled]}
                onPress={handleCreateWithCredits}
                activeOpacity={0.8}
                disabled={!canUseCredits}
              >
                <Text style={styles.confirmApproveText}>Onayla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTicketModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTicketModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.ticketCard}>
            <Text style={styles.confirmTitle}>Bilet ile Oluştur</Text>
            <Text style={styles.confirmSubtitle}>Mevcut biletini kullan veya paket satın al</Text>

            {canUseTicket && (
              <TouchableOpacity style={styles.useTicketButton} onPress={handleCreateWithTicket} activeOpacity={0.8}>
                <Ionicons name="ticket-outline" size={18} color="#FFFFFF" />
                <Text style={styles.useTicketText}>1 Bilet Kullan ({currentUser.tickets} mevcut)</Text>
              </TouchableOpacity>
            )}

            <View style={styles.ticketPackages}>
              {LEAGUE_TICKET_PACKAGES.map(pkg => (
                <TouchableOpacity
                  key={pkg.id}
                  style={styles.ticketPackageItem}
                  onPress={() => handlePurchaseTicketPackage(pkg.id)}
                  activeOpacity={0.8}
                  disabled={activePackageId !== null}
                >
                  <View>
                    <Text style={styles.ticketPackageTitle}>{pkg.title}</Text>
                    <Text style={styles.ticketPackageSubtitle}>{pkg.tickets} lig bileti</Text>
                  </View>
                  {activePackageId === pkg.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.ticketPackagePrice}>{pkg.priceText}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.ticketCloseButton}
              onPress={() => setShowTicketModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.ticketCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCreateSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <LinearGradient colors={[PRIMARY_BLUE, PRIMARY_BLUE, PRIMARY_BLUE]} style={styles.successGradient}>
            <Ionicons name="checkmark-circle-outline" size={96} color="#FFFFFF" />
            <Text style={styles.successTitle}>Ligi Oluşturdun!</Text>
            <Text style={styles.successSubtitle}>Liglerim sayfasına yönlendiriliyorsun...</Text>
          </LinearGradient>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animatedStepContainer: {
    flex: 1,
  },
  animatedStepContainerFinal: {
    flex: 1,
  },
  capacityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  capBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  capBtnActive: {
    backgroundColor: 'rgba(37, 110, 255,0.2)',
    borderColor: '#256EFF',
  },
  capText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
  },
  capTextActive: {
    color: '#256EFF',
  },
  catBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  catBtnActive: {
    backgroundColor: 'rgba(37, 110, 255,0.2)',
    borderColor: '#256EFF',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catIcon: {
    fontSize: 16,
  },
  catText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  catTextActive: {
    color: '#256EFF',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  confirmApproveButton: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  confirmApproveButtonDisabled: {
    opacity: 0.45,
  },
  confirmApproveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmCancelButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  confirmCancelText: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmCard: {
    backgroundColor: '#161B22',
    borderColor: '#30363D',
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 420,
    padding: 20,
    width: '90%',
  },
  confirmLabel: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
  },
  confirmLabelStrong: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confirmRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  confirmRowFinal: {
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 14,
  },
  confirmSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 2,
  },
  confirmTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  confirmValue: {
    color: '#D6E4FF',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmValueNegative: {
    color: '#FCA5A5',
    fontSize: 15,
    fontWeight: '700',
  },
  confirmValueStrong: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  feeInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
    padding: 16,
    paddingRight: 58,
    width: '100%',
  },
  feeInputContainer: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
  },
  feeInputSuffix: {
    color: 'rgba(255,255,255,0.65)',
    position: 'absolute',
    right: 14,
    top: 18,
  },
  feeRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    borderTopColor: 'rgba(255,255,255,0.05)',
    borderTopWidth: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerSpacer: {
    height: 40,
    width: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  iconBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'transparent',
    borderRadius: 14,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
    padding: 16,
  },
  insufficient: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 6,
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  nextBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  paymentCost: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  paymentGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  paymentIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  paymentMethodDisabled: {
    opacity: 0.6,
  },
  paymentName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 8,
  },
  privacyRow: {
    flexDirection: 'column',
    gap: 8,
  },
  privBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    width: '100%',
  },
  privBtnActive: {
    backgroundColor: 'rgba(37, 110, 255,0.2)',
    borderColor: '#256EFF',
  },
  privText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  privTextActive: {
    color: '#fff',
  },
  prizeFormula: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
  prizeLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
  },
  prizePreview: {
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderColor: 'rgba(37, 110, 255,0.4)',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 72,
    padding: 12,
  },
  prizeValue: {
    color: '#256EFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  scrollContentFinal: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 4,
  },
  settingBox: {
    flex: 1,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  settingsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  stepContent: {
    gap: 20,
  },
  stepContentFinal: {
    gap: 14,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },
  stepIndicatorContainer: {
    paddingBottom: 14,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  stepIndicatorHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIndicatorSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  stepIndicatorTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#FFFFFF',
  },
  stepLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  stepSegment: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  stepSegmentActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  stepSegments: {
    flexDirection: 'row',
    gap: 8,
  },
  successGradient: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successOverlay: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    flex: 1,
  },
  successSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 20,
    marginTop: 4,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 20,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    marginBottom: 4,
    padding: 24,
  },
  summaryDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 24,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStats: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  ticketCard: {
    backgroundColor: '#161B22',
    borderColor: '#30363D',
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 420,
    padding: 20,
    width: '90%',
  },
  ticketCloseButton: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
  },
  ticketCloseText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '700',
  },
  ticketPackageItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ticketPackagePrice: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ticketPackages: {
    gap: 10,
    marginTop: 14,
  },
  ticketPackageSubtitle: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 12,
    marginTop: 2,
  },
  ticketPackageTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  useTicketButton: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 46,
  },
  useTicketText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
