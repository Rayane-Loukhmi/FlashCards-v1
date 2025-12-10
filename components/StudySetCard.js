import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';

export default function StudySetCard({ set, onPress, onDelete, onEdit, onStudy }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {set.name}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {set.description || 'No description'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.cardCount}>
            {set.cardCount || 0} {set.cardCount === 1 ? 'term' : 'terms'}
          </Text>
          {set.lastStudied && (
            <Text style={styles.lastStudied}>
              Studied {new Date(set.lastStudied.toDate()).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.studyButton]}
          onPress={() => onStudy && onStudy(set)}
          disabled={!set.cardCount || set.cardCount === 0}
        >
          <Text style={styles.studyButtonText}>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit && onEdit(set)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
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
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.cardShadow,
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
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  studyButton: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  studyButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.white,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  lastStudied: {
    fontSize: 12,
    color: colors.textLight,
  },
});

