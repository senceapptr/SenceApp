interface WelcomeScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

export function WelcomeScreen({ onNavigateToLogin, onNavigateToSignUp }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B46F0] via-purple-600 to-[#8980F5] flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-8 relative z-10">
        {/* Top Section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/20">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 
              className="font-bold text-5xl text-white mb-4 drop-shadow-lg"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              Sence
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm mx-auto">
              Geleceği tahmin et, kazanmaya başla! 
              <br />
              <span className="text-white/70 text-base">Akıllı tahminlerle kazançlı ol</span>
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">⚡</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Hızlı Tahminler</p>
                <p className="text-white/70 text-sm">Swipe ile saniyeler içinde</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🏆</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Büyük Ödüller</p>
                <p className="text-white/70 text-sm">Doğru tahminlerle kazan</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👥</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Arkadaşlarla Yarış</p>
                <p className="text-white/70 text-sm">Lig sistemi ile rekabet et</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onNavigateToSignUp}
            className="w-full bg-white hover:bg-gray-50 text-[#6B46F0] font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-95"
          >
            🚀 Hemen Başla
          </button>
          
          <button
            onClick={onNavigateToLogin}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 border border-white/30 hover:border-white/50 transform hover:scale-[1.02] active:scale-95"
          >
            Zaten hesabım var
          </button>

          <p className="text-center text-white/60 text-sm mt-4 leading-relaxed">
            Devam ederek{' '}
            <button className="text-white underline">Kullanım Şartları</button>{' '}
            ve{' '}
            <button className="text-white underline">Gizlilik Politikası</button>'nı kabul etmiş olursunuz
          </p>
        </div>
      </div>
    </div>
  );
}