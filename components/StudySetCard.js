import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

export default function StudySetCard({ set, onPress, onDelete, onEdit, onStudy }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {set.name}
          </Text>
        </View>
        <Text style={[styles.description, { color: theme.textLight }]} numberOfLines={2}>
          {set.description || 'No description'}
        </Text>
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.cardCount, { color: theme.primary }]}>
            {set.cardCount || 0} {set.cardCount === 1 ? 'term' : 'terms'}
          </Text>
          {set.lastStudied && (
            <Text style={[styles.lastStudied, { color: theme.textLight }]}>
              Studied {new Date(set.lastStudied.toDate()).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.studyButton, { backgroundColor: theme.primary }]}
          onPress={() => onStudy && onStudy(set)}
          disabled={!set.cardCount || set.cardCount === 0}
        >
          <Text style={styles.studyButtonText}>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => onEdit && onEdit(set)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: theme.error }]}
          onPress={() => onDelete && onDelete(set.id)}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: handled dynamically
    borderRadius: 12,
    marginBottom: 16,
    // shadowColor: handled dynamically
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    // color: handled dynamically
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    // borderTopColor: handled dynamically
  },
  studyButton: {
    // backgroundColor: handled dynamically
    flex: 1,
  },
  studyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    // backgroundColor: handled dynamically
  },
  deleteButton: {
    // backgroundColor: handled dynamically
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    // color: handled dynamically
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    // borderTopColor: handled dynamically
  },
  cardCount: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
  },
  lastStudied: {
    fontSize: 12,
    // color: handled dynamically
  },
});

