import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WriteQuestionHeaderProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export const WriteQuestionHeader: React.FC<WriteQuestionHeaderProps> = ({
  onBack,
  onMenuToggle,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.headerButton} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color="#202020" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Soru Yaz</Text>
        <Text style={styles.headerSubtitle}>Toplulukla paylaşmak istediğin soruları yaz</Text>
      </View>
      
      <TouchableOpacity onPress={onMenuToggle} style={styles.headerButton} activeOpacity={0.7}>
        <View style={styles.hamburgerIcon}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
    marginTop: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#202020',
    borderRadius: 1.25,
  },
});


