import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useXp, DAILY_GOALS, RANKS } from '../contexts/XpContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUESTS_DEFINITIONS = {
    IRON: [
        { id: 'IRON_1', title: 'Start Strong', description: 'Get 5 correct answers in a row.', target: 5, type: 'STREAK' },
        { id: 'IRON_2', title: 'Consistent Learner', description: 'Complete 3 sets in total.', target: 3, type: 'SETS_COMPLETED' },
        { id: 'IRON_3', title: 'Memory Lane', description: 'Review 1 set you haven\'t seen in 3 days.', target: 1, type: 'OLD_SET_REVIEW' },
    ],
    BRONZE: [
        { id: 'BRONZE_1', title: 'On Fire', description: 'Get 10 correct answers in a row.', target: 10, type: 'STREAK' },
        { id: 'BRONZE_2', title: 'Typist', description: 'Use the "Type Answer" mode for 10 cards.', target: 10, type: 'TYPE_MODE_CARDS' },
        { id: 'BRONZE_3', title: 'Combo Master', description: 'Earn a Combo Bonus (2 perfect lessons) twice.', target: 2, type: 'COMBO_BONUS' },
    ],
    GOLD: [
        { id: 'GOLD_1', title: 'Perfectionist', description: 'Perfect 1 Set (100% correct).', target: 1, type: 'PERFECT_SET' },
        { id: 'GOLD_2', title: 'Explorer', description: 'Complete a lesson in three different sets.', target: 3, type: 'DIFF_SETS' },
        { id: 'GOLD_3', title: 'Daily Grinder', description: 'Achieve your Daily Minimum XP Goal.', target: 1, type: 'DAILY_GOAL_MET' },
    ],
    DIAMOND: [
        { id: 'DIAMOND_1', title: 'Double Perfect', description: 'Perfect 2 Sets (100% correct).', target: 2, type: 'PERFECT_SET' },
        { id: 'DIAMOND_2', title: 'Endurance', description: 'Answer 25 cards correctly in one session.', target: 25, type: 'SESSION_CORRECT' },
        { id: 'DIAMOND_3', title: 'Shuffler', description: 'Use the "Shuffle Cards" feature once.', target: 1, type: 'SHUFFLE_USE' },
    ],
    NOVICE: [
        { id: 'NOVICE_1', title: 'Welcome', description: 'Get 5 correct answers to reach Iron Rank!', target: 5, type: 'TOTAL_CORRECT' }
    ]
};

export default function QuestsScreen() {
    const { theme } = useTheme();
    const {
        weeklyXp, dailyGoal, setDailyGoal, dailyProgress, streak, currentRank,
        questsProgress, RANK_TIERS, resetProgress
    } = useXp();

    // Determine active quests based on rank
    const activeQuests = QUESTS_DEFINITIONS[currentRank.id] || QUESTS_DEFINITIONS.NOVICE;

    // Calculate Rank Progress
    // Find current rank index
    const rankIndex = RANK_TIERS.findIndex(r => r.id === currentRank.id);
    const nextRank = rankIndex < RANK_TIERS.length - 1 ? RANK_TIERS[rankIndex + 1] : null;

    let rankProgress = 0;
    let rankLabel = "Max Rank";
    if (nextRank) {
        const range = nextRank.minWeeklyXp - currentRank.minWeeklyXp;
        const progress = weeklyXp - currentRank.minWeeklyXp;
        rankProgress = Math.min(Math.max(progress / range, 0), 1);
        rankLabel = `${Math.floor(rankProgress * 100)}% to ${nextRank.name}`;
    }

    // Get Quest Status Helper
    const getQuestProgress = (quest) => {
        const todayKey = new Date().toISOString().split('T')[0];
        const dayData = questsProgress[todayKey] || {};
        // Depending on type, we look up different keys. 
        // Simplified mapping for now, assuming XpContext saves purely by Quest ID or Type.
        // Let's assume XpContext saves by TYPE or ID.
        // Ideally ID is unique enough.
        const current = dayData[quest.id] || 0;

        // Special case for 'DAILY_GOAL_MET' which is derived
        if (quest.type === 'DAILY_GOAL_MET') {
            return dailyProgress >= dailyGoal ? 1 : 0;
        }

        return current;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Section: Rank & Weekly XP */}
                <View style={[styles.section, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Rank</Text>
                    <View style={styles.rankContainer}>
                        <View style={[styles.rankBadge, { backgroundColor: currentRank.color, shadowColor: currentRank.color }]}>
                            <Text style={styles.rankBadgeText}>{currentRank.name[0]}</Text>{/* Simple Icon */}
                        </View>
                        <View style={styles.rankInfo}>
                            <Text style={[styles.rankName, { color: theme.text }]}>{currentRank.name}</Text>
                            <Text style={[styles.xpText, { color: theme.textLight }]}>{weeklyXp} XP this week</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${rankProgress * 100}%`, backgroundColor: currentRank.color }]} />
                    </View>
                    <Text style={[styles.progressText, { color: theme.textLight }]}>{rankLabel}</Text>
                </View>

                {/* Daily Goal Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Goal</Text>
                    <View style={styles.goalContainer}>
                        <Text style={[styles.goalText, { color: theme.text }]}>{dailyProgress} / {dailyGoal} XP</Text>
                        {dailyProgress >= dailyGoal && <Text style={styles.goalCompleted}>✅ Complete!</Text>}
                    </View>

                    {/* Goal Selector */}
                    <Text style={[styles.subLabel, { color: theme.textLight }]}>Set Daily Goal:</Text>
                    <View style={styles.goalButtons}>
                        {DAILY_GOALS.map(goal => (
                            <TouchableOpacity
                                key={goal}
                                style={[
                                    styles.goalButton,
                                    dailyGoal === goal ? { backgroundColor: theme.primary } : { borderColor: theme.border, borderWidth: 1 }
                                ]}
                                onPress={() => setDailyGoal(goal)}
                            >
                                <Text style={[
                                    styles.goalButtonText,
                                    dailyGoal === goal ? { color: '#fff' } : { color: theme.text }
                                ]}>{goal}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quests Section */}
                <View style={[styles.section, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Quests</Text>
                    <Text style={[styles.infoText, { color: theme.textLight }]}>
                        Complete quests to earn rewards (Implied). Quests reset daily.
                    </Text>

                    {activeQuests.map((quest, index) => {
                        const progress = getQuestProgress(quest);
                        const isComplete = progress >= quest.target;

                        return (
                            <View key={quest.id} style={[styles.questItem, { borderBottomColor: theme.border }]}>
                                <View style={styles.questHeader}>
                                    <Text style={[styles.questTitle, { color: theme.text }]}>
                                        {quest.title} {index === 0 && <Text style={{ color: theme.primary, fontSize: 12 }}>(Compulsory)</Text>}
                                    </Text>
                                    {isComplete ? <Text>✅</Text> : <Text style={{ color: theme.textLight }}>{progress}/{quest.target}</Text>}
                                </View>
                                <Text style={[styles.questDesc, { color: theme.textLight }]}>{quest.description}</Text>

                                {/* Progress Bar for Quest */}
                                <View style={[styles.progressBarBg, { height: 6, marginTop: 8 }]}>
                                    <View style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${Math.min((progress / quest.target) * 100, 100)}%`,
                                            backgroundColor: isComplete ? theme.success || '#4CAF50' : theme.primary
                                        }
                                    ]} />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Reset Progress Button */}
                <TouchableOpacity
                    style={[styles.resetButton, { borderColor: theme.error || '#FF3B30' }]}
                    onPress={() => {
                        Alert.alert(
                            "Reset Progress",
                            "Are you sure you want to reset all XP, Rank, and Quest progress? This cannot be undone.",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Reset",
                                    style: "destructive",
                                    onPress: () => resetProgress()
                                }
                            ]
                        );
                    }}
                >
                    <Text style={[styles.resetButtonText, { color: theme.error || '#FF3B30' }]}>Reset All Progress</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rankBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    rankBadgeText: {
        fontSize: 30,
    },
    rankInfo: {
        flex: 1,
    },
    rankName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    xpText: {
        fontSize: 14,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        marginTop: 8,
        textAlign: 'right',
        fontSize: 12,
    },
    goalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    goalText: {
        fontSize: 18,
        fontWeight: '600',
    },
    goalCompleted: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    subLabel: {
        marginBottom: 8,
        fontSize: 14,
    },
    goalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    goalButtonText: {
        fontWeight: '600',
    },
    infoText: {
        marginBottom: 16,
        fontSize: 14,
        fontStyle: 'italic',
    },
    questItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    questHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    questTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    questDesc: {
        fontSize: 14,
    },
    resetButton: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
