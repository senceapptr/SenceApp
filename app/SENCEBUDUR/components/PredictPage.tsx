import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './Header';

const { width, height } = Dimensions.get('window');

interface PredictPageProps {
  onBack: () => void;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
  maxSelections?: number;
  showBoostedOdds?: boolean;
}

export function PredictPage({ 
  onBack, 
  gameCredits, 
  setProfileDrawerOpen, 
  hasNotifications,
  maxSelections = 5, 
  showBoostedOdds = false 
}: PredictPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [predictionStack, setPredictionStack] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStackLimitError, setShowStackLimitError] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const cardRef = useRef<Animated.Value>(new Animated.Value(0)).current;
  const scaleRef = useRef<Animated.Value>(new Animated.Value(1)).current;

  // Sample questions for demonstration
  const questions = [
    {
      id: 1,
      title: "Bitcoin 100K geçecek mi?",
      yesOdds: 2.5,
      noOdds: 1.8,
      yesPercentage: 65,
      category: "kripto",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Tesla yeni model açıklayacak mı?",
      yesOdds: 1.9,
      noOdds: 2.2,
      yesPercentage: 45,
      category: "teknoloji",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Apple VR fiyat düşürecek mi?",
      yesOdds: 2.1,
      noOdds: 1.7,
      yesPercentage: 55,
      category: "teknoloji",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Netflix dizi sayısını artıracak mı?",
      yesOdds: 1.5,
      noOdds: 2.8,
      yesPercentage: 75,
      category: "eğlence",
      image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Amazon drone teslimat başlatacak mı?",
      yesOdds: 2.3,
      noOdds: 1.6,
      yesPercentage: 40,
      category: "teknoloji",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop"
    }
  ];

  const currentQuestion = questions[currentIndex];
  const canCreateCoupon = predictionStack.length === maxSelections;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentQuestion) return;
    
    // Check if stack is full
    if (predictionStack.length >= maxSelections) {
      setShowStackLimitError(true);
      setTimeout(() => setShowStackLimitError(false), 3000);
      return;
    }
    
    const vote = direction === 'right' ? 'yes' : 'no';
    const normalOdds = direction === 'right' ? currentQuestion.yesOdds : currentQuestion.noOdds;
    const boostedOdds = showBoostedOdds ? 
      (direction === 'right' ? currentQuestion.yesOdds * 1.2 : currentQuestion.noOdds * 1.2) : 
      normalOdds;
    
    const newPrediction = {
      id: currentQuestion.id,
      title: currentQuestion.title,
      vote: vote,
      odds: boostedOdds,
      normalOdds: normalOdds,
      boosted: showBoostedOdds,
      percentage: direction === 'right' ? currentQuestion.yesPercentage : (100 - currentQuestion.yesPercentage),
      category: currentQuestion.category
    };

    setPredictionStack(prev => {
      const newStack = [...prev, newPrediction];
      if (newStack.length === maxSelections) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      return newStack;
    });

    // Move to next question
    setCurrentIndex(prev => (prev + 1) % questions.length);
    setDragOffset(0);
    setSwipeDirection(null);
    
    // Reset card position
    Animated.parallel([
      Animated.timing(cardRef, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleRef, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleCreateCoupon = () => {
    if (!canCreateCoupon) return;
    
    // All coupons are now free
    setPredictionStack([]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleClearStack = () => {
    setPredictionStack([]);
  };

  const handleBack = () => {
    onBack();
  };

  const handleStart = () => {
    setShowIntro(false);
  };

  const getLeagueWarning = (category: string) => {
    const warnings = {
      kripto: "Kripto para piyasaları yüksek risk içerir",
      teknoloji: "Teknoloji sektörü hızlı değişim gösterir",
      eğlence: "Eğlence sektörü trendlere bağlıdır"
    };
    return warnings[category as keyof typeof warnings] || "";
  };

  const renderIntro = () => (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#6B4A9D']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>⚡</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            Hızlı Tahmin
          </Text>
          <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 40 }}>
            Kartları kaydırarak tahmin yap, kupon oluştur!
          </Text>
          
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, marginBottom: 30 }}>
            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
              Nasıl Oynanır?
            </Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, marginRight: 10 }}>➡️</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Sağa kaydır = EVET</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, marginRight: 10 }}>⬅️</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Sola kaydır = HAYIR</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, marginRight: 10 }}>📋</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>5 tahmin = Kupon oluştur</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={handleStart}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 25,
              marginBottom: 20
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#432870' }}>
              Başla
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Geri Dön
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderMainGame = () => (
    <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      {/* Header with stack info */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#202020' }}>
            Tahminler ({predictionStack.length}/{maxSelections})
          </Text>
          {canCreateCoupon && (
            <TouchableOpacity
              onPress={handleCreateCoupon}
              style={{
                backgroundColor: '#00AF54',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20
              }}
            >
              <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                Kupon Oluştur
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main card area */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Animated.View
          style={{
            width: width - 40,
            height: height * 0.6,
            transform: [
              { translateX: cardRef },
              { scale: scaleRef }
            ]
          }}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 12
          }}>
            {/* Card Image */}
            <View style={{ height: '60%', backgroundColor: '#F8F9FA' }}>
              <Image
                source={{ uri: currentQuestion.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%'
                }}
              />
            </View>

            {/* Card Content */}
            <View style={{ flex: 1, padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#202020', marginBottom: 15, lineHeight: 26 }}>
                {currentQuestion.title}
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00AF54' }}>
                    %{currentQuestion.yesPercentage}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>EVET</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FF4E4E' }}>
                    %{100 - currentQuestion.yesPercentage}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>HAYIR</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#00AF54' }}>
                    {currentQuestion.yesOdds}x
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>EVET Oranı</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FF4E4E' }}>
                    {currentQuestion.noOdds}x
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>HAYIR Oranı</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Swipe instructions */}
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
            Kartı kaydır
          </Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>⬅️</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>HAYIR</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24 }}>➡️</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>EVET</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Prediction Stack */}
      {predictionStack.length > 0 && (
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderTopWidth: 1,
          borderTopColor: '#E9ECEF'
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#202020' }}>
              Seçilen Tahminler
            </Text>
            <TouchableOpacity onPress={handleClearStack}>
              <Text style={{ color: '#FF4E4E', fontSize: 14 }}>Temizle</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {predictionStack.map((prediction, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: prediction.vote === 'yes' ? '#E8F5E8' : '#FEE2E2',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: prediction.vote === 'yes' ? '#00AF54' : '#FF4E4E'
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: prediction.vote === 'yes' ? '#00AF54' : '#FF4E4E'
                  }}>
                    {prediction.vote === 'yes' ? 'EVET' : 'HAYIR'} {prediction.odds}x
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      <Header 
        gameCredits={gameCredits}
        setProfileDrawerOpen={setProfileDrawerOpen}
        hasNotifications={hasNotifications}
        title="Hızlı Tahmin"
      />

      {showIntro ? renderIntro() : renderMainGame()}

      {/* Error Message */}
      {showStackLimitError && (
        <View style={{
          position: 'absolute',
          top: 100,
          left: 20,
          right: 20,
          backgroundColor: '#FF4E4E',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Maksimum {maxSelections} tahmin seçebilirsin!
          </Text>
        </View>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 20,
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 48, marginBottom: 10 }}>🎉</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#202020', marginBottom: 10 }}>
              Kupon Oluşturuldu!
            </Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
              Tahminlerin kuponlarım sayfasına eklendi.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
} 