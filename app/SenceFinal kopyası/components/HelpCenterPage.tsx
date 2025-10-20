import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface HelpCenterPageProps {
  onBack: () => void;
  onSupport?: () => void;
  onFAQ?: () => void;
  onTerms?: () => void;
}

interface HelpOption {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: [string, string];
}

export function HelpCenterPage({ onBack, onSupport, onFAQ, onTerms }: HelpCenterPageProps) {
  const { theme, isDarkMode } = useTheme();

  const helpOptions: HelpOption[] = [
    {
      key: 'support',
      title: 'Destek',
      description: 'Sorun bildirimi ve destek talebi',
      icon: 'headset',
      color: ['#432870', '#B29EFD']
    },
    {
      key: 'faq',
      title: 'Sıkça Sorulan Sorular',
      description: 'En çok merak edilen konular',
      icon: 'help-circle',
      color: ['#3B82F6', '#06B6D4']
    },
    {
      key: 'terms',
      title: 'Kullanıcı Sözleşmeleri',
      description: 'Kullanım koşulları ve gizlilik politikası',
      icon: 'document-text',
      color: ['#10B981', '#059669']
    }
  ];

  const handleOptionPress = (key: string) => {
    switch(key) {
      case 'support':
        onSupport?.();
        break;
      case 'faq':
        onFAQ?.();
        break;
      case 'terms':
        onTerms?.();
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: theme.hover }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Yardım Merkezi</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={[styles.welcomeText, { color: theme.textPrimary }]}>
            Nasıl yardımcı olabiliriz?
          </Text>
          <Text style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
            Size en iyi şekilde destek olmak için buradayız 💜
          </Text>
        </View>

        {/* Help Options */}
        <View style={styles.optionsContainer}>
          {helpOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[styles.optionCard, { 
                backgroundColor: theme.surface,
                borderColor: theme.border,
                shadowColor: isDarkMode ? 'transparent' : '#000'
              }]}
              onPress={() => handleOptionPress(option.key)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={option.color}
                style={styles.optionIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={option.icon as any} size={28} color="white" />
              </LinearGradient>

              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                  {option.description}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Info */}
        <View style={[styles.contactSection, { 
          backgroundColor: isDarkMode 
            ? 'rgba(67, 40, 112, 0.1)' 
            : 'rgba(147, 51, 234, 0.05)',
          borderColor: theme.border
        }]}>
          <Text style={[styles.contactTitle, { color: theme.textPrimary }]}>
            📧 Bize Ulaşın
          </Text>
          <Text style={[styles.contactText, { color: theme.textSecondary }]}>
            support@sence.app
          </Text>
          <Text style={[styles.contactSubtext, { color: theme.textMuted }]}>
            7/24 destek ekibimiz sizinle
          </Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={[styles.appVersion, { color: theme.textMuted }]}>
            Sence v1.0.0
          </Text>
          <Text style={[styles.appBuild, { color: theme.textMuted }]}>
            Build 2025.10.15
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  headerInfo: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  contactSection: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.1)',
    alignItems: 'center',
    marginBottom: 32,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#432870',
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
  },
  appBuild: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

