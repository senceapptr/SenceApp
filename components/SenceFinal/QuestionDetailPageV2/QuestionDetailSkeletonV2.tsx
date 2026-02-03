import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QuestionDetailSkeletonV2Props {
  onBack: () => void;
}

export function QuestionDetailSkeletonV2({ onBack }: QuestionDetailSkeletonV2Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  const SkeletonBox = ({ width, height, style }: { width: number | string; height: number; style?: object }) => (
    <Animated.View style={[styles.skeleton, { width, height, opacity }, style]} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={[styles.navBtn, { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.surfaceCard, alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <SkeletonBox width={44} height={44} style={styles.navBtn} />
          <SkeletonBox width={44} height={44} style={styles.navBtn} />
        </View>
      </View>
      <SkeletonBox width="100%" height={260} style={styles.image} />
      <View style={styles.content}>
        <SkeletonBox width="90%" height={24} style={styles.title} />
        <SkeletonBox width="70%" height={20} style={[styles.title, { marginTop: 8 }]} />
        <View style={styles.meta}>
          <SkeletonBox width={100} height={20} />
          <SkeletonBox width={80} height={20} />
        </View>
        <View style={styles.tabs}>
          <SkeletonBox width="33%" height={40} />
          <SkeletonBox width="33%" height={40} />
          <SkeletonBox width="33%" height={40} />
        </View>
        <SkeletonBox width="100%" height={120} style={{ marginTop: 16, borderRadius: 16 }} />
        <SkeletonBox width="100%" height={80} style={{ marginTop: 16, borderRadius: 16 }} />
        <View style={styles.voteBar}>
          <SkeletonBox width="45%" height={60} style={{ borderRadius: 12 }} />
          <SkeletonBox width="45%" height={60} style={{ borderRadius: 12 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skeleton: { backgroundColor: '#21262D', borderRadius: 8 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerRight: { flexDirection: 'row', gap: 12 },
  navBtn: { borderRadius: 22 },
  image: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  content: { padding: 24, paddingTop: 48 },
  title: { borderRadius: 8 },
  meta: { flexDirection: 'row', gap: 12, marginTop: 16 },
  tabs: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  voteBar: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
