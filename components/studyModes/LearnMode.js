import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
// import { colors } from '../../constants/colors';
import { useTheme } from '../../contexts/ThemeContext';

export default function LearnMode({ cards }) {
  const { theme } = useTheme();
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
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.completionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
          <Text style={[styles.completionTitle, { color: theme.primary }]}>Great job!</Text>
          <Text style={[styles.completionStats, { color: theme.text }]}>
            Correct: {correctCount} | Incorrect: {incorrectCount}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / cards.length) * 100}%`, backgroundColor: theme.primary },
          ]}
        />
      </View>

      <View style={styles.cardContainer}>
        <View style={[styles.card, { backgroundColor: theme.surface === '#FFFFFF' ? '#fff' : theme.surface, shadowColor: theme.cardShadow }]}>
          <Text style={[styles.cardLabel, { color: theme.textLight }]}>
            {showAnswer ? 'Answer' : 'Question'}
          </Text>
          <Text style={[styles.cardText, { color: theme.text }]}>
            {showAnswer ? currentCard.answer : currentCard.question}
          </Text>
        </View>

        {!showAnswer ? (
          <TouchableOpacity
            style={[styles.revealButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowAnswer(true)}
          >
            <Text style={styles.revealButtonText}>Show Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.answerButtons}>
            <TouchableOpacity
              style={[styles.answerButton, styles.incorrectButton, { backgroundColor: theme.error }]}
              onPress={handleIncorrect}
            >
              <Text style={styles.answerButtonText}>Incorrect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.answerButton, styles.correctButton, { backgroundColor: theme.success }]}
              onPress={handleCorrect}
            >
              <Text style={styles.answerButtonText}>Correct</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={[styles.progressText, { color: theme.textLight }]}>
        {currentIndex + 1} of {cards.length}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: handled dynamically
    padding: 20,
  },
  progressBar: {
    height: 4,
    // backgroundColor: handled dynamically
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    // backgroundColor: handled dynamically
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    // backgroundColor: handled dynamically
    borderRadius: 16,
    padding: 32,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: handled dynamically
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    // color: handled dynamically
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    // color: handled dynamically
    textAlign: 'center',
    lineHeight: 36,
  },
  revealButton: {
    // backgroundColor: handled dynamically
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  revealButtonText: {
    color: '#FFFFFF',
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
    // backgroundColor: handled dynamically
  },
  correctButton: {
    // backgroundColor: handled dynamically
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    // color: handled dynamically
    marginTop: 20,
  },
  completionCard: {
    // backgroundColor: handled dynamically
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    // shadowColor: handled dynamically
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 16,
  },
  completionStats: {
    fontSize: 18,
    // color: handled dynamically
  },
});


