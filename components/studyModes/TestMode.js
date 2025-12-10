import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors } from '../../constants/colors';

export default function TestMode({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [options, setOptions] = useState([]);

  const currentCard = cards[currentIndex];

  // Generate multiple choice options
  useEffect(() => {
    if (currentCard && cards.length > 0) {
      const correctAnswer = currentCard.answer;
      const wrongAnswers = cards
        .filter((c) => c.id !== currentCard.id)
        .map((c) => c.answer)
        .slice(0, 3);
      const newOptions = [correctAnswer, ...wrongAnswers].sort(
        () => Math.random() - 0.5
      );
      setOptions(newOptions);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIndex, currentCard, cards]);

  const handleSelectAnswer = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const isCorrect = selectedAnswer === currentCard.answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswers([...answers, { question: currentCard.question, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (!currentCard) {
    const percentage = Math.round((score / cards.length) * 100);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>Test Complete!</Text>
            <Text style={styles.completionScore}>
              {score} / {cards.length}
            </Text>
            <Text style={styles.completionPercentage}>{percentage}%</Text>
            <View style={styles.resultsList}>
              {answers.map((answer, index) => (
                <View
                  key={index}
                  style={[
                    styles.resultItem,
                    answer.isCorrect
                      ? styles.resultItemCorrect
                      : styles.resultItemIncorrect,
                  ]}
                >
                  <Text style={styles.resultItemText}>
                    {answer.isCorrect ? '✓' : '✗'} {answer.question}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
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

        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentCard.answer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isSelected && !showResult && styles.optionSelected,
                  showCorrect && styles.optionCorrect,
                  showIncorrect && styles.optionIncorrect,
                ]}
                onPress={() => handleSelectAnswer(option)}
                disabled={showResult}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && !showResult && styles.optionTextSelected,
                    showCorrect && styles.optionTextCorrect,
                    showIncorrect && styles.optionTextIncorrect,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedAnswer === null && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.progressText}>
        {currentIndex + 1} of {cards.length} | Score: {score}
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
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
  },
  optionIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.error + '20',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: colors.success,
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: colors.error,
    fontWeight: '600',
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
  completionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  completionScore: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  completionPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resultsList: {
    marginTop: 16,
  },
  resultItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultItemCorrect: {
    backgroundColor: colors.success + '20',
  },
  resultItemIncorrect: {
    backgroundColor: colors.error + '20',
  },
  resultItemText: {
    fontSize: 14,
    color: colors.text,
  },
});

