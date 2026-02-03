import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CARD_COLLAPSED = 148;
const CARD_EXPANDED = Math.min(SCREEN_HEIGHT * 0.52, 320);
const CARD_EXPANDED_FORM_SIGNUP = Math.min(SCREEN_HEIGHT * 0.84, 540);
const CARD_EXPANDED_FORM_LOGIN = Math.min(SCREEN_HEIGHT * 0.62, 400);

const springConfig = { damping: 28, stiffness: 150 };

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signIn, signUp } = useAuth();

  const [phase, setPhase] = useState<'welcome' | 'signup' | 'login'>('welcome');
  const [showEmailForm, setShowEmailForm] = useState<'none' | 'signup' | 'login'>('none');
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const expand = useSharedValue(0);
  const expandForm = useSharedValue(0);
  const formMode = useSharedValue(0); // 0 none, 1 signup, 2 login

  useEffect(() => {
    if (user) router.replace('/SenceFinal');
  }, [user]);

  const closeExpand = () => {
    formMode.value = 0;
    setPhase('welcome');
    setShowEmailForm('none');
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const openSignUp = () => {
    setShowEmailForm('none');
    setPhase('signup');
    expand.value = withSpring(1, springConfig);
  };

  const openLogin = () => {
    setShowEmailForm('none');
    setPhase('login');
    expand.value = withSpring(1, springConfig);
  };

  const handleClose = () => {
    formMode.value = 0;
    expandForm.value = withSpring(0, springConfig);
    expand.value = withSpring(0, springConfig, (finished) => {
      if (finished) runOnJS(closeExpand)();
    });
  };

  const openEmailForm = (mode: 'signup' | 'login') => {
    setShowEmailForm(mode);
    formMode.value = mode === 'signup' ? 1 : 2;
    expandForm.value = withSpring(1, springConfig);
  };

  const applyBackFromEmailForm = () => {
    setShowEmailForm('none');
    formMode.value = 0;
    setIsGoingBack(false);
  };

  const backFromEmailForm = () => {
    setIsGoingBack(true);
    expandForm.value = withSpring(0, springConfig, (finished) => {
      if (finished) runOnJS(applyBackFromEmailForm)();
    });
  };

  const handleGoogle = () => Alert.alert('Google', 'Google ile giriş yakında eklenecek.');
  const handleApple = () => Alert.alert('Apple', 'Apple ile giriş yakında eklenecek.');

  const handleEmailSignUp = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun.');
      return;
    }
    if (username.trim().length < 3) {
      Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalı.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta girin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(email, password, username.trim());
      if (error) Alert.alert('Kayıt hatası', error.message || 'Kayıt yapılamadı.');
      else {
        closeExpand();
        router.replace('/SenceFinal');
      }
    } catch (e: unknown) {
      Alert.alert('Hata', (e as Error)?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Hata', 'E-posta ve şifre girin.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) Alert.alert('Giriş hatası', error.message || 'Giriş yapılamadı.');
      else {
        closeExpand();
        router.replace('/SenceFinal');
      }
    } catch (e: unknown) {
      Alert.alert('Hata', (e as Error)?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = phase === 'signup';
  const title = isSignUp ? 'Kayıt ol' : 'Giriş yap';
  const subtitle = isSignUp
    ? 'Hesabını oluştur ve tahminlere başla.'
    : 'Hesabına giriş yap, tahminlere devam et.';

  const cardAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const base = interpolate(expand.value, [0, 1], [CARD_COLLAPSED, CARD_EXPANDED]);
    const extraSignup = interpolate(
      expandForm.value,
      [0, 1],
      [0, CARD_EXPANDED_FORM_SIGNUP - CARD_EXPANDED],
    );
    const extraLogin = interpolate(
      expandForm.value,
      [0, 1],
      [0, CARD_EXPANDED_FORM_LOGIN - CARD_EXPANDED],
    );
    const extra =
      formMode.value === 1 ? extraSignup : formMode.value === 2 ? extraLogin : 0;
    return { height: base + extra };
  });

  const welcomeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expand.value, [0, 0.4], [1, 0]),
  }));

  const expandedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expand.value, [0.3, 0.7], [0, 1]),
    transform: [{ translateY: interpolate(expand.value, [0, 1], [10, 0]) }],
  }));

  const socialAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandForm.value, [0, 1], [1, 0]),
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(expandForm.value, [0, 1], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f1419', '#161d24', '#1e282f', '#28343d']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + 28,
              paddingBottom: (insets.bottom || 0) + 0,
            },
          ]}
        >
          <View style={styles.hero}>
            <Text style={styles.brand}>SENCE</Text>
            <Text style={styles.tagline}>Tahmin et. Kazan.</Text>
          </View>

          <View style={styles.cardShadowWrap}>
          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            <View style={styles.glass} />
            <View style={styles.cardInner}>
              <Animated.View
                style={[styles.welcomeBlock, welcomeAnimatedStyle]}
                pointerEvents={phase === 'welcome' ? 'auto' : 'none'}
              >
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={openSignUp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryBtnText}>Kayıt ol</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={openLogin}
                  activeOpacity={0.7}
                >
                  <Text style={styles.linkText}>Hesabım var</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[styles.expandedBlock, expandedAnimatedStyle]}
                pointerEvents={phase !== 'welcome' ? 'auto' : 'none'}
              >
                <View style={styles.expandedInner}>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderText}>
                      <Text style={styles.modalTitle}>{title}</Text>
                      <Text style={styles.modalSubtitle}>{subtitle}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleClose}
                      style={styles.closeBtn}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={22} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.overlayContainer}>
                    <Animated.View
                      style={[styles.overlayLayer, socialAnimatedStyle]}
                      pointerEvents={showEmailForm === 'none' || isGoingBack ? 'auto' : 'none'}
                    >
                      <View style={styles.socialSection}>
                        <TouchableOpacity
                          style={[styles.socialBtn, styles.googleBtn]}
                          onPress={handleGoogle}
                          disabled={loading}
                          activeOpacity={0.82}
                        >
                          <Ionicons name="logo-google" size={20} color="#1a1a1a" />
                          <Text style={styles.socialBtnTextGoogle}>
                            {isSignUp ? 'Google ile kayıt ol' : 'Google ile giriş yap'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.socialBtn, styles.appleBtn]}
                          onPress={handleApple}
                          disabled={loading}
                          activeOpacity={0.82}
                        >
                          <Ionicons name="logo-apple" size={22} color="#fff" />
                          <Text style={styles.socialBtnTextApple}>
                            {isSignUp ? 'Apple ile kayıt ol' : 'Apple ile giriş yap'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.emailCta}
                          onPress={() => openEmailForm(phase === 'signup' ? 'signup' : 'login')}
                          disabled={loading}
                          activeOpacity={0.75}
                        >
                          <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.88)" />
                          <Text style={styles.emailCtaText}>
                            {isSignUp ? 'E-posta ile kayıt ol' : 'E-posta ile giriş yap'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                    <Animated.View
                      style={[styles.overlayLayer, formAnimatedStyle]}
                      pointerEvents={showEmailForm !== 'none' && !isGoingBack ? 'auto' : 'none'}
                    >
                      {isSignUp ? (
                        <View style={[styles.formBlock, styles.formBlockSignup]}>
                          <TouchableOpacity
                            style={styles.backLink}
                            onPress={backFromEmailForm}
                            activeOpacity={0.75}
                          >
                            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.88)" />
                            <Text style={styles.backLinkText}>Geri</Text>
                          </TouchableOpacity>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>Kullanıcı adı</Text>
                            <TextInput
                              style={styles.input}
                              value={username}
                              onChangeText={setUsername}
                              placeholder="kullaniciadi"
                              placeholderTextColor="rgba(255,255,255,0.38)"
                              autoCapitalize="none"
                              editable={!loading}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>E-posta</Text>
                            <TextInput
                              style={styles.input}
                              value={email}
                              onChangeText={setEmail}
                              placeholder="ornek@email.com"
                              placeholderTextColor="rgba(255,255,255,0.38)"
                              keyboardType="email-address"
                              autoCapitalize="none"
                              editable={!loading}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>Şifre</Text>
                            <View style={styles.inputRow}>
                              <TextInput
                                style={[styles.input, styles.inputFlex]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="En az 6 karakter"
                                placeholderTextColor="rgba(255,255,255,0.38)"
                                secureTextEntry={!showPassword}
                                editable={!loading}
                                autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                  size={20}
                                  color="rgba(255,255,255,0.55)"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>Şifre tekrar</Text>
                            <View style={styles.inputRow}>
                              <TextInput
                                style={[styles.input, styles.inputFlex]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Şifreyi tekrar girin"
                                placeholderTextColor="rgba(255,255,255,0.38)"
                                secureTextEntry={!showConfirmPassword}
                                editable={!loading}
                                autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                  size={20}
                                  color="rgba(255,255,255,0.55)"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                            onPress={handleEmailSignUp}
                            disabled={loading}
                          >
                            {loading ? (
                              <ActivityIndicator color="#1d1d1f" />
                            ) : (
                              <Text style={styles.submitBtnText}>Kayıt ol</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={[styles.formBlock, styles.formBlockLogin]}>
                          <TouchableOpacity
                            style={styles.backLink}
                            onPress={backFromEmailForm}
                            activeOpacity={0.75}
                          >
                            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.88)" />
                            <Text style={styles.backLinkText}>Geri</Text>
                          </TouchableOpacity>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>E-posta</Text>
                            <TextInput
                              style={styles.input}
                              value={email}
                              onChangeText={setEmail}
                              placeholder="ornek@email.com"
                              placeholderTextColor="rgba(255,255,255,0.38)"
                              keyboardType="email-address"
                              autoCapitalize="none"
                              editable={!loading}
                            />
                          </View>
                          <View style={styles.inputWrap}>
                            <Text style={styles.inputLabel}>Şifre</Text>
                            <View style={styles.inputRow}>
                              <TextInput
                                style={[styles.input, styles.inputFlex]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Şifreni gir"
                                placeholderTextColor="rgba(255,255,255,0.38)"
                                secureTextEntry={!showPassword}
                                editable={!loading}
                                autoCapitalize="none"
                              />
                              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                  size={20}
                                  color="rgba(255,255,255,0.55)"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                            onPress={handleEmailLogin}
                            disabled={loading}
                          >
                            {loading ? (
                              <ActivityIndicator color="#1d1d1f" />
                            ) : (
                              <Text style={styles.submitBtnText}>Giriş yap</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}
                    </Animated.View>
                  </View>
                </View>
              </Animated.View>
            </View>
          </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  kav: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  cardShadowWrap: {
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  card: {
    borderRadius: 32,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  glass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardInner: {
    flex: 1,
    position: 'relative',
  },
  welcomeBlock: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 0,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
    gap: 18,
  },
  primaryBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  linkText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '500',
  },
  expandedBlock: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  expandedInner: {
    flex: 1,
    paddingRight: 0,
    paddingBottom: 0,
  },
  overlayContainer: {
    flex: 1,
    position: 'relative',
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalHeaderText: {
    flex: 1,
    paddingRight: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '400',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: -4,
  },
  socialSection: { gap: 14 },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 15,
    gap: 10,
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  appleBtn: {
    backgroundColor: '#1d1d1f',
  },
  socialBtnTextGoogle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  socialBtnTextApple: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  emailCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    marginTop: 6,
  },
  emailCtaText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.88)',
  },
  formBlock: {},
  formBlockSignup: { paddingBottom: 12 },
  formBlockLogin: { paddingBottom: 28 },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backLinkText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '500',
  },
  inputWrap: { marginBottom: 14 },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.68)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1f',
  },
});
