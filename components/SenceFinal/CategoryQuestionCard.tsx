import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCountdown } from './hooks/useCountdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Ana sayfa ve Kategori sayfalarında kullanılan standart soru kartı.
 * Kendi içindeki useCountdown hook'u sayesinde her saniye kendini güncelleyerek saniye saniye akar.
 */
export default function CategoryQuestionCard({ question, onDetail, onVote, theme, dynamicStyles }: any) {
    const liveTimeLeft = useCountdown(question.end_date);
    const noPercentage = 100 - (question.yesPercentage || 50);

    // Animasyon değerleri (her kart için bağımsız)
    const yesBarWidth = useRef(new Animated.Value(question.yesPercentage || 0)).current;
    const noBarWidth = useRef(new Animated.Value(noPercentage)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const yesFillAnim = useRef(new Animated.Value(0)).current;
    const noFillAnim = useRef(new Animated.Value(0)).current;

    // Yüzde barları için animasyonu başlat
    useEffect(() => {
        Animated.parallel([
            Animated.timing(yesBarWidth, {
                toValue: question.yesPercentage || 0,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(noBarWidth, {
                toValue: noPercentage,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start();
    }, [question.yesPercentage]);

    const handleCardPressIn = () => Animated.spring(cardScale, { toValue: 0.97, useNativeDriver: true }).start();
    const handleCardPressOut = () => Animated.spring(cardScale, { toValue: 1, useNativeDriver: true }).start();
    const handleYesPressIn = () => Animated.timing(yesFillAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
    const handleYesPressOut = () => Animated.timing(yesFillAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    const handleNoPressIn = () => Animated.timing(noFillAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
    const handleNoPressOut = () => Animated.timing(noFillAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();

    const yesFillWidth = yesFillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    const noFillWidth = noFillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

    const formatVotes = (votes: number) => {
        if (votes >= 1000) return `${(votes / 1000).toFixed(1)}k`;
        return votes.toString();
    };

    // Time & Result Logic
    const endDateMs = question.end_date ? new Date(question.end_date).getTime() : 0;
    const isExpired = endDateMs > 0 && endDateMs <= Date.now();
    // Sonuç sadece süre bittiyse veya statü resolved/closed ise görünür.
    // Pre-approved sonuç (admin önden girmiş ama süre bitmemiş) gizlenir.
    const showResult = question.result && (isExpired || question.status === 'resolved' || question.status === 'closed');

    let displayTime = liveTimeLeft;
    if (showResult) {
        displayTime = 'Sonuçlandı';
    } else if (isExpired && !showResult) {
        displayTime = 'Sonuç Bekleniyor';
    }

    // Fallback for optional styles if not provided by parent
    const stylesOrFallback = dynamicStyles || {
        yesLabel: { color: theme?.yes || '#34C759' },
        noLabel: { color: theme?.no || '#FF3B30' },
        yesBar: { backgroundColor: theme?.yes || '#34C759' },
        noBar: { backgroundColor: theme?.no || '#FF3B30' },
        yesButton: { borderColor: theme?.yes || '#34C759' },
        noButton: { borderColor: theme?.no || '#FF3B30' },
    };

    const themeAccent = theme?.accent || '#34C759';
    const themeError = theme?.error || '#FF3B30';

    // ... result logic ...
    const resultColor = question.result === 'yes' ? themeAccent : question.result === 'no' ? themeError : '#8E8E93';
    const resultText = question.result === 'yes' ? 'EVET' : 'HAYIR';
    const resultIcon = question.result === 'yes' ? 'checkmark-circle' : 'close-circle';

    return (
        <TouchableOpacity
            onPress={() => onDetail(question.id, question.category)}
            onPressIn={handleCardPressIn}
            onPressOut={handleCardPressOut}
            activeOpacity={0.95}
            style={styles.cardContainer}
        >
            <Animated.View style={[styles.questionCard, { transform: [{ scale: cardScale }] }]}>
                <Image
                    source={{ uri: question.image || 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=600' }}
                    style={styles.questionImage}
                    resizeMode="cover"
                />

                {/* Dark Gradient Overlay for Readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />

                {/* RESULT OVERLAY (Eğer sonuç varsa şık bir şekilde göster) */}
                {showResult && (
                    <View style={styles.resultOverlay}>
                        <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
                            <Ionicons name={resultIcon} size={20} color="#FFF" style={{ marginRight: 6 }} />
                            <Text style={styles.resultBadgeText}>SONUÇ: {resultText}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.contentWrapper}>
                    {/* Header Info: User Count & Timer */}
                    <View style={styles.statsRow}>
                        <View style={styles.statContainer}>
                            <Ionicons name="people" size={12} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.statText}>{formatVotes(question.votes)} Oy</Text>
                        </View>
                        {!showResult && (
                            <View style={styles.statContainer}>
                                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                                <Text style={[styles.statText, isExpired && { color: '#FF453A' }]}>
                                    {displayTime}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Question Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title} numberOfLines={3}>{question.title}</Text>
                    </View>

                    {/* Apple-Style Modern Progress Bar */}
                    <View style={styles.progressSection}>
                        <View style={styles.percentageLabels}>
                            <Text style={[styles.percentageText, { color: stylesOrFallback.yesLabel.color }]}>
                                %{question.yesPercentage} Evet
                            </Text>
                            <Text style={[styles.percentageText, { color: stylesOrFallback.noLabel.color }]}>
                                %{noPercentage} Hayır
                            </Text>
                        </View>

                        <View style={styles.trackContainer}>
                            {/* YES Bar */}
                            <View style={[
                                styles.trackBar,
                                {
                                    flex: question.yesPercentage,
                                    backgroundColor: stylesOrFallback.yesBar.backgroundColor,
                                    borderTopRightRadius: 2,
                                    borderBottomRightRadius: 2,
                                    marginRight: 2
                                }
                            ]} />
                            {/* NO Bar */}
                            <View style={[
                                styles.trackBar,
                                {
                                    flex: noPercentage,
                                    backgroundColor: stylesOrFallback.noBar.backgroundColor,
                                    borderTopLeftRadius: 2,
                                    borderBottomLeftRadius: 2,
                                    marginLeft: 2
                                }
                            ]} />
                        </View>
                    </View>

                    {/* Action Buttons (Vote) - Sadece sonuçlanmadıysa gösterilebilir veya her zaman */}
                    {!showResult ? (
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                onPress={() => onVote(question.id, 'yes', question.yesOdds)}
                                style={[styles.voteButton, stylesOrFallback.yesButton]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.voteButtonText}>Evet</Text>
                                <Text style={styles.voteOdds}>{question.yesOdds}x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onVote(question.id, 'no', question.noOdds)}
                                style={[styles.voteButton, stylesOrFallback.noButton]}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.voteButtonText}>Hayır</Text>
                                <Text style={styles.voteOdds}>{question.noOdds}x</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.resultInfoContainer}>
                            <Text style={styles.resultInfoText}>
                                Bu tahmin etkinliği sona erdi.
                            </Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    questionCard: {
        height: 380, // Kart boyunu biraz arttırdım ferahlık için
        borderRadius: 28, // Daha yumuşak köşe
        backgroundColor: '#1C1C1E',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
    },
    questionImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.85,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    resultOverlay: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    resultBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#34C759', // Dinamik değişecek
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    resultBadgeText: {
        color: '#FFFFFF',
        fontWeight: '800', // Heavy font
        fontSize: 14,
        letterSpacing: 0.5,
    },
    contentWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 24,
        gap: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statText: {
        color: '#EBEBF5',
        fontSize: 12,
        fontWeight: '600',
    },
    titleContainer: {
        marginBottom: 4,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 17, // Küçültüldü
        fontWeight: '700',
        lineHeight: 22,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    progressSection: {
        gap: 8,
    },
    percentageLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    trackContainer: {
        flexDirection: 'row',
        height: 8, // İnce bar
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.15)', // Empty track color
        borderRadius: 4,
        overflow: 'hidden',
    },
    trackBar: {
        height: '100%',
        borderRadius: 4, // Pill shape
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    voteButton: {
        flex: 1,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.15)', // Glass effect
        borderWidth: 1,
        // borderColor dinamik gelecek
        borderRadius: 14, // Squircle'a yakın
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    voteButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    voteOdds: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
    },
    resultInfoContainer: {
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
    },
    resultInfoText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
        fontSize: 14,
    },
});
