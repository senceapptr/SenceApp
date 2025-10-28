/**
 * Question Cache Service
 * Soruları cache'leyerek hızlı erişim sağlar
 */

interface CachedQuestion {
  id: string;
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class QuestionCacheService {
  private cache: Map<string, CachedQuestion> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 dakika

  /**
   * Soruyu cache'e ekle
   */
  setQuestion(questionId: string, data: any, ttl?: number): void {
    const cachedQuestion: CachedQuestion = {
      id: questionId,
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    };
    
    this.cache.set(questionId, cachedQuestion);
  }

  /**
   * Cache'den soru getir
   */
  getQuestion(questionId: string): any | null {
    const cached = this.cache.get(questionId);
    
    if (!cached) {
      return null;
    }

    // TTL kontrolü
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(questionId);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache'de soru var mı kontrol et
   */
  hasQuestion(questionId: string): boolean {
    const cached = this.cache.get(questionId);
    if (!cached) return false;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(questionId);
      return false;
    }

    return true;
  }

  /**
   * Cache'i temizle
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Eski cache'leri temizle
   */
  cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Cache istatistikleri
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const questionCacheService = new QuestionCacheService();
