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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../SenceFinal/contexts/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    // Validations
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        Alert.alert('Kayıt Hatası', error.message || 'Kayıt yapılamadı');
      } else {
        Alert.alert(
          'Başarılı!',
          'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => router.replace('/SenceFinal'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.back();
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
            <Text style={styles.welcomeText}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Hesap oluştur ve başla</Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
                autoComplete="off"
                autoCorrect={false}
                textContentType="none"
                importantForAutofill="no"
                underlineColorAndroid="transparent"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
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
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
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
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#667eea"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre Tekrar"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
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
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#667eea"
                />
              </TouchableOpacity>
            </View>

            {/* Terms & Privacy */}
            <Text style={styles.termsText}>
              Kayıt olarak{' '}
              <Text style={styles.termsLink}>Kullanım Koşulları</Text> ve{' '}
              <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
            </Text>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>VEYA</Text>
              <View style={styles.divider} />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={handleLogin} disabled={loading}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
  inputContainer: {
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
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
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
  },
  eyeIcon: {
    padding: 8,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#667eea',
    fontWeight: '600',
  },
  signUpButton: {
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
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

