import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';

export default function LearnMode({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentCard = cards[currentIndex];

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    nextCard();
  };

  const handleIncorrect = () => {
    setIncorrectCount(incorrectCount + 1);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  if (!currentCard) {
    return (
      <View style={styles.container}>
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>Great job!</Text>
          <Text style={styles.completionStats}>
            Correct: {correctCount} | Incorrect: {incorrectCount}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / cards.length) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            {showAnswer ? 'Answer' : 'Question'}
          </Text>
          <Text style={styles.cardText}>
            {showAnswer ? currentCard.answer : currentCard.question}
          </Text>
        </View>

        {!showAnswer ? (
          <TouchableOpacity
            style={styles.revealButton}
            onPress={() => setShowAnswer(true)}
          >
            <Text style={styles.revealButtonText}>Show Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.answerButtons}>
            <TouchableOpacity
              style={[styles.answerButton, styles.incorrectButton]}
              onPress={handleIncorrect}
            >
              <Text style={styles.answerButtonText}>Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.answerButton, styles.correctButton]}
              onPress={handleCorrect}
            >
              <Text style={styles.answerButtonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.progressText}>
        {currentIndex + 1} of {cards.length}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  revealButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  revealButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  incorrectButton: {
    backgroundColor: colors.error,
  },
  correctButton: {
    backgroundColor: colors.success,
  },
  answerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textLight,
    marginTop: 20,
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  completionStats: {
    fontSize: 18,
    color: colors.text,
  },
});

