import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import { MenuItem } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const useMenuAnimation = (isOpen: boolean, menuItems: MenuItem[]) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

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
      menuItemAnims.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(50);
        anim.scale.setValue(0.8);
      });

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
        const itemAnimations = menuItemAnims.map((anim, index) =>
          Animated.sequence([
            Animated.delay(index * 80),
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
      
      menuItemAnims.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateX.setValue(50);
        anim.scale.setValue(0.8);
      });

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

  return {
    slideAnim,
    overlayOpacity,
    isAnimating,
    menuItemAnims,
    menuTranslateX,
    pageTranslateX,
  };
};



