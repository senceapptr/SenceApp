import * as React from "react";
import { View, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';

interface ResizableProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initial?: number; // 0-1 arası, sol panelin genişlik oranı
  style?: any;
}

function Resizable({ left, right, initial = 0.5, style }: ResizableProps) {
  const windowWidth = Dimensions.get('window').width;
  const [leftWidth, setLeftWidth] = React.useState(windowWidth * initial);
  const pan = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newWidth = leftWidth + gesture.dx;
        newWidth = Math.max(60, Math.min(windowWidth - 60, newWidth));
        setLeftWidth(newWidth);
      },
    })
  ).current;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.panel, { width: leftWidth }]}>{left}</View>
      <Animated.View
        style={styles.handle}
        {...panResponder.panHandlers}
      />
      <View style={[styles.panel, { flex: 1 }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  panel: {
    backgroundColor: '#fff',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 12,
    backgroundColor: '#e5e7eb',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    cursor: 'ew-resize',
  },
});

export { Resizable };
