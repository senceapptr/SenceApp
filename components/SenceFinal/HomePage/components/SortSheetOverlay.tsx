import React, { useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TrendSortBy } from './TrendQuestionsSection';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SORT_OPTIONS: { key: TrendSortBy; label: string }[] = [
  { key: 'date', label: 'Son Eklenenler' },
  { key: 'odds', label: 'Yüksek Oranlar' },
  { key: 'popular', label: 'Popüler Sorular' },
  { key: 'ending', label: 'Yakında Bitecek' },
];

interface SortSheetOverlayProps {
  visible: boolean;
  sortBy: TrendSortBy;
  onSelect: (key: TrendSortBy) => void;
  onClose: () => void;
}

export function SortSheetOverlay({ visible, sortBy, onSelect, onClose }: SortSheetOverlayProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    if (visible) {
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      panY.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: false,
          tension: 65,
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: false,
        tension: 200,
        friction: 3,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      onClose();
      slideAnim.setValue(SCREEN_HEIGHT);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) panY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        const { dy, vy } = g;
        if (dy > 100 || vy > 0.5) {
          slideAnim.setValue(dy);
          panY.setValue(0);
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: SCREEN_HEIGHT,
              useNativeDriver: false,
              tension: 60,
              friction: 8,
              velocity: vy * 50,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
              easing: Easing.in(Easing.cubic),
            }),
          ]).start(() => {
            onClose();
            slideAnim.setValue(SCREEN_HEIGHT);
          });
        } else {
          panY.setValue(0);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
            tension: 80,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSheet} activeOpacity={1} />
      </Animated.View>
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: Animated.add(slideAnim, panY) }] }]}
      >
        <View style={styles.handleWrap} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Sırala</Text>
        </View>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.option, sortBy === opt.key && styles.optionActive]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, sortBy === opt.key && styles.optionTextActive]}>
              {opt.label}
            </Text>
            {sortBy === opt.key && <Ionicons name="checkmark" size={20} color="#0A84FF" />}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.cancel} onPress={closeSheet} activeOpacity={0.8}>
          <Text style={styles.cancelText}>İptal</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingHorizontal: 16,
  },
  handleWrap: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 4,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  titleWrap: {
    paddingVertical: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  optionActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  optionText: {
    fontSize: 20,
    color: '#F5F5F7',
    fontWeight: '400',
  },
  optionTextActive: {
    color: '#0A84FF',
    fontWeight: '600',
  },
  cancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A84FF',
  },
});
