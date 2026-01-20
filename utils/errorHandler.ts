/**
 * Error Handler Utility
 * Database hatalarını parse edip kullanıcıya anlamlı mesajlar döndürür
 */

/**
 * Questions ile ilgili hataları parse et
 */
export const parseQuestionError = (error: any): string => {
  if (!error) return 'Bir hata oluştu';
  
  // RLS Policy hatası (yetki yok)
  if (error.code === '42501') {
    return 'Bu işlem için yetkiniz yok. Sadece bekleyen sorularınızı güncelleyebilirsiniz.';
  }
  
  // Status transition hatası
  if (error.message?.includes('Only admins can approve questions')) {
    return 'Sadece yöneticiler soruları onaylayabilir.';
  }
  
  if (error.message?.includes('Only admins can change status')) {
    return 'Sadece yöneticiler soru durumunu değiştirebilir.';
  }
  
  if (error.message?.includes('Cannot revert closed/resolved questions')) {
    return 'Kapatılmış veya sonuçlanmış sorular geri alınamaz.';
  }
  
  // End date hatası
  if (error.message?.includes('End date must be in the future')) {
    return 'Bitiş tarihi gelecekte olmalıdır.';
  }
  
  // Genel Supabase hataları
  if (error.code === 'PGRST301') {
    return 'Kimlik doğrulama hatası. Lütfen tekrar giriş yapın.';
  }
  
  if (error.code === 'PGRST116') {
    return 'Kayıt bulunamadı.';
  }
  
  // Mesaj varsa onu kullan, yoksa genel mesaj
  return error.message || 'Bir hata oluştu';
};

/**
 * Genel hata parse fonksiyonu
 */
export const parseError = (error: any): string => {
  if (!error) return 'Bir hata oluştu';
  
  // Error object ise
  if (error instanceof Error) {
    return error.message;
  }
  
  // String ise
  if (typeof error === 'string') {
    return error;
  }
  
  // Object ise message property'sini kontrol et
  if (error.message) {
    return error.message;
  }
  
  // Hiçbiri değilse genel mesaj
  return 'Bir hata oluştu';
};
