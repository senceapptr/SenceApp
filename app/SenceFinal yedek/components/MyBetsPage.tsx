import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ColorValue
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


interface MyBetsPageProps {
  showHeader?: boolean;
}

export function MyBetsPage({ showHeader = true }: MyBetsPageProps) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'won'>('all');

  const bets = [
    {
      id: 3,
      date: '19 Ocak 2025',
      status: 'pending' as const,
      statusText: 'Bekliyor',
      amount: 10,
      payout: 28,
      odds: 2.8,
      selections: [
        { question: 'Netflix dizi sayısını artıracak mı?', vote: 'Evet', odds: 1.4 },
        { question: 'Amazon drone teslimat başlatacak mı?', vote: 'Hayır', odds: 2.0 }
      ]
    },
    {
      id: 1,
      date: '21 Ocak 2025',
      status: 'won' as const,
      statusText: 'Kazandı',
      amount: 25,
      payout: 67.5,
      odds: 2.7,
      selections: [
        { question: 'Lakers playoff\'a kalacak mı?', vote: 'Evet', odds: 1.5 },
        { question: 'Bitcoin 100K geçecek mi?', vote: 'Evet', odds: 1.8 }
      ]
    },
    {
      id: 2,
      date: '20 Ocak 2025',
      status: 'lost' as const,
      statusText: 'Kaybetti',
      amount: 15,
      payout: 0,
      odds: 3.2,
      selections: [
        { question: 'Tesla yeni model açıklayacak mı?', vote: 'Hayır', odds: 2.2 },
        { question: 'Apple VR fiyat düşürecek mi?', vote: 'Evet', odds: 1.45 }
      ]
    }
  ];

  const tabs = [
    { id: 'all', label: 'Tümü', count: bets.length },
    { id: 'pending', label: 'Bekleyenler', count: bets.filter(b => b.status === 'pending').length },
    { id: 'won', label: 'Kazanan', count: bets.filter(b => b.status === 'won').length }
  ];

  const filteredBets = selectedTab === 'all' ? bets : bets.filter(bet => {
    if (selectedTab === 'pending') return bet.status === 'pending';
    if (selectedTab === 'won') return bet.status === 'won';
    return true;
  });

  const getCardStyle = (status: string): {
    gradient: [ColorValue, ColorValue];
    borderColor: string;
    statusColor: string;
  } => {
    switch (status) {
      case 'pending':
        return {
          gradient: ['#FEF3C7', '#FED7AA'],
          borderColor: '#F59E0B',
          statusColor: '#D97706'
        };
      case 'won':
        return {
          gradient: ['#DCFCE7', '#BBF7D0'],
          borderColor: '#10B981',
          statusColor: '#059669'
        };
      case 'lost':
        return {
          gradient: ['#FEE2E2', '#FECACA'],
          borderColor: '#EF4444',
          statusColor: '#DC2626'
        };
      default:
        return {
          gradient: ['#F9FAFB', '#F3F4F6'],
          borderColor: '#E5E7EB',
          statusColor: '#6B7280'
        };
    }
  };

  const TabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => setSelectedTab(tab.id as any)}
          style={[
            styles.tab,
            selectedTab === tab.id && styles.activeTab
          ]}
        >
          <Text style={[
            styles.tabText,
            selectedTab === tab.id && styles.activeTabText
          ]}>
            {tab.label} ({tab.count})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const BetCard = ({ bet }: { bet: any }) => {
    const cardStyle = getCardStyle(bet.status);
    
    return (
      <View style={[styles.betCard, { borderColor: cardStyle.borderColor }]}>
        <LinearGradient
          colors={cardStyle.gradient}
          style={styles.betCardGradient}
        >
          {/* Status Header */}
          <View style={styles.betHeader}>
            <Text style={[styles.statusText, { color: cardStyle.statusColor }]}>
              {bet.statusText}
            </Text>
            <Text style={styles.payoutText}>
              {bet.status === 'won' ? `+${bet.payout}` : bet.status === 'lost' ? `-${bet.amount}` : bet.payout}
            </Text>
          </View>

          {/* Bet Info */}
          <Text style={styles.betInfo}>
            {bet.date} • {bet.amount} puan • {bet.odds}x oran
          </Text>

          {/* Selections */}
          <View style={styles.selectionsContainer}>
            {bet.selections.map((selection: any, index: number) => (
              <View key={index} style={styles.selectionCard}>
                <Text style={styles.selectionQuestion} numberOfLines={2}>
                  {selection.question}
                </Text>
                <View style={styles.selectionMeta}>
                  <View style={[
                    styles.voteBadge,
                    selection.vote === 'Evet' ? styles.yesBadge : styles.noBadge
                  ]}>
                    <Text style={styles.voteText}>{selection.vote}</Text>
                  </View>
                  <Text style={styles.oddsText}>{selection.odds}x</Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📊</Text>
      <Text style={styles.emptyTitle}>
        {selectedTab === 'all' ? 'Henüz Kupon Yok' : 
         selectedTab === 'pending' ? 'Bekleyen Kupon Yok' : 
         'Kazanan Kupon Yok'}
      </Text>
      <Text style={styles.emptySubtitle}>
        Tahmin yapmaya başla ve kuponlarını burada takip et!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TabBar />

        {filteredBets.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.betsContainer}>
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6B46F0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  betsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  betCard: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  betCardGradient: {
    padding: 20,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  payoutText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
  },
  betInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  selectionsContainer: {
    gap: 12,
  },
  selectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  selectionQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 18,
  },
  selectionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  yesBadge: {
    backgroundColor: '#DCFCE7',
  },
  noBadge: {
    backgroundColor: '#FEE2E2',
  },
  voteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  oddsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
