import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';



interface LoadingIndicatorProps {
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function LoadingIndicator({
  style,
  size = 'medium',
  showText = true,
}: LoadingIndicatorProps) {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  const centerPulse = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const sizes = {
    small: { outer: 60, inner: 20 },
    medium: { outer: 100, inner: 30 },
    large: { outer: 140, inner: 40 },
  };

  const { outer, inner } = sizes[size];

  useEffect(() => {
    // Staggered pulse animations for the rings
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Center dot pulse
    const centerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(centerPulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(centerPulse, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Text fade in
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Start all animations
    createPulseAnimation(pulse1, 0).start();
    createPulseAnimation(pulse2, 500).start();
    createPulseAnimation(pulse3, 1000).start();
    centerAnimation.start();

    return () => {
      pulse1.stopAnimation();
      pulse2.stopAnimation();
      pulse3.stopAnimation();
      centerPulse.stopAnimation();
    };
  }, []);

  const createRingStyle = (animValue: Animated.Value, baseSize: number) => ({
    position: 'absolute' as const,
    width: baseSize,
    height: baseSize,
    borderRadius: baseSize / 2,
    borderWidth: 2,
    borderColor: theme.colors.textPrimary,
    opacity: animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.6, 0.3, 0],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.pulseContainer, { width: outer, height: outer }]}>
        {/* Pulse rings */}
        <Animated.View style={createRingStyle(pulse1, outer)} />
        <Animated.View style={createRingStyle(pulse2, outer)} />
        <Animated.View style={createRingStyle(pulse3, outer)} />

        {/* Center dot */}
        <Animated.View
          style={[
            styles.centerDot,
            {
              width: inner,
              height: inner,
              borderRadius: inner / 2,
              transform: [{ scale: centerPulse }],
            },
          ]}
        />
      </View>

      {/* Loading text */}
      {showText && (
        <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
          Loading
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    backgroundColor: theme.colors.textPrimary,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    letterSpacing: 3,
  },
});
