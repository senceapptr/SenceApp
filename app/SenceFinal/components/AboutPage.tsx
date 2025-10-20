import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface AboutPageProps {
  onBack: () => void;
}

const FEATURES = [
  {
    icon: '🎯',
    title: 'Akıllı Tahminler',
    description: 'Gerçek zamanlı oranlar ve detaylı analizlerle tahmin yap'
  },
  {
    icon: '🏆',
    title: 'Rekabetçi Ligler',
    description: 'Arkadaşlarınla lig oluştur, yarış ve kazanmaktan zevk al'
  },
  {
    icon: '💰',
    title: 'Ödül Sistemi',
    description: 'Doğru tahminlerinle kredi kazan, market\'ten ödüller al'
  },
  {
    icon: '📊',
    title: 'İstatistikler',
    description: 'Performansını takip et, gelişimini gör'
  },
];


export function AboutPage({ onBack }: AboutPageProps) {
  const { theme, isDarkMode } = useTheme();


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
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Uygulama Hakkında</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Info */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#432870', '#B29EFD']}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>S</Text>
          </LinearGradient>
          <Text style={[styles.appName, { color: theme.textPrimary }]}>Sence</Text>
          <Text style={[styles.appVersion, { color: theme.textSecondary }]}>Versiyon 1.0.0</Text>
          <Text style={[styles.appTagline, { color: theme.textMuted }]}>
            Tahmin, Rekabet, Kazan!
          </Text>
        </View>

        {/* About Description */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.descriptionTitle, { color: theme.textPrimary }]}>
            Sence Nedir?
          </Text>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            Sence, günlük hayattan ekonomiye, spordan teknolojiye kadar her konuda tahmin yapabileceğin, arkadaşlarınla rekabet edebileceğin ve kazanabileceğin sosyal bir tahmin platformudur.
          </Text>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            Doğru tahminlerinle kredi kazan, liglerde yarış, sıralamada yüksel ve eğlenceli ödüller kazan!
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Özellikler
          </Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>


        {/* Legal & Info */}
        <View style={styles.legalSection}>
          <Text style={[styles.legalText, { color: theme.textMuted }]}>
            © 2025 Sence. Tüm hakları saklıdır.
          </Text>
          <Text style={[styles.legalText, { color: theme.textMuted }]}>
            Made with 💜 in Turkey
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalSection: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  legalText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

