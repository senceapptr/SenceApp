import * as React from "react";
import { View, StyleSheet } from 'react-native';
// VictoryPie yüklü ise import edin, yoksa yüklenmesi gerekir.
import { VictoryPie } from 'victory-native';

interface ChartProps {
  data: { x: string; y: number }[];
  style?: any;
}

function Chart({ data, style }: ChartProps) {
  return (
    <View style={[styles.container, style]}>
      <VictoryPie data={data} colorScale={["#2563eb", "#f59e42", "#e11d48", "#10b981"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 220,
  },
});

export { Chart };
