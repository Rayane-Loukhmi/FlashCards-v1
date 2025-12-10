import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import NavigationSidebar, { NAV_ITEMS } from './components/NavigationSidebar';
import DashboardScreen from './screens/DashboardScreen';
import ManageCardsScreen from './screens/ManageCardsScreen';
import FilesScreen from './screens/FilesScreen';
import ProgressScreen from './screens/ProgressScreen';
import StudyModesScreen from './screens/StudyModesScreen';
import { colors } from './constants/colors';
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
  const [currentScreen, setCurrentScreen] = useState(NAV_ITEMS.DASHBOARD);
  const [studyView, setStudyView] = useState(null); // null, 'all', or studySet object
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
    // Auto-hide sidebar on mobile after navigation
    if (isMobile) {
      setSidebarVisible(false);
    }
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Study view (when studying a set or all cards)
  if (studyView !== null) {
    let cardsToStudy = cards;
    if (studyView !== 'all' && studyView.cardIds) {
      cardsToStudy = cards.filter((c) => studyView.cardIds.includes(c.id));
    }

    return (
      <StudyModesScreen
        cards={cardsToStudy}
        onBack={handleBackFromStudy}
      />
    );
  }

  // Main app with navigation
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.appContainer}>
        {sidebarVisible && (
          <>
            {isMobile && (
              <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={() => setSidebarVisible(false)}
              />
            )}
            <View style={[styles.sidebarContainer, isMobile && styles.sidebarMobile]}>
              <NavigationSidebar
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
              />
            </View>
          </>
        )}
        <View style={[styles.contentArea, !sidebarVisible && styles.contentAreaFull]}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setSidebarVisible(!sidebarVisible)}
          >
            <Text style={styles.toggleButtonText}>
              ☰
            </Text>
          </TouchableOpacity>
          {renderScreen()}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
  sidebarContainer: {
    zIndex: 10,
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  contentArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentAreaFull: {
    width: '100%',
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleButtonText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textLight,
  },
});
