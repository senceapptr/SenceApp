import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Step1BasicInfoProps {
  leagueConfig: {
    name: string;
    description: string;
    icon: string;
  };
  onConfigChange: (config: any) => void;
}

// Modern icon options with Ionicons
const ICON_OPTIONS = [
  { id: 'trophy', icon: 'trophy', color: '#FFD700', label: 'Kupa' },
  { id: 'flame', icon: 'flame', color: '#FF6B35', label: 'Ateş' },
  { id: 'flash', icon: 'flash', color: '#F59E0B', label: 'Yıldırım' },
  { id: 'rocket', icon: 'rocket', color: '#8B5CF6', label: 'Roket' },
  { id: 'diamond', icon: 'diamond', color: '#06B6D4', label: 'Elmas' },
  { id: 'star', icon: 'star', color: '#FBBF24', label: 'Yıldız' },
  { id: 'shield', icon: 'shield', color: '#10B981', label: 'Kalkan' },
  { id: 'medal', icon: 'medal', color: '#EF4444', label: 'Madalya' },
  { id: 'game', icon: 'game-controller', color: '#8B5CF6', label: 'Oyun' },
  { id: 'football', icon: 'football', color: '#10B981', label: 'Futbol' },
];

export function Step1BasicInfo({ leagueConfig, onConfigChange }: Step1BasicInfoProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [iconAnimations] = useState(() => 
    ICON_OPTIONS.map(() => ({
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  );
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const previewPulse = useRef(new Animated.Value(1)).current;

  // Get selected icon data
  const selectedIconData = ICON_OPTIONS.find(opt => opt.id === leagueConfig.icon) || ICON_OPTIONS[0];

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

    // Stagger icon animations
    iconAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.spring(anim.rotate, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 60);
    });

    // Preview pulse
    if (leagueConfig.name && leagueConfig.description) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(previewPulse, {
            toValue: 1.03,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(previewPulse, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [leagueConfig.name, leagueConfig.description]);

  const handleIconSelect = (iconId: string, index: number) => {
    // Icon press animation
    const anim = iconAnimations[index];
    Animated.sequence([
      Animated.spring(anim.scale, {
        toValue: 1.4,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(anim.scale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onConfigChange({ ...leagueConfig, icon: iconId });
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    Animated.spring(focusAnim, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setFocusedField(null);
    Animated.spring(focusAnim, {
      toValue: 0,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const focusScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
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
        {/* Icon Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="color-palette" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Lig İkonu</Text>
            </View>
          </View>

          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map((option, index) => {
              const isSelected = leagueConfig.icon === option.id;
              const anim = iconAnimations[index];
              
              const rotate = anim.rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['-15deg', '0deg'],
              });

              return (
              <Animated.View
                key={option.id}
                style={{
                  transform: [
                    { scale: anim.scale },
                    { rotate },
                  ],
                  overflow: 'visible',
                  zIndex: isSelected ? 100 : 1,
                }}
              >
                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      isSelected && styles.iconButtonActive,
                    ]}
                    onPress={() => handleIconSelect(option.id, index)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        isSelected
                          ? [option.color, `${option.color}CC`]
                          : ['#F9FAFB', '#F3F4F6']
                      }
                      style={styles.iconButtonGradient}
                    >
                      <Ionicons 
                        name={option.icon as any} 
                        size={28} 
                        color={isSelected ? '#FFFFFF' : option.color} 
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {/* Checkmark outside button */}
                  {isSelected && (
                    <View style={styles.iconCheckBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>

        </View>

        {/* League Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="text" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Lig Adı</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Zorunlu</Text>
              </View>
            </View>
          </View>

          <Animated.View
            style={[
              styles.inputContainer,
              focusedField === 'name' && styles.inputContainerFocused,
              {
                transform: [{ scale: focusedField === 'name' ? focusScale : 1 }],
              },
            ]}
          >
            <View style={styles.inputIconContainer}>
              <Ionicons 
                name="trophy" 
                size={20} 
                color={focusedField === 'name' ? '#432870' : '#9CA3AF'} 
              />
            </View>
            <TextInput
              style={styles.textInput}
              value={leagueConfig.name}
              onChangeText={(text) => onConfigChange({ ...leagueConfig, name: text })}
              placeholder="Süper Tahminler Ligi"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
            />
            <View style={styles.charCountBadge}>
              <Text style={[
                styles.charCountText,
                leagueConfig.name.length > 45 && styles.charCountWarning
              ]}>
                {leagueConfig.name.length}/50
              </Text>
            </View>
          </Animated.View>

          {/* Name validation feedback */}
          {leagueConfig.name.length > 0 && (
            <View style={styles.validationFeedback}>
              {leagueConfig.name.length >= 3 ? (
                <View style={styles.validationSuccess}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.validationSuccessText}>Harika bir isim!</Text>
                </View>
              ) : (
                <View style={styles.validationWarning}>
                  <Ionicons name="alert-circle" size={16} color="#F59E0B" />
                  <Text style={styles.validationWarningText}>En az 3 karakter olmalı</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* League Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={18} color="#432870" />
              <Text style={styles.sectionTitle}>Açıklama</Text>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>Zorunlu</Text>
              </View>
            </View>
          </View>

          <Animated.View
            style={[
              styles.inputContainer,
              styles.textAreaContainer,
              focusedField === 'description' && styles.inputContainerFocused,
              {
                transform: [{ scale: focusedField === 'description' ? focusScale : 1 }],
              },
            ]}
          >
            <View style={styles.textAreaHeader}>
              <Ionicons 
                name="list" 
                size={20} 
                color={focusedField === 'description' ? '#432870' : '#9CA3AF'} 
              />
              <View style={styles.charCountBadge}>
                <Text style={[
                  styles.charCountText,
                  leagueConfig.description.length > 180 && styles.charCountWarning
                ]}>
                  {leagueConfig.description.length}/200
                </Text>
              </View>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={leagueConfig.description}
              onChangeText={(text) => onConfigChange({ ...leagueConfig, description: text })}
              placeholder="Arkadaşlarınla haftalık tahmin yarışı yap, en yüksek puanı toplayan kazansın!"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
              onFocus={() => handleFocus('description')}
              onBlur={handleBlur}
            />
          </Animated.View>

          {/* Description validation feedback */}
          {leagueConfig.description.length > 0 && (
            <View style={styles.validationFeedback}>
              {leagueConfig.description.length >= 10 ? (
                <View style={styles.validationSuccess}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.validationSuccessText}>Açıklayıcı ve net!</Text>
                </View>
              ) : (
                <View style={styles.validationWarning}>
                  <Ionicons name="alert-circle" size={16} color="#F59E0B" />
                  <Text style={styles.validationWarningText}>En az 10 karakter olmalı</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Live Preview - Şimdilik gizli */}
        {false && leagueConfig.name && leagueConfig.description && (
          <Animated.View
            style={[
              styles.previewSection,
              { transform: [{ scale: previewPulse }] },
            ]}
          >
            <View style={styles.previewHeader}>
              <Ionicons name="eye" size={18} color="#432870" />
              <Text style={styles.previewHeaderText}>Canlı Önizleme</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>CANLI</Text>
              </View>
            </View>

            <View style={styles.previewCard}>
              <LinearGradient
                colors={['#FFFFFF', '#F9FAFB']}
                style={styles.previewGradient}
              >
                {/* Icon */}
                <View style={styles.previewIconContainer}>
                  <LinearGradient
                    colors={[selectedIconData.color, `${selectedIconData.color}CC`]}
                    style={styles.previewIconGradient}
                  >
                    <Ionicons name={selectedIconData.icon as any} size={36} color="#FFFFFF" />
                  </LinearGradient>
                </View>

                {/* Content */}
                <View style={styles.previewContent}>
                  <Text style={styles.previewTitle} numberOfLines={1}>
                    {leagueConfig.name}
                  </Text>
                  <Text style={styles.previewDescription} numberOfLines={2}>
                    {leagueConfig.description}
                  </Text>
                  
                  {/* Stats Preview */}
                  <View style={styles.previewStats}>
                    <View style={styles.previewStat}>
                      <Ionicons name="people" size={14} color="#6B7280" />
                      <Text style={styles.previewStatText}>0/10</Text>
                    </View>
                    <View style={styles.previewDivider} />
                    <View style={styles.previewStat}>
                      <Ionicons name="time" size={14} color="#6B7280" />
                      <Text style={styles.previewStatText}>Aktif</Text>
                    </View>
                  </View>
                </View>

                {/* Action hint */}
                <View style={styles.previewAction}>
                  <Text style={styles.previewActionText}>Böyle görünecek</Text>
                  <Ionicons name="sparkles" size={16} color="#F59E0B" />
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>İpucu:</Text> Kısa ve akılda kalıcı isimler daha çok ilgi çeker
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            </View>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>Güvenlik:</Text> Ligini daha sonra düzenleyebilirsin
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
  // Icon Grid
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  iconButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  iconButtonActive: {
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCheckBadge: {
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
  // Input Container
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#432870',
    shadowColor: '#432870',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    backgroundColor: '#FEFEFE',
  },
  inputIconContainer: {
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 0,
    marginBottom: 12,
  },
  textAreaContainer: {
    minHeight: 140,
  },
  textAreaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  charCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  charCountWarning: {
    color: '#F59E0B',
  },
  // Validation Feedback
  validationFeedback: {
    marginTop: 8,
  },
  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
  },
  validationSuccessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  validationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
  },
  validationWarningText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  // Preview Section
  previewSection: {
    marginBottom: 32,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#432870',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
  },
  previewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
  },
  previewGradient: {
    padding: 20,
  },
  previewIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  previewIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContent: {
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  previewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  previewDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#D1D5DB',
  },
  previewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  previewActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Tips Section
  tipsSection: {
    gap: 12,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
