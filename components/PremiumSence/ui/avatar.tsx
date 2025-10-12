import * as React from "react";
import { View, Image, Text, StyleSheet, ImageSourcePropType, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface AvatarProps {
  source?: ImageSourcePropType;
  fallback?: string;
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

function Avatar({ source, fallback, size = 40, style, imageStyle, textStyle }: AvatarProps) {
  const [error, setError] = React.useState(false);
  return (
    <View style={[styles.avatar, { width: size, height: size }, style]}>
      {source && !error ? (
        <Image
          source={source}
          style={[styles.image, { width: size, height: size }, imageStyle]}
          onError={() => setError(true)}
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size }]}> 
          <Text style={[styles.fallbackText, textStyle]}>{fallback || '?'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 999,
    resizeMode: 'cover',
  },
  fallback: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    flex: 1,
  },
  fallbackText: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export { Avatar };
