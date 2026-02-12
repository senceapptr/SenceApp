import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PurchaseModalProps, ShippingAddress } from '../types';
import { formatPrice, isProductAvailable } from '../utils';

type PurchaseStep = 'review' | 'shipping';

type ShippingAddressField = keyof Omit<ShippingAddress, 'country'>;
type ShippingAddressErrors = Partial<Record<ShippingAddressField, string>>;

const EMPTY_ADDRESS: ShippingAddress = {
  addressLine: '',
  city: '',
  country: 'TR',
  district: '',
  phone: '',
  postalCode: '',
  recipientName: '',
};

const PRIMARY_BLUE = '#256EFF';
const ACCENT_DARK = '#2F4F8C';

const validateShippingAddress = (address: ShippingAddress): ShippingAddressErrors => {
  const errors: ShippingAddressErrors = {};
  const phoneDigits = address.phone.replace(/\D/g, '');

  if (address.recipientName.trim().length < 2) {
    errors.recipientName = 'Ad soyad en az 2 karakter olmalıdır.';
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    errors.phone = 'Telefon numarası 10-11 haneli olmalıdır.';
  }

  if (!address.city.trim()) {
    errors.city = 'İl alanı zorunludur.';
  }

  if (!address.district.trim()) {
    errors.district = 'İlçe alanı zorunludur.';
  }

  if (!/^\d{5}$/.test(address.postalCode.trim())) {
    errors.postalCode = 'Posta kodu 5 haneli olmalıdır.';
  }

  if (address.addressLine.trim().length < 10) {
    errors.addressLine = 'Adres detayı en az 10 karakter olmalıdır.';
  }

  return errors;
};

export function PurchaseModal({
  visible,
  product,
  userCredits,
  purchaseLoading = false,
  onClose,
  onConfirm,
}: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('review');
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [errors, setErrors] = useState<ShippingAddressErrors>({});

  const canAfford = useMemo(() => {
    if (!product) {
      return false;
    }

    return isProductAvailable(userCredits, product.price);
  }, [product, userCredits]);

  const requiresShipping = Boolean(product?.requiresShipping);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setStep('review');
    setAddress(EMPTY_ADDRESS);
    setErrors({});
  }, [visible, product?.id]);

  if (!product) {
    return null;
  }

  const setFieldValue = (field: ShippingAddressField, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handlePrimaryPress = async () => {
    if (!canAfford || purchaseLoading) {
      return;
    }

    if (!requiresShipping) {
      await onConfirm();
      return;
    }

    if (step === 'review') {
      setStep('shipping');
      return;
    }

    const validationErrors = validateShippingAddress(address);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onConfirm(address);
  };

  const handleSecondaryPress = () => {
    if (purchaseLoading) {
      return;
    }

    if (step === 'shipping') {
      setStep('review');
      return;
    }

    onClose();
  };

  const primaryButtonLabel = requiresShipping ? (step === 'review' ? 'Adrese Geç' : 'Satın Al') : 'Satın Al';

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.stepRow}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            {requiresShipping ? (
              <>
                <View style={styles.stepLine} />
                <View style={[styles.stepDot, step === 'shipping' && styles.stepDotActive]} />
              </>
            ) : null}
          </View>

          <Text style={styles.stepTitle}>{step === 'review' ? 'Ürün Özeti' : 'Teslimat Adresi'}</Text>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {step === 'review' ? (
              <>
                <View style={styles.header}>
                  <View style={styles.productImageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
                  </View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>

                  {requiresShipping ? (
                    <View style={styles.shippingBadge}>
                      <Ionicons name="cube-outline" size={14} color={PRIMARY_BLUE} />
                      <Text style={styles.shippingBadgeText}>Fiziksel gönderim gerekiyor</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.pricing}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Fiyat</Text>
                    <View style={styles.valueRow}>
                      <Text style={styles.price}>{formatPrice(product.price)}</Text>
                      <Ionicons name="diamond-outline" size={16} color={PRIMARY_BLUE} />
                    </View>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Mevcut Kredi</Text>
                    <View style={styles.valueRow}>
                      <Text style={[styles.credits, canAfford ? styles.sufficientCredits : styles.insufficientCredits]}>
                        {formatPrice(userCredits)}
                      </Text>
                      <Ionicons
                        name="diamond-outline"
                        size={16}
                        color={canAfford ? '#10B981' : '#EF4444'}
                      />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.formSection}>
                <FormField
                  value={address.recipientName}
                  onChangeText={value => setFieldValue('recipientName', value)}
                  placeholder="Ad Soyad"
                  error={errors.recipientName}
                />

                <FormField
                  value={address.phone}
                  onChangeText={value => setFieldValue('phone', value)}
                  placeholder="Telefon"
                  keyboardType="phone-pad"
                  error={errors.phone}
                />

                <View style={styles.twoColumnRow}>
                  <View style={styles.twoColumnItem}>
                    <FormField
                      value={address.city}
                      onChangeText={value => setFieldValue('city', value)}
                      placeholder="İl"
                      error={errors.city}
                    />
                  </View>
                  <View style={styles.twoColumnItem}>
                    <FormField
                      value={address.district}
                      onChangeText={value => setFieldValue('district', value)}
                      placeholder="İlçe"
                      error={errors.district}
                    />
                  </View>
                </View>

                <FormField
                  value={address.postalCode}
                  onChangeText={value => setFieldValue('postalCode', value.replace(/[^0-9]/g, '').slice(0, 5))}
                  placeholder="Posta Kodu"
                  keyboardType="number-pad"
                  error={errors.postalCode}
                />

                <FormField
                  value={address.addressLine}
                  onChangeText={value => setFieldValue('addressLine', value)}
                  placeholder="Adres"
                  multiline={true}
                  error={errors.addressLine}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={handleSecondaryPress}
              style={styles.cancelButton}
              activeOpacity={0.8}
              disabled={purchaseLoading}
            >
              <Text style={styles.cancelButtonText}>{step === 'shipping' ? 'Geri' : 'İptal'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePrimaryPress}
              disabled={!canAfford || purchaseLoading}
              style={[styles.purchaseButton, (!canAfford || purchaseLoading) && styles.disabledPurchaseButton]}
              activeOpacity={0.8}
            >
              {purchaseLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.purchaseButtonText}>{primaryButtonLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface FormFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  multiline?: boolean;
}

function FormField({
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
}: FormFieldProps) {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8B949E"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilineInput, Boolean(error) && styles.inputError]}
      />
      {error ? <Text style={styles.inputErrorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.64)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    padding: 20,
    maxWidth: 420,
    width: '100%',
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  stepDotActive: {
    backgroundColor: PRIMARY_BLUE,
  },
  stepLine: {
    height: 1,
    width: 40,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  stepTitle: {
    color: '#F0F6FC',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 6,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: '#B1BAC4',
    textAlign: 'center',
  },
  shippingBadge: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37,110,255,0.3)',
    backgroundColor: 'rgba(37,110,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  shippingBadgeText: {
    color: '#D6E4FF',
    fontSize: 12,
    fontWeight: '600',
  },
  pricing: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B1BAC4',
  },
  valueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_BLUE,
  },
  credits: {
    fontSize: 16,
    fontWeight: '700',
  },
  sufficientCredits: {
    color: '#10B981',
  },
  insufficientCredits: {
    color: '#EF4444',
  },
  formSection: {
    gap: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#30363D',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F0F6FC',
    fontSize: 14,
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputErrorText: {
    marginTop: 4,
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  twoColumnItem: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#21262D',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: ACCENT_DARK,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
  },
  disabledPurchaseButton: {
    backgroundColor: '#334155',
    borderColor: '#334155',
  },
  purchaseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
