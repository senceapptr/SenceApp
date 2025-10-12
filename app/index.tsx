import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RootMenu() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#2d2d2d']}
        style={styles.backgroundGradient}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sence</Text>
        <Text style={styles.subtitle}>Choose your experience</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/SenceFinal' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#432870', '#5A3A8B']}
            style={styles.menuItemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.menuItemIcon}>🎯</Text>
            <Text style={styles.menuItemTitle}>Sence App</Text>
            <Text style={styles.menuItemSubtitle}>Latest version</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/SENCEBUDUR' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2d2d2d', '#404040']}
            style={styles.menuItemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.menuItemIcon}>📱</Text>
            <Text style={styles.menuItemTitle}>Sence App</Text>
            <Text style={styles.menuItemSubtitle}>Previous version</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/CustomScreen2 copy' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#007AFF', '#5856D6']}
            style={styles.menuItemGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.menuItemIcon}>✨</Text>
            <Text style={styles.menuItemTitle}>Onboarding</Text>
            <Text style={styles.menuItemSubtitle}>Get started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    paddingTop: SCREEN_HEIGHT * 0.15,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 20,
  },
  menuItem: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItemGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  menuItemTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  menuItemSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: SCREEN_HEIGHT * 0.05,
  },
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
}); 