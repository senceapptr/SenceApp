import { useState } from 'react';

interface LoginScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onNavigateToSignUp: () => void;
}

export function LoginScreen({ onBack, onLogin, onNavigateToSignUp }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'twitter' | 'phone') => {
    setIsLoading(provider);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading('');
      onLogin();
    }, 1500);
  };

  const handlePhoneLogin = () => {
    if (phoneNumber.length >= 10) {
      handleSocialLogin('phone');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-xl text-gray-900">Giriş Yap</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#6B46F0] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-2">Tekrar Hoş Geldin!</h2>
          <p className="text-gray-600">Tahminlerine kaldığın yerden devam et</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== ''}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
          >
            {isLoading === 'google' ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Google ile Giriş Yap
          </button>

          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={isLoading !== ''}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
          >
            {isLoading === 'twitter' ? (
              <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )}
            X ile Giriş Yap
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-500 text-sm font-medium">veya</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Phone Number Login */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Telefon Numarası
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handlePhoneLogin}
            disabled={phoneNumber.length < 10 || isLoading !== ''}
            className="w-full bg-gradient-to-r from-[#6B46F0] to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
          >
            {isLoading === 'phone' ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                SMS Gönderiliyor...
              </div>
            ) : (
              'SMS ile Giriş Yap'
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto space-y-4">
          <div className="text-center">
            <p className="text-gray-600">
              Hesabın yok mu?{' '}
              <button 
                onClick={onNavigateToSignUp}
                className="text-[#6B46F0] font-semibold hover:text-purple-700 transition-colors"
              >
                Hemen Kayıt Ol
              </button>
            </p>
          </div>

          <div className="text-center">
            <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors">
              Şifremi Unuttum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}