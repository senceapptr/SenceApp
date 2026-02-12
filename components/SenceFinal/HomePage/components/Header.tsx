import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBadge } from '../../ui/NotificationBadge';

interface HeaderProps {
  onMenuToggle: () => void;
  headerTranslateY: Animated.Value;
  isDarkMode: boolean;
  theme: any;
}

export function Header({ onMenuToggle, headerTranslateY, isDarkMode, theme }: HeaderProps) {
  const { unreadNotificationsCount } = useAuth();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              backgroundColor: 'rgba(33, 38, 45, 0.9)',
              shadowColor: '#000',
            },
          ]}
          onPress={onMenuToggle}
          activeOpacity={0.8}
        >
          <View style={styles.hamburgerIcon}>
            <View style={[styles.hamburgerLine, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: '#FFFFFF' }]} />
          </View>
          {unreadNotificationsCount > 0 && (
            <NotificationBadge count={unreadNotificationsCount} size="small" style={styles.notificationBadge} />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    paddingTop: 50,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(33, 38, 45, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0,
  },
  hamburgerIcon: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 18,
    height: 2.5,
    backgroundColor: '#1F2937',
    borderRadius: 1.25,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
});
