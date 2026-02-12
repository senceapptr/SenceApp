import { Animated } from 'react-native';
import { useCallback, useRef, useEffect } from 'react';

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

  const showHeader = useCallback(
    (duration: number = 200) => {
      Animated.timing(headerTranslateY, {
        duration,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
    [headerTranslateY],
  );

  const resetHeaderState = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    lastScrollY.current = 0;
    headerTranslateY.stopAnimation();
    showHeader(120);
  }, [headerTranslateY, showHeader]);

  const handleScroll = useCallback(
    (event: any) => {
      if (!isInitialized.current) return;

      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDiff = currentScrollY - lastScrollY.current;

      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }

      if (scrollDiff > 5 && currentScrollY > 50) {
        Animated.timing(headerTranslateY, {
          duration: 200,
          toValue: -200,
          useNativeDriver: true,
        }).start();
      } else if (scrollDiff < -5) {
        Animated.timing(headerTranslateY, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }).start();

        hideTimeout.current = setTimeout(() => {
          if (currentScrollY > 50) {
            Animated.timing(headerTranslateY, {
              duration: 300,
              toValue: -200,
              useNativeDriver: true,
            }).start();
          }
        }, 3000);
      } else if (currentScrollY <= 16) {
        showHeader(160);
      }

      lastScrollY.current = currentScrollY;
    },
    [headerTranslateY, showHeader],
  );

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  return { handleScroll, headerTranslateY, resetHeaderState };
};
