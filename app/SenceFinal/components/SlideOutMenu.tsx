import React, { useEffect, useRef, useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type PageType = 'home' | 'discover' | 'coupons' | 'leagues' | 'writeQuestion' | 'tasks' | 'settings' | 'market' | 'notifications' | 'profile' | 'questionCardDesign';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageType) => void;
  children: React.ReactNode;
}

export function SlideOutMenu({ isOpen, onClose, onNavigate, children }: SlideOutMenuProps) {
  const { user, profile } = useAuth();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Simple swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const menuItems = [
    { id: 1, title: 'Bildirimler', highlight: false, page: 'notifications' as PageType },
    { id: 2, title: 'Trivia', highlight: true, page: null },
    { id: 3, title: 'Swipe', highlight: true, page: null },
    { id: 4, title: 'Soru Yaz', highlight: false, page: 'writeQuestion' as PageType },
    { id: 5, title: 'Soru Kartları', highlight: false, page: 'questionCardDesign' as PageType },
    { id: 6, title: 'Görevler', highlight: false, page: 'tasks' as PageType },
    { id: 7, title: 'Market', highlight: false, page: 'market' as PageType },
    { id: 8, title: 'Ayarlar', highlight: false, page: 'settings' as PageType },
  ];

  // Create individual animation values for each menu item
  const menuItemAnims = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(50),
      scale: new Animated.Value(0.8),
    }))
  ).current;

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      {/* Purple Background Overlay with Fluid Effect - behind everything */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents="none">
        <LinearGradient
          colors={[
            '#6B21A8', // Deep rich purple
            '#581C87', // Darker rich purple
            '#4C1D95', // Even darker
            '#3B0764', // Deepest rich purple
            '#2D1B69', // Darkest purple
          ]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Fluid overlay effect */}
        <View style={styles.fluidOverlay}>
          <LinearGradient
            colors={[
              'rgba(107, 33, 168, 0.4)',
              'transparent',
              'rgba(88, 28, 135, 0.3)',
              'transparent',
              'rgba(59, 7, 100, 0.5)',
            ]}
            style={styles.fluidGradient1}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <LinearGradient
            colors={[
              'transparent',
              'rgba(76, 29, 149, 0.3)',
              'transparent',
              'rgba(45, 27, 105, 0.4)',
            ]}
            style={styles.fluidGradient2}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced Profile Area */}
          <TouchableOpacity 
            style={styles.profileArea}
            onPress={() => {
              console.log('Profile pressed');
              onNavigate('profile');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: profile?.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" }}
                  style={styles.userAvatar}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'}
                </Text>
                <Text style={styles.balanceAmount}>
                  {profile?.credits ? `₺${profile.credits.toLocaleString('tr-TR')}` : '₺10,000'}
                </Text>
              </View>
              <View style={styles.profileArrow}>
                <Text style={styles.profileArrowText}>›</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
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
                    console.log('Menu item pressed:', item.title);
                    if (item.page) {
                      onNavigate(item.page);
                    } else {
                      // Handle items without pages (Trivia, Swipe)
                      console.log('Feature not implemented yet:', item.title);
                      onClose();
                    }
                  }}>
                  <Text style={[
                    styles.menuText,
                    item.highlight && styles.menuTextHighlight
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuArrow}>›</Text>
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
  },
  movedContentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },

  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    zIndex: 1002,
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
    backgroundColor: 'transparent',
    zIndex: 1003,
  },
  menuContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topSection: {
    paddingTop: 40,
    paddingRight: 24,
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  profileArea: {
    marginHorizontal: 24,
    marginBottom: 15,
    marginTop: 5,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00FF88',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF88',
    marginTop: 4,
  },
  profileArrow: {
    marginLeft: 8,
  },
  profileArrowText: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2,
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  menuItemHighlight: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  menuText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  menuTextHighlight: {
    fontWeight: '700',
    fontSize: 18,
  },
  menuArrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
  menuFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});
