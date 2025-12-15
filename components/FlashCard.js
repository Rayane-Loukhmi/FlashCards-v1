import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
// import { colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

export default function FlashCard({ card }) {
  const { theme } = useTheme();
  const [flipped, setFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const flip = () => {
    if (flipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={flip}
        style={styles.cardContainer}
      >
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            frontAnimatedStyle,
            { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.cardShadow }
          ]}
        >
          <Text style={[styles.label, { color: theme.textLight }]}>Question</Text>
          <Text style={[styles.text, { color: theme.text }]}>{card.question}</Text>
          <Text style={[styles.tapHint, { color: theme.textLight }]}>Tap to flip</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            backAnimatedStyle,
            { backgroundColor: theme.primary, shadowColor: theme.cardShadow }
          ]}
        >
          <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Answer</Text>
          <Text style={[styles.text, { color: '#FFFFFF' }]}>{card.answer}</Text>
          <Text style={[styles.tapHint, { color: 'rgba(255,255,255,0.7)' }]}>Tap to flip</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    height: 400,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: handled dynamically
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardFront: {
    // backgroundColor: handled dynamically
    borderWidth: 1,
    // borderColor: handled dynamically
  },
  cardBack: {
    // backgroundColor: handled dynamically
    transform: [{ rotateY: '180deg' }],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    // color: handled dynamically
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    // color: handled dynamically
    textAlign: 'center',
    lineHeight: 36,
  },
  tapHint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    // color: handled dynamically
    fontStyle: 'italic',
  },
});

