import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

export default function CardList({ cards, onDelete, onEdit, onAdd, onMarkAsDone }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const openAddModal = () => {
    setEditingCard(null);
    setQuestion('');
    setAnswer('');
    setModalVisible(true);
  };

  const openEditModal = (card) => {
    setEditingCard(card);
    setQuestion(card.question);
    setAnswer(card.answer);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Please fill in both question and answer');
      return;
    }

    if (editingCard) {
      onEdit(editingCard.id, question.trim(), answer.trim());
    } else {
      onAdd(question.trim(), answer.trim());
    }
    setModalVisible(false);
    setQuestion('');
    setAnswer('');
  };

  const handleDelete = (card) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(card.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {cards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No flashcards yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first card
            </Text>
          </View>
        ) : (
          cards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardContent}>
                <Text style={styles.cardQuestion} numberOfLines={2}>
                  {card.question}
                </Text>
                <Text style={styles.cardAnswer} numberOfLines={1}>
                  {card.answer}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[
                    styles.masteryButton,
                    card.mastered && styles.masteryButtonDone,
                    { marginRight: 10 },
                  ]}
                  onPress={() => onMarkAsDone && onMarkAsDone(card.id, !card.mastered)}
                >
                  <Text
                    style={[
                      styles.masteryButtonText,
                      card.mastered && styles.masteryButtonTextDone,
                    ]}
                  >
                    {card.mastered ? '✓ Mastered' : '○ Mark Done'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, { marginRight: 10 }]}
                  onPress={() => openEditModal(card)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(card)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </Text>

            <Text style={styles.inputLabel}>Question</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter question"
              value={question}
              onChangeText={setQuestion}
              multiline
            />

            <Text style={styles.inputLabel}>Answer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter answer"
              value={answer}
              onChangeText={setAnswer}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { marginRight: 12 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  cardItem: {
    backgroundColor: colors.white,
    borderRadius: isMobile ? 10 : 12,
    padding: isMobile ? 12 : 16,
    marginBottom: isMobile ? 10 : 12,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    marginBottom: isMobile ? 10 : 12,
  },
  cardQuestion: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  cardAnswer: {
    fontSize: isMobile ? 12 : 14,
    color: colors.textLight,
  },
  cardActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 6 : 8,
    borderRadius: isMobile ? 6 : 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: isMobile ? 12 : 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingHorizontal: isMobile ? 12 : 16,
    paddingVertical: isMobile ? 6 : 8,
    borderRadius: isMobile ? 6 : 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: isMobile ? 12 : 14,
    fontWeight: '600',
  },
  masteryButton: {
    backgroundColor: colors.border,
    paddingHorizontal: isMobile ? 10 : 12,
    paddingVertical: isMobile ? 6 : 8,
    borderRadius: isMobile ? 6 : 8,
  },
  masteryButtonDone: {
    backgroundColor: colors.success + '20',
  },
  masteryButtonText: {
    color: colors.text,
    fontSize: isMobile ? 11 : 12,
    fontWeight: '600',
  },
  masteryButtonTextDone: {
    color: colors.success,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top',
    color: colors.text,
    backgroundColor: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

