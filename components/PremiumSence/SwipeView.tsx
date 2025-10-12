import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, PanResponder } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SwipeViewProps {
  items: Array<{ id: string; label: string; description?: string }>;
  onSwipe: (id: string) => void;
}

export default function SwipeView({ items, onSwipe }: SwipeViewProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swiped right
          onSwipe(items[0].id);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  if (!items.length) {
    return (
      <View style={styles.emptyBox}>
        <Feather name="inbox" size={48} color="#9ca3af" />
        <Text style={styles.emptyText}>No items to swipe</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.cardLabel}>{items[0].label}</Text>
        {items[0].description && (
          <Text style={styles.cardDesc}>{items[0].description}</Text>
        )}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onSwipe(items[0].id)}>
            <Feather name="check" size={24} color="#22C55E" />
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onSwipe(items[0].id)}>
            <Feather name="x" size={24} color="#EF4444" />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {items.length > 1 && (
        <View style={styles.nextCard}>
          <Text style={styles.nextCardText}>{items[1].label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  actionText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
  },
  nextCard: {
    position: 'absolute',
    top: 32,
    left: 32,
    right: 32,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    zIndex: -1,
  },
  nextCardText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
});