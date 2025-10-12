import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Easing, PanResponder, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';

function ArrowIcon({ opacity = 1, style = {} }: { opacity?: number; style?: any }) {
  return (
    <View style={[{ width: 18, height: 18, opacity }, style, { justifyContent: 'center', alignItems: 'center' }]}> 
      {/* Üst çizgi */}
      <View
        style={{
          position: 'absolute',
          left: 2,
          top: 6,
          width: 12,
          height: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          transform: [{ rotate: '25deg' }],
        }}
      />
      {/* Alt çizgi */}
      <View
        style={{
          position: 'absolute',
          left: 2,
          top: 9,
          width: 12,
          height: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          transform: [{ rotate: '-25deg' }],
        }}
      />
    </View>
  );
}

export default function CustomScreen() {
  const SLIDE_WIDTH = 150; // Eski genişlik
  const SLIDE_MARGIN = 8;
  const [buttonWidth, setButtonWidth] = useState(0);
  const SLIDE_MAX = buttonWidth > 0 ? buttonWidth - SLIDE_WIDTH - SLIDE_MARGIN * 2 + 1 : 0;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isSliding, setIsSliding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lastHapticX = useRef(0);
  const HAPTIC_STEP = 30; // Her 30 pikselde bir haptic

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !completed,
        onMoveShouldSetPanResponder: () => !completed,
        onPanResponderGrant: () => {
          setIsSliding(true);
          lastHapticX.current = 0;
          Haptics.selectionAsync(); // Sürükleme başında kısa haptic
        },
        onPanResponderMove: (e, gestureState) => {
          if (completed) return;
          let newX = Math.max(0, Math.min(gestureState.dx, SLIDE_MAX));
          slideAnim.setValue(newX);
          // Her HAPTIC_STEP pikselde bir haptic tetikle
          if (Math.abs(newX - lastHapticX.current) >= HAPTIC_STEP) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            lastHapticX.current = newX;
          }
        },
        onPanResponderRelease: (e, gestureState) => {
          if (completed) return;
          if (gestureState.dx > SLIDE_MAX * 0.7) {
            // Tamamlandı
            Animated.timing(slideAnim, {
              toValue: SLIDE_MAX,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setCompleted(true);
              setIsSliding(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Başarı haptici
            });
          } else {
            // Eski yerine dön
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setIsSliding(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Geri dönüşte orta haptic
            });
          }
        },
      }),
    [SLIDE_MAX, completed, slideAnim]
  );

  const handleSlide = () => {
    setIsSliding(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.bezier(0.22, 1, 0.36, 1), // iOS tarzı yumuşak eğri
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setIsSliding(false);
        slideAnim.setValue(0);
      }, 900);
    });
  };

  const slideTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Main Content Area */}
        <View style={styles.content}>
          <Text style={[styles.bigText, { marginBottom: 8 }]}>Gerçekten</Text>
          <View style={styles.row}>
            <View style={[styles.block, { backgroundColor: '#A8D5FF', width: 128 }]} />
            <Text style={[styles.bigText, { fontStyle: 'italic', marginLeft: 16 }]}>tahmin</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.bigText}>edebilir</Text>
            <View style={[styles.block, { backgroundColor: '#FFB3E6', width: 112, marginLeft: 16 }]} />
          </View>
          <View style={styles.row}>
            <View style={[styles.block, { backgroundColor: '#FFE066', width: 96 }]} />
            <Text style={[styles.bigText, { marginLeft: 16 }]}>misin?</Text>
          </View>
        </View>
        {/* Alt Alanlar */}
        <View style={styles.bottomArea}>
          {/* Slide Button */}
          <View style={styles.slideButton} onLayout={e => setButtonWidth(e.nativeEvent.layout.width)}>
            {/* Oklar önce, arka planda */}
            <View style={styles.arrowsBehind} pointerEvents="none">
              <ArrowIcon opacity={0.3} style={{}} />
              <ArrowIcon opacity={0.6} style={{ marginLeft: 4 }} />
              <ArrowIcon opacity={1.0} style={{ marginLeft: 4 }} />
            </View>
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.slidePart,
                {
                  transform: [{ translateX: slideAnim }],
                  backgroundColor: completed ? '#A8FFB3' : '#7ED957',
                  opacity: completed ? 0.7 : 1,
                  width: SLIDE_WIDTH, // Animated.View genişliği güncellendi
                  height: 84, // 1 piksel azaltıldı
                  borderRadius: 44, // Yükseklikle orantılı
                  top: 6, // Tam ortalama için
                  bottom: 6, // Tam ortalama için
                  left: 7, // 1 piksel sola kaydırıldı
                  zIndex: 1,
                },
              ]}
            >
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>{completed ? 'Done!' : 'Create'}</Text>
            </Animated.View>
          </View>
          {/* Login info */}
          <View style={styles.loginRow}>
            <Text style={{ color: '#000', opacity: 0.7 }}>Have an account?</Text>
            <TouchableOpacity>
              <Text style={{ color: '#000', textDecorationLine: 'underline' }}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ED957',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  bigText: { fontSize: 48, color: '#000', fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
    width: '100%',
  },
  block: { height: 48, borderRadius: 24 },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideButton: {
    width: '95%', // Daha da genişletildi
    height: 96, // Yükseklik artırıldı
    backgroundColor: '#000',
    borderRadius: 48, // Yükseklikle orantılı
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  slidePart: {
    position: 'absolute',
    left: 8,
    // top ve bottom Animated.View içinde override edildi
    // width Animated.View içinde override edildi
    backgroundColor: '#7ED957',
    borderRadius: 44, // Yükseklikle orantılı
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrows: {
    position: 'absolute',
    right: 90, // daha sola çekildi
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowsBehind: {
    position: 'absolute',
    right: 90, // eski arrows konumu
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0,
    top: '50%',
    transform: [{ translateY: -12 }], // okları dikey ortalamak için (yükseklik 24px gibi)
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
}); 