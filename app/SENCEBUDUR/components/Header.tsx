import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
  variant?: 'default' | 'market';
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  isHomePage?: boolean;
}

export function Header({ 
  gameCredits, 
  setProfileDrawerOpen, 
  hasNotifications,
  variant = 'default',
  onBack,
  title,
  subtitle,
  isHomePage = false
}: HeaderProps) {
  if (variant === 'market') {
    return (
      <View style={styles.marketHeader}>
        <View style={styles.marketHeaderContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          
          <View style={styles.marketHeaderCenter}>
            <Text style={styles.marketHeaderTitle}>{title || 'Market'}</Text>
            {subtitle && (
              <Text style={styles.marketHeaderSubtitle}>{subtitle}</Text>
            )}
          </View>
          
          <View style={styles.creditsBadge}>
            <Text style={styles.marketCreditsText}>{gameCredits.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Left Section - Logo for HomePage, Title for other pages */}
        <View style={styles.headerLeft}>
          {isHomePage ? (
            <Image 
              source={require('../../../assets/images/sencelogo.png')}
              style={[styles.logo, styles.homePageLogo]}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.title, { marginLeft: 20 }]}>
              {title || 'Sence'}
            </Text>
          )}
        </View>

        {/* Center Section - Empty */}
        <View style={styles.headerCenter}>
        </View>

        {/* Right Section - Profile */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => setProfileDrawerOpen(true)}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            <View style={styles.profileFrame}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 140,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homePageLogo: {
    tintColor: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#202020',
    letterSpacing: -0.5,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  profileButton: {
    position: 'relative',
  },
  profileFrame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#432870',
    backgroundColor: '#F0E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  // Market Header Styles
  marketHeader: {
    backgroundColor: '#432870',
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  marketHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B29EFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketHeaderCenter: {
    alignItems: 'center',
    flex: 1,
  },
  marketHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    marginBottom: 4,
  },
  marketHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  creditsBadge: {
    backgroundColor: '#B29EFD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  marketCreditsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 