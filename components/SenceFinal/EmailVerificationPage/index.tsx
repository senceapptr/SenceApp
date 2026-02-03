import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { verificationService } from '@/services/verification.service';
import { InputOTP } from '@/components/PremiumSence/ui/input-otp';

interface EmailVerificationPageProps {
  onBack?: () => void;
  onVerified: () => void; // Verification başarılı → HomePage'e git
}

export function EmailVerificationPage({ onBack, onVerified }: EmailVerificationPageProps) {
  const { user, profile } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingOTP, setSendingOTP] = useState(false);

  const userEmail = user?.email || profile?.email || '';

  // Modal açıldığında veya component mount olduğunda OTP gönder
  useEffect(() => {
    if (user && userEmail) {
      handleSendOTP();
    }
  }, []); // Sadece mount'ta çalışsın

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!user || !userEmail) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    setResendLoading(true);
    setSendingOTP(true);
    try {
      const result = await verificationService.sendOTP(user.id, userEmail);
      
      if (result.success) {
        setCountdown(60); // 60 saniye bekle
        if (countdown === 0) {
          // İlk gönderimde sessiz, tekrar gönderimde bildirim
          Alert.alert('Başarılı', 'Doğrulama kodu email adresinize gönderildi');
        }
      } else {
        Alert.alert('Hata', result.error || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setResendLoading(false);
      setSendingOTP(false);
    }
  };

  const handleVerify = async () => {
    if (!user || !userEmail) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Hata', 'Lütfen 6 haneli kodu girin');
      return;
    }

    setLoading(true);
    try {
      const result = await verificationService.verifyOTP(user.id, userEmail, otp);
      
      if (result.success) {
        Alert.alert(
          'Başarılı',
          'Email adresiniz başarıyla doğrulandı!',
          [
            {
              text: 'Tamam',
              onPress: () => {
                // AuthContext'te isEmailVerified state'ini güncelle
                onVerified();
              }
            }
          ]
        );
      } else {
        const errorMessage = result.error || 'Kod hatalı veya süresi dolmuş';
        const remainingAttempts = result.remainingAttempts;
        
        let message = errorMessage;
        if (remainingAttempts !== undefined && remainingAttempts > 0) {
          message += `\n\nKalan deneme hakkı: ${remainingAttempts}`;
        } else if (remainingAttempts === 0) {
          message += '\n\nYeni kod almak için "Kodu Tekrar Gönder" butonuna tıklayın.';
        }
        
        Alert.alert('Hata', message);
        setOtp(''); // OTP'yi temizle
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          
          <Text style={styles.title}>Email Doğrulama</Text>
          <Text style={styles.subtitle}>
            {userEmail ? `${userEmail} adresine gönderilen 6 haneli kodu girin` : 'Email adresinize gönderilen 6 haneli kodu girin'}
          </Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <InputOTP
            length={6}
            value={otp}
            onChange={setOtp}
            style={styles.otpInput}
          />
          
          {sendingOTP && (
            <View style={styles.sendingContainer}>
              <ActivityIndicator size="small" color="#432870" />
              <Text style={styles.sendingText}>Kod gönderiliyor...</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.verifyButton, (loading || otp.length !== 6) && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={loading || otp.length !== 6}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Doğrula</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Kodu almadınız mı?</Text>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleSendOTP}
            disabled={countdown > 0 || resendLoading}
            activeOpacity={0.7}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#432870" />
            ) : (
              <Text style={[styles.resendButtonText, countdown > 0 && styles.resendButtonTextDisabled]}>
                {countdown > 0 
                  ? `Kodu Tekrar Gönder (${formatCountdown(countdown)})`
                  : 'Kodu Tekrar Gönder'
                }
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            ⏰ Kod 10 dakika geçerlidir{'\n'}
            📧 Email'inizi kontrol etmeyi unutmayın (Spam klasörüne bakın)
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#432870',
    fontWeight: '600',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpInput: {
    marginVertical: 20,
  },
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  sendingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  verifyButton: {
    backgroundColor: '#432870',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#432870',
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#9CA3AF',
  },
  infoContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});


