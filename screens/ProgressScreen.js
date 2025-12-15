import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
// import { colors } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;
import { useAuth } from '../contexts/AuthContext';
import { getCards } from '../services/cardsService';
import { getStudySets } from '../services/setsService';

export default function ProgressScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
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
    <View style={[styles.statCard, { borderTopColor: color, backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statTitle, { color: theme.textLight }]}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: theme.textLight }]}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <View style={[styles.progressBarContainer, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
        <View style={styles.progressBarHeader}>
          <Text style={[styles.progressBarLabel, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.progressBarValue, { color: theme.textLight }]}>
            {value} / {max}
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
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
      <View style={[styles.activityCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
        <View style={styles.activityCardContent}>
          <Text style={[styles.activityCardQuestion, { color: theme.text }]} numberOfLines={1}>
            {card.question}
          </Text>
          <Text style={[styles.activityCardAnswer, { color: theme.textLight }]} numberOfLines={1}>
            {card.answer}
          </Text>
        </View>
        <View style={[styles.activityCardMeta, { borderTopColor: theme.border }]}>
          <View
            style={[
              styles.masteryBadge,
              card.mastered ? { backgroundColor: theme.success + '20' } : { backgroundColor: theme.warning + '20' },
            ]}
          >
            <Text style={[styles.masteryBadgeText, { color: theme.text }]}>
              {card.mastered ? '✓ Mastered' : '○ Learning'}
            </Text>
          </View>
          <Text style={[styles.activityCardDate, { color: theme.textLight }]}>{lastStudied}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <Text style={[styles.subtitle, { color: theme.textLight }]}>Your stats and achievements</Text>
        </View>
        <View style={styles.themeToggle}>
          <Text style={{ color: theme.text, marginRight: 8 }}>{isDark ? '🌙' : '☀️'}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primaryLight }}
            thumbColor={isDark ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            selectedPeriod === 'week' && { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: theme.text },
              selectedPeriod === 'week' && { color: '#FFFFFF' },
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            selectedPeriod === 'month' && { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: theme.text },
              selectedPeriod === 'month' && { color: '#FFFFFF' },
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: theme.surface, borderColor: theme.border },
            selectedPeriod === 'all' && { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={() => setSelectedPeriod('all')}
        >
          <Text
            style={[
              styles.periodButtonText,
              { color: theme.text },
              selectedPeriod === 'all' && { color: '#FFFFFF' },
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
          color={theme.primary}
        />
        <StatCard
          title="Mastered"
          value={stats.masteredCards}
          subtitle={`${stats.masteryRate}% complete`}
          icon="✅"
          color={theme.success}
        />
        <StatCard
          title="Study Sessions"
          value={stats.totalStudyTime}
          subtitle="Times studied"
          icon="🔥"
          color={theme.warning}
        />
        <StatCard
          title="Recent Activity"
          value={stats.recentActivity}
          subtitle={`This ${selectedPeriod}`}
          icon="📈"
          color={theme.primaryLight}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Mastery Progress</Text>
        <ProgressBar
          label="Cards Mastered"
          value={stats.masteredCards}
          max={stats.totalCards}
          color={theme.success}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
        {getFilteredCards().length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Text style={[styles.emptyStateText, { color: theme.textLight }]}>
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
    // backgroundColor: handled dynamically
  },
  content: {
    padding: isMobile ? 16 : 24,
    paddingTop: isMobile ? 60 : 24,
  },
  header: {
    marginBottom: isMobile ? 20 : 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    // color: handled dynamically
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
    // backgroundColor: handled dynamically
    borderWidth: 1,
    // borderColor: handled dynamically
    alignItems: 'center',
  },
  periodButtonActive: {
    // backgroundColor: handled dynamically
    // borderColor: handled dynamically
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: isMobile ? 20 : 24,
    gap: isMobile ? 12 : 16,
  },
  statCard: {
    // backgroundColor: handled dynamically
    borderRadius: isMobile ? 12 : 16,
    padding: isMobile ? 16 : 20,
    width: isMobile ? '100%' : '48%',
    borderTopWidth: 4,
    // shadowColor: handled dynamically
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
    // color: handled dynamically
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    // color: handled dynamically
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: handled dynamically
    marginBottom: 16,
  },
  progressBarContainer: {
    // backgroundColor: handled dynamically
    borderRadius: 12,
    padding: 16,
    // shadowColor: handled dynamically
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
    // color: handled dynamically
  },
  progressBarValue: {
    fontSize: 14,
    fontWeight: '600',
    // color: handled dynamically
  },
  progressBar: {
    height: 8,
    // backgroundColor: handled dynamically
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  activityCard: {
    // backgroundColor: handled dynamically
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // shadowColor: handled dynamically
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
    // color: handled dynamically
    marginBottom: 4,
  },
  activityCardAnswer: {
    fontSize: 14,
    // color: handled dynamically
  },
  activityCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    // borderTopColor: handled dynamically
  },
  masteryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  // masteryBadgeDone: handled inline
  // masteryBadgePending: handled inline
  masteryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    // color: handled dynamically
  },
  activityCardDate: {
    fontSize: 12,
    // color: handled dynamically
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    // backgroundColor: handled dynamically
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    // color: handled dynamically
  },
});

