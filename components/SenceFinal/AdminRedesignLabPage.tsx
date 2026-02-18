import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';

interface AdminRedesignLabPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  onOpenProfileRedesignMock?: () => void;
}

interface RedesignTarget {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const REDESIGN_TARGETS: RedesignTarget[] = [
  {
    id: 'profile',
    icon: 'person-circle-outline',
    title: 'Profil',
    subtitle: 'Profil redesign mock akışı',
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    title: 'Bildirimler',
    subtitle: 'Bildirimler redesign mock akışı',
  },
  {
    id: 'tasks',
    icon: 'checkmark-done-outline',
    title: 'Görevler',
    subtitle: 'Görevler redesign mock akışı',
  },
  {
    id: 'gameHub',
    icon: 'game-controller-outline',
    title: 'GameHub',
    subtitle: 'GameHub redesign mock akışı',
  },
  {
    id: 'leaderboard',
    icon: 'trophy-outline',
    title: 'Sıralama',
    subtitle: 'Sıralama redesign mock akışı',
  },
  {
    id: 'tickets',
    icon: 'ticket-outline',
    title: 'Ticketlar',
    subtitle: 'Ticketlar redesign mock akışı',
  },
];

export function AdminRedesignLabPage({
  onBack,
  onMenuToggle,
  onOpenProfileRedesignMock,
}: AdminRedesignLabPageProps) {
  const { isDarkMode, theme } = useTheme();

  const handleMockPress = (target: RedesignTarget) => {
    if (target.id === 'profile' && onOpenProfileRedesignMock) {
      onOpenProfileRedesignMock();
      return;
    }

    Alert.alert('Yakında', `${target.title} için mock tasarım bu alana eklenecek.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <SafeAreaView edges={['top']} style={[styles.safeArea, { borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <Ionicons name="menu-outline" size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Redesign Test Alanı</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Admin Mock Playground</Text>
          </View>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>Bu ekranda canlı sayfa yönlendirmesi yok</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Aşağıdaki butonlar mevcut sayfalara gitmez. Her biri için redesign mock tasarımlar bu alana eklenecek.
          </Text>
        </View>

        <View style={styles.targetsList}>
          {REDESIGN_TARGETS.map(target => (
            <TouchableOpacity
              key={target.id}
              style={[styles.targetButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => handleMockPress(target)}
            >
              <View style={[styles.targetIconWrap, { backgroundColor: theme.hover }]}>
                <Ionicons name={target.icon} size={20} color={theme.textPrimary} />
              </View>

              <View style={styles.targetTextWrap}>
                <Text style={[styles.targetTitle, { color: theme.textPrimary }]}>{target.title}</Text>
                <Text style={[styles.targetSubtitle, { color: theme.textSecondary }]}>{target.subtitle}</Text>
              </View>

              <View style={[styles.mockBadge, { borderColor: theme.border, backgroundColor: theme.hover }]}>
                <Text style={[styles.mockBadgeText, { color: theme.textMuted }]}>Mock</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    marginTop: 6,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  mockBadge: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  mockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  safeArea: {
    borderBottomWidth: 1,
  },
  targetButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  targetIconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  targetSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  targetTextWrap: {
    flex: 1,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  targetsList: {
    paddingBottom: 12,
  },
});
