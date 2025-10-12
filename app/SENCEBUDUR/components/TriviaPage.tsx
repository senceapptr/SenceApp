import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './Header';

const { width, height } = Dimensions.get('window');

interface TriviaPageProps {
  onBack: () => void;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

type GameState = 'intro' | 'interactive-intro' | 'countdown' | 'playing' | 'results' | 'final-results';

export function TriviaPage({ onBack, gameCredits, setProfileDrawerOpen, hasNotifications }: TriviaPageProps) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState(0);
  const [timerStopped, setTimerStopped] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const triviaQuestions: TriviaQuestion[] = [
    {
      id: 1,
      question: "Türkiye'nin başkenti neresidir?",
      options: ["İstanbul", "Ankara"],
      correctAnswer: 1,
      category: "Coğrafya",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Bitcoin ilk kez hangi yılda piyasaya sürüldü?",
      options: ["2008", "2009"],
      correctAnswer: 1,
      category: "Kripto",
      difficulty: "medium"
    },
    {
      id: 3,
      question: "Apple'ın kurucusu Steve Jobs mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Teknoloji",
      difficulty: "easy"
    },
    {
      id: 4,
      question: "En büyük okyanus Pasifik midir?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Coğrafya",
      difficulty: "easy"
    },
    {
      id: 5,
      question: "Tesla'nın CEO'su Elon Musk mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Teknoloji",
      difficulty: "easy"
    }
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'countdown') {
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGameState('playing');
            return 3;
          }
          return prev - 1;
        });
      }, 1000) as any;
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !timerStopped) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 5;
          }
          return prev - 1;
        });
      }, 1000) as any;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timerStopped]);

  const handleTimeUp = () => {
    setTimerStopped(true);
    setShowAnswer(true);
    setAnswers(prev => [...prev, false]);
    
    setTimeout(() => {
      setShowAnswer(false);
      setTimerStopped(false);
      setTimeLeft(5);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < triviaQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('final-results');
      }
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setTimerStopped(true);
    setShowAnswer(true);
    
    const isCorrect = answerIndex === triviaQuestions[currentQuestionIndex].correctAnswer;
    setAnswers(prev => [...prev, isCorrect]);
    if (isCorrect) setScore(prev => prev + 1);
    
    setTimeout(() => {
      setShowAnswer(false);
      setTimerStopped(false);
      setTimeLeft(5);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < triviaQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameState('final-results');
      }
    }, 2000);
  };

  const handleStartInteractiveIntro = () => {
    setGameState('interactive-intro');
  };

  const handleNextStep = () => {
    if (interactiveStep < 2) {
      setInteractiveStep(prev => prev + 1);
    } else {
      setGameState('countdown');
    }
  };

  const handleNextQuestion = () => {
    setGameState('playing');
  };

  const handleBackClick = () => {
    if (gameState === 'intro') {
      onBack();
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    onBack();
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
  };

  const handleRestart = () => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(5);
    setScore(0);
    setAnswers([]);
    setCountdown(3);
    setShowAnswer(false);
    setInteractiveStep(0);
    setTimerStopped(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / triviaQuestions.length) * 100;
    if (percentage >= 80) return "Mükemmel! 🎉";
    if (percentage >= 60) return "İyi! 👍";
    if (percentage >= 40) return "Orta! 🤔";
    return "Daha iyisini yapabilirsin! 💪";
  };

  const currentQuestion = triviaQuestions[currentQuestionIndex];

  const renderIntro = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#6B4A9D']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>🧠</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            Trivia Challenge
          </Text>
          <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 40 }}>
            Bilgini test et, puanlar kazan!
          </Text>
          
          <TouchableOpacity
            onPress={handleStartInteractiveIntro}
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
          
          <TouchableOpacity onPress={handleBackClick}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Geri Dön
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderInteractiveIntro = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#6B4A9D']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 20 }}>
            {interactiveStep === 0 ? '🎯' : interactiveStep === 1 ? '⚡' : '🏆'}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            {interactiveStep === 0 ? 'Hızlı Cevapla' : 
             interactiveStep === 1 ? 'Zamanla Yarış' : 'Puanlar Kazan'}
          </Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 40 }}>
            {interactiveStep === 0 ? 'Her soruya hızlıca cevap ver' :
             interactiveStep === 1 ? '5 saniye içinde cevabını ver' : 
             'Doğru cevaplar için puanlar kazan'}
          </Text>
          
          <TouchableOpacity
            onPress={handleNextStep}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 25
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#432870' }}>
              {interactiveStep === 2 ? 'Başla' : 'Devam Et'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderCountdown = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#6B4A9D']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 120, fontWeight: 'bold', color: 'white' }}>
          {countdown}
        </Text>
        <Text style={{ fontSize: 24, color: 'rgba(255,255,255,0.8)', marginTop: 20 }}>
          Hazırlan...
        </Text>
      </LinearGradient>
    </Animated.View>
  );

  const renderPlaying = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
        {/* Timer */}
        <View style={{ 
          position: 'absolute', 
          top: 100, 
          left: 20, 
          right: 20, 
          zIndex: 10,
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#432870' }}>
              {timeLeft} saniye
            </Text>
          </View>
        </View>

        {/* Question */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          paddingHorizontal: 20,
          paddingTop: 60
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 30,
            width: '100%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#202020', textAlign: 'center', marginBottom: 30 }}>
              {currentQuestion.question}
            </Text>
            
            <View style={{ gap: 15 }}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  style={{
                    backgroundColor: selectedAnswer === index ? 
                      (index === currentQuestion.correctAnswer ? '#00AF54' : '#FF4E4E') : '#F8F9FA',
                    paddingVertical: 20,
                    paddingHorizontal: 20,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: selectedAnswer === index ? 
                      (index === currentQuestion.correctAnswer ? '#00AF54' : '#FF4E4E') : '#E9ECEF'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: selectedAnswer === index ? 'white' : '#202020',
                    textAlign: 'center'
                  }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={{ 
          position: 'absolute', 
          bottom: 50, 
          left: 20, 
          right: 20,
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
            Soru {currentQuestionIndex + 1} / {triviaQuestions.length}
          </Text>
          <View style={{
            width: '100%',
            height: 8,
            backgroundColor: '#E9ECEF',
            borderRadius: 4
          }}>
            <View style={{
              width: `${((currentQuestionIndex + 1) / triviaQuestions.length) * 100}%`,
              height: '100%',
              backgroundColor: '#432870',
              borderRadius: 4
            }} />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderFinalResults = () => (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#6B4A9D']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>🏆</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 16, textAlign: 'center' }}>
            Oyun Bitti!
          </Text>
          <Text style={{ fontSize: 24, color: 'white', marginBottom: 8 }}>
            {score} / {triviaQuestions.length}
          </Text>
          <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 40 }}>
            {getScoreMessage()}
          </Text>
          
          <TouchableOpacity
            onPress={handleRestart}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 40,
              paddingVertical: 16,
              borderRadius: 25,
              marginBottom: 20
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#432870' }}>
              Tekrar Oyna
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleBackClick}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
              Ana Menüye Dön
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <Header 
        gameCredits={gameCredits}
        setProfileDrawerOpen={setProfileDrawerOpen}
        hasNotifications={hasNotifications}
        title="Trivia"
      />

      {gameState === 'intro' && renderIntro()}
      {gameState === 'interactive-intro' && renderInteractiveIntro()}
      {gameState === 'countdown' && renderCountdown()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'final-results' && renderFinalResults()}

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitConfirm}
        transparent
        animationType="fade"
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 30,
            width: '100%',
            maxWidth: 300
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
              Oyundan Çıkmak İstiyor musun?
            </Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
              İlerlemen kaybolacak.
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity
                onPress={handleExitCancel}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E9ECEF'
                }}
              >
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleExitConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: '#FF4E4E'
                }}
              >
                <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold' }}>
                  Çık
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 