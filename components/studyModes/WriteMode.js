import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
// import { colors } from '../../constants/colors';
import { useTheme } from '../../contexts/ThemeContext';

import { useXp } from '../../contexts/XpContext';

export default function WriteMode({ cards }) {
  const { theme } = useTheme();
  const { addXp, updateQuestProgress } = useXp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);

  const currentCard = cards[currentIndex];
  // Helper to normalize text for comparison
  const normalize = (text) => text ? text.trim().toLowerCase() : '';
  const isCorrect = normalize(userAnswer) === normalize(currentCard?.answer);

  const handleSubmit = () => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
      // Gamification Hooks
      addXp(1);

      const newStreak = sessionStreak + 1;
      setSessionStreak(newStreak);

      const newSessionCorrect = sessionCorrectCount + 1;
      setSessionCorrectCount(newSessionCorrect);

      // Quest Updates
      // NOVICE_1: Total Correct
      updateQuestProgress('NOVICE_1', 1, 'ADD');

      // IRON_1: Steak 5, BRONZE_1: Streak 10
      updateQuestProgress('IRON_1', newStreak, 'MAX');
      updateQuestProgress('BRONZE_1', newStreak, 'MAX');

      // BRONZE_2: Type Answer 10 Cards
      updateQuestProgress('BRONZE_2', 1, 'ADD');

      // DIAMOND_2: 25 Correct in Session
      updateQuestProgress('DIAMOND_2', newSessionCorrect, 'MAX');

    } else {
      setSessionStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  if (!currentCard) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.completionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
          <Text style={[styles.completionTitle, { color: theme.primary }]}>Finished!</Text>
          <Text style={[styles.completionStats, { color: theme.text }]}>
            Score: {score} / {cards.length}
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
        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
          <Text style={[styles.cardLabel, { color: theme.textLight }]}>Question</Text>
          <Text style={[styles.cardText, { color: theme.text }]}>{currentCard.question}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Type the answer:</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface === '#FFFFFF' ? '#fff' : theme.surface,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter your answer"
            placeholderTextColor={theme.textLight}
            editable={!showResult}
            multiline
          />
        </View>

        {showResult && (
          <View
            style={[
              styles.resultCard,
              isCorrect ? { backgroundColor: theme.success + '20', borderColor: theme.success } : { backgroundColor: theme.error + '20', borderColor: theme.error },
            ]}
          >
            <Text style={[styles.resultText, { color: theme.text }]}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            {!isCorrect && (
              <Text style={[styles.correctAnswer, { color: theme.text }]}>
                Correct answer: {currentCard.answer}
              </Text>
            )}
          </View>
        )}

        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: theme.primary },
              !userAnswer.trim() && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            <Text style={styles.submitButtonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
  },
  card: {
    // backgroundColor: handled dynamically
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    // shadowColor: handled dynamically
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    // color: handled dynamically
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    // color: handled dynamically
    lineHeight: 28,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
    marginBottom: 8,
  },
  input: {
    // backgroundColor: handled dynamically
    borderWidth: 2,
    // borderColor: handled dynamically
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    // color: handled dynamically
    minHeight: 100,
    textAlignVertical: 'top',
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
  },
  // resultCorrect: handled inline
  // resultIncorrect: handled inline
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 14,
    // color: handled dynamically
  },
  submitButton: {
    // backgroundColor: handled dynamically
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    // backgroundColor: handled dynamically
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
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


