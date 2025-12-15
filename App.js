import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { XpProvider } from './contexts/XpContext';
import LoginScreen from './screens/LoginScreen';
import BottomTabBar, { NAV_ITEMS } from './components/BottomTabBar';
import DashboardScreen from './screens/DashboardScreen';
import ManageCardsScreen from './screens/ManageCardsScreen';
import FilesScreen from './screens/FilesScreen';
import ProgressScreen from './screens/ProgressScreen';
import StudyModesScreen from './screens/StudyModesScreen';
import QuestsScreen from './screens/QuestsScreen';
// import { colors } from './constants/colors';
import {
  getCards,
  addCard as addCardToFirestore,
  updateCard as updateCardInFirestore,
  deleteCard as deleteCardFromFirestore,
  markCardAsDone,
  markCardAsNotDone,
} from './services/cardsService';

function MainApp() {
  const { user, loading, signOut } = useAuth();
  const { theme, isDark } = useTheme();
  const [currentScreen, setCurrentScreen] = useState(NAV_ITEMS.DASHBOARD);
  const [studyView, setStudyView] = useState(null); // null, 'all', or studySet object
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  useEffect(() => {
    if (user) {
      loadCards();
    } else {
      setCards([]);
      setCardsLoading(false);
    }
  }, [user]);

  const loadCards = async () => {
    if (!user) return;
    try {
      setCardsLoading(true);
      const userCards = await getCards(user.uid);
      setCards(userCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setCardsLoading(false);
    }
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    setStudyView(null);
  };

  const handleStudySet = (set) => {
    setStudyView(set);
  };

  const handleBackFromStudy = () => {
    setStudyView(null);
  };

  const addCard = async (question, answer) => {
    try {
      const newCard = await addCardToFirestore(user.uid, question, answer);
      setCards([newCard, ...cards]);
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  const deleteCard = async (id) => {
    try {
      await deleteCardFromFirestore(id);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const editCard = async (id, question, answer) => {
    try {
      await updateCardInFirestore(id, question, answer);
      setCards(
        cards.map((card) =>
          card.id === id ? { ...card, question, answer } : card
        )
      );
    } catch (error) {
      console.error('Error editing card:', error);
      throw error;
    }
  };

  const handleMarkAsDone = async (cardId, isDone) => {
    try {
      const card = cards.find((c) => c.id === cardId);
      if (isDone) {
        await markCardAsDone(cardId, card?.timesStudied || 0);
        setCards(
          cards.map((c) =>
            c.id === cardId
              ? {
                ...c,
                mastered: true,
                lastStudied: new Date(),
                timesStudied: (c.timesStudied || 0) + 1,
              }
              : c
          )
        );
      } else {
        await markCardAsNotDone(cardId);
        setCards(
          cards.map((c) =>
            c.id === cardId ? { ...c, mastered: false } : c
          )
        );
      }
    } catch (error) {
      console.error('Error marking card:', error);
      throw error;
    }
  };

  if (loading || cardsLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textLight }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Study view (when studying a set or all cards) covers the whole screen (no tab bar usually, but Quizlet keeps it or hides it)
  // For simplicity, let's keep it full screen overlay like before.
  if (studyView !== null) {
    let cardsToStudy = cards;
    if (studyView !== 'all' && studyView.cardIds) {
      cardsToStudy = cards.filter((c) => studyView.cardIds.includes(c.id));
    }

    const setInfo = studyView === 'all'
      ? { name: 'All Cards', description: 'Studying all available flashcards' }
      : studyView;

    return (
      <StudyModesScreen
        cards={cardsToStudy}
        setInfo={setInfo}
        onBack={handleBackFromStudy}
      />
    );
  }

  // Main app with bottom navigation
  const renderScreen = () => {
    switch (currentScreen) {
      case NAV_ITEMS.DASHBOARD:
        return (
          <DashboardScreen
            onNavigate={handleNavigate}
            onStudySet={handleStudySet}
            cards={cards}
          />
        );
      case NAV_ITEMS.QUESTS:
        return <QuestsScreen />;
      case NAV_ITEMS.MANAGE_CARDS:
        return (
          <ManageCardsScreen
            cards={cards}
            onDelete={deleteCard}
            onEdit={editCard}
            onAdd={addCard}
            onMarkAsDone={handleMarkAsDone}
          />
        );
      case NAV_ITEMS.FILES:
        return (
          <FilesScreen
            onNavigate={handleNavigate}
            onStudySet={handleStudySet}
          />
        );
      case NAV_ITEMS.PROGRESS:
        // Using Progress as Profile placeholder
        return <ProgressScreen />;
      default:
        return (
          <DashboardScreen
            onNavigate={handleNavigate}
            onStudySet={() => handleStudySet('all')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar style={theme.statusBarStyle} />
      <View style={styles.appContainer}>
        <View style={styles.contentArea}>
          {renderScreen()}
        </View>
        <BottomTabBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <XpProvider>
            <MainApp />
          </XpProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color is handled dynamically
  },
  appContainer: {
    flex: 1,
    flexDirection: 'column', // Changed to column
  },
  contentArea: {
    flex: 1,
    // Background color handled dynamically
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    // color handled dynamically
  },
});
