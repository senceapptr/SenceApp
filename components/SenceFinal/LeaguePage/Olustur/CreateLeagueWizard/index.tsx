import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { leaguesService } from '@/services/leagues.service';
import { categoriesService } from '@/services/categories.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CreateLeagueWizardProps {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: {
    credits: number;
    tickets: number;
  };
}

// Icon options
const ICONS = [
  { id: 'trophy', color: '#FFD700' },
  { id: 'flame', color: '#FF6B35' },
  { id: 'rocket', color: '#8B5CF6' },
  { id: 'star', color: '#FBBF24' },
  { id: 'diamond', color: '#06B6D4' },
  { id: 'football', color: '#10B981' },
];

// Capacity options
const CAPACITIES = [5, 10, 20, 50, 100];

export function CreateLeagueWizard({ onClose, onSuccess, currentUser }: CreateLeagueWizardProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Animation for step transitions
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [config, setConfig] = useState({
    name: '',
    description: '',
    icon: 'trophy',
    maxParticipants: 10,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    isPrivate: false,
    categories: [] as string[],
    joinCost: 0,
  });

  // Load categories
  useEffect(() => {
    categoriesService.getActiveCategories().then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const toggleCategory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id],
    }));
  };

  const validateStep1 = () => {
    return config.name.length >= 3 && config.description.length >= 10;
  };

  const validateStep2 = () => {
    return config.categories.length > 0;
  };

  // Step Navigation
  const goToStep = (targetStep: number) => {
    if (targetStep > step) {
      if (step === 1 && !validateStep1()) return;
      if (step === 2 && !validateStep2()) return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: targetStep > step ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setStep(targetStep);
      slideAnim.setValue(targetStep > step ? 50 : -50);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleCreate = async () => {
    if (!user) return;

    try {
      setCreating(true);
      const result = await leaguesService.createLeague({
        name: config.name,
        description: config.description,
        type: config.isPrivate ? 'private' : 'public',
        max_members: config.maxParticipants,
        entry_fee: config.joinCost,
        end_date: config.endDate.toISOString(),
      });

      if (result.data) {
        onSuccess();
      }
    } catch (err) {
      Alert.alert('Hata', 'Lig oluşturulurken bir hata oluştu');
    } finally {
      setCreating(false);
    }
  };

  const selectedIcon = ICONS.find(i => i.id === config.icon) || ICONS[0];

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={styles.stepDotContainer}>
          <View
            style={[
              styles.stepDot,
              s <= step && styles.stepDotActive,
              s === step && styles.stepDotCurrent
            ]}
          />
          {s < 3 && <View style={[styles.stepLine, s < step && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      {/* Icon Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Lig İkonu</Text>
        <View style={styles.iconRow}>
          {ICONS.map(icon => (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconBtn,
                config.icon === icon.id && { backgroundColor: icon.color },
              ]}
              onPress={() => setConfig(p => ({ ...p, icon: icon.id }))}
            >
              <Ionicons
                name={icon.id as any}
                size={24}
                color={config.icon === icon.id ? '#fff' : icon.color}
              />
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
      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.label}>Kategoriler</Text>
        <View style={styles.catGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catBtn,
                config.categories.includes(cat.id) && styles.catBtnActive,
              ]}
              onPress={() => toggleCategory(cat.id)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[
                styles.catText,
                config.categories.includes(cat.id) && styles.catTextActive,
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings Row */}
      <View style={styles.settingsRow}>
        {/* Capacity */}
        <View style={styles.settingBox}>
          <Text style={styles.settingLabel}>Kapasite</Text>
          <View style={styles.capacityRow}>
            {CAPACITIES.map(cap => (
              <TouchableOpacity
                key={cap}
                style={[
                  styles.capBtn,
                  config.maxParticipants === cap && styles.capBtnActive,
                ]}
                onPress={() => setConfig(p => ({ ...p, maxParticipants: cap }))}
              >
                <Text style={[
                  styles.capText,
                  config.maxParticipants === cap && styles.capTextActive,
                ]}>
                  {cap}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.settingBox}>
          <Text style={styles.settingLabel}>Tür</Text>
          <View style={styles.privacyRow}>
            <TouchableOpacity
              style={[
                styles.privBtn,
                !config.isPrivate && styles.privBtnActive,
              ]}
              onPress={() => setConfig(p => ({ ...p, isPrivate: false }))}
            >
              <Ionicons name="globe" size={16} color={!config.isPrivate ? '#fff' : '#666'} />
              <Text style={[styles.privText, !config.isPrivate && styles.privTextActive]}>
                Açık
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.privBtn,
                config.isPrivate && styles.privBtnActive,
              ]}
              onPress={() => setConfig(p => ({ ...p, isPrivate: true }))}
            >
              <Ionicons name="lock-closed" size={16} color={config.isPrivate ? '#fff' : '#666'} />
              <Text style={[styles.privText, config.isPrivate && styles.privTextActive]}>
                Özel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Entry Fee */}
      <View style={styles.section}>
        <Text style={styles.label}>Katılım Ücreti (Kredi)</Text>
        <View style={styles.feeRow}>
          <TextInput
            style={styles.feeInput}
            value={config.joinCost.toString()}
            onChangeText={t => setConfig(p => ({ ...p, joinCost: parseInt(t) || 0 }))}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
          {config.joinCost > 0 && (
            <View style={styles.prizePreview}>
              <Text style={styles.prizeLabel}>Ödül Havuzu:</Text>
              <Text style={styles.prizeValue}>
                {(config.joinCost * config.maxParticipants).toLocaleString('tr-TR')} kredi
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={[styles.summaryIcon, { backgroundColor: selectedIcon.color }]}>
            <Ionicons name={selectedIcon.id as any} size={32} color="#fff" />
          </View>
          <Text style={styles.summaryTitle}>{config.name}</Text>
          <Text style={styles.summaryDesc}>{config.description}</Text>
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
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {config.joinCost > 0 ? `${config.joinCost} Kredi` : 'Ücretsiz'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.paymentTitle}>Nasıl oluşturmak istersin?</Text>

      <TouchableOpacity
        style={styles.paymentMethod}
        onPress={handleCreate}
        disabled={creating}
      >
        <LinearGradient
          colors={['rgba(16,185,129,0.1)', 'rgba(16,185,129,0.05)']}
          style={styles.paymentGradient}
        >
          <View style={[styles.paymentIcon, { backgroundColor: 'rgba(16,185,129,0.2)' }]}>
            <Ionicons name="wallet" size={24} color="#10B981" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Kredi ile Oluştur</Text>
            <Text style={styles.paymentCost}>5,000 Kredi</Text>
          </View>
          {currentUser.credits >= 5000 ? (
            <Ionicons name="chevron-forward" size={24} color="#10B981" />
          ) : (
            <Text style={styles.insufficient}>Yetersiz</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paymentMethod}
        onPress={handleCreate}
        disabled={creating}
      >
        <LinearGradient
          colors={['rgba(245,158,11,0.1)', 'rgba(245,158,11,0.05)']}
          style={styles.paymentGradient}
        >
          <View style={[styles.paymentIcon, { backgroundColor: 'rgba(245,158,11,0.2)' }]}>
            <Ionicons name="ticket" size={24} color="#F59E0B" />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Bilet Kullan</Text>
            <Text style={styles.paymentCost}>1 Bilet</Text>
          </View>
          {currentUser.tickets >= 1 ? (
            <Ionicons name="chevron-forward" size={24} color="#F59E0B" />
          ) : (
            <Text style={styles.insufficient}>Yetersiz</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.safeArea}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => step > 1 ? goToStep(step - 1) : onClose()}
            >
              <Ionicons name={step > 1 ? "arrow-back" : "close"} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {step === 1 ? 'Temel Bilgiler' : step === 2 ? 'Ayarlar' : 'Onay ve Ödeme'}
            </Text>
            <View style={styles.headerBtn} />
          </View>

          {renderStepIndicator()}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
              }}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Footer Navigation */}
          {step < 3 && (
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  ((step === 1 && !validateStep1()) || (step === 2 && !validateStep2())) && styles.nextBtnDisabled
                ]}
                onPress={() => goToStep(step + 1)}
                disabled={(step === 1 && !validateStep1()) || (step === 2 && !validateStep2())}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>Devam Et</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </Modal >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepDotActive: {
    backgroundColor: '#10B981',
  },
  stepDotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0D1117',
    transform: [{ scale: 1.2 }],
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContent: {
    gap: 20,
  },
  section: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  catBtnActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10B981',
  },
  catIcon: {
    fontSize: 16,
  },
  catText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  catTextActive: {
    color: '#10B981',
  },
  settingsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  settingBox: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 10,
  },
  capacityRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  capBtn: {
    minWidth: 40,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flex: 1,
  },
  capBtnActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10B981',
  },
  capText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  capTextActive: {
    color: '#10B981',
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  privBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  privBtnActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10B981',
  },
  privText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  privTextActive: {
    color: '#fff',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feeInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  prizePreview: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  prizeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  prizeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  nextBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  summaryHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  summaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    marginTop: 12,
  },
  paymentMethod: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  paymentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  paymentCost: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  insufficient: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 6,
  },
});
