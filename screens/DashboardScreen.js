import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
import { useAuth } from '../contexts/AuthContext';
import { getCards } from '../services/cardsService';
import { getStudySets } from '../services/setsService';

export default function DashboardScreen({ onNavigate, onStudySet, cards: propCards }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    totalSets: 0,
    masteredCards: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const cardsData = propCards || await getCards(user.uid);
      const sets = await getStudySets(user.uid);
      
      const masteredCards = cardsData.filter((card) => card.mastered).length;
      const recentActivity = cardsData.filter((card) => {
        if (!card.lastStudied) return false;
        const lastStudied = card.lastStudied.toDate();
        const daysSince = (Date.now() - lastStudied.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      }).length;

      setStats({
        totalCards: cardsData.length,
        totalSets: sets.length,
        masteredCards,
        recentActivity,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const QuickAction = ({ title, description, icon, onPress, color }) => (
    <TouchableOpacity
      style={[styles.quickAction, { borderColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
      <Text style={[styles.quickActionArrow, { color }]}>→</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Your learning overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Cards"
          value={stats.totalCards}
          subtitle="Flashcards created"
          icon="📚"
          color={colors.primary}
        />
        <StatCard
          title="Study Sets"
          value={stats.totalSets}
          subtitle="Organized sets"
          icon="📁"
          color={colors.primaryLight}
        />
        <StatCard
          title="Mastered"
          value={stats.masteredCards}
          subtitle={`${stats.totalCards > 0 ? Math.round((stats.masteredCards / stats.totalCards) * 100) : 0}% complete`}
          icon="✅"
          color={colors.success}
        />
        <StatCard
          title="This Week"
          value={stats.recentActivity}
          subtitle="Cards studied"
          icon="🔥"
          color={colors.warning}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickAction
          title="Create New Set"
          description="Organize your flashcards"
          icon="➕"
          color={colors.primary}
          onPress={() => onNavigate('files')}
        />
        <QuickAction
          title="Add Cards"
          description="Create new flashcards"
          icon="📝"
          color={colors.primary}
          onPress={() => onNavigate('manage')}
        />
        <QuickAction
          title="View Progress"
          description="Track your learning"
          icon="📈"
          color={colors.primary}
          onPress={() => onNavigate('progress')}
        />
        {propCards && propCards.length > 0 && (
          <QuickAction
            title="Study All Cards"
            description="Start studying all flashcards"
            icon="🎯"
            color={colors.primary}
            onPress={() => onStudySet && onStudySet('all')}
          />
        )}
      </View>

        {(propCards ? propCards.length === 0 : stats.totalCards === 0) && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎯</Text>
          <Text style={styles.emptyStateTitle}>Get Started!</Text>
          <Text style={styles.emptyStateText}>
            Create your first flashcard to begin learning
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => onNavigate('manage')}
          >
            <Text style={styles.emptyStateButtonText}>Create Flashcard</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 60 : 24,
  },
  header: {
    marginBottom: isMobile ? 20 : 32,
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isMobile ? 20 : 32,
    gap: isMobile ? 12 : 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: isMobile ? 12 : 16,
    padding: isMobile ? 16 : 20,
    width: isMobile ? '100%' : '48%',
    borderLeftWidth: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: isMobile ? 8 : 0,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: isMobile ? 10 : 12,
    padding: isMobile ? 12 : 16,
    marginBottom: isMobile ? 10 : 12,
    borderWidth: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: isMobile ? 20 : 24,
    marginRight: isMobile ? 12 : 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: isMobile ? 12 : 14,
    color: colors.textLight,
  },
  quickActionArrow: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

