import { supabase } from '@/lib/supabase';

/**
 * Email Verification Service
 * Edge Functions ile OTP gönderme ve doğrulama işlemlerini yönetir
 */
export const verificationService = {
  /**
   * OTP gönder - Edge Function'a istek atar
   * @param userId Kullanıcı ID (UUID)
   * @param email Email adresi
   * @returns { success: boolean, expiresIn?: number, error?: string }
   */
  async sendOTP(userId: string, email: string) {
    try {
      // Supabase URL kontrolü
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        console.error('EXPO_PUBLIC_SUPABASE_URL is not set in environment variables');
        return { 
          success: false, 
          error: 'Supabase URL yapılandırılmamış. Lütfen .env.local dosyasını kontrol edin.',
          expiresIn: undefined
        };
      }

      console.log('Sending OTP request to:', `${supabaseUrl}/functions/v1/send-verification-otp`);
      console.log('Request body:', { userId, email });

      const { data, error } = await supabase.functions.invoke(
        'send-verification-otp',
        {
          body: { 
            userId,
            email 
          }
        }
      );

      if (error) {
        console.error('Send OTP error:', error);
        console.error('Error type:', error.constructor?.name);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // Network error kontrolü
        if (error.message?.includes('Network request failed') || 
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('fetch failed')) {
          return { 
            success: false, 
            error: 'İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin ve Edge Function\'ların deploy edildiğinden emin olun.\n\nSupabase Dashboard > Edge Functions > send-verification-otp',
            expiresIn: undefined
          };
        }
        
        // Edge Function'dan gelen response body'yi okumayı dene
        let errorMessage = 'Failed to send verification code';
        let errorDetails = '';
        
        // Supabase error objesi içindeki mesajları kontrol et
        if (error.message) {
          errorMessage = error.message;
        }
        
        // Error context içindeki body'yi parse etmeyi dene
        if (error.context?._bodyInit?._data) {
          try {
            // Response body'yi text olarak okumayı dene (async)
            const bodyText = await error.context._bodyInit._data.text?.();
            if (bodyText) {
              const parsedBody = JSON.parse(bodyText);
              if (parsedBody.error) {
                errorMessage = parsedBody.error;
              }
              if (parsedBody.details) {
                errorDetails = parsedBody.details;
              }
              console.error('Parsed error body:', parsedBody);
            }
          } catch (parseError) {
            console.error('Could not parse error body:', parseError);
          }
        }
        
        // Error mesajını birleştir
        const fullErrorMessage = errorDetails 
          ? `${errorMessage}\n\nDetails: ${errorDetails}`
          : errorMessage;
        
        return { 
          success: false, 
          error: fullErrorMessage,
          expiresIn: undefined
        };
      }

      if (data?.error) {
        return { 
          success: false, 
          error: data.error,
          expiresIn: undefined
        };
      }

      return { 
        success: true, 
        expiresIn: data?.expiresIn || 600, // 10 dakika
        error: null
      };
    } catch (error) {
      console.error('Send OTP exception:', error);
      console.error('Exception type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Exception details:', error);
      
      // Network error kontrolü
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Network request failed') || 
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('fetch failed')) {
        return { 
          success: false, 
          error: 'İnternet bağlantısı hatası veya Edge Function deploy edilmemiş.\n\nKontrol edin:\n1. İnternet bağlantınız\n2. Supabase Dashboard > Edge Functions > send-verification-otp (deploy edilmiş mi?)\n3. .env.local dosyasında EXPO_PUBLIC_SUPABASE_URL doğru mu?',
          expiresIn: undefined
        };
      }
      
      return { 
        success: false, 
        error: errorMessage || 'An unexpected error occurred',
        expiresIn: undefined
      };
    }
  },

  /**
   * OTP doğrula - Edge Function'a istek atar
   * @param userId Kullanıcı ID (UUID)
   * @param email Email adresi
   * @param code 6 haneli OTP kodu
   * @returns { success: boolean, error?: string, remainingAttempts?: number }
   */
  async verifyOTP(userId: string, email: string, code: string) {
    try {
      // Code format kontrolü (6 haneli sayı)
      if (!/^\d{6}$/.test(code)) {
        return { 
          success: false, 
          error: 'Code must be 6 digits',
          remainingAttempts: undefined
        };
      }

      // Supabase URL kontrolü
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        console.error('EXPO_PUBLIC_SUPABASE_URL is not set in environment variables');
        return { 
          success: false, 
          error: 'Supabase URL yapılandırılmamış. Lütfen .env.local dosyasını kontrol edin.',
          remainingAttempts: undefined
        };
      }

      console.log('Verifying OTP request to:', `${supabaseUrl}/functions/v1/verify-otp`);

      const { data, error } = await supabase.functions.invoke(
        'verify-otp',
        {
          body: { 
            userId,
            email,
            code 
          }
        }
      );

      if (error) {
        console.error('Verify OTP error:', error);
        console.error('Error type:', error.constructor?.name);
        
        // Network error kontrolü
        if (error.message?.includes('Network request failed') || 
            error.message?.includes('Failed to fetch') ||
            error.message?.includes('fetch failed')) {
          return { 
            success: false, 
            error: 'İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin ve Edge Function\'ların deploy edildiğinden emin olun.',
            remainingAttempts: undefined
          };
        }
        
        return { 
          success: false, 
          error: error.message || 'Failed to verify code',
          remainingAttempts: undefined
        };
      }

      if (data?.error) {
        return { 
          success: false, 
          error: data.error,
          remainingAttempts: data?.remainingAttempts
        };
      }

      return { 
        success: true,
        error: null,
        remainingAttempts: undefined
      };
    } catch (error) {
      console.error('Verify OTP exception:', error);
      console.error('Exception type:', error instanceof Error ? error.constructor.name : typeof error);
      
      // Network error kontrolü
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Network request failed') || 
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('fetch failed')) {
        return { 
          success: false, 
          error: 'İnternet bağlantısı hatası veya Edge Function deploy edilmemiş.\n\nKontrol edin:\n1. İnternet bağlantınız\n2. Supabase Dashboard > Edge Functions > verify-otp (deploy edilmiş mi?)',
          remainingAttempts: undefined
        };
      }
      
      return { 
        success: false, 
        error: errorMessage || 'An unexpected error occurred',
        remainingAttempts: undefined
      };
    }
  },

  /**
   * Email verification durumunu kontrol et
   * @param userId Kullanıcı ID (UUID)
   * @returns { isVerified: boolean, error?: string }
   */
  async checkVerificationStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Check verification status error:', error);
        return { 
          isVerified: false, 
          error: error.message 
        };
      }

      // Type assertion - database.types.ts'de is_verified tanımlı olmadığı için
      const profileData = data as { is_verified?: boolean } | null;

      return { 
        isVerified: profileData?.is_verified || false,
        error: null
      };
    } catch (error) {
      console.error('Check verification status exception:', error);
      return { 
        isVerified: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
};

