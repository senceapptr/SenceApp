// npm install react-native-snap-carousel
import CarouselLib from 'react-native-snap-carousel';
import { View, Text, Dimensions, StyleProp, ViewStyle } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

type CarouselProps = {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
};

function Carousel({ data, renderItem, containerStyle }: CarouselProps) {
  return (
    <CarouselLib
      data={data}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={width * 0.8}
      containerCustomStyle={containerStyle}
    />
  );
}

export default Carousel;
