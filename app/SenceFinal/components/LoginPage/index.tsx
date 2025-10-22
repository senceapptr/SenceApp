import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Email ve şifre alanları zorunludur');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Giriş Hatası', error.message);
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Hata', 'Email, şifre ve kullanıcı adı alanları zorunludur');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        Alert.alert('Kayıt Hatası', error.message);
      } else {
        Alert.alert('Başarılı', 'Hesabınız oluşturuldu! Giriş yapabilirsiniz.');
        setIsSignUp(false);
        setPassword('');
      }
    } catch (error) {
      Alert.alert('Hata', 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>SENCE</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Hesap Oluştur' : 'Hoş Geldiniz'}
          </Text>
          <Text style={styles.description}>
            {isSignUp 
              ? 'Yeni hesabınızı oluşturun ve tahminlere başlayın' 
              : 'Hesabınıza giriş yapın ve tahminlere devam edin'
            }
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {isSignUp && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Adınız ve soyadınız"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Kullanıcı adınız"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Şifreniz"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, loading && styles.actionButtonDisabled]}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>
                {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Sign Up/Sign In */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Zaten hesabınız var mı?' : 'Hesabınız yok mu?'}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleButton}>
                {isSignUp ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Devam ederek{' '}
            <Text style={styles.linkText}>Kullanım Şartları</Text>
            {' '}ve{' '}
            <Text style={styles.linkText}>Gizlilik Politikası</Text>
            'nı kabul etmiş olursunuz.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#432870',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  actionButton: {
    backgroundColor: '#432870',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  toggleText: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  toggleButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#432870',
    fontWeight: '500',
  },
});
