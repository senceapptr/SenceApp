export interface TriviaQuestion {
  question: string;
  answer: boolean;
  category: string;
}

export interface MultiplierLevel {
  correctAnswers: number;
  multiplier: number;
  label: string;
}

export const triviaQuestions: TriviaQuestion[] = [
  { question: "İstanbul iki kıtada yer alan tek şehirdir.", answer: true, category: "Coğrafya" },
  { question: "Türkiye'nin başkenti İstanbul'dur.", answer: false, category: "Coğrafya" },
  { question: "Atatürk 1881 yılında doğmuştur.", answer: true, category: "Tarih" },
  { question: "Osmanlı İmparatorluğu 1299'da kurulmuştur.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en uzun nehri Fırat'tır.", answer: true, category: "Coğrafya" },
  { question: "Ankara'nın plaka kodu 06'dır.", answer: true, category: "Genel" },
  { question: "Türkiye'de 81 il vardır.", answer: true, category: "Genel" },
  { question: "İstanbul Boğazı'nın uzunluğu 30 km'dir.", answer: true, category: "Coğrafya" },
  { question: "Türkiye'nin en yüksek dağı Ağrı Dağı'dır.", answer: true, category: "Coğrafya" },
  { question: "Cumhuriyet 1923'te ilan edilmiştir.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en büyük gölü Van Gölü'dür.", answer: true, category: "Coğrafya" },
  { question: "İstanbul'un nüfusu 15 milyondan fazladır.", answer: true, category: "Genel" },
  { question: "Türkiye'nin para birimi Lira'dır.", answer: true, category: "Ekonomi" },
  { question: "Ankara'nın eski adı Angora'dır.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en uzun kıyı şeridi Akdeniz'dedir.", answer: false, category: "Coğrafya" },
  { question: "İstanbul'un 3. köprüsü Yavuz Sultan Selim'dir.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en büyük adası Gökçeada'dır.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın nüfusu 5 milyondan fazladır.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en kuzey noktası Sinop'tur.", answer: false, category: "Coğrafya" },
  { question: "İstanbul'un iki havaalanı vardır.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en güney noktası Hatay'dır.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın kuruluşu 1923'tür.", answer: false, category: "Tarih" },
  { question: "Türkiye'nin en doğu noktası Iğdır'dır.", answer: true, category: "Coğrafya" },
  { question: "İstanbul'un en yüksek noktası Çamlıca Tepesi'dir.", answer: true, category: "Coğrafya" },
  { question: "Türkiye'nin en batı noktası Çanakkale'dir.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın en yüksek noktası Elmadağ'dır.", answer: true, category: "Coğrafya" },
  { question: "Türkiye'nin en uzun tüneli Avrasya Tüneli'dir.", answer: true, category: "Genel" },
  { question: "İstanbul'un en eski semti Fatih'tir.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en büyük limanı Mersin'dir.", answer: false, category: "Ekonomi" },
  { question: "Ankara'nın en eski semti Ulus'tur.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en uzun otoyolu TEM'dir.", answer: true, category: "Genel" },
  { question: "İstanbul'un en büyük parkı Emirgan'dır.", answer: false, category: "Genel" },
  { question: "Türkiye'nin en büyük stadyumu Atatürk Olimpiyat'tır.", answer: true, category: "Spor" },
  { question: "Ankara'nın en büyük parkı Gençlik Parkı'dır.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en uzun nehri Kızılırmak'tır.", answer: false, category: "Coğrafya" },
  { question: "İstanbul'un en eski üniversitesi İstanbul Üniversitesi'dir.", answer: true, category: "Eğitim" },
  { question: "Türkiye'nin en büyük gölü Tuz Gölü'dür.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın en eski üniversitesi Ankara Üniversitesi'dir.", answer: true, category: "Eğitim" },
  { question: "Türkiye'nin en uzun kıyı şeridi Ege'dedir.", answer: true, category: "Coğrafya" },
  { question: "İstanbul'un en büyük alışveriş merkezi Cevahir'dir.", answer: false, category: "Ekonomi" },
  { question: "Türkiye'nin en büyük adası Marmara Adası'dır.", answer: true, category: "Coğrafya" },
  { question: "Ankara'nın en büyük alışveriş merkezi Ankamall'dır.", answer: true, category: "Ekonomi" },
  { question: "Türkiye'nin en kuzey noktası Sinop'tur.", answer: false, category: "Coğrafya" },
  { question: "İstanbul'un en yüksek binası Sapphire'dir.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en güney noktası Hatay'dır.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın en yüksek binası Armada'dır.", answer: true, category: "Genel" },
  { question: "Türkiye'nin en doğu noktası Iğdır'dır.", answer: true, category: "Coğrafya" },
  { question: "İstanbul'un en eski camisi Ayasofya'dır.", answer: false, category: "Tarih" },
  { question: "Türkiye'nin en batı noktası Çanakkale'dir.", answer: false, category: "Coğrafya" },
  { question: "Ankara'nın en eski camisi Hacı Bayram'dır.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en uzun tüneli Avrasya Tüneli'dir.", answer: true, category: "Genel" },
  { question: "İstanbul'un en eski semti Fatih'tir.", answer: true, category: "Tarih" },
  { question: "Türkiye'nin en büyük limanı Mersin'dir.", answer: false, category: "Ekonomi" },
  { question: "Ankara'nın en eski semti Ulus'tur.", answer: true, category: "Tarih" }
];

export const multiplierLevels: MultiplierLevel[] = [
  { correctAnswers: 0, multiplier: 1.0, label: "Başlangıç" },
  { correctAnswers: 5, multiplier: 1.2, label: "Gelişen" },
  { correctAnswers: 10, multiplier: 1.5, label: "İleri" },
  { correctAnswers: 15, multiplier: 2.0, label: "Uzman" },
  { correctAnswers: 18, multiplier: 2.5, label: "Master" },
  { correctAnswers: 20, multiplier: 3.0, label: "Efsane" }
];

export interface ChallengePrediction {
  id: string;
  title: string;
  category: string;
  image: string;
  yesOdds: number;
  noOdds: number;
  timeLeft: string;
  participants: number;
  trending?: boolean;
}

export const challengePredictions: ChallengePrediction[] = [
  {
    id: "1",
    title: "Galatasaray bu sezon şampiyon olacak mı?",
    category: "Futbol",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
    yesOdds: 2.1,
    noOdds: 1.8,
    timeLeft: "2 gün",
    participants: 15420,
    trending: true
  },
  {
    id: "2", 
    title: "Bitcoin 100.000$ üzerine çıkacak mı?",
    category: "Kripto",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400",
    yesOdds: 3.2,
    noOdds: 1.4,
    timeLeft: "5 gün",
    participants: 8930
  },
  {
    id: "3",
    title: "Bu hafta sonu kar yağacak mı?",
    category: "Hava Durumu", 
    image: "https://images.unsplash.com/photo-1551524164-6cf2ac531d64?w=400",
    yesOdds: 1.9,
    noOdds: 1.9,
    timeLeft: "3 gün",
    participants: 5670
  },
  {
    id: "4",
    title: "Yeni iPhone modeli çıkacak mı?",
    category: "Teknoloji",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", 
    yesOdds: 1.5,
    noOdds: 2.5,
    timeLeft: "1 hafta",
    participants: 12300,
    trending: true
  },
  {
    id: "5",
    title: "Euro 2024'te Türkiye finale çıkacak mı?",
    category: "Futbol",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400",
    yesOdds: 4.5,
    noOdds: 1.2,
    timeLeft: "2 hafta", 
    participants: 18750
  },
  {
    id: "6",
    title: "Altın fiyatları yükselecek mi?",
    category: "Ekonomi",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    yesOdds: 2.3,
    noOdds: 1.6,
    timeLeft: "4 gün",
    participants: 6780
  },
  {
    id: "7",
    title: "Netflix yeni dizi çıkaracak mı?",
    category: "Eğlence",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400",
    yesOdds: 1.3,
    noOdds: 3.4,
    timeLeft: "1 hafta",
    participants: 9450
  },
  {
    id: "8",
    title: "Bu ay enflasyon düşecek mi?",
    category: "Ekonomi", 
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    yesOdds: 2.8,
    noOdds: 1.4,
    timeLeft: "2 hafta",
    participants: 11200
  }
];
