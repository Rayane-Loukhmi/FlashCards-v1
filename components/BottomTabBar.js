import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
// Reuse NAV_ITEMS logic from NavigationSidebar (or define locally if we replace it)
// We will assume NAV_ITEMS are passed or imported logic remains consistent.

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NAV_ITEMS = {
    DASHBOARD: 'dashboard',
    QUESTS: 'quests',
    FILES: 'files',
    MANAGE_CARDS: 'manage',
    PROGRESS: 'progress',
};

export default function BottomTabBar({ currentScreen, onNavigate }) {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const tabs = [
        { id: NAV_ITEMS.DASHBOARD, label: 'Home', icon: '🏠' },
        { id: NAV_ITEMS.QUESTS, label: 'Quests', icon: '🎯' },
        { id: NAV_ITEMS.MANAGE_CARDS, label: 'Create', icon: '➕', isCenter: true },
        { id: NAV_ITEMS.FILES, label: 'Library', icon: '📚' },
        { id: NAV_ITEMS.PROGRESS, label: 'Profile', icon: '👤' },
    ];

    return (
        <View style={[styles.container, {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            shadowColor: theme.cardShadow,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
        }]}>
            {tabs.map((tab) => {
                const isActive = currentScreen === tab.id;
                if (tab.isCenter) {
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[
                                styles.centerButtonContainer,
                                { backgroundColor: theme.surface } // Match background to hide tab bar line behind?
                            ]}
                            onPress={() => onNavigate(tab.id)}
                        >
                            <View style={styles.centerButton}>
                                <Text style={[styles.centerButtonIcon, { color: isActive ? theme.primary : theme.textLight }]}>{tab.icon}</Text>
                            </View>
                            <Text style={[styles.tabLabel, { color: isActive ? theme.primary : theme.textLight }]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => onNavigate(tab.id)}
                    >
                        <Text style={[styles.tabIcon, { color: isActive ? theme.primary : theme.textLight }]}>
                            {tab.icon}
                        </Text>
                        <Text style={[
                            styles.tabLabel,
                            { color: isActive ? theme.primary : theme.textLight, fontWeight: isActive ? '600' : '400' }
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // height handled dynamically
        borderTopWidth: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        // paddingBottom handled dynamically
        // Shadow for depth
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 10,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 2,
    },
    tabLabel: {
        fontSize: 10,
    },
    centerButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    centerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    centerButtonIcon: {
        fontSize: 32, // Make + slightly bigger
        fontWeight: 'bold',
    },
});
