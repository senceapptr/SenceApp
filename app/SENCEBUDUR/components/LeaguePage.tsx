import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './Header';

const { width, height } = Dimensions.get('window');

interface LeaguePageProps {
  showHeader?: boolean;
  onNavigate?: (page: string) => void;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

interface League {
  id: number;
  name: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost?: number;
}

interface LeaderboardUser {
  rank: number;
  username: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export function LeaguePage({ showHeader = true, onNavigate, gameCredits, setProfileDrawerOpen, hasNotifications }: LeaguePageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLeagueConfigModal, setShowLeagueConfigModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [userCredits] = useState(8500);
  const [userTickets] = useState(2);

  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    categories: [] as string[],
    isPrivate: true,
    maxParticipants: 20,
    duration: 7,
    entryFee: 0
  });

  const leagues: League[] = [
    {
      id: 1,
      name: "Spor Tahmin Ligi",
      description: "Futbol, basketbol ve diğer spor tahminleri",
      category: "spor",
      participants: 156,
      maxParticipants: 200,
      prize: "10,000 kredi",
      endDate: "15 Şubat",
      isJoined: true,
      position: 12,
      creator: "sporcu_mehmet",
      joinCost: 250
    },
    {
      id: 2,
      name: "Teknoloji Geleceği",
      description: "Tech şirketleri ve yeni teknolojiler hakkında",
      category: "teknoloji",
      participants: 89,
      maxParticipants: 100,
      prize: "7,500 kredi",
      endDate: "20 Şubat",
      isJoined: false,
      creator: "tech_guru",
      joinCost: 500
    },
    {
      id: 3,
      name: "Kripto Dünyası",
      description: "Bitcoin, altcoin ve kripto piyasa tahminleri",
      category: "kripto",
      participants: 234,
      maxParticipants: 300,
      prize: "15,000 kredi",
      endDate: "10 Mart",
      isJoined: true,
      position: 45,
      creator: "crypto_master",
      joinCost: 1000
    }
  ];

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, username: 'crypto_king', points: 3450, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
    { rank: 2, username: 'prediction_master', points: 3210, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
    { rank: 3, username: 'future_seer', points: 2980, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332446c?w=50&h=50&fit=crop&crop=face' },
    { rank: 12, username: 'mehmet_k', points: 2150, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', isCurrentUser: true },
    { rank: 4, username: 'trend_hunter', points: 2850, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face' },
    { rank: 5, username: 'market_wizard', points: 2720, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' }
  ];

  const ticketPrices = [
    { id: '1', title: '1 Lig Bileti', price: '₺29', description: 'Tek lig oluşturma hakkı' },
    { id: '2', title: '2 Lig Bileti', price: '₺49', originalPrice: '₺58', discount: '15% indirim', description: 'İki lig oluşturma hakkı', isPopular: true },
    { id: '3', title: '5 Lig Bileti', price: '₺99', originalPrice: '₺145', discount: '32% indirim', description: 'Beş lig oluşturma hakkı' }
  ];

  const categories = [
    { id: 'spor', name: 'Spor', icon: '⚽' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'kripto', name: 'Kripto', icon: '₿' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'ekonomi', name: 'Ekonomi', icon: '📈' },
    { id: 'eglence', name: 'Eğlence', icon: '🎬' }
  ];

  const availableLeagues = leagues.filter(league => !league.isJoined);
  const myLeagues = leagues.filter(league => league.isJoined);

  const handleJoinLeague = (league: League) => {
    setSelectedLeague(league);
    setShowJoinModal(true);
  };

  const confirmJoinLeague = () => {
    setShowJoinModal(false);
    setSelectedLeague(null);
  };

  const handleViewLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleCreateWithCredits = () => {
    setShowCreditModal(false);
    setShowLeagueConfigModal(true);
  };

  const handlePurchaseTicket = (optionId: string) => {
    setShowTicketModal(false);
    setShowLeagueConfigModal(true);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setLeagueConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleCreateLeague = () => {
    setShowLeagueConfigModal(false);
    setLeagueConfig({
      name: '',
      categories: [],
      isPrivate: true,
      maxParticipants: 20,
      duration: 7,
      entryFee: 0
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'spor': return { bg: '#B29EFD30', text: '#202020' };
      case 'teknoloji': return { bg: '#E3F2FD', text: '#1976D2' };
      case 'kripto': return { bg: '#FFF3E0', text: '#F57C00' };
      default: return { bg: '#F2F3F5', text: '#202020' };
    }
  };

  const renderTabButton = (tabId: string, label: string, icon: string) => (
    <TouchableOpacity
      key={tabId}
      onPress={() => setActiveTab(tabId as any)}
      style={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: activeTab === tabId ? '#FFFFFF' : 'transparent',
        marginHorizontal: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ marginRight: 8, fontSize: 16 }}>{icon}</Text>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 14,
          color: activeTab === tabId ? '#432870' : '#20202070'
        }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderLeagueCard = (league: League, isJoined: boolean = false) => (
    <View key={league.id} style={{
      backgroundColor: isJoined ? '#43287010' : '#FFFFFF',
      borderRadius: 24,
      borderWidth: 2,
      borderColor: isJoined ? '#43287030' : '#F2F3F5',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }}>
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
              {league.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#20202070', marginBottom: 12 }}>
              {league.description}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              {isJoined && (
                <View style={{
                  backgroundColor: '#432870',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 8,
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                    #{league.position} Sırada
                  </Text>
                </View>
              )}
              <View style={{
                backgroundColor: getCategoryColor(league.category).bg,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 8,
              }}>
                <Text style={{ color: getCategoryColor(league.category).text, fontSize: 12, fontWeight: 'bold' }}>
                  {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                </Text>
              </View>
              <Text style={{ color: '#20202050', fontSize: 12 }}>•</Text>
              <Text style={{ color: '#20202050', fontSize: 12, marginLeft: 8 }}>@{league.creator}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#432870' }}>{league.prize}</Text>
            <Text style={{ fontSize: 12, color: '#20202050' }}>Ödül</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#20202070', marginRight: 16 }}>
              👥 {league.participants}/{league.maxParticipants}
            </Text>
            <Text style={{ fontSize: 14, color: '#20202070' }}>
              📅 {league.endDate}
            </Text>
          </View>
        </View>

        {isJoined ? (
          <TouchableOpacity
            onPress={() => handleViewLeaderboard(league)}
            style={{
              backgroundColor: '#432870',
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 24,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
              Sıralamaya Bak
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => handleJoinLeague(league)}
              style={{
                flex: 1,
                backgroundColor: '#432870',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 24,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
                Katıl
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                backgroundColor: '#F2F3F5',
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#202020', fontSize: 16, fontWeight: 'bold' }}>
                Detay
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {showHeader && (
        <Header 
          gameCredits={gameCredits}
          setProfileDrawerOpen={setProfileDrawerOpen}
          hasNotifications={hasNotifications}
          title="Ligler"
        />
      )}
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Tabs */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{
            backgroundColor: '#F2F3F5',
            borderRadius: 16,
            padding: 4,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            flexDirection: 'row',
          }}>
            {renderTabButton('discover', 'Keşfet', '🔍')}
            {renderTabButton('my-leagues', 'Liglerım', '👤')}
            {renderTabButton('create', 'Oluştur', '➕')}
          </View>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: 20 }}>
          {activeTab === 'discover' && (
            <View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 16 }}>
                Katılabileceğin Ligler
              </Text>
              {availableLeagues.map(league => renderLeagueCard(league))}
            </View>
          )}

          {activeTab === 'my-leagues' && (
            <View>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 16 }}>
                Katıldığın Ligler
              </Text>
              {myLeagues.map(league => renderLeagueCard(league, true))}
            </View>
          )}

          {activeTab === 'create' && (
            <View style={{ gap: 24 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
                  Kendi Ligini Oluştur
                </Text>
                <Text style={{ color: '#20202070', textAlign: 'center' }}>
                  Arkadaşlarınla özel lig oluştur ve yarışın başlasın!
                </Text>
              </View>

              <View style={{
                backgroundColor: '#43287010',
                borderRadius: 24,
                padding: 24,
                borderWidth: 2,
                borderColor: '#43287030',
              }}>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>🏆</Text>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020', marginBottom: 12 }}>
                    Kendi ligin, kendi kuralların.
                  </Text>
                  <Text style={{ color: '#20202080', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
                    Sadece izlemekle yetinme. Arkadaşlarını topla, ligini kur, sıralamada 1. ol!
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                  {['Özel davetiye sistemi', 'Canlı sıralama', 'Kategori seçimi', 'Özel ödüller'].map((feature, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: '45%' }}>
                      <Text style={{ color: '#B29EFD', marginRight: 8 }}>✓</Text>
                      <Text style={{ color: '#202020', fontSize: 14 }}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Creation Options */}
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity
                  onPress={() => setShowCreditModal(true)}
                  style={{
                    flex: 1,
                    backgroundColor: '#B29EFD',
                    borderRadius: 24,
                    padding: 24,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>💰</Text>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
                    Kredi ile
                  </Text>
                  <Text style={{ color: '#202020', fontWeight: 'bold' }}>
                    Kredi ile oluştur
                  </Text>
                  <Text style={{ color: '#20202070', fontSize: 12, marginTop: 4 }}>
                    Hızlı ve kolay
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowTicketModal(true)}
                  style={{
                    flex: 1,
                    backgroundColor: '#432870',
                    borderRadius: 24,
                    padding: 24,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 48, marginBottom: 12 }}>🎫</Text>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFFFFF', marginBottom: 8 }}>
                    Bilet ile
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                    Bilet kullan
                  </Text>
                  <Text style={{ color: '#FFFFFF80', fontSize: 12, marginTop: 4 }}>
                    Premium özellikler
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Credit Purchase Modal */}
      <Modal
        visible={showCreditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreditModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowCreditModal(false)}
          />
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
                Kredi ile Lig Oluştur
              </Text>
              <Text style={{ color: '#20202070', textAlign: 'center' }}>
                Kendi ligini oluşturmak için 5,000 kredi gerekiyor
              </Text>
            </View>

            <View style={{
              backgroundColor: '#B29EFD20',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>💰</Text>
                <Text style={{ fontSize: 32, fontWeight: '900', color: '#432870', marginBottom: 8 }}>
                  5,000 kredi
                </Text>
                <Text style={{ color: '#20202070', fontSize: 12 }}>
                  Mevcut bakiyen: {userCredits.toLocaleString()} kredi
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCreditModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#E5E5E5',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#202020', fontWeight: 'bold' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateWithCredits}
                disabled={userCredits < 5000}
                style={{
                  flex: 1,
                  backgroundColor: userCredits >= 5000 ? '#432870' : '#E5E5E5',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: userCredits >= 5000 ? '#FFFFFF' : '#999999',
                  fontWeight: 'bold'
                }}>
                  Devam Et
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ticket Purchase Modal */}
      <Modal
        visible={showTicketModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTicketModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            margin: 16,
            flex: 1,
            overflow: 'hidden',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#F2F3F5',
            }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020' }}>
                  Lig Bileti Satın Al
                </Text>
                <Text style={{ color: '#432870', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>
                  Mevcut biletlerin: {userTickets}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowTicketModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F2F3F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#202020" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {ticketPrices.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handlePurchaseTicket(option.id)}
                  style={{
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: option.isPopular ? '#432870' : '#F2F3F5',
                    backgroundColor: option.isPopular ? '#43287010' : '#FFFFFF',
                    padding: 24,
                    marginBottom: 16,
                    alignItems: 'center',
                  }}
                >
                  {option.isPopular && (
                    <View style={{
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      marginLeft: -40,
                      backgroundColor: '#432870',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                        En Popüler
                      </Text>
                    </View>
                  )}

                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
                    {option.title}
                  </Text>
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#432870' }}>
                      {option.price}
                    </Text>
                    {option.originalPrice && (
                      <Text style={{
                        color: '#20202050',
                        fontSize: 18,
                        textDecorationLine: 'line-through',
                        marginLeft: 8,
                      }}>
                        {option.originalPrice}
                      </Text>
                    )}
                  </View>
                  {option.discount && (
                    <View style={{
                      backgroundColor: '#B29EFD',
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginBottom: 12,
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                        {option.discount}
                      </Text>
                    </View>
                  )}
                  <Text style={{ color: '#20202070', fontSize: 12, textAlign: 'center' }}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* League Configuration Modal */}
      <Modal
        visible={showLeagueConfigModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLeagueConfigModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            margin: 16,
            flex: 1,
            overflow: 'hidden',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#F2F3F5',
            }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020' }}>
                Lig Ayarları
              </Text>
              <TouchableOpacity
                onPress={() => setShowLeagueConfigModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F2F3F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#202020" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {/* League Name */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                  Lig Adı
                </Text>
                <TextInput
                  value={leagueConfig.name}
                  onChangeText={(text) => setLeagueConfig(prev => ({ ...prev, name: text }))}
                  placeholder="Örn: Arkadaşlar Ligi"
                  style={{
                    backgroundColor: '#F2F3F5',
                    borderWidth: 2,
                    borderColor: '#43287020',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>

              {/* Categories */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 12 }}>
                  Kategoriler
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => handleCategoryToggle(category.id)}
                      style={{
                        flex: 1,
                        minWidth: '45%',
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: leagueConfig.categories.includes(category.id) ? '#432870' : '#F2F3F5',
                        backgroundColor: leagueConfig.categories.includes(category.id) ? '#43287010' : '#FFFFFF',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>{category.icon}</Text>
                        <Text style={{
                          fontWeight: 'bold',
                          fontSize: 12,
                          color: leagueConfig.categories.includes(category.id) ? '#432870' : '#202020'
                        }}>
                          {category.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Privacy */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 12 }}>
                  Gizlilik
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setLeagueConfig(prev => ({ ...prev, isPrivate: true }))}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: leagueConfig.isPrivate ? '#432870' : '#F2F3F5',
                      backgroundColor: leagueConfig.isPrivate ? '#43287010' : '#FFFFFF',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24, marginBottom: 8 }}>🔒</Text>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: leagueConfig.isPrivate ? '#432870' : '#202020'
                    }}>
                      Özel Lig
                    </Text>
                    <Text style={{
                      fontSize: 10,
                      opacity: 0.7,
                      color: leagueConfig.isPrivate ? '#432870' : '#202020'
                    }}>
                      Sadece davetliler
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setLeagueConfig(prev => ({ ...prev, isPrivate: false }))}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: !leagueConfig.isPrivate ? '#432870' : '#F2F3F5',
                      backgroundColor: !leagueConfig.isPrivate ? '#43287010' : '#FFFFFF',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 24, marginBottom: 8 }}>🌍</Text>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: !leagueConfig.isPrivate ? '#432870' : '#202020'
                    }}>
                      Herkese Açık
                    </Text>
                    <Text style={{
                      fontSize: 10,
                      opacity: 0.7,
                      color: !leagueConfig.isPrivate ? '#432870' : '#202020'
                    }}>
                      Herkes katılabilir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Settings Grid */}
              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                    Maksimum Kişi
                  </Text>
                  <TextInput
                    value={leagueConfig.maxParticipants.toString()}
                    onChangeText={(text) => setLeagueConfig(prev => ({ ...prev, maxParticipants: parseInt(text) || 20 }))}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: '#F2F3F5',
                      borderWidth: 2,
                      borderColor: '#43287020',
                      borderRadius: 12,
                      padding: 12,
                      fontSize: 16,
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                    Süre (Gün)
                  </Text>
                  <TextInput
                    value={leagueConfig.duration.toString()}
                    onChangeText={(text) => setLeagueConfig(prev => ({ ...prev, duration: parseInt(text) || 7 }))}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: '#F2F3F5',
                      borderWidth: 2,
                      borderColor: '#43287020',
                      borderRadius: 12,
                      padding: 12,
                      fontSize: 16,
                    }}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={{ color: '#202020', fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
                  Katılım Ücreti (Kredi)
                </Text>
                <TextInput
                  value={leagueConfig.entryFee.toString()}
                  onChangeText={(text) => setLeagueConfig(prev => ({ ...prev, entryFee: parseInt(text) || 0 }))}
                  keyboardType="numeric"
                  placeholder="0 = Ücretsiz"
                  style={{
                    backgroundColor: '#F2F3F5',
                    borderWidth: 2,
                    borderColor: '#43287020',
                    borderRadius: 12,
                    padding: 12,
                    fontSize: 16,
                  }}
                />
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleCreateLeague}
                style={{
                  backgroundColor: '#432870',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
                  Ligi Oluştur
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Join League Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowJoinModal(false)}
          />
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020', marginBottom: 8 }}>
                {selectedLeague?.name} Ligine Katıl
              </Text>
              <Text style={{ color: '#20202070', textAlign: 'center' }}>
                {selectedLeague?.description}
              </Text>
            </View>

            <View style={{
              backgroundColor: '#B29EFD20',
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>💰</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#432870', marginBottom: 8 }}>
                  {selectedLeague?.joinCost?.toLocaleString()} kredi
                </Text>
                <Text style={{ color: '#20202070', fontSize: 12 }}>
                  Mevcut bakiyen: {userCredits.toLocaleString()} kredi
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowJoinModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#E5E5E5',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#202020', fontWeight: 'bold' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmJoinLeague}
                disabled={userCredits < (selectedLeague?.joinCost || 0)}
                style={{
                  flex: 1,
                  backgroundColor: userCredits >= (selectedLeague?.joinCost || 0) ? '#432870' : '#E5E5E5',
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: userCredits >= (selectedLeague?.joinCost || 0) ? '#FFFFFF' : '#999999',
                  fontWeight: 'bold'
                }}>
                  Katıl
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        visible={showLeaderboard}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLeaderboard(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            margin: 16,
            flex: 1,
            overflow: 'hidden',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#F2F3F5',
            }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020' }}>
                  {selectedLeague?.name}
                </Text>
                <Text style={{ color: '#432870', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>
                  Sıralama
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLeaderboard(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F2F3F5',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="#202020" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {leaderboardData.map((user) => (
                <View
                  key={user.rank}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: user.isCurrentUser ? '#43287020' : '#F2F3F5',
                    marginBottom: 12,
                    borderWidth: user.isCurrentUser ? 2 : 0,
                    borderColor: user.isCurrentUser ? '#43287030' : 'transparent',
                  }}
                >
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: user.rank === 1 ? '#FFD700' :
                                   user.rank === 2 ? '#C0C0C0' :
                                   user.rank === 3 ? '#CD7F32' :
                                   user.isCurrentUser ? '#432870' : '#E5E5E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                    <Text style={{
                      fontWeight: '900',
                      fontSize: 12,
                      color: user.rank <= 3 || user.isCurrentUser ? '#FFFFFF' : '#202020'
                    }}>
                      {user.rank}
                    </Text>
                  </View>

                  <Image
                    source={{ uri: user.avatar }}
                    style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
                  />

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{
                        fontWeight: 'bold',
                        color: user.isCurrentUser ? '#432870' : '#202020'
                      }}>
                        {user.username}
                      </Text>
                      {user.isCurrentUser && (
                        <View style={{
                          backgroundColor: '#432870',
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 8,
                          marginLeft: 8,
                        }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>
                            Sen
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ color: '#20202070', fontSize: 12 }}>
                      {user.points.toLocaleString()} puan
                    </Text>
                  </View>

                  {user.rank <= 3 && (
                    <Text style={{ fontSize: 24 }}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
} 