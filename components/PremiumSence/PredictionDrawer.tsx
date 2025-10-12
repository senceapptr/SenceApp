import { MaterialCommunityIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';

type IconProps = { size?: number; color?: string; style?: any; };
const XIcon = (props: IconProps) => <Feather name="x" {...props} />;
const PlusIcon = (props: IconProps) => <Feather name="plus" {...props} />;
const MinusIcon = (props: IconProps) => <Feather name="minus" {...props} />;
const SparklesIcon = (props: IconProps) => <Feather name="star" {...props} />;

interface PredictionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPredictions: Array<{
    id: string;
    question: string;
    choice: 'yes' | 'no';
    odds: number;
  }>;
}

export default function PredictionDrawer({ isOpen, onClose, selectedPredictions }: PredictionDrawerProps) {
  const [points, setPoints] = useState(100);
  if (!isOpen) return null;
  const totalOdds = selectedPredictions.reduce((acc, pred) => acc * pred.odds, 1);
  const potentialReward = Math.round(points * totalOdds);

  return (
    <View style={styles.overlay}>
      {/* Overlay */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      {/* Side drawer */}
      <View style={styles.drawer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Create Prediction</Text>
            <Text style={styles.headerDesc}>Build your combination</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <XIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.contentScroll}>
          {/* Selected predictions header */}
          <View style={styles.selectedHeaderRow}>
            <View style={styles.selectedIconBox}>
              <SparklesIcon size={16} color="#7C3AED" />
            </View>
            <View>
              <Text style={styles.selectedHeaderTitle}>Selected Predictions</Text>
              <Text style={styles.selectedHeaderDesc}>{selectedPredictions.length}/4 predictions</Text>
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(selectedPredictions.length / 4) * 100}%` }]} />
          </View>
          {/* Predictions list */}
          <View style={{ marginBottom: 24 }}>
            {selectedPredictions.map((pred, index) => (
              <View key={pred.id} style={styles.predictionCard}>
                <View style={styles.predictionCardRow}>
                  <Text style={styles.predictionCardIndex}>#{index + 1}</Text>
                  <Text style={styles.predictionCardOdds}>{pred.odds.toFixed(2)}x</Text>
                </View>
                <Text style={styles.predictionCardQuestion}>{pred.question}</Text>
                <View style={styles.predictionCardChoiceRow}>
                  <Text style={[styles.predictionCardChoice, pred.choice === 'yes' ? styles.choiceYes : styles.choiceNo]}>{pred.choice.toUpperCase()}</Text>
                </View>
              </View>
            ))}
            {/* Add more placeholder */}
            {selectedPredictions.length < 4 && (
              <View style={styles.addMoreBox}>
                <View style={styles.addMoreIconBox}>
                  <PlusIcon size={16} color="#9ca3af" />
                </View>
                <Text style={styles.addMoreText}>Add {4 - selectedPredictions.length} more</Text>
              </View>
            )}
          </View>
          {/* Points input section */}
          <View style={styles.pointsBox}>
            <Text style={styles.pointsTitle}>💎 Points to Wager</Text>
            <View style={styles.quickSelectRow}>
              {[50, 100, 250, 500].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setPoints(amount)}
                  style={[styles.quickSelectButton, points === amount && styles.quickSelectButtonActive]}
                >
                  <Text style={[styles.quickSelectText, points === amount && styles.quickSelectTextActive]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.customInputRow}>
              <TouchableOpacity style={styles.inputIconButton} onPress={() => setPoints(Math.max(10, points - 10))}>
                <MinusIcon size={14} color="#7C3AED" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={points.toString()}
                onChangeText={val => setPoints(Math.max(10, parseInt(val) || 10))}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity style={styles.inputIconButton} onPress={() => setPoints(points + 10)}>
                <PlusIcon size={14} color="#7C3AED" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Summary card */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>🎯 Summary</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total Odds:</Text><Text style={styles.summaryValue}>{totalOdds.toFixed(2)}x</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Points:</Text><Text style={styles.summaryValue}>{points}</Text></View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Potential:</Text><Text style={[styles.summaryValue, { color: '#F59E42' }]}>{potentialReward}</Text></View>
          </View>
        </ScrollView>
        {/* Submit button */}
        <View style={styles.submitBox}>
          <TouchableOpacity
            style={[styles.submitButton, selectedPredictions.length === 0 && styles.submitButtonDisabled]}
            disabled={selectedPredictions.length === 0}
          >
            <Text style={styles.submitButtonText}>
              {selectedPredictions.length === 0 ? 'Add Predictions' : 'Create Prediction 🚀'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    width: '60%',
    maxWidth: 400,
    height: '100%',
    backgroundColor: '#F5F3FF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    position: 'absolute',
    right: 0,
    top: 0,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#7C3AED',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  headerDesc: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 8,
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  selectedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedIconBox: {
    backgroundColor: '#EDE7F6',
    borderRadius: 16,
    padding: 6,
    marginRight: 8,
  },
  selectedHeaderTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
  },
  selectedHeaderDesc: {
    color: '#666',
    fontSize: 12,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
  predictionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  predictionCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  predictionCardIndex: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  predictionCardOdds: {
    color: '#F59E42',
    fontWeight: 'bold',
    fontSize: 13,
  },
  predictionCardQuestion: {
    color: '#222',
    fontWeight: '500',
    fontSize: 13,
    marginBottom: 4,
  },
  predictionCardChoiceRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  predictionCardChoice: {
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    color: '#fff',
  },
  choiceYes: {
    backgroundColor: '#22C55E',
  },
  choiceNo: {
    backgroundColor: '#EF4444',
  },
  addMoreBox: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 10,
  },
  addMoreIconBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addMoreText: {
    color: '#888',
    fontSize: 12,
  },
  pointsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  pointsTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 13,
    marginBottom: 8,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  quickSelectButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  quickSelectButtonActive: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  quickSelectText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 13,
  },
  quickSelectTextActive: {
    color: '#fff',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputIconButton: {
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginHorizontal: 4,
  },
  summaryBox: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  summaryValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 6,
  },
  submitBox: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});