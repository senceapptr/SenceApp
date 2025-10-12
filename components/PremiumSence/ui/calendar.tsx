import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  style?: any;
}

function Calendar({ value, onChange, style }: CalendarProps) {
  const [show, setShow] = React.useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.input} onPress={() => setShow(true)}>
        <Feather name="calendar" size={18} color="#2563eb" />
        <Text style={styles.text}>{value.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginVertical: 6,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
  },
});

export { Calendar };
