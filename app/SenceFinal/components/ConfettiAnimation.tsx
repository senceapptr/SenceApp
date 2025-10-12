import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  delay: number;
}

export function ConfettiAnimation({ isVisible, onComplete }: ConfettiAnimationProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const messageScale = useState(new Animated.Value(0))[0];
  const messageOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: new Animated.Value(-50),
        rotation: new Animated.Value(Math.random() * 360),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0),
        color: [
          '#432870', '#B29EFD', '#C9F158', '#F2F3F5', 
          '#34C759', '#FF3B30', '#FFD60A', '#FF9500'
        ][Math.floor(Math.random() * 8)],
        size: Math.random() * 8 + 4, // 4-12px
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle',
        delay: Math.random() * 500 // stagger animation
      }));
      
      setConfettiPieces(pieces);
      setShowMessage(true);

      // Animate success message
      Animated.parallel([
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.spring(messageScale, {
          toValue: 1,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate confetti pieces
      pieces.forEach((piece) => {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(piece.scale, {
              toValue: 1,
              duration: 200,
              delay: piece.delay,
              useNativeDriver: true,
            }),
            Animated.timing(piece.scale, {
              toValue: 0.8,
              duration: 2800,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(piece.opacity, {
              toValue: 1,
              duration: 200,
              delay: piece.delay,
              useNativeDriver: true,
            }),
            Animated.timing(piece.opacity, {
              toValue: 0,
              duration: 1000,
              delay: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 50,
            duration: 3000,
            delay: piece.delay,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotation, {
            toValue: 720, // spin while falling
            duration: 3000,
            delay: piece.delay,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  const getShapeStyle = (piece: ConfettiPiece) => {
    const baseStyle = {
      width: piece.size,
      height: piece.size,
      backgroundColor: piece.color,
    };

    switch (piece.shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: piece.size / 2 };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeftWidth: piece.size / 2,
          borderRightWidth: piece.size / 2,
          borderBottomWidth: piece.size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: piece.color,
        };
      default: // square
        return { ...baseStyle, borderRadius: 2 };
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Confetti Pieces */}
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confettiPiece,
            {
              left: piece.x,
              transform: [
                { translateY: piece.y },
                { rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
                { scale: piece.scale },
              ],
              opacity: piece.opacity,
            },
            getShapeStyle(piece),
          ]}
        />
      ))}

      {/* Success Message Overlay */}
      {showMessage && (
        <Animated.View
          style={[
            styles.messageOverlay,
            {
              opacity: messageOpacity,
              transform: [{ scale: messageScale }],
            },
          ]}
        >
          <View style={styles.messageContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🎉</Text>
            </View>
            
            <Text style={styles.messageTitle}>Kupon Oluşturuldu!</Text>
            <Text style={styles.messageSubtitle}>Tahminlerin hazır! 🚀</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiPiece: {
    position: 'absolute',
  },
  messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#432870',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconText: {
    fontSize: 32,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
    marginBottom: 8,
    textAlign: 'center',
  },
  messageSubtitle: {
    fontSize: 18,
    color: 'rgba(32,32,32,0.7)',
    textAlign: 'center',
  },
});



