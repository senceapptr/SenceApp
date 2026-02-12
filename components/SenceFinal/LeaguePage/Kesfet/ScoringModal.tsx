import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from '../types';

interface ScoringModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
}

export function ScoringModal({ visible, league, onClose }: ScoringModalProps) {
  if (!league) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <LinearGradient
            colors={['#256EFF', '#256EFF', '#256EFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerIcon}>📊</Text>
            <Text style={styles.headerTitle}>Puanlama Sistemi</Text>
            <Text style={styles.headerSubtitle}>{league.name}</Text>
          </LinearGradient>

          <View style={styles.body}>
            <View style={styles.contentBox}>
              <Text style={styles.text}>{league.pointSystem}</Text>
            </View>

            <View style={styles.features}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>✓</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Doğru Tahmin</Text>
                  <Text style={styles.featureDescription}>Puan kazan ve sıralamada yüksel</Text>
                </View>
              </View>

              <View style={styles.feature}>
                <View style={[styles.featureIcon, styles.featureIconRed]}>
                  <Text style={styles.featureIconText}>✗</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Yanlış Tahmin</Text>
                  <Text style={styles.featureDescription}>Puan kaybedebilirsin</Text>
                </View>
              </View>

              <View style={styles.feature}>
                <View style={[styles.featureIcon, styles.featureIconYellow]}>
                  <Text style={styles.featureIconText}>🔥</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Streak Bonus</Text>
                  <Text style={styles.featureDescription}>Ardışık doğrularda ekstra puan</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#256EFF', '#256EFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Anladım</Text>
              </LinearGradient>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '75%',
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  body: {
    padding: 24,
    paddingTop: 16,
  },
  contentBox: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
    lineHeight: 20,
  },
  features: {
    gap: 12,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#256EFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconRed: {
    backgroundColor: '#FF3B30',
  },
  featureIconYellow: {
    backgroundColor: '#256EFF',
  },
  featureIconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

