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
import { useTheme } from '../contexts/ThemeContext';
import FlashCard from '../components/FlashCard';
import LearnMode from '../components/studyModes/LearnMode';
import WriteMode from '../components/studyModes/WriteMode';
import TestMode from '../components/studyModes/TestMode';

const MODES = {
  OVERVIEW: 'overview',
  FLASHCARDS: 'flashcards',
  LEARN: 'learn',
  WRITE: 'write',
  TEST: 'test',
};

import { useXp } from '../contexts/XpContext';

// ...
export default function StudyModesScreen({ cards, setInfo, onBack }) {
  const { theme, isDark } = useTheme();
  const { addXp, updateQuestProgress } = useXp(); // Hook
  const [currentMode, setCurrentMode] = useState(MODES.OVERVIEW);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setCurrentCardIndex(0);
    setSessionStreak(0);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markKnown = () => {
    const newStreak = sessionStreak + 1;
    setSessionStreak(newStreak);

    addXp(1);

    // Update Quests
    updateQuestProgress('NOVICE_1', 1, 'ADD'); // Total Correct
    updateQuestProgress('IRON_1', newStreak, 'MAX'); // Streak 5
    updateQuestProgress('BRONZE_1', newStreak, 'MAX'); // Streak 10

    // Check for "Perfect 1 Set" logic? 
    // That requires tracking if we missed any card in the whole set. Complex for now.

    nextCard();
  };

  const markUnknown = () => {
    setSessionStreak(0);
    nextCard();
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case MODES.FLASHCARDS:
        return (
          <View style={styles.modeFullscreen}>
            {cards.length > 0 && (
              <>
                <FlashCard card={cards[currentCardIndex]} />

                {/* Knowledge Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20, gap: 20 }}>
                  <TouchableOpacity
                    style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFCDD2', justifyContent: 'center', alignItems: 'center' }}
                    onPress={markUnknown}
                  >
                    <Text style={{ fontSize: 24 }}>❌</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#C8E6C9', justifyContent: 'center', alignItems: 'center' }}
                    onPress={markKnown}
                  >
                    <Text style={{ fontSize: 24 }}>✅</Text>
                  </TouchableOpacity>
                </View>

                {/* Navigation Buttons (Original) - kept for manual navigation if wanted */}
                <View style={[styles.navigationButtons, { marginTop: 0 }]}>
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: theme.surface === '#FFFFFF' ? '#fff' : theme.surface, borderColor: theme.border, borderWidth: 1 }]}
                    onPress={prevCard}
                  >
                    <Text style={[styles.navButtonText, { color: theme.text }]}>Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: theme.primary }]}
                    onPress={nextCard}
                  >
                    <Text style={[styles.navButtonTextNext, { color: '#FFFFFF' }]}>Next</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.counter, { color: theme.textLight, textAlign: 'center', marginTop: 10 }]}>
                  {currentCardIndex + 1} / {cards.length}
                </Text>
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

  if (currentMode !== MODES.OVERVIEW) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.modeHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentMode(MODES.OVERVIEW)}>
            <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back to Set</Text>
          </TouchableOpacity>
          <Text style={[styles.modeTitle, { color: theme.text }]}>
            {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
          </Text>
          <View style={{ width: 60 }} />
        </View>
        {renderModeContent()}
      </SafeAreaView>
    )
  }

  // OVERVIEW MODE (Set Page)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        {/* Actions like Share/Edit could go here */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.setInfo}>
          <Text style={[styles.setTitle, { color: theme.text }]}>{setInfo?.name || 'Study Set'}</Text>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>U</Text>
            </View>
            <Text style={[styles.authorName, { color: theme.text }]}>user_123</Text>
            <Text style={[styles.separator, { color: theme.textLight }]}>|</Text>
            <Text style={[styles.termCount, { color: theme.textLight }]}>{cards.length} terms</Text>
          </View>
          {setInfo?.description ? (
            <Text style={[styles.setDescription, { color: theme.textLight }]}>{setInfo.description}</Text>
          ) : null}
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
            onPress={() => handleModeChange(MODES.FLASHCARDS)}
          >
            <Text style={[styles.actionIcon, { color: theme.primary }]}>🃏</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Flashcards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
            onPress={() => handleModeChange(MODES.LEARN)}
          >
            <Text style={[styles.actionIcon, { color: theme.secondary }]}>🧠</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
            onPress={() => handleModeChange(MODES.TEST)}
          >
            <Text style={[styles.actionIcon, { color: theme.error }]}>📝</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
            onPress={() => handleModeChange(MODES.WRITE)}
          >
            <Text style={[styles.actionIcon, { color: theme.success }]}>✍️</Text>
            <Text style={[styles.actionLabel, { color: theme.text }]}>Write</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsList}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Terms in this set ({cards.length})</Text>
          {cards.map((card, index) => (
            <View key={card.id || index} style={[styles.termItem, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
              <Text style={[styles.termText, { color: theme.text }]}>{card.question}</Text>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.defText, { color: theme.textLight }]}>{card.answer}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  setInfo: {
    padding: 20,
  },
  setTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 8,
  },
  termCount: {
    fontSize: 14,
  },
  setDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12, // Gap handling
  },
  actionCard: {
    width: '46%', // approximate for 2 columns
    margin: '2%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center', // Centered alignment for cleaner look
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    aspectRatio: 1.5,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  termsList: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  termItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  termText: {
    fontSize: 16,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 8,
  },
  defText: {
    fontSize: 15,
  },
  modeFullscreen: {
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
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextNext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

