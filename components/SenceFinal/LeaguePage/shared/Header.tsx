import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface HeaderProps {
  onMenuToggle: () => void;
  headerTranslateY: Animated.Value;
  children?: React.ReactNode;
}

export function Header({ onMenuToggle, headerTranslateY, children }: HeaderProps) {
  return (
    <Animated.View
      style={[
        styles.animatedHeader,
        {
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ligler</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuToggle}
          activeOpacity={0.8}
        >
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
      </View>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#0D1117',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#21262D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#F0F6FC',
    borderRadius: 1.25,
  },
});

