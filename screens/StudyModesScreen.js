import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import FlashCard from '../components/FlashCard';
import LearnMode from '../components/studyModes/LearnMode';
import WriteMode from '../components/studyModes/WriteMode';
import TestMode from '../components/studyModes/TestMode';

const MODES = {
  FLASHCARDS: 'flashcards',
  LEARN: 'learn',
  WRITE: 'write',
  TEST: 'test',
};

export default function StudyModesScreen({ cards, onBack }) {
  const [currentMode, setCurrentMode] = useState(MODES.FLASHCARDS);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setCurrentCardIndex(0); // Reset to first card when switching modes
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case MODES.FLASHCARDS:
        return (
          <View style={styles.modeContent}>
            {cards.length > 0 && (
              <>
                <FlashCard card={cards[currentCardIndex]} />
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={prevCard}
                  >
                    <Text style={styles.navButtonText}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={nextCard}
                  >
                    <Text style={styles.navButtonTextNext}>Next</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      case MODES.LEARN:
        return <LearnMode cards={cards} />;
      case MODES.WRITE:
        return <WriteMode cards={cards} />;
      case MODES.TEST:
        return <TestMode cards={cards} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.cardCounter}>
          {currentCardIndex + 1} / {cards.length}
        </Text>
      </View>

      <View style={styles.modeSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === MODES.FLASHCARDS && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange(MODES.FLASHCARDS)}
          >
            <Text
              style={[
                styles.modeButtonText,
                currentMode === MODES.FLASHCARDS && styles.modeButtonTextActive,
              ]}
            >
              Flashcards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === MODES.LEARN && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange(MODES.LEARN)}
          >
            <Text
              style={[
                styles.modeButtonText,
                currentMode === MODES.LEARN && styles.modeButtonTextActive,
              ]}
            >
              Learn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === MODES.WRITE && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange(MODES.WRITE)}
          >
            <Text
              style={[
                styles.modeButtonText,
                currentMode === MODES.WRITE && styles.modeButtonTextActive,
              ]}
            >
              Write
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              currentMode === MODES.TEST && styles.modeButtonActive,
            ]}
            onPress={() => handleModeChange(MODES.TEST)}
          >
            <Text
              style={[
                styles.modeButtonText,
                currentMode === MODES.TEST && styles.modeButtonTextActive,
              ]}
            >
              Test
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {renderModeContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  cardCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  modeSelector: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modeButtonTextActive: {
    color: colors.white,
  },
  modeContent: {
    flex: 1,
    padding: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  navButtonTextNext: {
    color: colors.white,
  },
});

