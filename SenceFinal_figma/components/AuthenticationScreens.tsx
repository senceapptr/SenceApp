import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';

interface AuthenticationScreensProps {
  authScreen: 'welcome' | 'login' | 'signup';
  setAuthScreen: (screen: 'welcome' | 'login' | 'signup') => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function AuthenticationScreens({ 
  authScreen, 
  setAuthScreen, 
  onLogin, 
  onSignUp 
}: AuthenticationScreensProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-sm mx-auto bg-white min-h-screen relative">
        {authScreen === 'welcome' && (
          <WelcomeScreen
            onNavigateToLogin={() => setAuthScreen('login')}
            onNavigateToSignUp={() => setAuthScreen('signup')}
          />
        )}
        {authScreen === 'login' && (
          <LoginScreen
            onBack={() => setAuthScreen('welcome')}
            onLogin={onLogin}
            onNavigateToSignUp={() => setAuthScreen('signup')}
          />
        )}
        {authScreen === 'signup' && (
          <SignUpScreen
            onBack={() => setAuthScreen('welcome')}
            onSignUp={onSignUp}
            onNavigateToLogin={() => setAuthScreen('login')}
          />
        )}
      </div>
    </div>
  );
}