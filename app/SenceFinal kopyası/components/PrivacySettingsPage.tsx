import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface PrivacySettingsPageProps {
  onBack: () => void;
}

export function PrivacySettingsPage({ onBack }: PrivacySettingsPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    privateAccount: false,
    showActivityStatus: true,
    allowTagging: true,
  });

  const handlePrivateAccountToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        '🔒 Hesabı Kilitle',
        'Hesabını kilitlediğinde, profil içeriklerini sadece takipçilerin görebilir.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          {
            text: 'Kilitle',
            onPress: () => setSettings(prev => ({ ...prev, privateAccount: value }))
          }
        ]
      );
    } else {
      setSettings(prev => ({ ...prev, privateAccount: value }));
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
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Gizlilik Ayarları</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          {/* Private Account */}
          <View style={styles.settingSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Hesap Gizliliği</Text>
            
            <View style={[styles.settingCard, { 
              backgroundColor: theme.surface, 
              borderColor: theme.border,
              shadowColor: isDarkMode ? 'transparent' : '#000'
            }]}>
              <View style={styles.settingContent}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingHeader}>
                    <Ionicons name="lock-closed" size={20} color={theme.primary} />
                    <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                      Hesabı Kilitle
                    </Text>
                  </View>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Profil içeriklerini sadece takipçilerin görsün
                  </Text>
                </View>
                
                <Switch
                  value={settings.privateAccount}
                  onValueChange={handlePrivateAccountToggle}
                  trackColor={{ 
                    false: isDarkMode ? theme.border : '#D1D5DB', 
                    true: theme.primary 
                  }}
                  thumbColor={isDarkMode ? theme.surface : '#FFFFFF'}
                  ios_backgroundColor={isDarkMode ? theme.border : '#D1D5DB'}
                />
              </View>
            </View>
          </View>

          {/* Activity & Visibility */}
          <View style={styles.settingSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Görünürlük</Text>
            
            <View style={styles.settingsList}>
              <View style={[styles.settingCard, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                shadowColor: isDarkMode ? 'transparent' : '#000'
              }]}>
                <View style={styles.settingContent}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                      Aktivite Durumu
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Diğer kullanıcılar çevrimiçi durumunu görsün
                    </Text>
                  </View>
                  
                  <Switch
                    value={settings.showActivityStatus}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, showActivityStatus: value }))}
                    trackColor={{ 
                      false: isDarkMode ? theme.border : '#D1D5DB', 
                      true: theme.primary 
                    }}
                    thumbColor={isDarkMode ? theme.surface : '#FFFFFF'}
                    ios_backgroundColor={isDarkMode ? theme.border : '#D1D5DB'}
                  />
                </View>
              </View>

              <View style={[styles.settingCard, { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                shadowColor: isDarkMode ? 'transparent' : '#000'
              }]}>
                <View style={styles.settingContent}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                      Etiketlenmeye İzin Ver
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Diğerleri seni tahminlerde etiketleyebilsin
                    </Text>
                  </View>
                  
                  <Switch
                    value={settings.allowTagging}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, allowTagging: value }))}
                    trackColor={{ 
                      false: isDarkMode ? theme.border : '#D1D5DB', 
                      true: theme.primary 
                    }}
                    thumbColor={isDarkMode ? theme.surface : '#FFFFFF'}
                    ios_backgroundColor={isDarkMode ? theme.border : '#D1D5DB'}
                  />
                </View>
              </View>
            </View>
          </View>

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
    paddingTop: 24,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    gap: 32,
    paddingBottom: 40,
  },
  settingSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  settingsList: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

