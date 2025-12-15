import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
// import { colors } from '../../constants/colors';
import { useTheme } from '../../contexts/ThemeContext';

export default function TestMode({ cards }) {
  const { theme } = useTheme();
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
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <View style={[styles.completionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
            <Text style={[styles.completionTitle, { color: theme.primary }]}>Test Complete!</Text>
            <Text style={[styles.completionScore, { color: theme.text }]}>
              {score} / {cards.length}
            </Text>
            <Text style={[styles.completionPercentage, { color: theme.primary }]}>{percentage}%</Text>
            <View style={styles.resultsList}>
              {answers.map((answer, index) => (
                <View
                  key={index}
                  style={[
                    styles.resultItem,
                    answer.isCorrect
                      ? { backgroundColor: theme.success + '20' }
                      : { backgroundColor: theme.error + '20' },
                  ]}
                >
                  <Text style={[styles.resultItemText, { color: theme.text }]}>
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
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  isSelected && !showResult && { borderColor: theme.primary, backgroundColor: theme.primary + '10' },
                  showCorrect && { borderColor: theme.success, backgroundColor: theme.success + '20' },
                  showIncorrect && { borderColor: theme.error, backgroundColor: theme.error + '20' },
                ]}
                onPress={() => handleSelectAnswer(option)}
                disabled={showResult}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: theme.text },
                    isSelected && !showResult && { color: theme.primary, fontWeight: '600' },
                    showCorrect && { color: theme.success, fontWeight: '600' },
                    showIncorrect && { color: theme.error, fontWeight: '600' },
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
              { backgroundColor: theme.primary },
              selectedAnswer === null && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.progressText, { color: theme.textLight }]}>
        {currentIndex + 1} of {cards.length} | Score: {score}
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
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    // backgroundColor: handled dynamically
    borderWidth: 2,
    // borderColor: handled dynamically
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  // optionSelected: handled inline
  // optionCorrect: handled inline
  // optionIncorrect: handled inline
  optionText: {
    fontSize: 16,
    // color: handled dynamically
  },
  // optionTextSelected: handled inline
  // optionTextCorrect: handled inline
  // optionTextIncorrect: handled inline
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
  completionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  completionCard: {
    // backgroundColor: handled dynamically
    borderRadius: 16,
    padding: 32,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  completionScore: {
    fontSize: 24,
    fontWeight: '600',
    // color: handled dynamically
    textAlign: 'center',
    marginBottom: 8,
  },
  completionPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    // color: handled dynamically
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
  // resultItemCorrect: handled inline
  // resultItemIncorrect: handled inline
  resultItemText: {
    fontSize: 14,
    // color: handled dynamically
  },
});

