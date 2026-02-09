import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationBadge } from './ui/NotificationBadge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PageType = 'home' | 'discover' | 'newDiscover' | 'discoverNew' | 'coupons' | 'leagues' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionCardDesign' | 'adminPanel' | 'leaderboard';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageType) => void;
  children: React.ReactNode;
}

export function SlideOutMenu({ isOpen, onClose, onNavigate, children }: SlideOutMenuProps) {
  const { user, profile, unreadNotificationsCount } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const menuItems = [
    { id: 1, title: 'Bildirimler', highlight: false, page: 'notifications' as PageType },
    { id: 2, title: 'Keşfet', highlight: true, page: 'newDiscover' as PageType },
    { id: 3, title: 'Yeni Keşfet', highlight: true, page: 'discoverNew' as PageType },
    { id: 4, title: 'Soru Yaz', highlight: false, page: 'writeQuestion' as PageType },
    { id: 5, title: 'Soru Kartları', highlight: false, page: 'questionCardDesign' as PageType },
    { id: 6, title: 'Görevler', highlight: false, page: 'tasks' as PageType },
    { id: 7, title: 'Market', highlight: false, page: 'market' as PageType },
    { id: 8, title: '🏆 Sıralama', highlight: true, page: 'leaderboard' as PageType },
    { id: 9, title: 'Ayarlar', highlight: false, page: 'settings' as PageType },
    { id: 10, title: 'Admin Panel', highlight: true, page: 'adminPanel' as PageType, adminOnly: true },
  ];

  // Create individual animation values for each menu item
  const menuItemAnims = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(50),
      scale: new Animated.Value(0.8),
    }))
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
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 12,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animate menu items sequentially with bounce effect
        const itemAnimations = menuItemAnims.map((anim, index) =>
          Animated.sequence([
            Animated.delay(index * 80), // Stagger each item by 80ms
            Animated.parallel([
              Animated.spring(anim.opacity, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
              Animated.spring(anim.translateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
              }),
              Animated.spring(anim.scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 120,
                friction: 6,
              }),
            ])
          ])
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
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 9,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
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
  const filteredMenuItems = menuItems.filter(item =>
    !item.adminOnly || isAdmin
  );

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
        pointerEvents="none">
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
              transform: [
                { translateX: pageTranslateX },
              ],
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
            transform: [
              { translateX: pageTranslateX },
            ],
          },
        ]}>
        <TouchableOpacity
          style={styles.contentTouchable}
          activeOpacity={1}
          onPress={isOpen ? onClose : undefined}
          disabled={!isOpen}>
          <View
            style={styles.disabledContent}
            pointerEvents={isOpen ? "none" : "auto"}
            onTouchStart={isOpen ? handleTouchStart : undefined}
            onTouchEnd={isOpen ? handleTouchEnd : undefined}>
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
        pointerEvents={isOpen ? 'auto' : 'none'}>
        <SafeAreaView style={styles.menuContent}>
          {/* Close Button - Top Right */}
          <View style={styles.topSection}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
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
                    source={{ uri: profile?.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face" }}
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
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.35)" style={styles.profileChevron} />
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
                    transform: [
                      { translateX: menuItemAnims[index].translateX },
                      { scale: menuItemAnims[index].scale },
                    ],
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    item.highlight && styles.menuItemHighlight
                  ]}
                  onPress={() => {
                    if (item.page) {
                      onNavigate(item.page);
                    }
                    onClose();
                  }}>
                  <View style={styles.menuItemContent}>
                    <Text style={[
                      styles.menuText,
                      item.highlight && styles.menuTextHighlight
                    ]}>
                      {item.title}
                    </Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  movedContentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D1117',
    zIndex: 1000,
  },

  mainContent: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    zIndex: 1002,
    backgroundColor: '#0D1117',
  },
  contentTouchable: {
    flex: 1,
  },
  disabledContent: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#0D1117',
  },
  gradientBackground: {
    flex: 1,
  },
  fluidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fluidGradient1: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: 50,
    bottom: 100,
    borderRadius: 200,
    transform: [{ rotate: '15deg' }],
  },
  fluidGradient2: {
    position: 'absolute',
    top: 100,
    left: 50,
    right: -100,
    bottom: -50,
    borderRadius: 150,
    transform: [{ rotate: '-25deg' }],
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT,
    zIndex: 1003,
    backgroundColor: '#161B22',
  },
  menuContent: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  topSection: {
    paddingTop: 8,
    paddingRight: 20,
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  profileArea: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2.5,
    borderColor: '#161B22',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  profileChevron: {
    marginLeft: 4,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#21262D',
    borderColor: '#30363D',
  },
  menuItems: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 20,
  },
  menuItemContainer: {
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  menuItemHighlight: {
    borderWidth: 1,
    backgroundColor: '#21262D',
    borderColor: '#30363D',
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    color: '#F0F6FC',
  },
  notificationBadge: {
    marginLeft: 8,
  },
  menuTextHighlight: {
    fontWeight: '700',
    fontSize: 18,
    color: '#10B981',
  },
  menuFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});
