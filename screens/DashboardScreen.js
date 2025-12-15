import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useXp } from '../contexts/XpContext';
import { getStudySets } from '../services/setsService';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ onNavigate, onStudySet, cards }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { dailyProgress, dailyGoal, streak, currentRank } = useXp();
  const [sets, setSets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const userSets = await getStudySets(user.uid);
      setSets(userSets);
    } catch (error) {
      console.error('Error loading sets:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const RecentSetCard = ({ set }) => (
    <TouchableOpacity
      style={[styles.recentCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
      onPress={() => onStudySet(set)}
    >
      <Text style={[styles.recentCardTitle, { color: theme.text }]} numberOfLines={2}>
        {set.name}
      </Text>
      <View style={styles.recentCardFooter}>
        <Text style={[styles.recentCardCount, { color: theme.textLight }]}>
          {set.cardIds?.length || 0} terms
        </Text>
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{user?.email?.[0].toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Hello, {user?.email?.split('@')[0] || 'Student'}</Text>
          <View style={styles.headerIcons}>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search flashcards"
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {/* Daily Progress Section */}
        <View style={styles.section}>
          <View style={[styles.progressCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.progressTitle, { color: theme.text }]}>Daily Goal</Text>
                <Text style={[styles.rankText, { color: currentRank.color }]}>{currentRank.name} Rank</Text>
              </View>
              <View style={[styles.streakContainer, { backgroundColor: theme.secondary + '20' }]}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={[styles.streakCount, { color: theme.secondary }]}>{streak}</Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[
                styles.progressBarFill,
                {
                  width: `${Math.min((dailyProgress / dailyGoal) * 100, 100)}%`,
                  backgroundColor: dailyProgress >= dailyGoal ? theme.success : theme.primary
                }
              ]} />
            </View>

            <View style={styles.progressFooter}>
              <Text style={[styles.progressText, { color: theme.textLight }]}>
                {dailyProgress} / {dailyGoal} XP
              </Text>
              {dailyProgress >= dailyGoal && (
                <Text style={{ color: theme.success, fontWeight: 'bold' }}>Completed!</Text>
              )}
            </View>

            <TouchableOpacity onPress={() => onNavigate('quests')} style={styles.viewQuestsBtn}>
              <Text style={[styles.viewQuestsText, { color: theme.primary }]}>View Quests &rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent</Text>
            <TouchableOpacity onPress={() => onNavigate('files')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {sets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {sets.map(set => <RecentSetCard key={set.id} set={set} />)}
            </ScrollView>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Text style={{ color: theme.textLight }}>No sets found. Create one!</Text>
              <TouchableOpacity onPress={() => onNavigate('manage')}>
                <Text style={{ color: theme.primary, fontWeight: 'bold', marginTop: 8 }}>Create Set</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recentCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recentCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  recentCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentCardCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Progress Card Styles
  progressCard: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
  },
  viewQuestsBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewQuestsText: {
    fontWeight: '600',
  }
});
