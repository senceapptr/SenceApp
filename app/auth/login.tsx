import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../SenceFinal/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    Alert.alert('Google ile Giriş', 'Google ile giriş özelliği yakında eklenecek!');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple ile Giriş', 'Apple ile giriş özelliği yakında eklenecek!');
  };

  const handlePhoneLogin = () => {
    Alert.alert('Telefon ile Giriş', 'Telefon ile giriş özelliği yakında eklenecek!');
  };

  const handleEmailLogin = () => {
    setShowEmailLogin(true);
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Giriş Hatası', error.message || 'Giriş yapılamadı');
      } else {
        router.replace('/SenceFinal');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const closeEmailLogin = () => {
    setShowEmailLogin(false);
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/sencelogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Hoş Geldin!</Text>
            <Text style={styles.subtitle}>Devam etmek için giriş yap</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              {/* Google Login */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleLogin}
                disabled={loading}
              >
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Google ile Giriş Yap</Text>
              </TouchableOpacity>

              {/* Apple Login */}
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleLogin}
                disabled={loading}
              >
                <Ionicons name="logo-apple" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Apple ile Giriş Yap</Text>
              </TouchableOpacity>

              {/* Phone Login */}
              <TouchableOpacity
                style={[styles.socialButton, styles.phoneButton]}
                onPress={handlePhoneLogin}
                disabled={loading}
              >
                <Ionicons name="call-outline" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Telefon ile Giriş Yap</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>VEYA</Text>
              <View style={styles.divider} />
            </View>

            {/* Email Login */}
            <TouchableOpacity
              style={[styles.emailButton, loading && styles.emailButtonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.emailIcon} />
              <Text style={styles.emailButtonText}>E-posta ile Giriş Yap</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Hesabın yok mu? </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={loading}>
                <Text style={styles.signUpLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Email Login Modal */}
      <Modal
        visible={showEmailLogin}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEmailLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeEmailLogin} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>E-posta ile Giriş</Text>
              </View>

              {/* Form */}
              <View style={styles.modalForm}>
                {/* Email Input */}
                <View style={styles.modalInputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.modalInputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="E-posta"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    autoComplete="off"
                    autoCorrect={false}
                    textContentType="none"
                    importantForAutofill="no"
                    underlineColorAndroid="transparent"
                  />
                </View>

                {/* Password Input */}
                <View style={styles.modalInputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.modalInputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Şifre"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    autoComplete="off"
                    autoCorrect={false}
                    textContentType="none"
                    importantForAutofill="no"
                    underlineColorAndroid="transparent"
                    selectionColor="#667eea"
                    caretHidden={false}
                    contextMenuHidden={false}
                    keyboardType="default"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={50}
                    clearButtonMode="never"
                    enablesReturnKeyAutomatically={true}
                    spellCheck={false}
                    autoCapitalize="none"
                    passwordRules=""
                    textBreakStrategy="simple"
                    autoFocus={false}
                    focusable={true}
                    selectTextOnFocus={false}
                    allowFontScaling={false}
                    rejectResponderTermination={false}
                    scrollEnabled={false}
                    showSoftInputOnFocus={true}
                    keyboardAppearance="default"
                    returnKeyLabel="done"
                    disableFullscreenUI={true}
                    textAlign="left"
                    textAlignVertical="center"
                    onFocus={() => {}}
                    onBlur={() => {}}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.modalEyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#667eea"
                    />
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.modalLoginButton, loading && styles.modalLoginButtonDisabled]}
                  onPress={handleEmailSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalLoginButtonText}>Giriş Yap</Text>
                  )}
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.modalForgotPassword}>
                  <Text style={styles.modalForgotPasswordText}>Şifremi Unuttum</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  phoneButton: {
    backgroundColor: '#25D366',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  emailButtonDisabled: {
    opacity: 0.6,
  },
  emailIcon: {
    marginRight: 12,
  },
  emailButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#666',
    fontSize: 15,
  },
  signUpLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 30,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Close button width compensation
  },
  modalForm: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#dee2e6',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
    minHeight: 54,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    zIndex: 1,
    position: 'relative',
  },
  modalInputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#ffffff',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0,
    outlineStyle: 'none',
    borderRadius: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    writingDirection: 'ltr',
    zIndex: 2,
    position: 'relative',
  },
  modalEyeIcon: {
    padding: 8,
  },
  modalLoginButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  modalLoginButtonDisabled: {
    opacity: 0.6,
  },
  modalLoginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalForgotPassword: {
    alignItems: 'center',
  },
  modalForgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
});

