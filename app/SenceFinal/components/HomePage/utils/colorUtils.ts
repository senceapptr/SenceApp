/**
 * Color Utilities
 * Hex color işlemleri için yardımcı fonksiyonlar
 */

/**
 * Hex color'ı RGB'ye çevir
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * RGB'yi rgba string'e çevir
 */
export const rgbToRgba = (r: number, g: number, b: number, alpha: number): string => {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Hex color'ı rgba string'e çevir
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`;
  return rgbToRgba(rgb.r, rgb.g, rgb.b, alpha);
};
