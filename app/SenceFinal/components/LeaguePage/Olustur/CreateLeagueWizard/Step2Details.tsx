import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Step2DetailsProps {
  leagueConfig: {
    categories: string[];
    maxParticipants: number;
    endDate: Date;
    joinCost: number;
    isPrivate: boolean;
  };
  onConfigChange: (config: any) => void;
  availableCategories: Array<{ id: string; name: string; icon: string }>;
  onShowDatePicker: () => void;
  onShowCapacityPicker: () => void;
}

// Participant options
const PARTICIPANT_OPTIONS = [5, 10, 20, 50, 100];

export function Step2Details({ 
  leagueConfig, 
  onConfigChange, 
  availableCategories,
  onShowDatePicker,
  onShowCapacityPicker
}: Step2DetailsProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [categoryAnimations] = useState(() => 
    availableCategories.map(() => new Animated.Value(0))
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const switchAnim = useRef(new Animated.Value(leagueConfig.isPrivate ? 1 : 0)).current;

  useEffect(() => {
    // Page entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger category animations
    categoryAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }).start();
      }, index * 50);
    });
  }, []);

  const handleCategoryToggle = (categoryId: string, index: number) => {
    const anim = categoryAnimations[index];
    
    // Press animation
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 1.2,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(anim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const newCategories = leagueConfig.categories.includes(categoryId)
      ? leagueConfig.categories.filter(id => id !== categoryId)
      : [...leagueConfig.categories, categoryId];
    
    onConfigChange({ ...leagueConfig, categories: newCategories });
  };

  const handlePrivateToggle = () => {
    const newValue = !leagueConfig.isPrivate;
    
    Animated.spring(switchAnim, {
      toValue: newValue ? 1 : 0,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();

    onConfigChange({ ...leagueConfig, isPrivate: newValue });
  };

  const calculatePrizePool = () => {
    return leagueConfig.joinCost * leagueConfig.maxParticipants;
  };

  const switchTranslateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Kategoriler</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Zorunlu</Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            {availableCategories.map((category, index) => {
              const isSelected = leagueConfig.categories.includes(category.id);
              const anim = categoryAnimations[index];
              
              // Backend'den gelen kategori için icon ve renk kullan
              const categoryIcon = category.icon || '📁';
              const categoryColor = category.color || '#6B7280';

              return (
                <Animated.View
                  key={category.id}
                  style={{
                    transform: [{ scale: anim }],
                    overflow: 'visible',
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategoryToggle(category.id, index)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryIconContainer, { backgroundColor: `${categoryColor}20` }]}>
                      <Text style={styles.categoryIcon}>{categoryIcon}</Text>
                    </View>
                    <Text style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}>
                      {category.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.categoryCheckBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {leagueConfig.categories.length > 0 && (
            <View style={styles.selectedCount}>
              <Ionicons name="checkmark-done" size={16} color="#10B981" />
              <Text style={styles.selectedCountText}>
                {leagueConfig.categories.length} kategori seçildi
              </Text>
            </View>
          )}
        </View>

        {/* Settings Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="settings" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Lig Ayarları</Text>
            </View>
          </View>

          <View style={styles.settingsGrid}>
            {/* Max Participants */}
            <TouchableOpacity
              style={styles.settingCard}
              onPress={onShowCapacityPicker}
              activeOpacity={0.7}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="people" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Kişi Sayısı</Text>
                <Text style={styles.settingValue}>{leagueConfig.maxParticipants} kişi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>

            {/* End Date */}
            <TouchableOpacity
              style={styles.settingCard}
              onPress={onShowDatePicker}
              activeOpacity={0.7}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name="calendar" size={24} color="#F59E0B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Bitiş Tarihi</Text>
                <Text style={styles.settingValue}>
                  {leagueConfig.endDate.toLocaleDateString('tr-TR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Join Cost */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="diamond" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Katılım Ücreti</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Ionicons name="wallet" size={20} color="#10B981" />
            </View>
            <TextInput
              style={styles.textInput}
              value={leagueConfig.joinCost.toString()}
              onChangeText={(text) => 
                onConfigChange({ 
                  ...leagueConfig, 
                  joinCost: Math.max(0, parseInt(text) || 0) 
                })
              }
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            <Text style={styles.inputSuffix}>kredi</Text>
          </View>

          {/* Prize Pool Preview */}
          {leagueConfig.joinCost > 0 && (
            <View style={styles.prizePoolCard}>
              <View style={styles.prizePoolHeader}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <Text style={styles.prizePoolTitle}>Toplam Ödül Havuzu</Text>
              </View>
              <Text style={styles.prizePoolAmount}>
                {calculatePrizePool().toLocaleString('tr-TR')} kredi
              </Text>
              <Text style={styles.prizePoolFormula}>
                {leagueConfig.joinCost} kredi × {leagueConfig.maxParticipants} kişi
              </Text>
            </View>
          )}
        </View>

        {/* Privacy Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="lock-closed" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Gizlilik</Text>
            </View>
          </View>

          <View style={styles.privacyOptions}>
            <TouchableOpacity
              style={[
                styles.privacyCard,
                !leagueConfig.isPrivate && styles.privacyCardActive,
              ]}
              onPress={() => !leagueConfig.isPrivate || handlePrivateToggle()}
              activeOpacity={0.7}
            >
              <View style={styles.privacyIconContainer}>
                <Ionicons 
                  name="globe" 
                  size={32} 
                  color={!leagueConfig.isPrivate ? '#10B981' : '#9CA3AF'} 
                />
              </View>
              <Text style={[
                styles.privacyTitle,
                !leagueConfig.isPrivate && styles.privacyTitleActive,
              ]}>
                Herkese Açık
              </Text>
              <Text style={styles.privacyDescription}>
                Herkes ligini görebilir ve katılabilir
              </Text>
              {!leagueConfig.isPrivate && (
                <View style={styles.privacyCheck}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.privacyCard,
                leagueConfig.isPrivate && styles.privacyCardActive,
              ]}
              onPress={() => leagueConfig.isPrivate || handlePrivateToggle()}
              activeOpacity={0.7}
            >
              <View style={styles.privacyIconContainer}>
                <Ionicons 
                  name="lock-closed" 
                  size={32} 
                  color={leagueConfig.isPrivate ? '#8B5CF6' : '#9CA3AF'} 
                />
              </View>
              <Text style={[
                styles.privacyTitle,
                leagueConfig.isPrivate && styles.privacyTitleActive,
              ]}>
                Özel Lig
              </Text>
              <Text style={styles.privacyDescription}>
                Sadece davet ettiğin kişiler katılabilir
              </Text>
              {leagueConfig.isPrivate && (
                <View style={styles.privacyCheck}>
                  <Ionicons name="checkmark-circle" size={24} color="#8B5CF6" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Preview */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt" size={18} color="#432870" />
            <Text style={styles.summaryTitle}>Lig Özeti</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kategoriler</Text>
            <Text style={styles.summaryValue}>
              {leagueConfig.categories.length > 0 
                ? `${leagueConfig.categories.length} seçildi` 
                : 'Seçilmedi'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kapasite</Text>
            <Text style={styles.summaryValue}>{leagueConfig.maxParticipants} kişi</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Süre</Text>
            <Text style={styles.summaryValue}>
              {Math.ceil((leagueConfig.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Katılım</Text>
            <Text style={styles.summaryValue}>
              {leagueConfig.joinCost > 0 ? `${leagueConfig.joinCost} kredi` : 'Ücretsiz'}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>Gizlilik</Text>
            <Text style={styles.summaryValue}>
              {leagueConfig.isPrivate ? '🔒 Özel' : '🌐 Herkese Açık'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  requiredBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    overflow: 'visible',
  },
  categoryButtonActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#432870',
    borderWidth: 3,
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#432870',
    fontWeight: 'bold',
  },
  categoryCheckBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  selectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  selectedCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  // Settings Grid
  settingsGrid: {
    gap: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    padding: 0,
  },
  inputSuffix: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Prize Pool Card
  prizePoolCard: {
    marginTop: 16,
    backgroundColor: '#FFF7ED',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FDBA74',
    borderStyle: 'dashed',
  },
  prizePoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  prizePoolTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },
  prizePoolAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#EA580C',
    marginBottom: 4,
  },
  prizePoolFormula: {
    fontSize: 13,
    color: '#9A3412',
  },
  // Privacy Options
  privacyOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    minHeight: 160,
  },
  privacyCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#432870',
    borderWidth: 3,
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  privacyIconContainer: {
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  privacyTitleActive: {
    color: '#1F2937',
  },
  privacyDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  privacyCheck: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  // Summary Card
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#432870',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRowLast: {
    marginBottom: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

