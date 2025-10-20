import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageType } from './types';
import { menuItems, userProfile } from './utils';
import { useMenuAnimation } from './hooks';
import { MenuOverlay } from './components/MenuOverlay';
import { ProfileCard } from './components/ProfileCard';
import { MenuItemsList } from './components/MenuItemsList';
import { MenuFooter } from './components/MenuFooter';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageType) => void;
  children: React.ReactNode;
}

export function SlideOutMenu({ isOpen, onClose, onNavigate, children }: SlideOutMenuProps) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const {
    overlayOpacity,
    isAnimating,
    menuItemAnims,
    menuTranslateX,
    pageTranslateX,
  } = useMenuAnimation(isOpen, menuItems);

  const handleTouchStart = (event: any) => {
    touchStartX.current = event.nativeEvent.pageX;
    touchStartY.current = event.nativeEvent.pageY;
  };

  const handleTouchEnd = (event: any) => {
    const touchEndX = event.nativeEvent.pageX;
    const touchEndY = event.nativeEvent.pageY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);
    
    if (deltaX > 50 && deltaY < 100) {
      onClose();
    }
  };

  const handleItemPress = (page: PageType | null, title: string) => {
    console.log('Menu item pressed:', title);
    if (page) {
      onNavigate(page);
    } else {
      console.log('Feature not implemented yet:', title);
      onClose();
    }
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    onNavigate('profile');
  };

  return (
    <View style={styles.container}>
      {/* Purple Background Overlay */}
      <MenuOverlay overlayOpacity={overlayOpacity} onClose={onClose} />

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

      {/* Slide Out Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: menuTranslateX }],
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}>
        <SafeAreaView style={styles.menuContent}>
          {/* Close Button */}
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <ProfileCard
            name={userProfile.name}
            avatar={userProfile.avatar}
            balance={userProfile.balance}
            isOnline={userProfile.isOnline}
            onProfilePress={handleProfilePress}
          />

          {/* Menu Items */}
          <MenuItemsList
            items={menuItems}
            animations={menuItemAnims}
            onItemPress={handleItemPress}
          />

          {/* Footer */}
          <MenuFooter />
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
});




