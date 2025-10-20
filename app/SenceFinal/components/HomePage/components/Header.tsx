import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, SafeAreaView, View } from 'react-native';

interface HeaderProps {
  onMenuToggle: () => void;
  headerTranslateY: Animated.Value;
  isDarkMode: boolean;
  theme: any;
}

export function Header({ onMenuToggle, headerTranslateY, isDarkMode, theme }: HeaderProps) {
  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [{ translateY: headerTranslateY }],
      }
    ]}>
      <SafeAreaView>
        <View style={styles.content}>
          <TouchableOpacity 
            style={[styles.menuButton, { 
              backgroundColor: isDarkMode ? theme.surfaceElevated : 'rgba(255,255,255,0.95)',
              borderColor: isDarkMode ? theme.border : 'rgba(0,0,0,0.05)',
              shadowColor: isDarkMode ? 'transparent' : '#000'
            }]}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <View style={styles.hamburgerIcon}>
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.hamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
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
});

