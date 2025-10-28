import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  Image,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CouponPrediction {
  id: number;
  question: string;
  choice: 'yes' | 'no';
  odds: number;
  category: string;
  result?: 'won' | 'lost' | 'pending';
}

interface Coupon {
  id: number;
  predictions: CouponPrediction[];
  totalOdds: number;
  potentialEarnings: number;
  status: 'live' | 'won' | 'lost';
  createdAt: Date;
  claimedReward?: boolean;
  username?: string;
  investmentAmount?: number;
}

interface AlternativeCouponsPageProps {
  onMenuToggle: () => void;
}

export function AlternativeCouponsPage({ onMenuToggle }: AlternativeCouponsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'live' | 'won' | 'lost'>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Header animation logic
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Clear existing timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    if (scrollDiff > 5 && currentScrollY > 50) {
      // Scrolling down - hide header
      Animated.timing(headerTranslateY, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      // Scrolling up - show header
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide after 3 seconds of no scrolling
      hideTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          Animated.timing(headerTranslateY, {
            toValue: -120,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, 3000);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  // Mock coupon data with statistics
  const mockCoupons: Coupon[] = [
    {
      id: 100,
      predictions: [
        { id: 1, question: "Bitcoin bu yıl 100.000 doları aşacak mı?", choice: 'yes', odds: 2.4, category: 'Kripto', result: 'pending' },
        { id: 2, question: "ChatGPT-5 2024'te çıkacak mı?", choice: 'yes', odds: 1.8, category: 'Teknoloji', result: 'pending' },
        { id: 3, question: "Türkiye Milli Takımı Avrupa Şampiyonası'nda finale kalacak mı?", choice: 'no', odds: 3.2, category: 'Spor', result: 'pending' }
      ],
      totalOdds: 13.82,
      potentialEarnings: 6910,
      status: 'live',
      createdAt: new Date(),
      claimedReward: false,
      username: '@mustafa_92',
      investmentAmount: 500
    },
    {
      id: 101,
      predictions: [
        { id: 4, question: "Apple Vision Pro Türkiye'ye bu yıl gelecek mi?", choice: 'yes', odds: 1.9, category: 'Teknoloji', result: 'won' },
        { id: 5, question: "Netflix abonelik fiyatları %50 artacak mı?", choice: 'yes', odds: 2.2, category: 'Teknoloji', result: 'won' }
      ],
      totalOdds: 4.18,
      potentialEarnings: 2090,
      status: 'won',
      createdAt: new Date(Date.now() - 86400000),
      claimedReward: false,
      username: '@mustafa_92',
      investmentAmount: 500
    },
    {
      id: 102,
      predictions: [
        { id: 6, question: "Tesla Model Y fiyatı düşecek mi?", choice: 'no', odds: 1.5, category: 'Finans', result: 'lost' },
        { id: 7, question: "Instagram Reels özelliği kaldırılacak mı?", choice: 'yes', odds: 4.2, category: 'Sosyal-Medya', result: 'lost' }
      ],
      totalOdds: 6.30,
      potentialEarnings: 3150,
      status: 'lost',
      createdAt: new Date(Date.now() - 172800000),
      claimedReward: false,
      username: '@mustafa_92',
      investmentAmount: 500
    }
  ];

  // Statistics calculation
  const totalCoupons = mockCoupons.length;
  const liveCoupons = mockCoupons.filter(c => c.status === 'live').length;
  const wonCoupons = mockCoupons.filter(c => c.status === 'won').length;
  const lostCoupons = mockCoupons.filter(c => c.status === 'lost').length;
  const totalEarnings = mockCoupons.filter(c => c.status === 'won').reduce((sum, c) => sum + c.potentialEarnings, 0);
  const totalLost = mockCoupons.filter(c => c.status === 'lost').reduce((sum, c) => sum + (c.investmentAmount || 0), 0);

  const filteredCoupons = mockCoupons.filter(coupon => {
    if (selectedCategory === 'all') return true;
    return coupon.status === selectedCategory;
  });

  const handleCouponClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponDetail(true);
  };

  const handleClaimReward = (couponId: number) => {
    setShowCouponDetail(false);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Statistics Cards Component
  const StatisticsCards = () => (
    <View style={styles.statisticsContainer}>
      <View style={styles.statisticsRow}>
        <LinearGradient
          colors={['#432870', '#5A3A8B']}
          style={[styles.statCard, styles.statCardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statLabel}>Toplam Kupon</Text>
          <Text style={styles.statValue}>{totalCoupons}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#10B981', '#059669']}
          style={[styles.statCard, styles.statCardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statLabel}>Kazanılan Kredi</Text>
          <Text style={styles.statValue}>{totalEarnings.toLocaleString()}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          style={[styles.statCard, styles.statCardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statLabel}>Kaybedilen Kredi</Text>
          <Text style={styles.statValue}>{totalLost.toLocaleString()}</Text>
        </LinearGradient>
      </View>
    </View>
  );

  // Category Tabs Component
  const CategoryTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContainer}>
        {[
          { id: 'all', name: 'Tümü', count: totalCoupons },
          { id: 'live', name: 'Canlı', count: liveCoupons },
          { id: 'won', name: 'Kazanan', count: wonCoupons },
          { id: 'lost', name: 'Kaybeden', count: lostCoupons }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedCategory === tab.id ? styles.activeTab : styles.inactiveTab
            ]}
            onPress={() => setSelectedCategory(tab.id as any)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.tabText,
              selectedCategory === tab.id ? styles.activeTabText : styles.inactiveTabText
            ]}>
              {tab.name}
            </Text>
            <Text style={[
              styles.tabCount,
              selectedCategory === tab.id ? styles.activeTabCount : styles.inactiveTabCount
            ]}>
              {tab.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Coupon Card Component
  const CouponCard = ({ item }: { item: Coupon }) => {
    const getStatusColor = (): [string, string] => {
      switch (item.status) {
        case 'live': return ['#E0E7FF', '#C7D2FE'];
        case 'won': return ['#D1FAE5', '#A7F3D0'];
        case 'lost': return ['#FEE2E2', '#FECACA'];
        default: return ['#F3F4F6', '#E5E7EB'];
      }
    };

    const getStatusBorderColor = (): string => {
      switch (item.status) {
        case 'live': return '#3B82F6';
        case 'won': return '#10B981';
        case 'lost': return '#EF4444';
        default: return '#E5E7EB';
      }
    };

    const getStatusBadge = () => {
      switch (item.status) {
        case 'live': return { text: '⏰ 7 gün 0 saat', color: '#3B82F6' };
        case 'won': return { text: '🎉 Kazandı', color: '#10B981' };
        case 'lost': return { text: '😞 Kaybetti', color: '#EF4444' };
        default: return { text: '', color: '#6B7280' };
      }
    };

    const statusBadge = getStatusBadge();

    return (
      <TouchableOpacity
        style={[styles.couponCard, { borderWidth: 2, borderColor: getStatusBorderColor() }]}
        onPress={() => handleCouponClick(item)}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={getStatusColor()}
          style={styles.couponCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header */}
          <View style={styles.couponHeader}>
            <View style={styles.couponHeaderLeft}>
              <View style={[styles.statusDot, { backgroundColor: statusBadge.color }]} />
              <Text style={styles.couponTitle}>Kupon #{item.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
              <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
            </View>
          </View>

          {/* Predictions */}
          <View style={styles.predictionsContainer}>
            {item.predictions.slice(0, 3).map((prediction, index) => (
              <View key={prediction.id} style={styles.predictionRow}>
                <View style={styles.predictionLeft}>
                  <Text style={styles.predictionQuestion} numberOfLines={1}>
                    {prediction.question}
                  </Text>
                  <View style={styles.predictionMeta}>
                    <View style={[
                      styles.choiceBadge,
                      prediction.choice === 'yes' ? styles.yesBadge : styles.noBadge
                    ]}>
                      <Text style={[
                        styles.choiceBadgeText,
                        prediction.choice === 'yes' ? styles.yesBadgeText : styles.noBadgeText
                      ]}>
                        {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                      </Text>
                    </View>
                    <Text style={styles.categoryText}>{prediction.category}</Text>
                    {prediction.result && (
                      <Text style={styles.resultIcon}>
                        {prediction.result === 'won' ? '✅' : prediction.result === 'lost' ? '❌' : '⏳'}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.oddsText}>{prediction.odds}x</Text>
              </View>
            ))}

            {item.predictions.length > 3 && (
              <View style={styles.morePredictions}>
                <Text style={styles.morePredictionsText}>
                  +{item.predictions.length - 3} tahmin daha
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.couponFooter}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Potansiyel Kazanç</Text>
              <Text style={styles.footerValue}>₺{item.potentialEarnings.toLocaleString()}</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerLabel}>Toplam Oran</Text>
              <Text style={styles.totalOdds}>{item.totalOdds.toFixed(2)}x</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Coupon Detail Modal Component
  const CouponDetailModal = () => (
    <Modal
      visible={showCouponDetail}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCouponDetail(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {selectedCoupon && (
          <>
            {/* Modal Header */}
            <LinearGradient
              colors={
                selectedCoupon.status === 'live' ? ['#3B82F6', '#8B5CF6'] :
                selectedCoupon.status === 'won' ? ['#10B981', '#059669'] :
                ['#EF4444', '#DC2626']
              }
              style={styles.modalHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalHeaderLeft}>
                  <Image
                    source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" }}
                    style={styles.modalUserImage}
                  />
                  <View>
                    <Text style={styles.modalTitle}>Kupon #{selectedCoupon.id}</Text>
                    <Text style={styles.modalUsername}>{selectedCoupon.username}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowCouponDetail(false)}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalStats}>
                <View style={styles.modalStat}>
                  <Text style={styles.modalStatLabel}>Yatırım</Text>
                  <Text style={styles.modalStatValue}>{selectedCoupon.investmentAmount}</Text>
                </View>
                <View style={styles.modalStat}>
                  <Text style={styles.modalStatLabel}>Toplam Oran</Text>
                  <Text style={styles.modalStatValue}>{selectedCoupon.totalOdds.toFixed(2)}x</Text>
                </View>
                <View style={styles.modalStat}>
                  <Text style={styles.modalStatLabel}>Potansiyel</Text>
                  <Text style={styles.modalStatValue}>₺{selectedCoupon.potentialEarnings.toLocaleString()}</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Modal Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Tahminler ({selectedCoupon.predictions.length})
                </Text>
                <Text style={styles.modalSectionDate}>09.08.2025</Text>
              </View>

              <View style={styles.modalPredictions}>
                {selectedCoupon.predictions.map((prediction, index) => (
                  <View
                    key={prediction.id}
                    style={[
                      styles.modalPredictionCard,
                      prediction.result === 'won' ? styles.modalPredictionWon :
                      prediction.result === 'lost' ? styles.modalPredictionLost :
                      styles.modalPredictionPending
                    ]}
                  >
                    <View style={styles.modalPredictionHeader}>
                      <Text style={styles.modalPredictionQuestion}>
                        {prediction.question}
                      </Text>
                      <Text style={styles.modalPredictionOdds}>
                        {prediction.odds}x
                      </Text>
                    </View>

                    <View style={styles.modalPredictionFooter}>
                      <View style={[
                        styles.modalChoiceBadge,
                        prediction.choice === 'yes' ? styles.modalYesBadge : styles.modalNoBadge
                      ]}>
                        <Text style={styles.modalChoiceBadgeText}>
                          {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                        </Text>
                      </View>
                      <Text style={styles.modalCategoryText}>{prediction.category}</Text>
                      {prediction.result && (
                        <View style={[
                          styles.modalResultBadge,
                          prediction.result === 'won' ? styles.modalResultWon :
                          prediction.result === 'lost' ? styles.modalResultLost :
                          styles.modalResultPending
                        ]}>
                          <Text style={styles.modalResultText}>
                            {prediction.result === 'won' ? '✅ BEKLIYOR' :
                             prediction.result === 'lost' ? '❌ KAYBETTI' : '⏳ BEKLIYOR'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.shareButton}>
                <LinearGradient
                  colors={['#432870', '#8B5CF6']}
                  style={styles.shareButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.shareButtonText}>📤 Kuponu Paylaş</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.copyButton}>
                <Text style={styles.copyButtonText}>📄</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Animated Header */}
        <Animated.View style={[
          styles.animatedHeader,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}>
          <SafeAreaView style={styles.headerSafeArea}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Kuponlarım</Text>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={onMenuToggle}
                activeOpacity={0.8}
              >
                <View style={styles.hamburgerIcon}>
                  <View style={styles.hamburgerLine} />
                  <View style={styles.hamburgerLine} />
                  <View style={styles.hamburgerLine} />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#432870', '#5A3A8B']}
              tintColor="#432870"
              progressBackgroundColor="#FFFFFF"
              title="Yenileniyor..."
              titleColor="#432870"
            />
          }
        >
          {/* Statistics Cards */}
          <StatisticsCards />

          {/* Category Tabs */}
          <CategoryTabs />

          {/* Coupons List */}
          <View style={styles.couponsContainer}>
            <FlatList
              data={filteredCoupons}
              renderItem={CouponCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.couponsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        {/* Coupon Detail Modal */}
        <CouponDetailModal />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingTop: 70, // Header height compensation
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  statisticsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statisticsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statCardLarge: {
    minHeight: 80,
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  tabsContainer: {
    marginBottom: 24,
  },
  tabsScrollContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#432870',
  },
  inactiveTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#374151',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabCount: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  inactiveTabCount: {
    color: '#6B7280',
  },
  couponsContainer: {
    paddingHorizontal: 24,
  },
  couponsList: {
    gap: 16,
  },
  couponCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  couponCardGradient: {
    padding: 20,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  couponHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  predictionsContainer: {
    marginBottom: 16,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  predictionLeft: {
    flex: 1,
  },
  predictionQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  predictionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  yesBadge: {
    backgroundColor: '#D1FAE5',
  },
  noBadge: {
    backgroundColor: '#FEE2E2',
  },
  choiceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  yesBadgeText: {
    color: '#065F46',
  },
  noBadgeText: {
    color: '#991B1B',
  },
  categoryText: {
    fontSize: 10,
    color: '#6B7280',
  },
  resultIcon: {
    fontSize: 12,
  },
  oddsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  morePredictions: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  morePredictionsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalOdds: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalUserImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalUsername: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  modalStatValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSectionDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalPredictions: {
    gap: 12,
  },
  modalPredictionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  modalPredictionPending: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  modalPredictionWon: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  modalPredictionLost: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  modalPredictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalPredictionQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
  },
  modalPredictionOdds: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  modalPredictionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalChoiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalYesBadge: {
    backgroundColor: '#D1FAE5',
  },
  modalNoBadge: {
    backgroundColor: '#FEE2E2',
  },
  modalChoiceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalCategoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalResultPending: {
    backgroundColor: '#DBEAFE',
  },
  modalResultWon: {
    backgroundColor: '#D1FAE5',
  },
  modalResultLost: {
    backgroundColor: '#FEE2E2',
  },
  modalResultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  shareButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyButton: {
    width: 56,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 20,
  },
});
