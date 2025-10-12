import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
function Table({ children, style }: TableProps) {
  return <View style={[styles.table, style]}>{children}</View>;
}

function TableHeader({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.header, style]}>{children}</View>;
}
function TableBody({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={style}>{children}</View>;
}
function TableFooter({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}
function TableRow({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.row, style]}>{children}</View>;
}
function TableHead({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.head, style]}>{children}</Text>;
}
function TableCell({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.cell, style]}>{children}</Text>;
}
function TableCaption({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  head: {
    flex: 1,
    fontWeight: 'bold',
    color: '#222',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  cell: {
    flex: 1,
    color: '#444',
    fontSize: 15,
    paddingHorizontal: 4,
  },
  caption: {
    color: '#888',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
