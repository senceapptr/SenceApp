import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { PurchaseModalProps } from '../types';
import { formatPrice, isProductAvailable } from '../utils';

export function PurchaseModal({ visible, product, userCredits, onClose, onConfirm }: PurchaseModalProps) {
  if (!product) return null;

  const canAfford = isProductAvailable(userCredits, product.price);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.productImageContainer}>
              <Image 
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
          </View>

          <View style={styles.pricing}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Fiyat</Text>
              <Text style={styles.price}>{formatPrice(product.price)} 💎</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Mevcut Kredi</Text>
              <Text style={[
                styles.credits,
                canAfford ? styles.sufficientCredits : styles.insufficientCredits
              ]}>
                {formatPrice(userCredits)} 💎
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onConfirm}
              disabled={!canAfford}
              style={[
                styles.purchaseButton,
                !canAfford && styles.disabledPurchaseButton
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.purchaseButtonText,
                !canAfford && styles.disabledPurchaseButtonText
              ]}>
                Satın Al
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
  },
  pricing: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  credits: {
    fontSize: 18,
    fontWeight: '900',
  },
  sufficientCredits: {
    color: '#059669',
  },
  insufficientCredits: {
    color: '#DC2626',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: '#432870',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledPurchaseButton: {
    backgroundColor: '#D1D5DB',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  disabledPurchaseButtonText: {
    color: '#6B7280',
  },
});

