/**
 * Smart Image Color Analyzer - Modern & Adaptive
 * Görselden dominant renkleri extract eder ve dinamik gradient oluşturur
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  gradient: string[];
  textColor: string;
  glowColor: string;
  shadowColor: string;
}

// Modern Tailwind-inspired color palettes
const MODERN_PALETTES = {
  green: {
    primary: '#10B981',
    secondary: '#059669',
    gradient: ['#10B981', '#059669'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    shadowColor: '#10B981',
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    gradient: ['#3B82F6', '#2563EB'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    shadowColor: '#3B82F6',
  },
  red: {
    primary: '#EF4444',
    secondary: '#DC2626',
    gradient: ['#EF4444', '#DC2626'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    shadowColor: '#EF4444',
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    gradient: ['#8B5CF6', '#7C3AED'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    shadowColor: '#8B5CF6',
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#D97706',
    gradient: ['#F59E0B', '#D97706'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: '#F59E0B',
  },
  teal: {
    primary: '#14B8A6',
    secondary: '#0D9488',
    gradient: ['#14B8A6', '#0D9488'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    shadowColor: '#14B8A6',
  },
  pink: {
    primary: '#EC4899',
    secondary: '#DB2777',
    gradient: ['#EC4899', '#DB2777'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    shadowColor: '#EC4899',
  },
  indigo: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    gradient: ['#6366F1', '#4F46E5'],
    textColor: '#FFFFFF',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    shadowColor: '#6366F1',
  },
};

/**
 * URL ve keyword bazlı akıllı renk analizi
 */
export const analyzeImageColors = async (imageUrl: string): Promise<ColorPalette> => {
  const url = imageUrl.toLowerCase();
  
  // Futbol sahası, yeşil çim, doğa
  if (url.includes('grass') || url.includes('field') || url.includes('soccer') || 
      url.includes('football') || url.includes('green') || url.includes('nature') ||
      url.includes('forest') || url.includes('park') || url.includes('golf') ||
      url.includes('tennis') || url.includes('çim') || url.includes('saha')) {
    return MODERN_PALETTES.green;
  }
  
  // Gökyüzü, bina, mavi tonlar
  if (url.includes('sky') || url.includes('building') || url.includes('blue') || 
      url.includes('ocean') || url.includes('sea') || url.includes('water') ||
      url.includes('cloud') || url.includes('gök') || url.includes('deniz')) {
    return MODERN_PALETTES.blue;
  }
  
  // Stadyum, kırmızı, basketbol
  if (url.includes('stadium') || url.includes('red') || url.includes('basketball') ||
      url.includes('boxing') || url.includes('fight') || url.includes('mma') ||
      url.includes('blood') || url.includes('kırmızı')) {
    return MODERN_PALETTES.red;
  }
  
  // Gece, teknoloji, oyun, mor tonlar
  if (url.includes('night') || url.includes('tech') || url.includes('game') ||
      url.includes('gaming') || url.includes('esport') || url.includes('neon') ||
      url.includes('purple') || url.includes('cyber') || url.includes('mor')) {
    return MODERN_PALETTES.purple;
  }
  
  // Günbatımı, turuncu, ateş
  if (url.includes('sunset') || url.includes('orange') || url.includes('fire') ||
      url.includes('autumn') || url.includes('turuncu') || url.includes('güneş')) {
    return MODERN_PALETTES.orange;
  }
  
  // Su, havuz, turkuaz
  if (url.includes('pool') || url.includes('swim') || url.includes('teal') ||
      url.includes('turquoise') || url.includes('aqua') || url.includes('havuz')) {
    return MODERN_PALETTES.teal;
  }
  
  // Pembe, kadın, moda
  if (url.includes('pink') || url.includes('fashion') || url.includes('beauty') ||
      url.includes('rose') || url.includes('pembe')) {
    return MODERN_PALETTES.pink;
  }
  
  // Varsayılan: Modern mor (mevcut tasarıma uygun)
  return MODERN_PALETTES.purple;
};

/**
 * Kategoriye göre renk paleti
 */
export const getGradientByCategory = (category: string): string[] => {
  const categoryMap: { [key: string]: keyof typeof MODERN_PALETTES } = {
    'Spor': 'green',
    'Futbol': 'green',
    'Basketbol': 'orange',
    'Teknoloji': 'purple',
    'Bilim': 'blue',
    'Doğa': 'green',
    'Müzik': 'pink',
    'Eğlence': 'orange',
    'Ekonomi': 'indigo',
    'Politika': 'red',
    'Sağlık': 'teal',
    'Genel': 'purple',
    'Global': 'purple',
  };
  
  const paletteKey = categoryMap[category] || 'purple';
  return MODERN_PALETTES[paletteKey].gradient;
};

/**
 * Kategoriye göre tam palette
 */
export const getPaletteByCategory = (category: string): ColorPalette => {
  const categoryMap: { [key: string]: keyof typeof MODERN_PALETTES } = {
    'Spor': 'green',
    'Futbol': 'green',
    'Basketbol': 'orange',
    'Teknoloji': 'purple',
    'Bilim': 'blue',
    'Doğa': 'green',
    'Müzik': 'pink',
    'Eğlence': 'orange',
    'Ekonomi': 'indigo',
    'Politika': 'red',
    'Sağlık': 'teal',
    'Genel': 'purple',
    'Global': 'purple',
  };
  
  const paletteKey = categoryMap[category] || 'purple';
  return MODERN_PALETTES[paletteKey];
};

/**
 * Renk parlaklığını hesapla
 */
export const getBrightness = (hex: string): number => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Text rengini belirle
 */
export const getTextColor = (backgroundColor: string): string => {
  const brightness = getBrightness(backgroundColor);
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

export default {
  analyzeImageColors,
  getGradientByCategory,
  getPaletteByCategory,
  getBrightness,
  getTextColor,
};
