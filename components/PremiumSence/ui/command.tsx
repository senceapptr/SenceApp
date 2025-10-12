import * as React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CommandItem {
  label: string;
  onPress: () => void;
}

interface CommandProps {
  visible: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  style?: any;
}

function Command({ visible, onClose, items, placeholder = 'Ara...', style }: CommandProps) {
  const [query, setQuery] = React.useState('');
  const filtered = items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, style]}>
          <View style={styles.inputWrapper}>
            <Feather name="search" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={item => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => { item.onPress(); onClose(); }}>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Sonuç bulunamadı</Text>}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
          />
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#222',
  },
  list: {
    maxHeight: 220,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 15,
    color: '#2563eb',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 16,
  },
  close: {
    alignSelf: 'center',
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  closeText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

export { Command };
