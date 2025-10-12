import * as React from "react";
import { View, Text, StyleSheet, Animated } from 'react-native';

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
}

function Toast({ message, visible, duration = 2000 }: ToastProps) {
  const [show, setShow] = React.useState(visible);
  const translateY = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.timing(translateY, {
        toValue: 40,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShow(false));
      }, duration);
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShow(false));
    }
    return () => {
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, [visible, duration, translateY]);

  if (!show) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }] }>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
    marginTop: 40,
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
  },
});

export { Toast };
