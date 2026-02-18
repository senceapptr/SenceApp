import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ContentTab = 'predictions' | 'statistics';
type StatsSubTab = 'predictions' | 'tickets';

interface AdminProfileRedesignMockPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

interface PredictionCard {
  id: string;
  image: ImageSourcePropType;
  odds: string;
  title: string;
  vote: 'EVET' | 'HAYIR';
}

interface StatRow {
  label: string;
  tone: 'base' | 'primary' | 'secondary';
  value: string;
}

const LEAGUE_COLORS = {
  background: '#0D1117',
  border: '#30363D',
  card: '#161B22',
  cta: '#256EFF',
  ctaDark: '#2F4F8C',
  muted: '#8B949E',
  surface: '#0F172A',
  text: '#F0F6FC',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const responsiveFont = (base: number, min: number, max: number) => {
  const scaled = Math.round((SCREEN_WIDTH / 390) * base);
  return Math.max(min, Math.min(max, scaled));
};

const MOCK_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=220&h=220&fit=crop&crop=face';

const MOCK_PREDICTION_CARDS: PredictionCard[] = [
  {
    id: 'pred-1',
    image: require('../../assets/images/global_new.png'),
    odds: '2.48x',
    title: 'Bitcoin bu hafta 95.000$ üstüne çıkar mı?',
    vote: 'EVET',
  },
  {
    id: 'pred-2',
    image: require('../../assets/images/finans_new.png'),
    odds: '3.12x',
    title: 'FED Mart toplantısında faiz sabit kalır mı?',
    vote: 'HAYIR',
  },
  {
    id: 'pred-3',
    image: require('../../assets/images/spor_new.png'),
    odds: '1.94x',
    title: 'Derbi maçında toplam gol 2.5 üst olur mu?',
    vote: 'EVET',
  },
  {
    id: 'pred-4',
    image: require('../../assets/images/teknoloji_new.png'),
    odds: '2.73x',
    title: 'Yeni iPhone çıkış haftasında stok sorunu yaşar mı?',
    vote: 'HAYIR',
  },
];

const MOCK_STAT_SUMMARY = {
  accuracyRate: 0.624,
  correctPredictions: 98,
  couponAccuracyRate: 0.371,
  couponTotalEarnings: 12400,
  highestOddsWon: 4.92,
  maxWinAmount: 3650,
  totalCoupons: 43,
  totalEarnings: 29100,
  totalPredictions: 157,
  wonCoupons: 16,
};

export function AdminProfileRedesignMockPage({ onBack, onMenuToggle }: AdminProfileRedesignMockPageProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ContentTab>('predictions');
  const [activeStatsSubTab, setActiveStatsSubTab] = useState<StatsSubTab>('predictions');

  const predictionStats = useMemo<StatRow[]>(
    () => [
      { label: 'Toplam Tahmin', tone: 'base', value: `${MOCK_STAT_SUMMARY.totalPredictions}` },
      { label: 'Doğru Yanıt', tone: 'secondary', value: `${MOCK_STAT_SUMMARY.correctPredictions}` },
      { label: 'Başarı Oranı', tone: 'secondary', value: `%${(MOCK_STAT_SUMMARY.accuracyRate * 100).toFixed(1)}` },
      { label: 'Toplam Kazanç', tone: 'primary', value: `+${MOCK_STAT_SUMMARY.totalEarnings.toLocaleString('tr-TR')} kredi` },
    ],
    [],
  );

  const ticketStats = useMemo<StatRow[]>(
    () => [
      { label: 'Toplam Ticket', tone: 'base', value: `${MOCK_STAT_SUMMARY.totalCoupons}` },
      { label: 'Kazanan Ticket', tone: 'secondary', value: `${MOCK_STAT_SUMMARY.wonCoupons}` },
      {
        label: 'Kupon Başarısı',
        tone: 'secondary',
        value: `%${(MOCK_STAT_SUMMARY.couponAccuracyRate * 100).toFixed(1)}`,
      },
      {
        label: 'Ticket Kazancı',
        tone: 'primary',
        value: `+${MOCK_STAT_SUMMARY.couponTotalEarnings.toLocaleString('tr-TR')} kredi`,
      },
    ],
    [],
  );

  const activeStatsRows = activeStatsSubTab === 'predictions' ? predictionStats : ticketStats;

  const getRowValueStyle = (tone: StatRow['tone']) => {
    if (tone === 'primary') return styles.statRowValuePrimary;
    if (tone === 'secondary') return styles.statRowValueSecondary;
    return styles.statRowValueBase;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={LEAGUE_COLORS.background} />

      <SafeAreaView edges={['top']} style={styles.safeTopArea}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topIconButton} onPress={onBack} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color={LEAGUE_COLORS.text} />
          </TouchableOpacity>

          <Text style={styles.topHandle}>@ilginy</Text>

          <TouchableOpacity style={styles.topIconButton} onPress={onMenuToggle} activeOpacity={0.8}>
            <Ionicons name="settings-outline" size={22} color={LEAGUE_COLORS.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom + 140, 150),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileHeaderRow}>
            <Image source={{ uri: MOCK_PROFILE_IMAGE }} style={styles.avatar} />

            <View style={styles.countsRow}>
              <View style={styles.countItem}>
                <Text style={styles.countValue}>132</Text>
                <Text style={styles.countLabel}>Takipçi</Text>
              </View>
              <View style={styles.countItem}>
                <Text style={styles.countValue}>64</Text>
                <Text style={styles.countLabel}>Takip</Text>
              </View>
              <View style={styles.countItem}>
                <Text style={styles.countValue}>{MOCK_STAT_SUMMARY.totalPredictions}</Text>
                <Text style={styles.countLabel}>Tahmin</Text>
              </View>
            </View>
          </View>

          <Text style={styles.userName}>Ilgin Yolgezen</Text>
          <Text style={styles.userBio}>Prediction strategist</Text>

          <TouchableOpacity style={styles.editButton} activeOpacity={0.88}>
            <LinearGradient colors={[LEAGUE_COLORS.cta, LEAGUE_COLORS.cta]} style={styles.editButtonGradient}>
              <Text style={styles.editButtonText}>Profili Düzenle</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.iconTabBar}>
          <TouchableOpacity
            style={[styles.iconTabItem, activeTab === 'predictions' && styles.iconTabItemActive]}
            onPress={() => setActiveTab('predictions')}
            activeOpacity={0.88}
          >
            <Ionicons
              name="ticket-outline"
              size={24}
              color={activeTab === 'predictions' ? LEAGUE_COLORS.text : LEAGUE_COLORS.muted}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconTabItem, activeTab === 'statistics' && styles.iconTabItemActive]}
            onPress={() => setActiveTab('statistics')}
            activeOpacity={0.88}
          >
            <Ionicons
              name="stats-chart-outline"
              size={24}
              color={activeTab === 'statistics' ? LEAGUE_COLORS.text : LEAGUE_COLORS.muted}
            />
          </TouchableOpacity>
        </View>

        {activeTab === 'predictions' && (
          <View style={styles.predictionsGrid}>
            {MOCK_PREDICTION_CARDS.map(card => (
              <View key={card.id} style={styles.predictionCardWrapper}>
                <ImageBackground source={card.image} style={styles.predictionCard} imageStyle={styles.predictionCardImage}>
                  <TouchableOpacity style={styles.deleteBadge} activeOpacity={0.8}>
                    <Ionicons name="trash-outline" size={16} color={LEAGUE_COLORS.text} />
                  </TouchableOpacity>

                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.85)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.predictionBottomOverlay}
                  >
                    <Text style={styles.predictionTitle} numberOfLines={2}>
                      {card.title}
                    </Text>
                    <View style={styles.predictionMetaRow}>
                      <View style={[styles.voteBadge, card.vote === 'EVET' ? styles.voteBadgeYes : styles.voteBadgeNo]}>
                        <Text style={styles.voteBadgeText}>{card.vote}</Text>
                      </View>
                      <Text style={styles.predictionOdds}>{card.odds}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'statistics' && (
          <View style={styles.statisticsSection}>
            <View style={styles.highlightRow}>
              <View style={styles.highlightCard}>
                <Text style={styles.highlightLabel}>En Yüksek Oran</Text>
                <Text style={styles.highlightValue}>{MOCK_STAT_SUMMARY.highestOddsWon.toFixed(2)}x</Text>
              </View>
              <View style={styles.highlightCard}>
                <Text style={styles.highlightLabel}>Maksimum Kazanç</Text>
                <Text style={styles.highlightValue}>{MOCK_STAT_SUMMARY.maxWinAmount.toLocaleString('tr-TR')}</Text>
              </View>
            </View>

            <View style={styles.statisticsCard}>
              <View style={styles.statsSubTabs}>
                <TouchableOpacity
                  style={[styles.statsSubTabButton, activeStatsSubTab === 'predictions' && styles.statsSubTabButtonActive]}
                  onPress={() => setActiveStatsSubTab('predictions')}
                  activeOpacity={0.88}
                >
                  <Text
                    style={[styles.statsSubTabText, activeStatsSubTab === 'predictions' && styles.statsSubTabTextActive]}
                  >
                    Tahmin
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statsSubTabButton, activeStatsSubTab === 'tickets' && styles.statsSubTabButtonActive]}
                  onPress={() => setActiveStatsSubTab('tickets')}
                  activeOpacity={0.88}
                >
                  <Text style={[styles.statsSubTabText, activeStatsSubTab === 'tickets' && styles.statsSubTabTextActive]}>
                    Ticket
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsRows}>
                {activeStatsRows.map(row => (
                  <View key={row.label} style={styles.statRow}>
                    <Text style={styles.statRowLabel}>{row.label}</Text>
                    <Text style={[styles.statRowValueBase, getRowValueStyle(row.tone)]}>{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomMockTabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.bottomMockTabsRow}>
          <Ionicons name="home-outline" size={24} color={LEAGUE_COLORS.muted} />
          <Ionicons name="ticket-outline" size={24} color={LEAGUE_COLORS.muted} />
          <Ionicons name="stats-chart-outline" size={24} color={LEAGUE_COLORS.muted} />
          <Ionicons name="person-circle-outline" size={24} color={LEAGUE_COLORS.text} />
        </View>

        <TouchableOpacity style={styles.bottomCtaButton} activeOpacity={0.9}>
          <Ionicons name="add" size={26} color={LEAGUE_COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: LEAGUE_COLORS.border,
    borderRadius: 44,
    borderWidth: 2,
    height: 88,
    width: 88,
  },
  bottomCtaButton: {
    alignItems: 'center',
    backgroundColor: LEAGUE_COLORS.cta,
    borderRadius: 30,
    bottom: 54,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    width: 60,
  },
  bottomMockTabBar: {
    backgroundColor: LEAGUE_COLORS.card,
    borderTopColor: LEAGUE_COLORS.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingTop: 16,
    position: 'absolute',
    right: 0,
  },
  bottomMockTabsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },
  container: {
    backgroundColor: LEAGUE_COLORS.background,
    flex: 1,
  },
  countItem: {
    alignItems: 'center',
    flex: 1,
  },
  countLabel: {
    color: LEAGUE_COLORS.muted,
    fontSize: responsiveFont(12, 11, 13),
    fontWeight: '500',
    marginTop: 4,
  },
  countValue: {
    color: LEAGUE_COLORS.text,
    fontSize: responsiveFont(22, 20, 24),
    fontWeight: '900',
  },
  countsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    marginLeft: 14,
  },
  deleteBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(13,17,23,0.74)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(240,246,252,0.12)',
    height: 32,
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 8,
    width: 32,
  },
  editButton: {
    borderRadius: 14,
    marginTop: 18,
    overflow: 'hidden',
    width: '100%',
  },
  editButtonGradient: {
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFont(16, 15, 17),
    fontWeight: '700',
  },
  highlightCard: {
    backgroundColor: LEAGUE_COLORS.card,
    borderColor: LEAGUE_COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  highlightLabel: {
    color: LEAGUE_COLORS.muted,
    fontSize: responsiveFont(11, 10, 12),
    fontWeight: '600',
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  highlightValue: {
    color: LEAGUE_COLORS.cta,
    fontSize: responsiveFont(17, 16, 19),
    fontWeight: '900',
    marginTop: 6,
  },
  iconTabBar: {
    backgroundColor: LEAGUE_COLORS.surface,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 2,
    overflow: 'hidden',
    padding: 4,
  },
  iconTabItem: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconTabItemActive: {
    backgroundColor: LEAGUE_COLORS.ctaDark,
  },
  predictionBottomOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  predictionCard: {
    flex: 1,
    justifyContent: 'space-between',
  },
  predictionCardImage: {
    borderRadius: 14,
  },
  predictionCardWrapper: {
    aspectRatio: 1,
    backgroundColor: LEAGUE_COLORS.card,
    borderColor: 'rgba(240,246,252,0.12)',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    width: '48.5%',
  },
  predictionMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  predictionOdds: {
    color: '#D6E4FF',
    fontSize: responsiveFont(12, 11, 13),
    fontWeight: '700',
  },
  predictionTitle: {
    color: '#F8FAFC',
    fontSize: responsiveFont(12, 11, 13),
    fontWeight: '700',
    lineHeight: responsiveFont(16, 14, 18),
  },
  predictionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
  },
  profileHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileSection: {
    backgroundColor: LEAGUE_COLORS.background,
    borderBottomColor: LEAGUE_COLORS.border,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  safeTopArea: {
    borderBottomColor: LEAGUE_COLORS.border,
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  statRowLabel: {
    color: LEAGUE_COLORS.muted,
    fontSize: responsiveFont(13, 12, 14),
    fontWeight: '600',
  },
  statRowValueBase: {
    color: LEAGUE_COLORS.text,
    fontSize: responsiveFont(13, 12, 14),
    fontWeight: '800',
  },
  statRowValuePrimary: {
    color: LEAGUE_COLORS.cta,
  },
  statRowValueSecondary: {
    color: '#93C5FD',
  },
  statisticsCard: {
    backgroundColor: LEAGUE_COLORS.card,
    borderColor: LEAGUE_COLORS.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  statisticsSection: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  statsRows: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  statsSubTabButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statsSubTabButtonActive: {
    backgroundColor: LEAGUE_COLORS.ctaDark,
  },
  statsSubTabText: {
    color: LEAGUE_COLORS.muted,
    fontSize: responsiveFont(12, 11, 13),
    fontWeight: '700',
  },
  statsSubTabTextActive: {
    color: LEAGUE_COLORS.text,
  },
  statsSubTabs: {
    backgroundColor: LEAGUE_COLORS.surface,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 4,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topHandle: {
    color: LEAGUE_COLORS.text,
    fontSize: responsiveFont(24, 20, 26),
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  topIconButton: {
    alignItems: 'center',
    backgroundColor: LEAGUE_COLORS.card,
    borderColor: LEAGUE_COLORS.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  userBio: {
    color: LEAGUE_COLORS.muted,
    fontSize: responsiveFont(14, 13, 16),
    fontWeight: '500',
    marginTop: 4,
  },
  userName: {
    color: LEAGUE_COLORS.text,
    fontSize: responsiveFont(28, 24, 30),
    fontWeight: '900',
    marginTop: 14,
  },
  voteBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  voteBadgeNo: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  voteBadgeText: {
    color: '#F8FAFC',
    fontSize: responsiveFont(9, 9, 10),
    fontWeight: '700',
  },
  voteBadgeYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
});
