import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const XpContext = createContext();

export function useXp() {
    return useContext(XpContext);
}

export const RANKS = {
    IRON: { name: 'Iron', minXp: 0, nextXp: 20, color: '#545454', badge: '🛡️' }, // Changed minXp to 0 for base
    BRONZE: { name: 'Bronze', minXp: 20, nextXp: 40, color: '#cd7f32', badge: '🥉' },
    SILVER: { name: 'Silver', minXp: 40, nextXp: 60, color: '#C0C0C0', badge: '🥈' }, // Added Silver as intermediate or adjust map
    GOLD: { name: 'Gold', minXp: 60, nextXp: 80, color: '#FFD700', badge: '🥇' },
    DIAMOND: { name: 'Diamond', minXp: 80, nextXp: 10000, color: '#b9f2ff', badge: '💎' },
};

// Adjusting to user Prompt requirements specifically:
// Iron >= 20, Bronze >= 40? No, Prompt says:
// Iron >= 20 XP? Wait, what is below 20? Unranked?
// Prompt:
// Iron >= 20 XP
// Bronze >= 40 XP
// Gold >= 60 XP
// Diamond >= 80 XP
// So 0-19 is "Unranked" or just "Beginner". Let's stick to the prompt.
// Actually, let's treat < 20 as "Iron" base or "Unranked".
// Prompt table says: Iron >= 20. This implies < 20 is not Iron.
// Let's call < 20 "Novice".

const RANK_TIERS = [
    { id: 'NOVICE', name: 'Novice', minWeeklyXp: 0, color: '#888888' },
    { id: 'IRON', name: 'Iron', minWeeklyXp: 20, color: '#434343' },
    { id: 'BRONZE', name: 'Bronze', minWeeklyXp: 40, color: '#cd7f32' },
    { id: 'GOLD', name: 'Gold', minWeeklyXp: 60, color: '#FFD700' },
    { id: 'DIAMOND', name: 'Diamond', minWeeklyXp: 80, color: '#b9f2ff' },
];

export const DAILY_GOALS = [10, 20, 30, 50];

export function XpProvider({ children }) {
    const { user } = useAuth();

    // State
    const [weeklyXp, setWeeklyXp] = useState(0);
    const [totalXp, setTotalXp] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(10);
    const [dailyProgress, setDailyProgress] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lastActiveDate, setLastActiveDate] = useState(null);

    // Quests State (stored as object with quest IDs)
    // Structure: { [date_string]: { [questId]: { progress: 0, completed: false } } }
    const [questsProgress, setQuestsProgress] = useState({});

    const [currentRank, setCurrentRank] = useState(RANK_TIERS[0]);

    // Load data on mount/user change
    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    // Check for rank updates when weeklyXp changes
    useEffect(() => {
        updateRank();
    }, [weeklyXp]);

    const loadUserData = async () => {
        try {
            const storedData = await AsyncStorage.getItem(`xp_data_${user.uid}`);
            if (storedData) {
                const data = JSON.parse(storedData);

                // Check for Weekly Reset (Monday 00:00 UTC)
                const lastReset = data.lastReset ? new Date(data.lastReset) : new Date(0);
                const now = new Date();

                // Calculate the last Monday 00:00 UTC
                const currentMonday = getMostRecentMonday(now);

                if (lastReset < currentMonday) {
                    // It's a new week! Reset Weekly XP
                    setWeeklyXp(0);
                    // Preserve Rank? Prompt says "Ranking system based on total accumulated XP since the last weekly reset".
                    // This implies Rank resets too, or is calculated dynamically from Weekly XP.
                    // If Rank depends purely on Weekly XP, then Rank resets to Novice.
                    // We will reset Weekly XP, so Rank will naturally update to Novice.
                    // Save new reset time
                    data.lastReset = now.toISOString();
                } else {
                    setWeeklyXp(data.weeklyXp || 0);
                }

                // Check for Daily Reset
                const lastDaily = data.lastDailyReset ? new Date(data.lastDailyReset) : new Date(0);
                if (!isSameDay(lastDaily, now)) {
                    setDailyProgress(0);
                    data.lastDailyReset = now.toISOString();
                    // Check streak logic here if needed (did they miss yesterday?)
                    // Simple streak logic: if lastActiveDate was yesterday, keep streak. If older, reset.
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (data.lastActiveDate && isSameDay(new Date(data.lastActiveDate), yesterday)) {
                        // Streak continues
                    } else if (data.lastActiveDate && isSameDay(new Date(data.lastActiveDate), now)) {
                        // Already active today
                    } else {
                        // Streak broken (unless it's the very first day)
                        if (data.lastActiveDate) setStreak(0);
                    }
                } else {
                    setDailyProgress(data.dailyProgress || 0);
                }

                setTotalXp(data.totalXp || 0);
                setDailyGoal(data.dailyGoal || 10);
                setStreak(data.streak || 0);
                setLastActiveDate(data.lastActiveDate || null);
                setQuestsProgress(data.questsProgress || {});
            }
        } catch (error) {
            console.error('Failed to load XP data', error);
        }
    };

    const saveData = async (newData) => {
        if (!user) return;
        try {
            const currentData = await AsyncStorage.getItem(`xp_data_${user.uid}`);
            const parsed = currentData ? JSON.parse(currentData) : {};

            const merged = {
                ...parsed,
                weeklyXp,
                totalXp,
                dailyGoal,
                dailyProgress,
                streak,
                lastActiveDate,
                questsProgress,
                ...newData
            };

            await AsyncStorage.setItem(`xp_data_${user.uid}`, JSON.stringify(merged));
        } catch (error) {
            console.error('Failed to save XP data', error);
        }
    };

    const updateRank = () => {
        let newRank = RANK_TIERS[0];
        for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
            if (weeklyXp >= RANK_TIERS[i].minWeeklyXp) {
                newRank = RANK_TIERS[i];
                break;
            }
        }
        setCurrentRank(newRank);
    };

    const addXp = (amount) => {
        const now = new Date();
        setWeeklyXp(prev => {
            const next = prev + amount;
            saveData({ weeklyXp: next, lastActiveDate: now.toISOString() });
            return next;
        });
        setTotalXp(prev => prev + amount);

        setDailyProgress(prev => {
            const next = prev + amount;
            // Check Daily Goal Completion
            if (prev < dailyGoal && next >= dailyGoal) {
                // Goal Reached!
                // Increment streak if not already done for today?
                // Let's rely on a separate streak check or just do it here.
                // If we haven't reached goal today yet (implied by prev < dailyGoal)
                setStreak(s => {
                    const newStreak = s + 1;
                    saveData({ streak: newStreak });
                    return newStreak;
                });
            }
            saveData({ dailyProgress: next });
            return next;
        });

        setLastActiveDate(now.toISOString());
    };

    const updateQuestProgress = (questId, value = 1, operation = 'ADD') => {
        const todayKey = new Date().toISOString().split('T')[0];
        setQuestsProgress(prev => {
            const today = prev[todayKey] || {};
            const current = today[questId] || 0;
            let next = current;

            if (operation === 'ADD') next += value;
            if (operation === 'SET') next = value;
            if (operation === 'MAX') next = Math.max(current, value);

            // Persist if changed
            if (next !== current) {
                const newToday = { ...today, [questId]: next };
                const newState = { ...prev, [todayKey]: newToday };
                saveData({ questsProgress: newState });
                return newState;
            }
            return prev;
        });
    };

    // Helper to determine quest Status
    const getQuestStatus = (questDef) => {
        if (!questDef) return { progress: 0, completed: false, target: 1 };

        const todayKey = new Date().toISOString().split('T')[0];
        const dayData = questsProgress[todayKey] || {};

        // Map quest definition to stored data keys
        // This requires a mapping logic. 
        // For now, I'll export a helper in the UI to resolve this or do it here.
        return { progress: 0, completed: false };
    };

    // Utilities
    function getMostRecentMonday(date) {
        const day = date.getUTCDay();
        const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(date);
        monday.setUTCDate(diff);
        monday.setUTCHours(0, 0, 0, 0);
        return monday;
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    const resetProgress = async () => {
        setWeeklyXp(0);
        setTotalXp(0);
        setDailyProgress(0);
        setStreak(0);
        setQuestsProgress({});
        setCurrentRank(RANK_TIERS[0]);
        // Reset stored data
        await saveData({
            weeklyXp: 0,
            totalXp: 0,
            dailyProgress: 0,
            streak: 0,
            questsProgress: {},
            lastActiveDate: null,
            lastReset: new Date().toISOString() // technically a new start
        });
    };

    return (
        <XpContext.Provider value={{
            weeklyXp,
            totalXp,
            dailyGoal,
            setDailyGoal,
            dailyProgress,
            streak,
            currentRank,
            addXp,
            updateQuestProgress,
            questsProgress,
            RANK_TIERS,
            resetProgress
        }}>
            {children}
        </XpContext.Provider>
    );
}
