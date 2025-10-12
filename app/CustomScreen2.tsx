import React, { useRef, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Easing, PanResponder, Dimensions, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

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

export default function CustomScreen2() {
  const SLIDE_WIDTH = 150; // Eski genişlik
  const SLIDE_MARGIN = 8;
  const [buttonWidth, setButtonWidth] = useState(0);
  const SLIDE_MAX = buttonWidth > 0 ? buttonWidth - SLIDE_WIDTH - SLIDE_MARGIN * 2 + 1 : 0;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isSliding, setIsSliding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const lastHapticX = useRef(0);
  const HAPTIC_STEP = 30; // Her 30 pikselde bir haptic

  // --- TITREŞİM ANİMASYONLARI ---
  const shakeAnim = useRef(new Animated.Value(0)).current; // Sayfa için
  const textShakeAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current]; // 4 yazı için
  const shakeInterval = useRef<any>(null);
  const hapticInterval = useRef<any>(null);

  // Parmağın ilk dokunduğu noktayı kaydetmek için
  const dragStartX = useRef(0);
  const dragStartAnim = useRef(0);

  // slideButton'ın ekrandaki sol konumu
  const parentLeft = useRef(0);
  // Parmağın butonun sol kenarına göre dokunduğu offset
  const touchOffset = useRef(0);

  // PanResponder'ı her render'da oluştur (useMemo yerine), böylece closure güncel state'i kullanır
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !completed,
    onMoveShouldSetPanResponder: () => !completed,
    onPanResponderGrant: (e, gestureState) => {
      setIsSliding(true);
      lastHapticX.current = 0;
      // Sürükleme başında mevcut animasyon değerini al
      slideAnim.stopAnimation((val) => {
        // touchOffset: parmağın butonun sol kenarına olan uzaklığı
        touchOffset.current = gestureState.x0 - (parentLeft.current + val);
      });
      Haptics.selectionAsync(); // Sürükleme başında kısa haptic
    },
    onPanResponderMove: (e, gestureState) => {
      if (completed) return;
      // slideAnim = parmağın mevcut X - parentLeft - touchOffset
      let newX = gestureState.moveX - parentLeft.current - touchOffset.current;
      newX = Math.max(0, Math.min(newX, SLIDE_MAX));
      slideAnim.setValue(newX);
      // Her HAPTIC_STEP pikselde bir haptic tetikle
      if (Math.abs(newX - lastHapticX.current) >= HAPTIC_STEP) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        lastHapticX.current = newX;
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (completed) return;
      let releaseX = 0;
      slideAnim.stopAnimation((val) => {
        releaseX = val;
      });
      // Debug log: releaseX ve SLIDE_MAX değerlerini yazdır
      console.log('onPanResponderRelease', { releaseX, SLIDE_MAX });
      if (releaseX > SLIDE_MAX * 0.7) {
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
  });

  // Daha smooth ve premium bir eğri için easing fonksiyonu
  function easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x);
  }

  const startShake = (intensity: number, speed: number) => {
    // Sayfa titreşimi
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: intensity, duration: Math.max(60, speed), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -intensity, duration: Math.max(60, speed), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
    // Yazılar için daha az randomness, daha dalgamsı faz farkı
    textShakeAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: intensity * (0.8 + i * 0.08), duration: Math.max(60, speed + i * 20), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: -intensity * (0.8 + i * 0.08), duration: Math.max(60, speed + i * 20), easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      ).start();
    });
  };
  const stopShake = () => {
    shakeAnim.stopAnimation();
    shakeAnim.setValue(0);
    textShakeAnims.forEach(anim => { anim.stopAnimation(); anim.setValue(0); });
  };

  // --- Sürükleme ile titreşim ve haptic kontrolü ---
  React.useEffect(() => {
    if (isSliding && !completed) {
      // Sürükleme başladığında titreşim başlat
      let lastIntensity = 0;
      let lastSpeed = 0;
      let lastHapticTime = Date.now();
      let lastHapticStrength: 'Light' | 'Medium' | 'Heavy' = 'Light';
      shakeInterval.current && clearInterval(shakeInterval.current);
      shakeInterval.current = setInterval(() => {
        // slideAnim'in değerini sadece oku, listener ekleme
        const value = (slideAnim as any).getValue ? (slideAnim as any).getValue() : (slideAnim as any)._value || 0;
        const percent = Math.min(1, value / (SLIDE_MAX || 1));
        // Daha smooth ve premium için easing ile artış
        const eased = easeOutQuad(percent);
        const intensity = 1.5 + eased * 1.5; // 1.5-3 px arası, çok zarif
        const speed = 40 - eased * 25; // 40ms'den 15ms'ye
        if (Math.abs(intensity - lastIntensity) > 0.3 || Math.abs(speed - lastSpeed) > 1) {
          startShake(intensity, speed);
          lastIntensity = intensity;
          lastSpeed = speed;
        }
      }, 50);
      // Haptic feedback interval ve şiddeti psikolojik olarak optimize
      hapticInterval.current && clearInterval(hapticInterval.current);
      hapticInterval.current = setInterval(() => {
        const value = (slideAnim as any).getValue ? (slideAnim as any).getValue() : (slideAnim as any)._value || 0;
        const percent = Math.min(1, value / (SLIDE_MAX || 1));
        // Haptic aralığı üstel/logaritmik azalsın (230ms → 100ms)
        const hapticGap = 230 - Math.pow(percent, 1.5) * 130; // 230ms'den 100ms'ye
        // Haptic şiddeti: başta Light, ortada Medium, sonda Heavy
        let hapticStrength: 'Light' | 'Medium' | 'Heavy' = 'Light';
        if (percent > 0.7) hapticStrength = 'Heavy';
        else if (percent > 0.3) hapticStrength = 'Medium';
        // Sadece aralık dolduysa tetikle
        if (Date.now() - lastHapticTime > hapticGap || hapticStrength !== lastHapticStrength) {
          if (hapticStrength === 'Heavy') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          else if (hapticStrength === 'Medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          lastHapticTime = Date.now();
          lastHapticStrength = hapticStrength;
        }
      }, 30); // Daha sık kontrol, ama tetikleme aralığı yukarıda
    } else {
      // Sürükleme bitince titreşim ve haptic durdur
      shakeInterval.current && clearInterval(shakeInterval.current);
      hapticInterval.current && clearInterval(hapticInterval.current);
      stopShake();
    }
    return () => {
      shakeInterval.current && clearInterval(shakeInterval.current);
      hapticInterval.current && clearInterval(hapticInterval.current);
      stopShake();
    };
  }, [isSliding, completed, slideAnim, SLIDE_MAX]);

  // Ekran genişliği
  const SCREEN_WIDTH = Dimensions.get('window').width;

  // Yazılar için opacity animasyonları
  const textOpacities = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];
  // Bloklar için genişlik animasyonları (ilk değerler blok genişlikleriyle aynı olmalı)
  const blockWidths = [
    useRef(new Animated.Value(144)).current, // ilk blok
    useRef(new Animated.Value(128)).current, // ikinci blok
    useRef(new Animated.Value(112)).current, // üçüncü blok
  ];

  // Bloklara yazı fade-in için Animated.Value
  const blockTextOpacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  // Blok yazılarını kaydırmak için Animated.Value
  const blockTextTranslateX = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Buton için opacity animasyonu
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  // Oklar için opacity animasyonu
  const arrowsOpacity = useRef(new Animated.Value(1)).current;

  // "İlk Soruya Geç!" için opacity animasyonu
  const questionButtonTextOpacity = useRef(new Animated.Value(0)).current;

  // "İlk Soruya Geç!" için yeni buton opacity animasyonu
  const newButtonOpacity = useRef(new Animated.Value(0)).current;

  // Fadeout ve genişleme animasyonunu tetikle
  React.useEffect(() => {
    if (completed) {
      // Blok yazılarını sırayla fade-in için
      const textFadeInDelays = [500, 1000, 1500];
      // Önce diğer animasyonları başlat
      Animated.parallel([
        // Yazıların opaklığını sıfıra indir
        ...textOpacities.map(op =>
          Animated.timing(op, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        ),
        // Blokların genişliğini ekranın %120'sine çıkar
        Animated.timing(blockWidths[0], {
          toValue: SCREEN_WIDTH * 1.2,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(blockWidths[1], {
          toValue: SCREEN_WIDTH * 1.2,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(blockWidths[2], {
          toValue: SCREEN_WIDTH * 1.2,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        // Butonun opaklığını sıfıra indir
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Okların opaklığını sıfıra indir
        Animated.timing(arrowsOpacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Blok yazılarını kaydır
        Animated.timing(blockTextTranslateX[0], {
          toValue: SCREEN_WIDTH * 0.18,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(blockTextTranslateX[1], {
          toValue: -SCREEN_WIDTH * 0.18,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(blockTextTranslateX[2], {
          toValue: SCREEN_WIDTH * 0.12,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      // Blok yazılarını sırayla fade-in başlat
      blockTextOpacities.forEach((op, i) => {
        setTimeout(() => {
          Animated.timing(op, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }, textFadeInDelays[i]);
      });
      // "tek doğru cevap." yazısından 0.75s sonra buton yazısını göster
      setTimeout(() => {
        Animated.timing(questionButtonTextOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, 2250);
      // Buton kaybolduktan sonra yeni siyah buton ve yazı fade-in
      setTimeout(() => {
        Animated.timing(newButtonOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, 1200); // butonun fade-out süresi kadar gecikme
    }
  }, [completed]);

  const [isLayoutReady, setIsLayoutReady] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: '#7ED957' }}>
        <View
          style={{ flex: 1, backgroundColor: '#7ED957' }}
          onLayout={e => {
            setButtonWidth(e.nativeEvent.layout.width);
            parentLeft.current = e.nativeEvent.layout.x;
            setIsLayoutReady(true);
          }}
        >
          {isLayoutReady && (
            <Animated.View
              style={[
                styles.container,
                {
                  backgroundColor: '#7ED957',
                  transform: [
                    {
                      translateX: shakeAnim,
                    },
                  ],
                },
              ]}
            >
              {/* Main Content Area */}
              <View style={styles.content}>
                <Animated.Text
                  style={[
                    styles.bigText,
                    { marginBottom: 0, fontSize: 56, transform: [{ translateX: textShakeAnims[0] }], opacity: textOpacities[0] },
                  ]}
                >
                  Gerçekten
                </Animated.Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 0 }}>
                  <Animated.View style={{ width: blockWidths[0], height: 56, borderRadius: 28, backgroundColor: '#A8D5FF', marginRight: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <Animated.Text style={{
                      color: '#222',
                      fontWeight: 'bold',
                      fontSize: 28,
                      opacity: blockTextOpacities[0],
                      textAlign: 'center',
                      transform: [{ translateX: blockTextTranslateX[0] }],
                    }}>
                      gündemden sorular,
                    </Animated.Text>
                  </Animated.View>
                  <Animated.Text
                    style={[
                      styles.bigText,
                      { fontStyle: 'italic', fontSize: 56, marginLeft: 0, transform: [{ translateX: textShakeAnims[1] }], opacity: textOpacities[1] },
                    ]}
                  >
                    tahmin
                  </Animated.Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 0 }}>
                  <Animated.Text
                    style={[
                      styles.bigText,
                      { fontSize: 56, transform: [{ translateX: textShakeAnims[2] }], opacity: textOpacities[2] },
                    ]}
                  >
                    edebilir
                  </Animated.Text>
                  <Animated.View style={{ width: blockWidths[1], height: 56, borderRadius: 28, backgroundColor: '#FFB3E6', marginLeft: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <Animated.Text style={{
                      color: '#222',
                      fontWeight: 'bold',
                      fontSize: 28,
                      opacity: blockTextOpacities[1],
                      textAlign: 'center',
                      transform: [{ translateX: blockTextTranslateX[1] }],
                    }}>
                      iki seçenek,
                    </Animated.Text>
                  </Animated.View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 0 }}>
                  <Animated.View style={{ width: blockWidths[2], height: 56, borderRadius: 28, backgroundColor: '#FFE066', marginRight: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    <Animated.Text style={{
                      color: '#222',
                      fontWeight: 'bold',
                      fontSize: 28,
                      opacity: blockTextOpacities[2],
                      textAlign: 'center',
                      transform: [{ translateX: blockTextTranslateX[2] }],
                    }}>
                      tek doğru cevap.
                    </Animated.Text>
                  </Animated.View>
                  <Animated.Text
                    style={[
                      styles.bigText,
                      { fontSize: 56, marginLeft: 0, transform: [{ translateX: textShakeAnims[3] }], opacity: textOpacities[3] },
                    ]}
                  >
                    misin?
                  </Animated.Text>
                </View>
              </View>
              {/* Alt Alanlar */}
              <View style={styles.bottomArea}>
                {/* Slide Button */}
                <View
                  style={styles.slideButton}
                  onLayout={e => {
                    setButtonWidth(e.nativeEvent.layout.width);
                    parentLeft.current = e.nativeEvent.layout.x;
                  }}
                >
                  {/* Oklar önce, arka planda */}
                  <Animated.View style={[styles.arrowsBehind, { opacity: arrowsOpacity }]} pointerEvents="none">
                    <ArrowIcon opacity={0.3} style={{}} />
                    <ArrowIcon opacity={0.6} style={{ marginLeft: 4 }} />
                    <ArrowIcon opacity={1.0} style={{ marginLeft: 4 }} />
                  </Animated.View>
                  <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                      styles.slidePart,
                      {
                        left: 6,
                        transform: [{ translateX: slideAnim }],
                        backgroundColor: completed ? '#A8FFB3' : '#7ED957',
                        width: SLIDE_WIDTH,
                        height: 84,
                        borderRadius: 44,
                        zIndex: 1,
                        opacity: buttonOpacity,
                      },
                    ]}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 20 }}>{completed ? 'Done!' : 'Create'}</Text>
                  </Animated.View>
                  {/* Devam yazısı: slideButton'ın tam ortasında, mutlak konumlu, pointerEvents none */}
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: newButtonOpacity,
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                  >
                    <Animated.Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 20,
                        opacity: newButtonOpacity,
                        textAlign: 'center',
                        includeFontPadding: false,
                        textAlignVertical: 'center',
                      }}
                    >
                      Devam
                    </Animated.Text>
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
              {/* Geri tuşu */}
              {completed && (
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ position: 'absolute', top: 24, left: 16, zIndex: 10, padding: 8 }}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222' }}>{'< Geri'}</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
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
    alignItems: 'center',
    width: '100%',
    // margin/padding yok
  },
  bigText: { fontSize: 56, color: '#000', fontWeight: 'bold' },
  // row ve block kullanılmıyor, inline style ile hizalama yapıldı
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
    // position: 'absolute',
    // left: 7,
    backgroundColor: '#7ED957',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    alignSelf: 'center',
    position: 'relative',
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