/**
 * Image Color Analyzer Utility
 * Görselden dominant renkleri extract eder ve gradient oluşturur
 */

export interface ColorAnalysis {
  dominantColors: string[];
  brightness: number; // 0-255
  suggestedGradient: string[];
  textColor: 'light' | 'dark';
}

/**
 * Görselden dominant renkleri tahmin et (basit versiyon)
 * Not: Gerçek implementasyon için canvas API veya image processing library gerekir
 */
export const analyzeImageColors = async (imageUrl: string): Promise<ColorAnalysis> => {
  // Basit implementasyon: Görsel URL'inden veya kategoriye göre renk tahmini
  // Gerçek implementasyon için react-native-image-colors veya benzeri kullanılabilir
  
  // Varsayılan olarak mor tonları kullan
  const defaultGradient = ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'];
  
  // Görsel URL'inden kategori tahmini (basit)
  const isNature = imageUrl.includes('nature') || imageUrl.includes('green') || imageUrl.includes('forest');
  const isSky = imageUrl.includes('sky') || imageUrl.includes('blue') || imageUrl.includes('cloud');
  const isSport = imageUrl.includes('sport') || imageUrl.includes('red') || imageUrl.includes('stadium');
  const isTech = imageUrl.includes('tech') || imageUrl.includes('digital') || imageUrl.includes('code');
  
  let suggestedGradient: string[] = defaultGradient;
  let brightness = 120; // Orta parlaklık
  
  if (isNature) {
    // Yeşil-mor gradient
    suggestedGradient = ['#0F2E1A', '#1B4E2D', '#287043', '#3A8B5A'];
    brightness = 100;
  } else if (isSky) {
    // Mavi-mor gradient
    suggestedGradient = ['#0F1A2E', '#1B2D4E', '#284370', '#3A5A8B'];
    brightness = 140;
  } else if (isSport) {
    // Kırmızı-mor gradient
    suggestedGradient = ['#2E0F1A', '#4E1B2D', '#702843', '#8B3A5A'];
    brightness = 90;
  } else if (isTech) {
    // Mor-mavi gradient (varsayılan)
    suggestedGradient = ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'];
    brightness = 100;
  }
  
  return {
    dominantColors: suggestedGradient,
    brightness,
    suggestedGradient,
    textColor: brightness > 128 ? 'dark' : 'light',
  };
};

/**
 * Kategoriye göre gradient oluştur
 */
export const getGradientByCategory = (category: string): string[] => {
  const categoryGradients: { [key: string]: string[] } = {
    'Spor': ['#2E0F1A', '#4E1B2D', '#702843', '#8B3A5A'], // Kırmızı-mor
    'Teknoloji': ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'], // Mor-mavi
    'Doğa': ['#0F2E1A', '#1B4E2D', '#287043', '#3A8B5A'], // Yeşil-mor
    'Müzik': ['#2E1A0F', '#4E2D1B', '#704328', '#8B5A3A'], // Turuncu-mor
    'Genel': ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'], // Varsayılan mor
  };
  
  return categoryGradients[category] || categoryGradients['Genel'];
};

/**
 * Renk parlaklığını hesapla
 */
export const getBrightness = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Text rengini belirle (contrast için)
 */
export const getTextColor = (backgroundColor: string): string => {
  const brightness = getBrightness(backgroundColor);
  return brightness > 128 ? '#000000' : '#FFFFFF';
};
