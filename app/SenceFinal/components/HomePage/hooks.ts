import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useHeaderAnimation = () => {
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const currentScrollY = value;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      isScrolling.current = true;
      
      if (scrollDelta > 15 && currentScrollY > 50) {
        if (headerVisible) {
          setHeaderVisible(false);
          Animated.timing(headerTranslateY, {
            toValue: -120,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      } else if (scrollDelta < -15 || currentScrollY <= 50) {
        if (!headerVisible) {
          setHeaderVisible(true);
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }).start();
        }
      }
      
      lastScrollY.current = currentScrollY;
      
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    });

    return () => {
      scrollY.removeListener(listenerId);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [headerVisible]);

  return { headerTranslateY, scrollY };
};




