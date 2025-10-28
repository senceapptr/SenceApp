import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useHeaderAnimation = () => {
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Component mount olduktan 300ms sonra animasyonları aktif et
    const timer = setTimeout(() => {
      isInitialized.current = true;
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event: any) => {
    if (!isInitialized.current) return;
    
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    if (scrollDiff > 5 && currentScrollY > 50) {
      Animated.timing(headerTranslateY, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      hideTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          Animated.timing(headerTranslateY, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, 3000);
    }
    
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  return { headerTranslateY, handleScroll };
};

