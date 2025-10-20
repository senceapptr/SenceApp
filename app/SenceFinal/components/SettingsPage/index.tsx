import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import { SettingsPageProps } from './types';
import { useSettings } from './hooks';
import { getSettingSections, socialLinks, defaultUserInfo } from './utils';
import { PageHeader } from './components/PageHeader';
import { UserCard } from './components/UserCard';
import { SettingSection } from './components/SettingSection';
import { SocialSection } from './components/SocialSection';
import { LogoutButton } from './components/LogoutButton';
import { DangerButton } from './components/DangerButton';

export function SettingsPage({ 
  onBack, 
  onMenuToggle, 
  onEditProfile,
  onPrivacySettings,
  onSecurity,
  onHelpCenter,
  onFeedback,
  onAbout
}: SettingsPageProps) {
  const {
    theme,
    isDarkMode,
    themeMode,
    settings,
    toggleSetting,
    handleNavigate,
    handleSocialLink,
    handleLogout,
    handleDeleteAccount,
  } = useSettings({
    onPrivacySettings,
    onSecurity,
    onHelpCenter,
    onFeedback,
    onAbout
  });

  const settingSections = getSettingSections(themeMode, isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      <PageHeader onBack={onBack} onMenuToggle={onMenuToggle} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <UserCard
          username={defaultUserInfo.username}
          avatarUrl={defaultUserInfo.avatarUrl}
          onPress={onEditProfile}
        />

        <View style={styles.sectionsContainer}>
          {settingSections.map((section) => (
            <SettingSection
              key={section.title}
              section={section}
              settings={settings}
              isDarkMode={isDarkMode}
              onToggleSetting={toggleSetting}
              onNavigate={handleNavigate}
            />
          ))}

          <SocialSection
            socialLinks={socialLinks}
            onSocialPress={handleSocialLink}
            isDarkMode={isDarkMode}
          />

          <View style={styles.dangerSection}>
            <View style={styles.dangerItems}>
              <LogoutButton
                onPress={handleLogout}
                isDarkMode={isDarkMode}
              />
              <DangerButton
                onPress={handleDeleteAccount}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>

          <View style={styles.versionSection}>
            <Text style={[styles.versionText, { color: theme.textMuted }]}>
              Sence v1.0.0
            </Text>
            <Text style={[styles.copyrightText, { color: theme.textMuted }]}>
              © 2025 Tüm hakları saklıdır
            </Text>
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
  content: {
    flex: 1,
    paddingTop: 16,
  },
  sectionsContainer: {
    paddingHorizontal: 20,
    gap: 32,
  },
  dangerSection: {
    // No specific styles
  },
  dangerItems: {
    gap: 12,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default SettingsPage;

