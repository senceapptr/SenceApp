import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { CreateLeagueWizard } from './CreateLeagueWizard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OlusturTabProps {
  currentUser: User;
  onSuccess: () => void;
}

export function OlusturTab({ currentUser, onSuccess }: OlusturTabProps) {
  const [showWizard, setShowWizard] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Float animation for trophy
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.heroContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          {/* Floating Trophy Icon */}
          <Animated.View
            style={[
              styles.trophyContainer,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <View style={styles.trophyCircle}>
              <LinearGradient
                colors={['#432870', '#5a3a8f']}
                style={styles.trophyGradient}
              >
                <Ionicons name="trophy" size={64} color="#FFD700" />
              </LinearGradient>
            </View>

            {/* Decorative rings */}
            <View style={[styles.decorativeRing, styles.ring1]} />
            <View style={[styles.decorativeRing, styles.ring2]} />
            <View style={[styles.decorativeRing, styles.ring3]} />
          </Animated.View>

          {/* Title */}
          <Text style={styles.heroTitle}>Kendi Ligini Oluştur</Text>
          <Text style={styles.heroSubtitle}>
            Arkadaşlarınla özel lig kur, yarış ve kazan!
          </Text>

          {/* Feature Pills */}
          <View style={styles.featuresContainer}>
            <View style={styles.featurePill}>
              <Ionicons name="people" size={16} color="#432870" />
              <Text style={styles.featurePillText}>Özel Lig</Text>
            </View>
            <View style={styles.featurePill}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.featurePillText}>Ödül Havuzu</Text>
            </View>
            <View style={styles.featurePill}>
              <Ionicons name="stats-chart" size={16} color="#10B981" />
              <Text style={styles.featurePillText}>Sıralama</Text>
            </View>
          </View>

          {/* Create Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowWizard(true)}
              activeOpacity={0.9}
            >
              <View style={styles.createButtonContent}>
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Lig Oluştur</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
              
              {/* Shimmer effect */}
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.3],
                    }),
                  },
                ]}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Neler Kazanırsın?</Text>
          
          <View style={styles.benefitsList}>
            <BenefitItem
              icon="flash"
              iconColor="#F59E0B"
              title="Özel Kurallar"
              description="Katılım ücreti, süre ve ödül sistemini sen belirle"
            />
            <BenefitItem
              icon="people"
              iconColor="#8B5CF6"
              title="Arkadaş Grubu"
              description="Sadece davet ettiğin kişiler katılabilir"
            />
            <BenefitItem
              icon="trophy"
              iconColor="#FFD700"
              title="Büyük Ödüller"
              description="Katılım ücretlerinden oluşan ödül havuzu"
            />
            <BenefitItem
              icon="stats-chart"
              iconColor="#10B981"
              title="Canlı Sıralama"
              description="Gerçek zamanlı liderlik tablosu"
            />
          </View>
        </View>
      </Animated.View>

      {showWizard && (
        <CreateLeagueWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            onSuccess();
          }}
          currentUser={currentUser}
        />
      )}
    </ScrollView>
  );
}

// Benefit Item Component
function BenefitItem({ 
  icon, 
  iconColor, 
  title, 
  description 
}: { 
  icon: string; 
  iconColor: string; 
  title: string; 
  description: string; 
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.benefitItem}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.benefitIconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <View style={styles.benefitContent}>
          <Text style={styles.benefitTitle}>{title}</Text>
          <Text style={styles.benefitDescription}>{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroContainer: {
    width: '100%',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 24,
  },
  trophyContainer: {
    position: 'relative',
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  trophyGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorativeRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
    opacity: 0.15,
  },
  ring1: {
    width: 160,
    height: 160,
  },
  ring2: {
    width: 180,
    height: 180,
  },
  ring3: {
    width: 200,
    height: 200,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featurePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  createButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#432870',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  createButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  benefitsSection: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
