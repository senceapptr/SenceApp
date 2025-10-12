import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  children: React.ReactNode;
  style?: any;
}

function Accordion({ children, style }: AccordionProps) {
  return <View style={style}>{children}</View>;
}

interface AccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: any;
}

function AccordionItem({ title, children, style }: AccordionItemProps) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };
  return (
    <View style={[styles.item, style]}>
      <TouchableOpacity style={styles.trigger} onPress={toggle}>
        <Text style={styles.title}>{title}</Text>
        <Feather
          name="chevron-down"
          size={20}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
          color="#888"
        />
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  content: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
});

export { Accordion, AccordionItem };
