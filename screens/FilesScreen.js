import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
// import { colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
import { useAuth } from '../contexts/AuthContext';
import StudySetCard from '../components/StudySetCard';
import {
  getStudySets,
  createStudySet,
  updateStudySet,
  deleteStudySet,
} from '../services/setsService';
import { getCards } from '../services/cardsService';

export default function FilesScreen({ onNavigate, onStudySet }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [sets, setSets] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [setName, setSetName] = useState('');
  const [setDescription, setSetDescription] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [setsData, cardsData] = await Promise.all([
        getStudySets(user.uid),
        getCards(user.uid),
      ]);
      setSets(setsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load study sets');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const openCreateModal = () => {
    setEditingSet(null);
    setSetName('');
    setSetDescription('');
    setSelectedCards([]);
    setModalVisible(true);
  };

  const openEditModal = (set) => {
    setEditingSet(set);
    setSetName(set.name);
    setSetDescription(set.description || '');
    setSelectedCards(set.cardIds || []);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!setName.trim()) {
      Alert.alert('Error', 'Please enter a set name');
      return;
    }

    try {
      if (editingSet) {
        await updateStudySet(editingSet.id, {
          name: setName.trim(),
          description: setDescription.trim(),
          cardIds: selectedCards,
        });
      } else {
        await createStudySet(user.uid, {
          name: setName.trim(),
          description: setDescription.trim(),
          cardIds: selectedCards,
        });
      }
      setModalVisible(false);
      // Use setTimeout to avoid state update during render
      setTimeout(() => {
        loadData();
      }, 0);
    } catch (error) {
      console.error('Error saving set:', error);
      Alert.alert('Error', 'Failed to save study set');
    }
  };

  const handleDelete = async (setId) => {
    Alert.alert(
      'Delete Study Set',
      'Are you sure you want to delete this study set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStudySet(setId);
              // Use setTimeout to avoid state update during render
              setTimeout(() => {
                loadData();
              }, 0);
            } catch (error) {
              console.error('Error deleting set:', error);
              Alert.alert('Error', 'Failed to delete study set');
            }
          },
        },
      ]
    );
  };

  const toggleCardSelection = (cardId) => {
    setSelectedCards((prev) => {
      const current = prev || [];
      return current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId];
    });
  };


  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Library</Text>
            <Text style={[styles.subtitle, { color: theme.textLight }]}>
              Your Study Sets
            </Text>
          </View>
          <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.primary }]} onPress={openCreateModal}>
            <Text style={styles.createButtonText}>+ New Set</Text>
          </TouchableOpacity>
        </View>

        {
          sets.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Text style={styles.emptyStateIcon}>📁</Text>
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Study Sets</Text>
              <Text style={[styles.emptyStateText, { color: theme.textLight }]}>
                Create your first study set to organize your flashcards
              </Text>
              <TouchableOpacity
                style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
                onPress={openCreateModal}
              >
                <Text style={styles.emptyStateButtonText}>Create Set</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.setsGrid}>
              {sets.map((set) => {
                const setCards = cards.filter((c) =>
                  (set.cardIds || []).includes(c.id)
                );
                return (
                  <StudySetCard
                    key={set.id}
                    set={{
                      ...set,
                      cardCount: setCards.length,
                    }}
                    onPress={() => { }}
                    onEdit={() => openEditModal(set)}
                    onDelete={() => handleDelete(set.id)}
                    onStudy={() => onStudySet(set)}
                  />
                );
              })}
            </View>
          )
        }
      </ScrollView >

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingSet ? 'Edit Study Set' : 'Create Study Set'}
            </Text>

            <Text style={[styles.inputLabel, { color: theme.text }]}>Set Name *</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.surface === '#FFFFFF' ? '#fff' : theme.background,
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Enter set name"
              placeholderTextColor={theme.textLight}
              value={setName}
              onChangeText={setSetName}
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, {
                backgroundColor: theme.surface === '#FFFFFF' ? '#fff' : theme.background,
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Enter description (optional)"
              placeholderTextColor={theme.textLight}
              value={setDescription}
              onChangeText={setSetDescription}
              multiline
            />

            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Select Cards ({selectedCards.length} selected)
            </Text>
            <ScrollView style={styles.cardsList}>
              {cards.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[
                      styles.cardItem,
                      { backgroundColor: theme.surface, borderColor: theme.border },
                      isSelected && { backgroundColor: theme.primary + '15', borderColor: theme.primary },
                    ]}
                    onPress={() => toggleCardSelection(card.id)}
                  >
                    <Text style={[styles.cardCheckbox, { color: theme.primary }]}>
                      {isSelected ? '✓' : '○'}
                    </Text>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardQuestion, { color: theme.text }]} numberOfLines={1}>
                        {card.question}
                      </Text>
                      <Text style={[styles.cardAnswer, { color: theme.textLight }]} numberOfLines={1}>
                        {card.answer}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: handled dynamically
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 60 : 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: handled dynamically
  },
  header: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'flex-start',
    marginBottom: isMobile ? 16 : 24,
    gap: isMobile ? 12 : 0,
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    // color: handled dynamically
  },
  createButton: {
    // backgroundColor: handled dynamically
    paddingHorizontal: isMobile ? 16 : 20,
    paddingVertical: isMobile ? 10 : 12,
    borderRadius: isMobile ? 10 : 12,
    alignSelf: isMobile ? 'flex-start' : 'auto',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
  },
  setsGrid: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    // backgroundColor: handled dynamically
    borderRadius: 16,
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    // color: handled dynamically
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    // backgroundColor: handled dynamically
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    // backgroundColor: handled dynamically
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    // borderColor: handled dynamically
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    // color: handled dynamically
    // backgroundColor: handled dynamically
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cardsList: {
    maxHeight: 200,
    marginTop: 8,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    // backgroundColor: handled dynamically
    borderWidth: 1,
    // borderColor: handled dynamically
  },
  // cardItemSelected: handled inline
  cardCheckbox: {
    fontSize: 20,
    marginRight: 12,
    // color: handled dynamically
  },
  cardContent: {
    flex: 1,
  },
  cardQuestion: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
    marginBottom: 4,
  },
  cardAnswer: {
    fontSize: 12,
    // color: handled dynamically
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    // backgroundColor: handled dynamically
  },
  cancelButtonText: {
    // color: handled dynamically
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    // backgroundColor: handled dynamically
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

