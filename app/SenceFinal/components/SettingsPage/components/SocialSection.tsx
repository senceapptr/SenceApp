import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SocialSectionProps } from '../types';
import { SocialButton } from './SocialButton';
import { useTheme } from '../../../contexts/ThemeContext';

export function SocialSection({ socialLinks, onSocialPress, isDarkMode }: SocialSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Bizi Takip Edin
      </Text>
      <View style={styles.items}>
        {socialLinks.map((social) => (
          <SocialButton
            key={social.platform}
            social={social}
            onPress={() => onSocialPress(social.url)}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    // No specific styles needed, handled by parent
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  items: {
    gap: 12,
  },
});

