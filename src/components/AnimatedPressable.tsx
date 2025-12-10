import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';


interface AnimatedPressableProps extends PressableProps {
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
  children: React.ReactNode;
}

export function AnimatedPressable({
  style,
  scaleValue = 0.97,
  children,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const animatedScale = React.useRef(new Animated.Value(1)).current;
  const animatedOpacity = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.parallel([
        Animated.spring(animatedScale, {
          toValue: scaleValue,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onPressIn?.(e);
    },
    [animatedScale, animatedOpacity, scaleValue, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.parallel([
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 4,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      onPressOut?.(e);
    },
    [animatedScale, animatedOpacity, onPressOut]
  );

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
