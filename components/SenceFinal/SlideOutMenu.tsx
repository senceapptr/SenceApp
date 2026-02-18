import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { adminService } from '@/services/admin.service';

import { NotificationBadge } from './ui/NotificationBadge';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type PageType =
  | 'home'
  | 'discover'
  | 'newDiscover'
  | 'discoverNew'
  | 'coupons'
  | 'leagues'
  | 'writeQuestion'
  | 'tasks'
  | 'settings'
  | 'market'
  | 'notifications'
  | 'profile'
  | 'questionCardDesign'
  | 'adminPanel'
  | 'adminRedesignLab'
  | 'leaderboard';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onNavigate: (page: PageType) => void;
}

export function SlideOutMenu({ children, isOpen, onClose, onNavigate }: SlideOutMenuProps) {
  const { profile, unreadNotificationsCount, user } = useAuth();
  const { isDarkMode, theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const menuItems = [
    { highlight: false, id: 1, page: 'notifications' as PageType, title: 'Bildirimler' },
    { highlight: true, id: 2, page: 'newDiscover' as PageType, title: 'Keşfet' },
    { highlight: true, id: 3, page: 'discoverNew' as PageType, title: 'Yeni Keşfet' },
    { highlight: false, id: 4, page: 'writeQuestion' as PageType, title: 'Soru Yaz' },
    { highlight: false, id: 5, page: 'questionCardDesign' as PageType, title: 'Soru Kartları' },
    { highlight: false, id: 6, page: 'tasks' as PageType, title: 'Görevler' },
    { highlight: false, id: 7, page: 'market' as PageType, title: 'Market' },
    { highlight: true, id: 8, page: 'leaderboard' as PageType, title: 'Sıralama' },
    { highlight: false, id: 9, page: 'settings' as PageType, title: 'Ayarlar' },
    { adminOnly: true, highlight: true, id: 10, page: 'adminPanel' as PageType, title: 'Admin Panel' },
    { adminOnly: true, highlight: false, id: 11, page: 'adminRedesignLab' as PageType, title: 'Redesign Testleri' },
  ];

  // Create individual animation values for each menu item
  const menuItemAnims = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.8),
      translateX: new Animated.Value(50),
    })),
  ).current;

  // Admin kontrolü
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { isAdmin: adminStatus } = await adminService.isAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [user]);

  useLayoutEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Reset menu item animations
      menuItemAnims.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(50);
        anim.scale.setValue(0.8);
      });

      // Open animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          friction: 12,
          tension: 60,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          duration: 500,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animate menu items sequentially with bounce effect
        const itemAnimations = menuItemAnims.map((anim, index) =>
          Animated.sequence([
            Animated.delay(index * 80), // Stagger each item by 80ms
            Animated.parallel([
              Animated.spring(anim.opacity, {
                friction: 8,
                tension: 100,
                toValue: 1,
                useNativeDriver: true,
              }),
              Animated.spring(anim.translateX, {
                friction: 8,
                tension: 100,
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.spring(anim.scale, {
                friction: 6,
                tension: 120,
                toValue: 1,
                useNativeDriver: true,
              }),
            ]),
          ]),
        );

        Animated.parallel(itemAnimations).start(() => {
          setIsAnimating(false);
        });
      });
    } else if (!isOpen) {
      setIsAnimating(true);

      // Reset menu items immediately when closing
      menuItemAnims.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(50);
        anim.scale.setValue(0.8);
      });

      // Close animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          friction: 9,
          tension: 120,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          duration: 300,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    }
  }, [isOpen]);

  const menuTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0],
  });

  const pageTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH * 0.75],
  });

  // Handle touch events for swipe detection
  const handleTouchStart = (event: any) => {
    touchStartX.current = event.nativeEvent.pageX;
    touchStartY.current = event.nativeEvent.pageY;
  };

  const handleTouchEnd = (event: any) => {
    const touchEndX = event.nativeEvent.pageX;
    const touchEndY = event.nativeEvent.pageY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);

    // Close menu if swiped right significantly and not too much vertical movement
    if (deltaX > 50 && deltaY < 100) {
      onClose();
    }
  };

  // Admin olmayan kullanıcılar için admin paneli gizle
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <View style={styles.container}>
      {/* Dark Background Overlay - behind everything */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={['#0D1117', '#161B22', '#21262D']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Subtle dark overlay - tema ile uyumlu */}
        <View style={styles.fluidOverlay}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.04)', 'transparent', 'rgba(16, 185, 129, 0.02)']}
            style={styles.fluidGradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      </Animated.View>

      {/* Dark Background Layer for Moved Content */}
      {(isOpen || isAnimating) && (
        <Animated.View
          style={[
            styles.movedContentBackground,
            {
              opacity: overlayOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
              transform: [{ translateX: pageTranslateX }],
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Main Content (moved to left) */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            transform: [{ translateX: pageTranslateX }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.contentTouchable}
          activeOpacity={1}
          onPress={isOpen ? onClose : undefined}
          disabled={!isOpen}
        >
          <View
            style={styles.disabledContent}
            pointerEvents={isOpen ? 'none' : 'auto'}
            onTouchStart={isOpen ? handleTouchStart : undefined}
            onTouchEnd={isOpen ? handleTouchEnd : undefined}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Slide Out Menu - only render when opening/open */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: menuTranslateX }],
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <SafeAreaView style={styles.menuContent}>
          {/* Close Button - Top Right */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color="#F0F6FC" />
            </TouchableOpacity>
          </View>

          {/* Apple-style Profile Area */}
          <TouchableOpacity
            style={styles.profileArea}
            onPress={() => {
              onNavigate('profile');
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri:
                        profile?.profile_image ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
                    }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'}
                  </Text>
                  <View style={styles.balanceRow}>
                    <Ionicons name="diamond-outline" size={14} color="rgba(255,215,0,0.9)" />
                    <Text style={styles.balanceLabel}>
                      {profile?.credits != null ? profile.credits.toLocaleString('tr-TR') : '10,000'} kredi
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="rgba(255,255,255,0.35)"
                  style={styles.profileChevron}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {filteredMenuItems.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.menuItemContainer,
                  {
                    opacity: menuItemAnims[index].opacity,
                    transform: [{ translateX: menuItemAnims[index].translateX }, { scale: menuItemAnims[index].scale }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.menuItem, item.highlight && styles.menuItemHighlight]}
                  onPress={() => {
                    if (item.page) {
                      onNavigate(item.page);
                    }
                    onClose();
                  }}
                >
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuText, item.highlight && styles.menuTextHighlight]}>{item.title}</Text>
                    {item.page === 'notifications' && unreadNotificationsCount > 0 && (
                      <NotificationBadge
                        count={unreadNotificationsCount}
                        size="small"
                        style={styles.notificationBadge}
                      />
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#8B949E" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Menu Footer */}
          <View style={styles.menuFooter}>
            <Text style={styles.footerText}>Sence v1.0.0</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    marginRight: 14,
    position: 'relative',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },

  balanceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#21262D',
    borderColor: '#30363D',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  container: {
    backgroundColor: '#0D1117',
    flex: 1,
  },
  contentTouchable: {
    flex: 1,
  },
  disabledContent: {
    flex: 1,
  },
  fluidGradient1: {
    borderRadius: 200,
    bottom: 100,
    left: -50,
    position: 'absolute',
    right: 50,
    top: -100,
    transform: [{ rotate: '15deg' }],
  },
  fluidGradient2: {
    borderRadius: 150,
    bottom: -50,
    left: 50,
    position: 'absolute',
    right: -100,
    top: 100,
    transform: [{ rotate: '-25deg' }],
  },
  fluidOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  gradientBackground: {
    flex: 1,
  },
  mainContent: {
    backgroundColor: '#0D1117',
    borderRadius: 30,
    flex: 1,
    overflow: 'hidden',
    zIndex: 1002,
  },
  menu: {
    backgroundColor: '#161B22',
    height: SCREEN_HEIGHT,
    position: 'absolute',
    right: 0,
    top: 0,
    width: SCREEN_WIDTH * 0.75,
    zIndex: 1003,
  },
  menuContent: {
    backgroundColor: '#161B22',
    flex: 1,
  },
  menuFooter: {
    alignItems: 'center',
    borderTopColor: '#30363D',
    borderTopWidth: 1,
    padding: 24,
  },
  menuItem: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 2,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  menuItemContainer: {
    marginBottom: 4,
  },
  menuItemContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  menuItemHighlight: {
    backgroundColor: '#21262D',
    borderColor: '#30363D',
    borderWidth: 1,
  },
  menuItems: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 5,
  },
  menuText: {
    color: '#F0F6FC',
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  menuTextHighlight: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '700',
  },
  movedContentBackground: {
    backgroundColor: '#0D1117',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  notificationBadge: {
    marginLeft: 8,
  },
  onlineDot: {
    backgroundColor: '#34C759',
    borderColor: '#161B22',
    borderRadius: 7,
    borderWidth: 2.5,
    bottom: 0,
    height: 14,
    position: 'absolute',
    right: 0,
    width: 14,
  },
  overlay: {
    backgroundColor: '#0D1117',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  profileArea: {
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  profileChevron: {
    marginLeft: 4,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  topSection: {
    alignItems: 'flex-end',
    marginBottom: 2,
    paddingRight: 20,
    paddingTop: 8,
  },
  userAvatar: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
