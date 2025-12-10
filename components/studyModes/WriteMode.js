import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../constants/colors';

export default function WriteMode({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentCard = cards[currentIndex];
  const isCorrect =
    userAnswer.trim().toLowerCase() ===
    currentCard?.answer.trim().toLowerCase();

  const handleSubmit = () => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
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
      <View style={styles.container}>
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>Finished!</Text>
          <Text style={styles.completionStats}>
            Score: {score} / {cards.length}
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
          <Text style={styles.cardLabel}>Question</Text>
          <Text style={styles.cardText}>{currentCard.question}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Type the answer:</Text>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter your answer"
            placeholderTextColor={colors.textLight}
            editable={!showResult}
            multiline
          />
        </View>

        {showResult && (
          <View
            style={[
              styles.resultCard,
              isCorrect ? styles.resultCorrect : styles.resultIncorrect,
            ]}
          >
            <Text style={styles.resultText}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            {!isCorrect && (
              <Text style={styles.correctAnswer}>
                Correct answer: {currentCard.answer}
              </Text>
            )}
          </View>
        )}

        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              !userAnswer.trim() && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            <Text style={styles.submitButtonText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 28,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultCorrect: {
    backgroundColor: colors.success + '20',
    borderWidth: 2,
    borderColor: colors.success,
  },
  resultIncorrect: {
    backgroundColor: colors.error + '20',
    borderWidth: 2,
    borderColor: colors.error,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 14,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
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

