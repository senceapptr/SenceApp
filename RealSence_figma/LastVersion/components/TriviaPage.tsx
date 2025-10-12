import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TriviaPageProps {
  onBack: () => void;
}

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

type GameState = 'intro' | 'category-selection' | 'difficulty-selection' | 'countdown' | 'playing' | 'final-results';

export function TriviaPage({ onBack }: TriviaPageProps) {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(30); // 30 seconds total
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  const allQuestions: TriviaQuestion[] = [
    // Kolay Sorular
    {
      id: 1,
      question: "Türkiye'nin başkenti neresidir?",
      options: ["İstanbul", "Ankara"],
      correctAnswer: 1,
      category: "coğrafya",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Apple'ın kurucusu Steve Jobs mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "teknoloji",
      difficulty: "easy"
    },
    {
      id: 3,
      question: "En büyük okyanus Pasifik midir?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "coğrafya",
      difficulty: "easy"
    },
    {
      id: 4,
      question: "Tesla'nın CEO'su Elon Musk mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "teknoloji",
      difficulty: "easy"
    },
    {
      id: 5,
      question: "Almanya'nın para birimi Euro mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "ekonomi",
      difficulty: "easy"
    },
    {
      id: 6,
      question: "Everest dünyanın en yüksek dağı mıdır?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "coğrafya",
      difficulty: "easy"
    },
    // Orta Sorular
    {
      id: 7,
      question: "Bitcoin ilk kez hangi yılda piyasaya sürüldü?",
      options: ["2008", "2009"],
      correctAnswer: 1,
      category: "ekonomi",
      difficulty: "medium"
    },
    {
      id: 8,
      question: "Instagram 2010 yılında mı kuruldu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "teknoloji",
      difficulty: "medium"
    },
    {
      id: 9,
      question: "Netflix ABD'de mi kuruldu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "eğlence",
      difficulty: "medium"
    },
    {
      id: 10,
      question: "Futbolda offside kuralı var mıdır?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "spor",
      difficulty: "medium"
    },
    {
      id: 11,
      question: "Google 1998'de mi kuruldu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "teknoloji",
      difficulty: "medium"
    },
    {
      id: 12,
      question: "Beethoven Alman besteci miydi?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "müzik",
      difficulty: "medium"
    },
    // Zor Sorular
    {
      id: 13,
      question: "Altının kimyasal sembolü Au mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "bilim",
      difficulty: "hard"
    },
    {
      id: 14,
      question: "DNA'nın açılımında 'A' Adenin midir?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "bilim",
      difficulty: "hard"
    },
    {
      id: 15,
      question: "Shakespeare 37 oyun mu yazdı?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "edebiyat",
      difficulty: "hard"
    },
    {
      id: 16,
      question: "Plüton artık gezegen sayılıyor mu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 1,
      category: "bilim",
      difficulty: "hard"
    },
    {
      id: 17,
      question: "İnsan beyni %75 su içerir mi?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "bilim",
      difficulty: "hard"
    },
    {
      id: 18,
      question: "Mona Lisa Louvre müzesinde mi?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "sanat",
      difficulty: "hard"
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🌟', description: 'Karışık sorular' },
    { id: 'spor', name: 'Spor', icon: '⚽', description: 'Futbol, basketbol...' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻', description: 'Tech şirketleri, AI...' },
    { id: 'müzik', name: 'Müzik', icon: '🎵', description: 'Sanatçılar, albümler...' },
    { id: 'bilim', name: 'Bilim', icon: '🔬', description: 'Fizik, kimya, biyoloji...' },
    { id: 'coğrafya', name: 'Coğrafya', icon: '🌍', description: 'Ülkeler, şehirler...' },
    { id: 'ekonomi', name: 'Ekonomi', icon: '💰', description: 'Para, piyasalar...' },
    { id: 'eğlence', name: 'Eğlence', icon: '🎬', description: 'Film, dizi, ünlüler...' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Kolay', icon: '😊', description: 'Herkesin bileceği sorular', color: 'from-emerald-500 to-green-500' },
    { id: 'medium', name: 'Orta', icon: '🤔', description: 'Biraz düşünmen gerek', color: 'from-amber-500 to-orange-500' },
    { id: 'hard', name: 'Zor', icon: '🧠', description: 'Gerçek uzmanlar için', color: 'from-red-500 to-rose-500' }
  ];

  // Generate questions based on category and difficulty
  const generateQuestions = () => {
    let filteredQuestions = allQuestions;
    
    if (selectedCategory !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
    }
    
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
    
    // Shuffle and take 10 questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    
    // If not enough questions, fill with random questions from same difficulty
    if (selected.length < 10) {
      const remaining = allQuestions
        .filter(q => q.difficulty === selectedDifficulty && !selected.includes(q))
        .sort(() => Math.random() - 0.5)
        .slice(0, 10 - selected.length);
      selected.push(...remaining);
    }
    
    setGameQuestions(selected.slice(0, 10));
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];

  // Timer effect - 30 seconds total
  useEffect(() => {
    if (gameState === 'playing' && totalTimeLeft > 0 && currentQuestionIndex < 10) {
      timerRef.current = setTimeout(() => {
        setTotalTimeLeft(prev => prev - 1);
      }, 1000);
    } else if ((totalTimeLeft === 0 || currentQuestionIndex >= 10) && gameState === 'playing') {
      // Game over
      setGameState('final-results');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, totalTimeLeft, currentQuestionIndex]);

  // Countdown effect
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTotalTimeLeft(30);
    }

    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [gameState, countdown]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null && !showAnswer && currentQuestionIndex < 10) {
      setSelectedAnswer(answerIndex);
      setShowAnswer(true);
      
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      setAnswers(prev => [...prev, isCorrect]);

      // Quick animation and move to next question
      setTimeout(() => {
        if (currentQuestionIndex < 9) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        } else {
          // All questions answered
          setGameState('final-results');
        }
      }, 1000);
    }
  };

  const handleStartGame = () => {
    generateQuestions();
    setGameState('countdown');
    setCountdown(3);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleBackClick = () => {
    if (gameState === 'playing') {
      setShowExitConfirm(true);
    } else {
      onBack();
    }
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    onBack();
  };

  const getScoreMessage = () => {
    const percentage = (score / Math.max(answers.length, 1)) * 100;
    if (percentage >= 90) return { message: "Mükemmel! 🏆", color: "from-yellow-400 to-orange-500", reward: "500 kredi" };
    if (percentage >= 70) return { message: "Harika! ⭐", color: "from-green-400 to-emerald-500", reward: "300 kredi" };
    if (percentage >= 50) return { message: "İyi! 👍", color: "from-blue-400 to-purple-500", reward: "150 kredi" };
    return { message: "Denemeye devam! 💪", color: "from-gray-400 to-gray-500", reward: "50 kredi" };
  };

  // Exit Confirmation Modal
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-[#202020] mb-2">Trivia'yı Bırak</h3>
            <p className="text-[#202020]/70 mb-6">Oyunu yarıda bırakmak istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-[#F2F3F5] hover:bg-gray-200 text-[#202020] font-bold py-3 rounded-xl transition-colors"
              >
                Devam Et
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Çık
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Intro Screen
  if (gameState === 'intro') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="max-w-sm mx-auto text-center px-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <motion.div 
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div 
              className="w-32 h-32 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-6xl">⚡</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-black text-white mb-4 tracking-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              HIZLI TRİVİA
            </motion.h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6"
            >
              <p className="text-white/90 text-lg font-semibold mb-2">30 Saniye</p>
              <p className="text-white/70 text-sm">10 soru • 2 seçenek • Hızlı refleks</p>
            </motion.div>
          </motion.div>

          <motion.button
            onClick={() => setGameState('category-selection')}
            className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#A688F7] text-white font-black py-4 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Başla!
          </motion.button>
        </div>
      </div>
    );
  }

  // Category Selection
  if (gameState === 'category-selection') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center px-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => setGameState('intro')}
            className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-black text-white mb-3">Kategori Seç</h2>
            <p className="text-white/80">Hangi konularda yarışmak istiyorsun?</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-white text-[#432870] shadow-xl transform scale-105'
                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-bold text-sm mb-1">{category.name}</div>
                <div className={`text-xs ${selectedCategory === category.id ? 'text-[#432870]/70' : 'text-white/60'}`}>
                  {category.description}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setGameState('difficulty-selection')}
            className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Devam Et
          </motion.button>
        </div>
      </div>
    );
  }

  // Difficulty Selection
  if (gameState === 'difficulty-selection') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] overflow-hidden">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center px-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => setGameState('category-selection')}
            className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-black text-white mb-3">Zorluk Seviyesi</h2>
            <p className="text-white/80">Ne kadar zorlanmak istiyorsun?</p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {difficulties.map((difficulty, index) => (
              <motion.button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id as 'easy' | 'medium' | 'hard')}
                className={`w-full p-6 rounded-2xl transition-all duration-300 ${
                  selectedDifficulty === difficulty.id
                    ? `bg-gradient-to-r ${difficulty.color} text-white shadow-xl transform scale-105`
                    : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20'
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: selectedDifficulty === difficulty.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{difficulty.icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg">{difficulty.name}</div>
                    <div className={`text-sm ${selectedDifficulty === difficulty.id ? 'text-white/80' : 'text-white/60'}`}>
                      {difficulty.description}
                    </div>
                  </div>
                  {selectedDifficulty === difficulty.id && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Oyunu Başlat 🎮
          </motion.button>
        </div>
      </div>
    );
  }

  // Countdown
  if (gameState === 'countdown') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="text-8xl font-black text-white mb-4"
            style={{ 
              textShadow: '0 0 40px rgba(255,255,255,0.5)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: countdown > 0 ? Infinity : 0
            }}
          >
            {countdown || "GO!"}
          </motion.div>
          <p className="text-white/80 text-xl font-semibold">
            {countdown > 0 ? 'Hazır ol...' : 'Başlıyor!'}
          </p>
        </div>
      </div>
    );
  }

  // Final Results
  if (gameState === 'final-results') {
    const scoreData = getScoreMessage();
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] flex items-center justify-center overflow-hidden">
        {/* Celebratory Animation */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {['🎉', '⭐', '💎', '🔥', '⚡'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        <div className="max-w-sm mx-auto text-center px-6 relative z-10">
          <motion.div 
            className={`w-32 h-32 bg-gradient-to-r ${scoreData.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <span className="text-6xl">🏆</span>
          </motion.div>

          <motion.h1 
            className="text-4xl font-black text-white mb-2 tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {scoreData.message}
          </motion.h1>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center mb-4">
              <p className="text-white/80 text-lg mb-2">Final Skor</p>
              <p className="text-5xl font-black text-white">
                {score}/{answers.length}
              </p>
              <p className="text-white/60 text-sm">
                %{Math.round((score / Math.max(answers.length, 1)) * 100)} doğru
              </p>
              <p className="text-white/60 text-sm mt-2">
                ⏱️ {30 - totalTimeLeft} saniyede tamamlandı
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#432870]/20 to-[#B29EFD]/20 rounded-2xl p-4 border border-[#432870]/30">
              <p className="text-[#B29EFD] font-bold">🎁 Ödülün</p>
              <p className="text-white text-xl font-black">{scoreData.reward}</p>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button
              onClick={() => {
                setGameState('category-selection');
                setCurrentQuestionIndex(0);
                setScore(0);
                setAnswers([]);
                setSelectedAnswer(null);
                setShowAnswer(false);
                setTotalTimeLeft(30);
              }}
              className="w-full bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#A688F7] text-white font-black py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              🔄 Tekrar Oyna
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-white/30"
            >
              Ana Sayfaya Dön
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing State
  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] overflow-hidden">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-8 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Progress and Timer */}
      <div className="absolute top-8 right-6 z-40">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30">
          <div className="text-center">
            <div className="text-white font-bold text-sm mb-1">
              {currentQuestionIndex + 1}/10
            </div>
            <div className="text-white/80 text-xs">
              ⏱️ {totalTimeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Main Timer - Large and Prominent */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div 
          className="relative w-20 h-20"
          animate={{
            scale: totalTimeLeft <= 5 ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: totalTimeLeft <= 5 ? Infinity : 0
          }}
        >
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={totalTimeLeft <= 10 ? "#FF3B30" : "#432870"}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - totalTimeLeft / 30)}`}
              className="transition-all duration-200"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-black ${totalTimeLeft <= 10 ? 'text-[#FF3B30]' : 'text-white'}`}>
              {totalTimeLeft}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-sm mx-auto h-full flex flex-col justify-center px-6 relative">
        {/* Question */}
        <motion.div 
          className="text-center mb-8 mt-8"
          key={currentQuestionIndex}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 mb-4">
            <div className="mb-4">
              <span className="bg-[#432870]/30 text-white px-3 py-1 rounded-full text-sm font-bold">
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-white font-bold text-xl leading-tight">
              {currentQuestion.question}
            </h2>
          </div>
        </motion.div>

        {/* Answer Options */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex gap-4"
            key={currentQuestionIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showAnswer}
                className={`flex-1 p-6 rounded-2xl font-bold transition-all duration-300 ${
                  showAnswer
                    ? index === currentQuestion.correctAnswer
                      ? 'bg-[#34C759] text-white'
                      : selectedAnswer === index
                      ? 'bg-[#FF3B30] text-white'
                      : 'bg-white/20 text-white/60'
                    : selectedAnswer === index
                    ? 'bg-[#432870] text-white shadow-xl'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
                }`}
                whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center">
                  <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-black mb-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg text-center">{option}</span>
                  <AnimatePresence>
                    {showAnswer && index === currentQuestion.correctAnswer && (
                      <motion.span 
                        className="text-2xl mt-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        ✓
                      </motion.span>
                    )}
                    {showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <motion.span 
                        className="text-2xl mt-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        ✗
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}