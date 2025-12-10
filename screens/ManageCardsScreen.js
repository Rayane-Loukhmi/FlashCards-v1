import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import CardList from '../components/CardList';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

export default function ManageCardsScreen({ cards, onDelete, onEdit, onAdd, onMarkAsDone }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Cards</Text>
        <Text style={styles.subtitle}>
          Create, edit, and organize your flashcards
        </Text>
      </View>
      <CardList
        cards={cards}
        onDelete={onDelete}
        onEdit={onEdit}
        onAdd={onAdd}
        onMarkAsDone={onMarkAsDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 60 : 24,
    paddingBottom: isMobile ? 12 : 16,
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textLight,
  },
});

