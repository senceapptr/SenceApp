import { useState, useEffect, useRef } from 'react';

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

type GameState = 'intro' | 'interactive-intro' | 'countdown' | 'playing' | 'results' | 'final-results';

export function TriviaPage({ onBack }: TriviaPageProps) {
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
  
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

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
    },
    {
      id: 6,
      question: "Almanya'nın para birimi Euro mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Ekonomi",
      difficulty: "easy"
    },
    {
      id: 7,
      question: "Instagram 2010 yılında mı kuruldu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Teknoloji",
      difficulty: "medium"
    },
    {
      id: 8,
      question: "Everest dünyanın en yüksek dağı mıdır?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Coğrafya",
      difficulty: "easy"
    },
    {
      id: 9,
      question: "Netflix ABD'de mi kuruldu?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Teknoloji",
      difficulty: "medium"
    },
    {
      id: 10,
      question: "Altının kimyasal sembolü Au mudur?",
      options: ["Evet", "Hayır"],
      correctAnswer: 0,
      category: "Bilim",
      difficulty: "hard"
    }
  ];

  const currentQuestion = triviaQuestions[currentQuestionIndex];

  // Shortened interactive intro steps - More concise
  const interactiveSteps = [
    {
      icon: "⚡",
      title: "Hızlı Trivia",
      description: "10 soru, 5 saniye, 2 seçenek",
      action: "Hadi başlayalım!"
    }
  ];

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      setTimeLeft(5);
      setTimerStopped(false);
    }

    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showAnswer && !timerStopped) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if ((timeLeft === 0 || (selectedAnswer !== null && timerStopped)) && gameState === 'playing' && !showAnswer) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft, selectedAnswer, showAnswer, timerStopped]);

  const handleTimeUp = () => {
    setShowAnswer(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, isCorrect]);
    
    // Fixed timing: 1.25 seconds after answer selection
    const delayTime = selectedAnswer !== null ? 1250 : 2000;
    
    setTimeout(() => {
      if (currentQuestionIndex < triviaQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(5);
        setShowAnswer(false);
        setTimerStopped(false);
        setGameState('results');
      } else {
        setGameState('final-results');
      }
    }, delayTime);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null && !showAnswer) {
      setSelectedAnswer(answerIndex);
      setTimerStopped(true); // Stop the timer immediately
    }
  };

  const handleStartInteractiveIntro = () => {
    setGameState('interactive-intro');
    setInteractiveStep(0);
  };

  const handleNextStep = () => {
    if (interactiveStep < interactiveSteps.length - 1) {
      setInteractiveStep(prev => prev + 1);
    } else {
      setGameState('countdown');
      setCountdown(3);
    }
  };

  const handleNextQuestion = () => {
    setGameState('playing');
  };

  const handleBackClick = () => {
    setShowExitConfirm(true);
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
    if (percentage >= 90) return { message: "Mükemmel! 🏆", color: "from-yellow-400 to-orange-500", reward: "500 kredi" };
    if (percentage >= 70) return { message: "Harika! ⭐", color: "from-green-400 to-emerald-500", reward: "300 kredi" };
    if (percentage >= 50) return { message: "İyi! 👍", color: "from-blue-400 to-purple-500", reward: "150 kredi" };
    return { message: "Denemeye devam! 💪", color: "from-gray-400 to-gray-500", reward: "50 kredi" };
  };

  // Exit Confirmation Modal
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-6 max-w-sm mx-4 shadow-2xl">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trivia'yı Bırak</h3>
            <p className="text-gray-600 mb-6">Oyunu yarıda bırakmak istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button
                onClick={handleExitCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
              >
                Devam Et
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Çık
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
        {/* Mysterious Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-sm mx-auto text-center px-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute top-0 left-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="mb-8 animate-in zoom-in-50 fade-in-0 duration-1000">
            <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
              <span className="text-6xl">🧠</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              TRIVIA
            </h1>
            <p className="text-white/80 text-lg font-medium animate-in slide-in-from-bottom-4 duration-1000 delay-500">
              Bilgin ne kadar hızlı?
            </p>
          </div>

          <button
            onClick={handleStartInteractiveIntro}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black py-4 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl animate-in slide-in-from-bottom-4 duration-1000 delay-1000"
          >
            🚀 Başla!
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'interactive-intro') {
    const step = interactiveSteps[interactiveStep];
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
        {/* Simplified Animated Background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-sm mx-auto text-center px-6 relative z-10">
          {/* Single Step - No Progress Indicator Needed */}
          
          {/* Icon with Animation */}
          <div className="mb-6 animate-in zoom-in-50 fade-in-0 duration-500">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
              <span className="text-4xl">{step.icon}</span>
            </div>
          </div>

          {/* Simplified Content */}
          <div className="mb-8 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              {step.title}
            </h2>
            <p className="text-white/80 text-xl mb-6 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black py-4 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl animate-in slide-in-from-bottom-4 fade-in-0 duration-500 delay-300"
          >
            {step.action} 🎮
          </button>

          {/* Skip Option */}
          <button
            onClick={() => {
              setGameState('countdown');
              setCountdown(3);
            }}
            className="mt-4 text-white/60 hover:text-white/80 text-sm transition-colors underline"
          >
            Direkt başla
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="text-8xl font-black text-white mb-4 animate-pulse"
            style={{ 
              textShadow: '0 0 40px rgba(255,255,255,0.5)',
              transform: `scale(${1 + (3 - countdown) * 0.2})`
            }}
          >
            {countdown || "GO!"}
          </div>
          <p className="text-white/80 text-xl font-medium">
            {countdown > 0 ? 'Hazır ol...' : 'Başlıyor!'}
          </p>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const isCorrect = answers[answers.length - 1];
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="max-w-sm mx-auto text-center px-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          } animate-in zoom-in-50 duration-500`}>
            <span className="text-4xl">{isCorrect ? '✓' : '✗'}</span>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">
            {isCorrect ? 'Doğru!' : 'Yanlış!'}
          </h2>
          
          <p className="text-white/80 text-lg mb-6">
            Skor: {score}/{currentQuestionIndex + 1}
          </p>

          <button
            onClick={handleNextQuestion}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            Devam Et
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'final-results') {
    const scoreData = getScoreMessage();
    
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center overflow-hidden">
        {/* Celebratory Confetti */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              {['🎉', '⭐', '💎', '🔥', '⚡'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="max-w-sm mx-auto text-center px-6 relative z-10">
          <div className={`w-32 h-32 bg-gradient-to-r ${scoreData.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse`}>
            <span className="text-6xl">🏆</span>
          </div>

          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            {scoreData.message}
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20">
            <div className="text-center mb-4">
              <p className="text-white/80 text-lg mb-2">Final Skor</p>
              <p className="text-5xl font-black text-white">
                {score}/{triviaQuestions.length}
              </p>
              <p className="text-white/60 text-sm">
                %{Math.round((score / triviaQuestions.length) * 100)} doğru
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30">
              <p className="text-yellow-200 font-bold">🎁 Ödülün</p>
              <p className="text-white text-xl font-black">{scoreData.reward}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              🔄 Tekrar Oyna
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-white/30"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state with Enhanced Timer and 2 Options
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-8 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Question Counter */}
      <div className="absolute top-8 right-6 z-40">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
          <span className="text-white font-bold text-sm">
            {currentQuestionIndex + 1}/{triviaQuestions.length}
          </span>
        </div>
      </div>

      <div className="max-w-sm mx-auto h-full flex flex-col justify-center px-6 relative">
        {/* Question with Category */}
        <div className="text-center mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 mb-4">
            <div className="mb-4">
              <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-bold">
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-white font-black text-xl leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Centered Timer with Circle */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            {/* Timer Circle */}
            <svg className="w-16 h-16 -rotate-90 absolute inset-0" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke={timeLeft <= 2 ? "#ef4444" : "#8b5cf6"}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - timeLeft / 5)}`}
                className={`transition-all duration-200 ${timerStopped ? 'opacity-50' : ''}`}
              />
            </svg>
            {/* Timer Number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-black ${timeLeft <= 2 ? 'text-red-400' : 'text-white'} ${timerStopped ? 'opacity-50' : ''}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Two Side-by-Side Answer Options */}
        <div className="flex gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showAnswer}
              className={`flex-1 p-6 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                showAnswer
                  ? index === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : selectedAnswer === index
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                  : selectedAnswer === index
                  ? 'bg-purple-600 text-white shadow-xl'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-black mb-3">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-lg text-center">{option}</span>
                {showAnswer && index === currentQuestion.correctAnswer && (
                  <span className="text-2xl mt-2">✓</span>
                )}
                {showAnswer && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <span className="text-2xl mt-2">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}