import { View, Text, Image, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      {/* App name */}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Sence</Text>
        {/* User profile */}
        <View style={styles.profileBox}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      </View>
      {/* Decorative dots */}
      <View style={[styles.dot, styles.dot1]} />
      <View style={[styles.dot, styles.dot2]} />
      <View style={[styles.dot, styles.dot3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  profileBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  dot: {
    position: 'absolute',
    borderRadius: 99,
    opacity: 0.5,
  },
  dot1: {
    top: 16,
    right: 80,
    width: 8,
    height: 8,
    backgroundColor: '#F59E42',
  },
  dot2: {
    bottom: 24,
    left: 48,
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  dot3: {
    top: 32,
    left: 120,
    width: 4,
    height: 4,
    backgroundColor: '#F59E42',
    opacity: 0.4,
  },
});