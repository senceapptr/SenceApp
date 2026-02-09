import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface RaceEmptyStateProps {
    onExplore: () => void;
    categoryName?: string;
    onResetFilter?: () => void;
}

export function RaceEmptyState({ onExplore, categoryName, onResetFilter }: RaceEmptyStateProps) {
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);

    useEffect(() => {
        // Celebration animation
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 600 }),
                withTiming(1, { duration: 600 })
            ),
            -1,
            true
        );

        rotate.value = withRepeat(
            withSequence(
                withTiming(-5, { duration: 400 }),
                withTiming(5, { duration: 400 }),
                withTiming(0, { duration: 400 })
            ),
            -1,
            true
        );
    }, []);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    const isCategoryEmpty = !!categoryName && categoryName !== 'all';

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <Text style={styles.icon}>{isCategoryEmpty ? '🏁' : '🎉'}</Text>
            </Animated.View>

            <Text style={styles.title}>{isCategoryEmpty ? 'Kategori Tamamlandı' : 'Harika!'}</Text>
            <Text style={styles.subtitle}>
                {isCategoryEmpty
                    ? `"${categoryName}" kategorisindeki sorular bitti`
                    : 'Tüm soruları cevapladın'}
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
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.exploreGradient}
                >
                    <Ionicons name={isCategoryEmpty ? "layers" : "compass"} size={20} color="#FFFFFF" />
                    <Text style={styles.exploreText}>
                        {isCategoryEmpty ? 'Tüm Soruları Gör' : 'Diğer Liglere Göz At'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Decorative elements */}
            <View style={styles.decorations}>
                <Text style={styles.decoration}>✨</Text>
                <Text style={[styles.decoration, styles.decorationAlt]}>🌟</Text>
                <Text style={[styles.decoration, styles.decorationAlt2]}>⭐</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        marginBottom: 24,
    },
    icon: {
        fontSize: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#10B981',
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    exploreButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    exploreGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 28,
        paddingVertical: 16,
    },
    exploreText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    decorations: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    decoration: {
        position: 'absolute',
        fontSize: 24,
        opacity: 0.3,
        top: '20%',
        left: '15%',
    },
    decorationAlt: {
        top: '30%',
        left: 'auto',
        right: '10%',
        fontSize: 20,
    },
    decorationAlt2: {
        top: '70%',
        left: '25%',
        fontSize: 18,
    },
});
