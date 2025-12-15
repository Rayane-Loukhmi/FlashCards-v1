import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
// import { colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';
import CardList from '../components/CardList';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

export default function ManageCardsScreen({ cards, onDelete, onEdit, onAdd, onMarkAsDone }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Manage Cards</Text>
        <Text style={[styles.subtitle, { color: theme.textLight }]}>
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
    // backgroundColor: handled dynamically
  },
  header: {
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 60 : 24,
    paddingBottom: isMobile ? 12 : 16,
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
});

