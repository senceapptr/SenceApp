import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Step1BasicInfoProps {
  leagueConfig: {
    name: string;
    description: string;
    icon: string;
  };
  onConfigChange: (config: any) => void;
  iconOptions: string[];
}

export function Step1BasicInfo({ leagueConfig, onConfigChange, iconOptions }: Step1BasicInfoProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScales = useRef(iconOptions.map(() => new Animated.Value(1))).current;
  const focusScaleAnim = useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

  useEffect(() => {
    // Entrance animation
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

    // Icon hover animations (stagger)
    iconScales.forEach((scale, index) => {
      setTimeout(() => {
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }, index * 50);
    });
  }, []);

  const handleIconPress = (icon: string, index: number) => {
    // Icon press animation
    const scale = iconScales[index];
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.3,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onConfigChange({ ...leagueConfig, icon });
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
    Animated.spring(focusScaleAnim, {
      toValue: 1.02,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
    Animated.spring(focusScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

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
      {/* Icon Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="color-palette" size={20} color="#432870" />
          <Text style={styles.sectionTitle}>Lig İkonu</Text>
        </View>
        
        <View style={styles.iconGrid}>
          {iconOptions.map((icon, index) => {
            const isSelected = leagueConfig.icon === icon;
            return (
              <Animated.View
                key={icon}
                style={{ transform: [{ scale: iconScales[index] || 1 }] }}
              >
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    isSelected && styles.iconButtonActive,
                  ]}
                  onPress={() => handleIconPress(icon, index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.iconText, isSelected && styles.iconTextActive]}>
                    {icon}
                  </Text>
                  {isSelected && (
                    <View style={styles.iconCheckmark}>
                      <Ionicons name="checkmark-circle" size={20} color="#432870" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* League Name */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="text" size={20} color="#432870" />
          <Text style={styles.sectionTitle}>Lig Adı</Text>
          <Text style={styles.requiredBadge}>*</Text>
        </View>
        
        <Animated.View
          style={[
            styles.inputWrapper,
            focusedInput === 'name' && styles.inputWrapperFocused,
            { transform: [{ scale: focusedInput === 'name' ? focusScaleAnim : 1 }] },
          ]}
        >
          <TextInput
            style={styles.input}
            value={leagueConfig.name}
            onChangeText={(text) => onConfigChange({ ...leagueConfig, name: text })}
            placeholder="Örn: Süper Tahminler Ligi"
            placeholderTextColor="#9CA3AF"
            maxLength={50}
            onFocus={() => handleInputFocus('name')}
            onBlur={handleInputBlur}
          />
          <View style={styles.inputFooter}>
            <Ionicons name="information-circle" size={14} color="#6B7280" />
            <Text style={styles.inputHint}>Benzersiz ve akılda kalıcı bir isim seç</Text>
            <Text style={styles.charCount}>{leagueConfig.name.length}/50</Text>
          </View>
        </Animated.View>
      </View>

      {/* League Description */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={20} color="#432870" />
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.requiredBadge}>*</Text>
        </View>
        
        <Animated.View
          style={[
            styles.inputWrapper,
            focusedInput === 'description' && styles.inputWrapperFocused,
            { transform: [{ scale: focusedInput === 'description' ? focusScaleAnim : 1 }] },
          ]}
        >
          <TextInput
            style={[styles.input, styles.textArea]}
            value={leagueConfig.description}
            onChangeText={(text) => onConfigChange({ ...leagueConfig, description: text })}
            placeholder="Liginin amacını ve kurallarını açıkla..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
            onFocus={() => handleInputFocus('description')}
            onBlur={handleInputBlur}
          />
          <View style={styles.inputFooter}>
            <Ionicons name="information-circle" size={14} color="#6B7280" />
            <Text style={styles.inputHint}>Ligin amacını ve kurallarını belirt</Text>
            <Text style={styles.charCount}>{leagueConfig.description.length}/200</Text>
          </View>
        </Animated.View>
      </View>

      {/* Preview Card */}
      {leagueConfig.name && leagueConfig.description && (
        <Animated.View
          style={[
            styles.previewCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.previewHeader}>
            <Ionicons name="eye" size={18} color="#432870" />
            <Text style={styles.previewTitle}>Önizleme</Text>
          </View>
          
          <View style={styles.previewContent}>
            <View style={styles.previewIconContainer}>
              <Text style={styles.previewIcon}>{leagueConfig.icon}</Text>
            </View>
            <View style={styles.previewTextContainer}>
              <Text style={styles.previewName} numberOfLines={1}>{leagueConfig.name}</Text>
              <Text style={styles.previewDescription} numberOfLines={2}>
                {leagueConfig.description}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// Preview animation value
const scaleAnim = new Animated.Value(0.95);
Animated.loop(
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 2000,
      useNativeDriver: true,
    }),
  ])
).start();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  requiredBadge: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  // Icon Grid
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButtonActive: {
    backgroundColor: '#F3E8FF',
    borderColor: '#432870',
    borderWidth: 3,
  },
  iconText: {
    fontSize: 32,
  },
  iconTextActive: {
    fontSize: 34,
  },
  iconCheckmark: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  // Input Wrapper
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: '#432870',
    shadowColor: '#432870',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
    marginBottom: 12,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputHint: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  charCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  // Preview Card
  previewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
    marginTop: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  previewIcon: {
    fontSize: 32,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

