import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './Header';

interface MyBetsPageProps {
  showHeader?: boolean;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

export function MyBetsPage({ showHeader = true, gameCredits, setProfileDrawerOpen, hasNotifications }: MyBetsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState('tümü');

  // Sample bet data based on Figma design
  const bets = [
    {
      id: 1,
      date: '19 Ocak 2025',
      status: 'pending',
      amount: 10,
      payout: 28,
      odds: 2.8,
      selections: [
        { question: 'Netflix dizi sayısını artıracak mı?', vote: 'Evet', odds: 1.4 },
        { question: 'Amazon drone teslimat başlatacak mı?', vote: 'Hayır', odds: 2.0 }
      ]
    },
    {
      id: 2,
      date: '21 Ocak 2025',
      status: 'won',
      amount: 25,
      payout: 67.5,
      odds: 2.7,
      selections: [
        { question: 'Lakers playoff\'a kalacak mı?', vote: 'Evet', odds: 1.5 },
        { question: 'Bitcoin 100K geçecek mi?', vote: 'Evet', odds: 1.8 }
      ]
    },
    {
      id: 3,
      date: '20 Ocak 2025',
      status: 'lost',
      amount: 15,
      payout: 0,
      odds: 3.2,
      selections: [
        { question: 'Tesla yeni model açıklayacak mı?', vote: 'Hayır', odds: 2.2 },
        { question: 'Apple VR fiyat düşürecek mi?', vote: 'Evet', odds: 1.45 }
      ]
    }
  ];

  const filters = [
    { id: 'tümü', label: 'Tümü', count: bets.length },
    { id: 'bekleyenler', label: 'Bekleyenler', count: bets.filter(b => b.status === 'pending').length },
    { id: 'kazananlar', label: 'Kazananlar', count: bets.filter(b => b.status === 'won').length },
    { id: 'kaybedenler', label: 'Kaybedenler', count: bets.filter(b => b.status === 'lost').length }
  ];

  const filteredBets = bets.filter(bet => {
    if (selectedFilter === 'tümü') return true;
    switch (selectedFilter) {
      case 'bekleyenler': return bet.status === 'pending';
      case 'kazananlar': return bet.status === 'won';
      case 'kaybedenler': return bet.status === 'lost';
      default: return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return '#00AA44';
      case 'lost': return '#DC2626';
      case 'pending': return '#432870';
      default: return '#202020';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'Kazandı';
      case 'lost': return 'Kaybetti';
      case 'pending': return 'Bekliyor';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'won': return '#E8F5E8';
      case 'lost': return '#FEE2E2';
      case 'pending': return '#F0E8FF';
      default: return '#F2F3F5';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {showHeader && (
        <Header 
          gameCredits={gameCredits}
          setProfileDrawerOpen={setProfileDrawerOpen}
          hasNotifications={hasNotifications}
          title="Kuponlarım"
        />
      )}

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Filter Tabs */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 16,
          gap: 8
        }}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: selectedFilter === filter.id ? '#432870' : 'transparent',
                borderWidth: selectedFilter === filter.id ? 0 : 1,
                borderColor: '#E5E5E5'
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: selectedFilter === filter.id ? 'white' : '#202020'
              }}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bets List */}
        <View style={{ paddingHorizontal: 16, gap: 16 }}>
          {filteredBets.map((bet) => (
            <View 
              key={bet.id} 
              style={{
                backgroundColor: getStatusBg(bet.status),
                borderRadius: 20,
                borderWidth: 1,
                borderColor: getStatusColor(bet.status) + '20',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              {/* Bet Header */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: getStatusColor(bet.status) + '20'
              }}>
                <View>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
                    marginBottom: 4
                  }}>
                    {bet.date}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <View style={{
                      backgroundColor: getStatusColor(bet.status),
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12
                    }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(bet.status)}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: '#666'
                    }}>
                      Oran: {bet.odds}x
                    </Text>
                  </View>
                </View>
                
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#202020',
                    marginBottom: 4
                  }}>
                    {bet.amount} kredi
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: bet.status === 'won' ? '#00AA44' : bet.status === 'lost' ? '#DC2626' : '#432870',
                    fontWeight: 'bold'
                  }}>
                    {bet.status === 'won' ? '+' : bet.status === 'lost' ? '-' : ''}{bet.payout} kredi
                  </Text>
                </View>
              </View>

              {/* Selections */}
              <View style={{ padding: 16 }}>
                {bet.selections.map((selection, index) => (
                  <View 
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 8,
                      borderBottomWidth: index < bet.selections.length - 1 ? 1 : 0,
                      borderBottomColor: '#E5E5E5'
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 16 }}>
                      <Text style={{
                        fontSize: 14,
                        color: '#202020',
                        marginBottom: 4
                      }}>
                        {selection.question}
                      </Text>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <View style={{
                          backgroundColor: selection.vote === 'Evet' ? '#00AA44' : '#DC2626',
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8
                        }}>
                          <Text style={{
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}>
                            {selection.vote}
                          </Text>
                        </View>
                        <Text style={{
                          fontSize: 12,
                          color: '#666'
                        }}>
                          {selection.odds}x
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 