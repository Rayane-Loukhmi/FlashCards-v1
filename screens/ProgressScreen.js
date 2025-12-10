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

export default function ProgressScreen() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [cardsData, setsData] = await Promise.all([
        getCards(user.uid),
        getStudySets(user.uid),
      ]);
      setCards(cardsData);
      setSets(setsData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCards = () => {
    const now = Date.now();
    const periodMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };
    const period = periodMs[selectedPeriod];

    return cards.filter((card) => {
      if (!card.lastStudied) return false;
      const lastStudied = card.lastStudied.toDate().getTime();
      return now - lastStudied <= period;
    });
  };

  const stats = {
    totalCards: cards.length,
    masteredCards: cards.filter((c) => c.mastered).length,
    recentActivity: getFilteredCards().length,
    totalStudyTime: cards.reduce((sum, c) => sum + (c.timesStudied || 0), 0),
    masteryRate: cards.length > 0
      ? Math.round((cards.filter((c) => c.mastered).length / cards.length) * 100)
      : 0,
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarHeader}>
          <Text style={styles.progressBarLabel}>{label}</Text>
          <Text style={styles.progressBarValue}>
            {value} / {max}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };

  const RecentActivityCard = ({ card }) => {
    const lastStudied = card.lastStudied
      ? new Date(card.lastStudied.toDate()).toLocaleDateString()
      : 'Never';
    return (
      <View style={styles.activityCard}>
        <View style={styles.activityCardContent}>
          <Text style={styles.activityCardQuestion} numberOfLines={1}>
            {card.question}
          </Text>
          <Text style={styles.activityCardAnswer} numberOfLines={1}>
            {card.answer}
          </Text>
        </View>
        <View style={styles.activityCardMeta}>
          <View
            style={[
              styles.masteryBadge,
              card.mastered ? styles.masteryBadgeDone : styles.masteryBadgePending,
            ]}
          >
            <Text style={styles.masteryBadgeText}>
              {card.mastered ? '✓ Mastered' : '○ Learning'}
            </Text>
          </View>
          <Text style={styles.activityCardDate}>{lastStudied}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'week' && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'week' && styles.periodButtonTextActive,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'month' && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'month' && styles.periodButtonTextActive,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === 'all' && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod('all')}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === 'all' && styles.periodButtonTextActive,
            ]}
          >
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Cards"
          value={stats.totalCards}
          subtitle="Created"
          icon="📚"
          color={colors.primary}
        />
        <StatCard
          title="Mastered"
          value={stats.masteredCards}
          subtitle={`${stats.masteryRate}% complete`}
          icon="✅"
          color={colors.success}
        />
        <StatCard
          title="Study Sessions"
          value={stats.totalStudyTime}
          subtitle="Times studied"
          icon="🔥"
          color={colors.warning}
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          subtitle={`This ${selectedPeriod}`}
          icon="📈"
          color={colors.primaryLight}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mastery Progress</Text>
        <ProgressBar
          label="Cards Mastered"
          value={stats.masteredCards}
          max={stats.totalCards}
          color={colors.success}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {getFilteredCards().length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No activity in this period
            </Text>
          </View>
        ) : (
          getFilteredCards()
            .slice(0, 10)
            .map((card) => (
              <RecentActivityCard key={card.id} card={card} />
            ))
        )}
      </View>
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
    marginBottom: isMobile ? 20 : 24,
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
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isMobile ? 20 : 24,
    gap: isMobile ? 12 : 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: isMobile ? 12 : 16,
    padding: isMobile ? 16 : 20,
    width: isMobile ? '100%' : '48%',
    borderTopWidth: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: isMobile ? 8 : 0,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  progressBarContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBarValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityCardContent: {
    marginBottom: 12,
  },
  activityCardQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  activityCardAnswer: {
    fontSize: 14,
    color: colors.textLight,
  },
  activityCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  masteryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  masteryBadgeDone: {
    backgroundColor: colors.success + '20',
  },
  masteryBadgePending: {
    backgroundColor: colors.warning + '20',
  },
  masteryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  activityCardDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
  },
});

