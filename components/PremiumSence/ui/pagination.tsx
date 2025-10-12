import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
  style?: any;
}

function Pagination({ current, total, onChange, style }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        <Feather name="chevron-left" size={20} color={current === 1 ? '#ccc' : '#2563eb'} />
      </TouchableOpacity>
      {pages.map((page) => (
        <TouchableOpacity
          key={page}
          style={[styles.page, current === page && styles.activePage]}
          onPress={() => onChange(page)}
        >
          <Text style={[styles.pageText, current === page && styles.activePageText]}>{page}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.arrow}
        onPress={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        <Feather name="chevron-right" size={20} color={current === total ? '#ccc' : '#2563eb'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 2,
  },
  arrow: {
    padding: 6,
  },
  page: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: '#f3f4f6',
  },
  activePage: {
    backgroundColor: '#2563eb',
  },
  pageText: {
    color: '#222',
    fontSize: 15,
  },
  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export { Pagination };
