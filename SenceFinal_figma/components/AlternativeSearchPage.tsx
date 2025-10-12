import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { questions } from '../constants/questions';

interface AlternativeSearchPageProps {
  onQuestionDetail: (question: any) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function AlternativeSearchPage({ onQuestionDetail, onVote }: AlternativeSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('trendler');
  const [selectedSubCategory, setSelectedSubCategory] = useState('tümü');
  const [isSticky, setIsSticky] = useState(false);
  const questionsRef = useRef<HTMLDivElement>(null);
  const subCategoriesRef = useRef<HTMLDivElement>(null);
  const subCategoriesContainerRef = useRef<HTMLDivElement>(null);

  // Main category data with updated gradients using app purple
  const mainCategories = [
    { id: 'trendler', name: 'Trendler', icon: '🔥', gradient: 'from-[#432870] via-[#5A3A8B] to-[#6B4A9D]', selectedGradient: 'from-[#2A1A4A] via-[#432870] to-[#5A3A8B]' },
    { id: 'yeni', name: 'Yeni', icon: '✨', gradient: 'from-[#5A3A8B] via-[#432870] to-[#6B4A9D]', selectedGradient: 'from-[#432870] via-[#2A1A4A] to-[#5A3A8B]' },
    { id: 'yakindan-bitecek', name: 'Yakında Bitecek', icon: '⏰', gradient: 'from-[#6B4A9D] via-[#432870] to-[#5A3A8B]', selectedGradient: 'from-[#5A3A8B] via-[#2A1A4A] to-[#432870]' },
    { id: 'ozel-oranlar', name: 'Özel Oranlar', icon: '💎', gradient: 'from-[#432870] via-[#6B4A9D] to-[#B29EFD]', selectedGradient: 'from-[#2A1A4A] via-[#432870] to-[#5A3A8B]' },
    { id: 'editorun-secimi', name: 'Editörün Seçimi', icon: '⭐', gradient: 'from-[#5A3A8B] via-[#432870] to-[#6B4A9D]', selectedGradient: 'from-[#432870] via-[#2A1A4A] to-[#5A3A8B]' },
  ];

  // Sub category data with minimal black icons on white background
  const subCategories = [
    { id: 'tümü', name: 'Tümü', icon: '🌐' },
    { id: 'spor', name: 'Spor', icon: '⚽' },
    { id: 'müzik', name: 'Müzik', icon: '🎵' },
    { id: 'finans', name: 'Finans', icon: '💰' },
    { id: 'magazin', name: 'Magazin', icon: '✨' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'dizi-film', name: 'Dizi&Film', icon: '🎬' },
    { id: 'sosyal-medya', name: 'Sosyal Medya', icon: '📱' },
    { id: 'dünya', name: 'Dünya', icon: '🌍' },
  ];

  // Enhanced questions data
  const enhancedQuestions = [
    {
      id: 1,
      title: "ChatGPT-5 bu yıl içinde çıkacak mı?",
      category: 'teknoloji',
      timeLeft: "3 gün 14 saat",
      votes: 127000,
      yesOdds: 2.4,
      noOdds: 1.6,
      yesPercentage: 68,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      mainCategory: 'trendler'
    },
    {
      id: 2,
      title: "Türkiye Milli Takımı Euro 2024'te finale kalacak mı?",
      category: 'spor',
      timeLeft: "5 gün 8 saat",
      votes: 89000,
      yesOdds: 3.2,
      noOdds: 1.8,
      yesPercentage: 45,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      mainCategory: 'yakindan-bitecek'
    },
    {
      id: 3,
      title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
      category: 'finans',
      timeLeft: "12 gün 6 saat",
      votes: 234000,
      yesOdds: 2.1,
      noOdds: 2.0,
      yesPercentage: 52,
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
      mainCategory: 'ozel-oranlar'
    },
    {
      id: 4,
      title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
      category: 'teknoloji',
      timeLeft: "1 gün 8 saat",
      votes: 156000,
      yesOdds: 1.9,
      noOdds: 2.1,
      yesPercentage: 78,
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop",
      mainCategory: 'yeni'
    },
    {
      id: 5,
      title: "İstanbul'da emlak fiyatları bu yıl %30 daha artacak mı?",
      category: 'finans',
      timeLeft: "8 gün 12 saat",
      votes: 445000,
      yesOdds: 2.8,
      noOdds: 1.6,
      yesPercentage: 35,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
      mainCategory: 'editorun-secimi'
    },
    {
      id: 6,
      title: "Netflix Türkiye'de abonelik fiyatları %50 artacak mı?",
      category: 'teknoloji',
      timeLeft: "2 gün 18 saat",
      votes: 67000,
      yesOdds: 2.2,
      noOdds: 1.8,
      yesPercentage: 72,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
      mainCategory: 'trendler'
    }
  ];

  // Scroll handler for sticky categories
  useEffect(() => {
    const handleScroll = () => {
      if (subCategoriesContainerRef.current) {
        const rect = subCategoriesContainerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicks outside to return sticky categories to top
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSticky && subCategoriesRef.current && !subCategoriesRef.current.contains(event.target as Node)) {
        // Scroll back to sub-categories section smoothly
        subCategoriesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSticky]);

  // Filter questions based on search and categories
  const filteredQuestions = enhancedQuestions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMainCategory = selectedMainCategory === 'trendler' || 
      question.mainCategory === selectedMainCategory;
    
    const matchesSubCategory = selectedSubCategory === 'tümü' || 
      question.category === selectedSubCategory;
    
    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  const formatVotes = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
    return count.toString();
  };

  const scrollToQuestions = () => {
    // Don't auto-scroll if there are very few questions to prevent header disappearing
    if (filteredQuestions.length <= 2) return;
    questionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Half-Circle Progress Indicator
  const SemicircleProgressIndicator = ({ percentage, isYes }: { percentage: number, isYes: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.3 });
    
    // Calculate the stroke dash for semicircle (half of full circle)
    const radius = 26;
    const circumference = Math.PI * radius; // Half circle circumference
    const strokeDasharray = circumference;
    const strokeDashoffset = isInView ? circumference * (1 - percentage / 100) : circumference;
    
    return (
      <div className="relative" ref={ref}>
        <div className="relative w-20 h-12 bg-black/70 backdrop-blur-md rounded-t-full flex items-end justify-center border-2 border-b-0 border-white/40 shadow-lg">
          <svg className="w-16 h-10 transform" viewBox="0 0 64 32">
            {/* Background semicircle */}
            <path
              d="M 6 26 A 26 26 0 0 1 58 26"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Progress semicircle */}
            <motion.path
              d="M 6 26 A 26 26 0 0 1 58 26"
              fill="none"
              stroke={isYes ? "#10B981" : "#EF4444"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset: isInView ? strokeDashoffset : strokeDasharray }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
            <motion.div 
              className="text-white font-bold text-xs drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              %{percentage}
            </motion.div>
            <motion.div 
              className="text-white text-xs opacity-90 drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.7 }}
            >
              {isYes ? 'EVET' : 'HAYIR'}
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header with Profile Photo - Like Coupons Page */}
      <div className="px-6 pt-16 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              className="text-4xl font-black text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Keşfet
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-3 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-[#432870]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </button>
            
            <button className="w-12 h-12 rounded-full overflow-hidden border-3 border-[#432870] hover:border-[#5A3A8B] transition-colors shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Hemen Keşfet!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-3xl py-5 px-8 pr-16 text-gray-900 placeholder-gray-500 focus:border-[#432870] focus:outline-none focus:ring-4 focus:ring-[#432870]/20 transition-all duration-300 text-lg shadow-lg"
          />
          <motion.div 
            className="absolute right-6 top-1/2 -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#432870] to-[#B29EFD] rounded-full flex items-center justify-center cursor-pointer">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Categories Section - MINIMAL spacing between main and sub */}
      <div className="mb-2">
        <div className="px-6 mb-3">
          <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
        </div>
        
        {/* Main Categories - Updated with app purple gradients */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-2 mb-1">
          {mainCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedMainCategory(category.id);
                setTimeout(scrollToQuestions, 100);
              }}
              className={`flex-shrink-0 relative overflow-hidden rounded-2xl p-6 min-w-32 h-28 transition-all duration-300 shadow-lg hover:shadow-xl`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                selectedMainCategory === category.id ? category.selectedGradient : category.gradient
              } opacity-90`} />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-sm font-bold text-center leading-tight">
                  {category.name}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sub Categories Container - NO spacing from main categories */}
      <div ref={subCategoriesContainerRef} className="relative">
        {/* Sub Categories - Updated with app purple selected state */}
        <div 
          ref={subCategoriesRef}
          className={`transition-all duration-300 bg-white border-b border-gray-100 ${
            isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'
          }`}
        >
          <div className="px-6 py-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {subCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedSubCategory(category.id);
                    if (!isSticky) {
                      setTimeout(scrollToQuestions, 100);
                    }
                  }}
                  className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl transition-all duration-300 min-w-20 ${
                    selectedSubCategory === category.id
                      ? 'bg-[#432870] shadow-lg'
                      : 'bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-8 h-8 flex items-center justify-center mb-2 text-lg ${
                    selectedSubCategory === category.id ? 'filter-none' : 'filter grayscale'
                  }`}>
                    {category.icon}
                  </div>
                  <span className={`text-xs font-semibold text-center leading-tight ${
                    selectedSubCategory === category.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {category.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section - Redesigned Layout */}
      <div ref={questionsRef} className={`pb-24 ${isSticky ? 'pt-20' : 'pt-6'}`}>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `"${searchQuery}" sonuçları` : 
               selectedMainCategory === 'trendler' ? 'Trend Sorular' :
               mainCategories.find(c => c.id === selectedMainCategory)?.name}
            </h3>
            <span className="text-[#432870] font-semibold">
              {filteredQuestions.length} soru
            </span>
          </div>
        </div>

        {/* Adjacent Cards - Redesigned Layout */}
        <div className="space-y-0">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg cursor-pointer group mx-0 overflow-hidden"
              onClick={() => onQuestionDetail(question)}
            >
              {/* Question Card with Redesigned Layout */}
              <div className="relative h-84 w-full overflow-hidden">
                {/* Background Image - Full Width with zoom only */}
                <img 
                  src={question.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Time Remaining - Top Left, Edge Flush Pill */}
                <div className="absolute top-6 left-0">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-r-full text-sm font-bold shadow-lg">
                    {question.timeLeft} kaldı
                  </div>
                </div>

                {/* Vote Count - Below Time Remaining, Same Style */}
                <div className="absolute top-16 left-0">
                  <div className="bg-black/70 text-white px-4 py-2 rounded-r-full text-sm font-bold shadow-lg border border-white/30">
                    👥 {formatVotes(question.votes)}
                  </div>
                </div>

                {/* Semicircle Progress Indicator - Top Right Corner */}
                <div className="absolute top-6 right-6">
                  <SemicircleProgressIndicator 
                    percentage={question.yesPercentage} 
                    isYes={question.yesPercentage > 50}
                  />
                </div>

                {/* Question Text - Above Buttons with proper spacing */}
                <div className="absolute bottom-24 left-6 right-28">
                  <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-lg">
                    {question.title}
                  </h3>
                </div>

                {/* Category - Slightly lower, right of question text */}
                <div className="absolute bottom-28 right-6">
                  <div className="bg-[#432870] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {subCategories.find(c => c.id === question.category)?.name}
                  </div>
                </div>

                {/* Action Buttons - 15% Reduced Height */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-4">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVote(question.id, 'yes', question.yesOdds);
                      }}
                      className="flex-1 bg-green-600/90 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-green-500/30 shadow-lg"
                      whileHover={{ 
                        backgroundColor: "rgba(34, 197, 94, 0.95)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="font-black text-base">EVET</div>
                        <div className="text-sm opacity-90">{question.yesOdds}x</div>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVote(question.id, 'no', question.noOdds);
                      }}
                      className="flex-1 bg-red-600/90 backdrop-blur-sm text-white font-bold py-3 rounded-2xl transition-all duration-300 border border-red-500/30 shadow-lg"
                      whileHover={{ 
                        backgroundColor: "rgba(239, 68, 68, 0.95)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center">
                        <div className="font-black text-base">HAYIR</div>
                        <div className="text-sm opacity-90">{question.noOdds}x</div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">
              {searchQuery ? 'Aradığın soru bulunamadı' : 'Bu kategoride soru yok'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Farklı kelimeler deneyebilirsin' : 'Başka bir kategori seçmeyi deneyin'}
            </p>
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white px-8 py-3 rounded-full font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aramayı Temizle
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}