/**
 * Image Color Analyzer Utility
 * Görselden dominant renkleri extract eder ve gradient oluşturur
 * Görselin URL'sinden ve görselin yüklenmesinden sonra renk analizi yapar
 */

import { Image } from 'react-native';

export interface ColorPalette {
  primary: string;
  secondary: string;
  gradient: string[];
  textColor: 'light' | 'dark';
  shadowColor: string;
}

/**
 * RGB'yi HSL'ye çevir
 */
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * HSL'yi RGB'ye çevir
 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * RGB'yi hex'e çevir
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Hex string'i RGB'ye çevir
 */
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [67, 40, 112]; // Varsayılan mor
};

/**
 * Renk parlaklığını hesapla
 */
const getBrightness = (r: number, g: number, b: number): number => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Soru başlığı ve kategorisinden renk tahmini yap (gelişmiş keyword matching)
 */
const getColorFromContent = (questionTitle: string, category: string, imageUrl: string): [number, number, number] => {
  // Soru başlığı ve kategoriyi birleştir
  const content = `${questionTitle} ${category} ${imageUrl}`.toLowerCase();
  
  console.log('Analyzing content for color:', { questionTitle, category, imageUrl });
  
  // Daha detaylı renk tahmini - soru başlığı ve kategoriden
  // Yeşil tonları
  if (content.includes('green') || content.includes('grass') || content.includes('nature') || 
      content.includes('forest') || content.includes('tree') || content.includes('plant') ||
      content.includes('leaf') || content.includes('garden') || content.includes('park')) {
    return [34, 139, 34]; // Yeşil
  }
  
  // Mavi tonları
  if (content.includes('blue') || content.includes('sky') || content.includes('ocean') ||
      content.includes('sea') || content.includes('water') || content.includes('lake') ||
      content.includes('cloud') || content.includes('air') || content.includes('space')) {
    return [30, 144, 255]; // Mavi
  }
  
  // Kırmızı tonları
  if (content.includes('red') || content.includes('fire') || content.includes('sunset') ||
      content.includes('rose') || content.includes('blood') || content.includes('cherry') ||
      content.includes('apple') || content.includes('tomato')) {
    return [220, 20, 60]; // Kırmızı
  }
  
  // Turuncu tonları
  if (content.includes('orange') || content.includes('sunset') || content.includes('autumn') ||
      content.includes('pumpkin') || content.includes('carrot') || content.includes('amber')) {
    return [255, 140, 0]; // Turuncu
  }
  
  // Sarı tonları
  if (content.includes('yellow') || content.includes('gold') || content.includes('sun') ||
      content.includes('lemon') || content.includes('banana') || content.includes('butter')) {
    return [255, 215, 0]; // Sarı
  }
  
  // Mor tonları
  if (content.includes('purple') || content.includes('violet') || content.includes('lavender') ||
      content.includes('plum') || content.includes('grape')) {
    return [138, 43, 226]; // Mor
  }
  
  // Pembe tonları
  if (content.includes('pink') || content.includes('rose') || content.includes('cherry') ||
      content.includes('blossom') || content.includes('flower')) {
    return [255, 192, 203]; // Pembe
  }
  
  // Kahverengi tonları
  if (content.includes('brown') || content.includes('wood') || content.includes('tree') ||
      content.includes('earth') || content.includes('soil') || content.includes('dirt')) {
    return [139, 69, 19]; // Kahverengi
  }
  
  // Siyah/Gri tonları
  if (content.includes('black') || content.includes('dark') || content.includes('night') ||
      content.includes('shadow') || content.includes('gray') || content.includes('grey')) {
    return [50, 50, 50]; // Koyu gri
  }
  
  // Beyaz tonları
  if (content.includes('white') || content.includes('snow') || content.includes('ice') ||
      content.includes('light') || content.includes('bright')) {
    return [240, 240, 240]; // Açık gri
  }
  
  // Teknoloji/Araba - Soru başlığından analiz
  if (content.includes('tesla') || content.includes('car') || content.includes('vehicle') ||
      content.includes('tech') || content.includes('technology') || content.includes('digital') ||
      content.includes('computer') || content.includes('laptop') || content.includes('phone') ||
      content.includes('iphone') || content.includes('android') || content.includes('software') ||
      content.includes('ai') || content.includes('artificial intelligence') || content.includes('robot')) {
    // Teknoloji için mavi-mor tonları
    return [67, 40, 112]; // Mor-mavi
  }
  
  // Spor/Stadyum
  if (content.includes('sport') || content.includes('stadium') || content.includes('football') ||
      content.includes('soccer') || content.includes('basketball') || content.includes('tennis') ||
      content.includes('futbol') || content.includes('basketbol') || content.includes('spor')) {
    return [220, 20, 60]; // Kırmızı
  }
  
  // Finans/Ekonomi - Soru başlığından analiz
  if (content.includes('finance') || content.includes('money') || content.includes('economy') ||
      content.includes('stock') || content.includes('market') || content.includes('dollar') ||
      content.includes('bitcoin') || content.includes('crypto') || content.includes('currency') ||
      content.includes('btc') || content.includes('eth') || content.includes('coin') ||
      content.includes('finans') || content.includes('ekonomi') || content.includes('hisse') ||
      content.includes('yatırım') || content.includes('borsa') || content.includes('döviz')) {
    return [255, 215, 0]; // Altın sarısı
  }
  
  // Kategoriye göre fallback
  if (category.toLowerCase().includes('teknoloji') || category.toLowerCase().includes('technology')) {
    return [67, 40, 112]; // Mor-mavi
  }
  if (category.toLowerCase().includes('finans') || category.toLowerCase().includes('finance')) {
    return [255, 215, 0]; // Altın sarısı
  }
  if (category.toLowerCase().includes('spor') || category.toLowerCase().includes('sport')) {
    return [220, 20, 60]; // Kırmızı
  }
  
  // Varsayılan mor
  return [67, 40, 112];
};

/**
 * Dominant renkten gradient oluştur
 */
const createGradientFromColor = (r: number, g: number, b: number): string[] => {
  // RGB'yi HSL'ye çevir
  const [h, s, l] = rgbToHsl(r, g, b);

  // Gradient için hue değerlerini ayarla
  const hue1 = (h + 30) % 360; // +30 derece
  const hue2 = (h - 30 + 360) % 360; // -30 derece
  const hue3 = h; // Orijinal hue
  const hue4 = (h + 15) % 360; // +15 derece

  // Saturation ve Lightness ayarla (okunabilirlik için)
  const adjustedS = Math.max(70, Math.min(90, s));
  const adjustedL1 = Math.max(45, Math.min(65, l - 10));
  const adjustedL2 = Math.max(45, Math.min(65, l + 10));
  const adjustedL3 = Math.max(40, Math.min(60, l - 5));
  const adjustedL4 = Math.max(50, Math.min(70, l + 5));

  // HSL'yi RGB'ye çevir
  const [r1, g1, b1] = hslToRgb(hue1, adjustedS, adjustedL1);
  const [r2, g2, b2] = hslToRgb(hue2, adjustedS, adjustedL2);
  const [r3, g3, b3] = hslToRgb(hue3, adjustedS, adjustedL3);
  const [r4, g4, b4] = hslToRgb(hue4, adjustedS, adjustedL4);

  // Hex'e çevir
  const color1 = rgbToHex(r1, g1, b1);
  const color2 = rgbToHex(r2, g2, b2);
  const color3 = rgbToHex(r3, g3, b3);
  const color4 = rgbToHex(r4, g4, b4);

  return [color1, color2, color3, color4];
};

/**
 * Görselden dominant renkleri extract et
 * Soru başlığı, kategorisi ve görsel URL'sinden renk analizi yapar
 */
export const analyzeImageColors = async (
  imageUrl: string, 
  questionTitle: string = '', 
  category: string = ''
): Promise<ColorPalette> => {
  try {
    console.log('Analyzing image colors:', { imageUrl, questionTitle, category });

    // Soru başlığı ve kategorisinden renk tahmini yap
    const dominantRgb = getColorFromContent(questionTitle, category, imageUrl || '');
    console.log('Detected dominant color from content:', dominantRgb);

    // Gradient oluştur
    const gradient = createGradientFromColor(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
    
    // Shadow color oluştur (daha koyu versiyon)
    const [h, s, l] = rgbToHsl(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
    const [shadowR, shadowG, shadowB] = hslToRgb(h, s, Math.max(20, l - 30));
    const shadowColor = rgbToHex(shadowR, shadowG, shadowB);

    // Text color belirle
    const brightness = getBrightness(dominantRgb[0], dominantRgb[1], dominantRgb[2]);
    const textColor: 'light' | 'dark' = brightness > 128 ? 'dark' : 'light';

    const result = {
      primary: rgbToHex(dominantRgb[0], dominantRgb[1], dominantRgb[2]),
      secondary: gradient[1],
      gradient,
      textColor,
      shadowColor,
    };

    console.log('Image color analysis result:', result);
    return result;
  } catch (error) {
    console.error('Image color analysis error:', error);
    // Hata durumunda varsayılan mor gradient
    return {
      primary: '#432870',
      secondary: '#5A3A8B',
      gradient: ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'],
      textColor: 'light',
      shadowColor: '#2D1B4E',
    };
  }
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
    'Finans': ['#2E2E0F', '#4E4E1B', '#707028', '#8B8B3A'], // Altın sarısı
    'Genel': ['#1A0F2E', '#2D1B4E', '#432870', '#5A3A8B'], // Varsayılan mor
  };
  
  return categoryGradients[category] || categoryGradients['Genel'];
};

/**
 * Kategoriye göre palette oluştur
 */
export const getPaletteByCategory = (category: string): ColorPalette => {
  const gradient = getGradientByCategory(category);
  return {
    primary: gradient[2],
    secondary: gradient[3],
    gradient,
    textColor: 'light',
    shadowColor: gradient[0],
  };
};

/**
 * Renk parlaklığını hesapla (hex string'den)
 */
export const getBrightnessFromHex = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return getBrightness(r, g, b);
};

/**
 * Text rengini belirle (contrast için)
 */
export const getTextColor = (backgroundColor: string): string => {
  const brightness = getBrightnessFromHex(backgroundColor);
  return brightness > 128 ? '#000000' : '#FFFFFF';
};
