import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Switch } from 'react-native';
// import { colors } from '../constants/colors'; // Legacy import, remove if possible or keep for reference
import { useTheme } from '../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const NAV_ITEMS = {
  DASHBOARD: 'dashboard',
  MANAGE_CARDS: 'manage',
  FILES: 'files',
  PROGRESS: 'progress',
};

export default function NavigationSidebar({ currentScreen, onNavigate }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: NAV_ITEMS.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: NAV_ITEMS.MANAGE_CARDS, label: 'Manage Cards', icon: '📝' },
    { id: NAV_ITEMS.FILES, label: 'Study Sets', icon: '📁' },
    { id: NAV_ITEMS.PROGRESS, label: 'Progress', icon: '📈' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderRightColor: theme.border, shadowColor: theme.cardShadow }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.logo, { color: theme.primary }]}>FlashCards</Text>
      </View>
      <View style={styles.navItems}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              currentScreen === item.id && { backgroundColor: theme.primary + '15' },
            ]}
            onPress={() => onNavigate(item.id)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                { color: theme.text },
                currentScreen === item.id && { color: theme.primary, fontWeight: '600' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.themeToggle}>
          <Text style={[styles.themeLabel, { color: theme.text }]}>
            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: theme.primaryLight }}
            thumbColor={isDark ? theme.primary : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );
}

export { NAV_ITEMS };

const styles = StyleSheet.create({
  container: {
    width: isMobile ? 200 : 240,
    // backgroundColor: handled dynamically
    borderRightWidth: 1,
    // borderRightColor: handled dynamically
    height: '100%',
    // shadowColor: handled dynamically
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between',
  },
  header: {
    padding: isMobile ? 16 : 24,
    borderBottomWidth: 1,
    // borderBottomColor: handled dynamically
  },
  logo: {
    fontSize: isMobile ? 20 : 24,
    fontWeight: 'bold',
    // color: handled dynamically
  },
  navItems: {
    paddingTop: 12,
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isMobile ? 12 : 16,
    paddingHorizontal: isMobile ? 16 : 24,
    marginHorizontal: isMobile ? 8 : 12,
    marginVertical: 2,
    borderRadius: 12,
  },
  // navItemActive handled inline
  navIcon: {
    fontSize: isMobile ? 18 : 20,
    marginRight: isMobile ? 10 : 12,
  },
  navLabel: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '500',
    // color: handled dynamically
  },
  // navLabelActive handled inline
  footer: {
    padding: 16,
    borderTopWidth: 1,
    // borderTopColor: handled dynamically
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

