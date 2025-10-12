import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>{children}</View>
  );
}

function CardHeader({ children, style }: CardProps) {
  return (
    <View style={[styles.cardHeader, style]}>{children}</View>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}
function CardTitle({ children, style }: CardTitleProps) {
  return (
    <Text style={[styles.cardTitle, style]}>{children}</Text>
  );
}

function CardDescription({ children, style }: CardTitleProps) {
  return (
    <Text style={[styles.cardDescription, style]}>{children}</Text>
  );
}

function CardAction({ children, style }: CardProps) {
  return (
    <View style={[styles.cardAction, style]}>{children}</View>
  );
}

function CardContent({ children, style }: CardProps) {
  return (
    <View style={[styles.cardContent, style]}>{children}</View>
  );
}

function CardFooter({ children, style }: CardProps) {
  return (
    <View style={[styles.cardFooter, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 0,
    flexDirection: 'column',
    marginVertical: 8,
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 6,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 2,
  },
  cardDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  cardAction: {
    alignSelf: 'flex-end',
    marginRight: 24,
    marginTop: 8,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
