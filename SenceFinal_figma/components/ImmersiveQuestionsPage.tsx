import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImmersiveQuestionsPageProps {
  onBack: () => void;
}

interface Question {
  id: number;
  title: string;
  category: string;
  image: string;
  yesOdds: number;
  noOdds: number;
  timeLeft: string;
  yesPercentage: number;
  votes: number;
  trending?: boolean;
  new?: boolean;
}

export function ImmersiveQuestionsPage({ onBack }: ImmersiveQuestionsPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      title: "Bitcoin 2024 sonunda 100.000$ üzerinde olacak mı?",
      category: "Kripto",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009026?w=400&h=600&fit=crop",
      yesOdds: 2.1,
      noOdds: 1.8,
      timeLeft: "2 gün 14 saat",
      yesPercentage: 68,
      votes: 1247,
      trending: true
    },
    {
      id: 2,
      title: "Türkiye Euro 2024'te yarı finale çıkacak mı?",
      category: "Spor",
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=600&fit=crop",
      yesOdds: 3.2,
      noOdds: 1.3,
      timeLeft: "5 gün 8 saat",
      yesPercentage: 35,
      votes: 892,
      new: true
    },
    {
      id: 3,
      title: "OpenAI GPT-5'i 2024'te yayınlayacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop",
      yesOdds: 1.9,
      noOdds: 2.0,
      timeLeft: "12 gün 3 saat",
      yesPercentage: 52,
      votes: 2156,
      trending: true
    },
    {
      id: 4,
      title: "Tesla Model 3'ün fiyatı 2024'te düşecek mi?",
      category: "Otomotiv",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=600&fit=crop",
      yesOdds: 2.5,
      noOdds: 1.6,
      timeLeft: "1 gün 18 saat",
      yesPercentage: 42,
      votes: 743
    },
    {
      id: 5,
      title: "Apple Vision Pro 2024'te Türkiye'de satışa çıkacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=600&fit=crop",
      yesOdds: 1.7,
      noOdds: 2.3,
      timeLeft: "8 gün 12 saat",
      yesPercentage: 78,
      votes: 1456,
      new: true
    },
    {
      id: 6,
      title: "Netflix Türkiye'de yeni bir orijinal dizi çekecek mi?",
      category: "Eğlence",
      image: "https://images.unsplash.com/photo-1489599843086-9cac686e19c6?w=400&h=600&fit=crop",
      yesOdds: 1.4,
      noOdds: 2.9,
      timeLeft: "15 gün 6 saat",
      yesPercentage: 85,
      votes: 567
    }
  ];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const handleSwipe = (direction: number) => {
    if (direction > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Auto advance every 10 seconds (optional)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className="fixed inset-0 bg-[#F2F3F5] overflow-hidden">
      {/* Modern Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#432870]/80 via-[#432870]/40 to-transparent backdrop-blur-md">
        <div className="flex items-center justify-between p-6 pt-12">
          <motion.button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-[#432870] border-2 border-[#B29EFD]/50 flex items-center justify-center text-white hover:bg-[#5A3A8B] hover:border-[#B29EFD] transition-all shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="text-center">
            <motion.h1 
              className="text-white font-black text-xl tracking-tight"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              HIZLI TAHMİN
            </motion.h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#B29EFD] to-[#432870] rounded-full mx-auto mt-1"></div>
          </div>

          <motion.div 
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#432870] to-[#B29EFD] border-2 border-white/20 flex items-center justify-center shadow-xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
        </div>
      </div>



      {/* Question Cards Container */}
      <div className="relative h-screen">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000) {
                handleSwipe(1);
              } else if (swipe > 10000) {
                handleSwipe(-1);
              }
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="relative h-full">
              <ImageWithFallback
                src={currentQuestion.image}
                alt=""
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              
              {/* Modern Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/4 right-8 w-20 h-20 rounded-full bg-gradient-to-r from-[#432870]/40 to-[#B29EFD]/40 backdrop-blur-md border border-[#B29EFD]/30"
              />
              
              <motion.div
                animate={{
                  y: [0, 25, 0],
                  x: [0, 15, 0],
                  rotate: [0, -45, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-1/3 left-6 w-12 h-12 rounded-xl bg-gradient-to-br from-[#B29EFD]/60 to-[#432870]/60 backdrop-blur-sm"
              />
              
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute bottom-1/3 right-6 w-16 h-16 rounded-2xl bg-gradient-to-tl from-[#432870]/50 to-[#B29EFD]/50 backdrop-blur-md border border-white/20"
              />
              
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-2/3 left-12 w-6 h-6 rounded-full bg-[#B29EFD] opacity-70"
              />

              {/* Question Title - At Top */}
              <div className="absolute top-32 left-6 right-6">
                {/* Modern Question Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                  className="bg-gradient-to-r from-[#432870]/20 to-[#B29EFD]/20 backdrop-blur-xl rounded-3xl p-6 border border-[#432870]/30 shadow-2xl"
                >
                  <h2 
                    className="text-white font-bold text-2xl leading-tight mb-6"
                    style={{ 
                      textShadow: '0 4px 20px rgba(67, 40, 112, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)' 
                    }}
                  >
                    {currentQuestion.title}
                  </h2>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 justify-center">
                    <motion.div 
                      className="px-4 py-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full border border-white/20 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-white font-semibold text-sm">{currentQuestion.category}</span>
                    </motion.div>
                    {currentQuestion.trending && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-[#B29EFD] to-[#432870] rounded-full border border-white/20"
                      >
                        <span className="text-white font-semibold text-xs">🔥 Trend</span>
                      </motion.div>
                    )}
                    {currentQuestion.new && (
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-[#B29EFD] to-[#432870] rounded-full border border-white/20"
                      >
                        <span className="text-white font-semibold text-xs">✨ Yeni</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Stats Content */}
              <div className="absolute bottom-32 left-6 right-6">

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-bold text-sm">{currentQuestion.votes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold text-sm">{currentQuestion.timeLeft}</span>
                    </div>
                  </div>
                  
                  <div className="text-[#432870] font-black text-lg">
                    {currentQuestion.yesPercentage}% Evet
                  </div>
                </motion.div>

                {/* Interactive Progress Bar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentQuestion.yesPercentage}%` }}
                      transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-white/70 text-xs font-bold">Hayır</span>
                    <span className="text-white/70 text-xs font-bold">Evet</span>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-8 left-6 right-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      boxShadow: "0 20px 40px rgba(255, 59, 48, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="p-5 bg-gradient-to-br from-[#FF3B30] via-rose-500 to-red-600 backdrop-blur-xl rounded-3xl border-2 border-white/20 text-white transition-all shadow-2xl"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">✗</div>
                      <div className="font-black text-lg mb-2">HAYIR</div>
                      <div className="font-bold text-sm bg-white/30 rounded-xl px-3 py-1 inline-block backdrop-blur-sm">{currentQuestion.noOdds}x</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      y: -4,
                      boxShadow: "0 20px 40px rgba(52, 199, 89, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="p-5 bg-gradient-to-br from-[#34C759] via-emerald-500 to-green-600 backdrop-blur-xl rounded-3xl border-2 border-white/20 text-white transition-all shadow-2xl"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">✓</div>
                      <div className="font-black text-lg mb-2">EVET</div>
                      <div className="font-bold text-sm bg-white/30 rounded-xl px-3 py-1 inline-block backdrop-blur-sm">{currentQuestion.yesOdds}x</div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Navigation Arrows - Purple Theme */}
              <motion.button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#432870]/30 backdrop-blur-md border border-[#B29EFD]/30 flex items-center justify-center text-white hover:bg-[#432870]/50 transition-all z-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <motion.button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#432870]/30 backdrop-blur-md border border-[#B29EFD]/30 flex items-center justify-center text-white hover:bg-[#432870]/50 transition-all z-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              {/* Swipe Hint */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-40 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold text-center"
              >
                👆 Kaydır veya tıkla
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}