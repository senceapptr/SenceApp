import { Alert, Linking } from 'react-native';

export const LEGAL_CONFIG = {
  privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL || 'https://sence.app/legal/privacy',
  supportEmail: 'support@sence.app',
  supportUrl: process.env.EXPO_PUBLIC_SUPPORT_URL || 'https://sence.app/support',
  termsOfUseUrl: process.env.EXPO_PUBLIC_TERMS_OF_USE_URL || 'https://sence.app/legal/terms',
};

export async function openExternalUrl(url: string) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Hata', 'Bağlantı açılamadı.');
      return;
    }

    await Linking.openURL(url);
  } catch {
    Alert.alert('Hata', 'Bağlantı açılırken bir sorun oluştu.');
  }
}

export async function openSupportEmail() {
  const mailToUrl = `mailto:${LEGAL_CONFIG.supportEmail}`;
  await openExternalUrl(mailToUrl);
}
