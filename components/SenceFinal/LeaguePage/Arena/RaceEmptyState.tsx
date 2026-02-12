import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PRIMARY_BLUE } from '../shared/theme';

interface RaceEmptyStateProps {
  onExplore: () => void;
  categoryName?: string;
  onResetFilter?: () => void;
}

export function RaceEmptyState({ categoryName, onExplore, onResetFilter }: RaceEmptyStateProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      true,
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 400 }),
        withTiming(5, { duration: 400 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
      true,
    );
  }, [rotate, scale]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const isCategoryEmpty = !!categoryName && categoryName !== 'all';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <Ionicons
          name={isCategoryEmpty ? 'checkmark-done-circle-outline' : 'sparkles-outline'}
          size={80}
          color={PRIMARY_BLUE}
        />
      </Animated.View>

      <Text style={styles.title}>{isCategoryEmpty ? 'Kategori Tamamlandı' : 'Harika!'}</Text>
      <Text style={styles.subtitle}>
        {isCategoryEmpty ? `"${categoryName}" kategorisindeki sorular bitti` : 'Tüm soruları cevapladın'}
      </Text>

      <Text style={styles.description}>
        {isCategoryEmpty
          ? 'Diğer kategorilerde cevaplanacak sorular olabilir. Tüm soruları görmek için aşağıya tıkla.'
          : 'Bu ligdeki tüm aktif soruları bitirdin. Yeni sorular eklendiğinde tekrar gel veya diğer liglere göz at.'}
      </Text>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={isCategoryEmpty && onResetFilter ? onResetFilter : onExplore}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#256EFF', '#256EFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.exploreGradient}
        >
          <Ionicons name={isCategoryEmpty ? 'layers' : 'compass'} size={20} color="#FFFFFF" />
          <Text style={styles.exploreText}>{isCategoryEmpty ? 'Tüm Soruları Gör' : 'Diğer Liglere Göz At'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  description: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
  },
  exploreButton: {
    borderRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  exploreGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  iconContainer: {
    marginBottom: 24,
  },
  subtitle: {
    color: PRIMARY_BLUE,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
});
