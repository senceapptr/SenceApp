import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface QuestionCardProps {
  id: string;
  image: string;
  question: string;
  yesPercentage: number;
  noPercentage: number;
  onCardClick: (id: string) => void;
  onYesClick: (id: string) => void;
  onNoClick: (id: string) => void;
}

export default function QuestionCard({ 
  id, 
  image, 
  question, 
  yesPercentage, 
  noPercentage, 
  onCardClick, 
  onYesClick, 
  onNoClick 
}: QuestionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onCardClick(id)} activeOpacity={0.85}>
      <View style={styles.row}>
        {/* Image section */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        {/* Content section */}
        <View style={styles.contentBox}>
          <Text style={styles.questionText} numberOfLines={2}>{question}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.buttonYes]} onPress={() => onYesClick(id)}>
              <Text style={styles.buttonText}>Yes {yesPercentage}%</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonNo]} onPress={() => onNoClick(id)}>
              <Text style={styles.buttonText}>No {noPercentage}%</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: 96,
  },
  imageBox: {
    width: 72,
    height: '100%',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  contentBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 12,
  },
  questionText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonYes: {
    backgroundColor: '#22C55E',
  },
  buttonNo: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});