import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;
const isMobile = screenWidth < 768;

const NAV_ITEMS = {
  DASHBOARD: 'dashboard',
  MANAGE_CARDS: 'manage',
  FILES: 'files',
  PROGRESS: 'progress',
};

export default function NavigationSidebar({ currentScreen, onNavigate }) {
  const navItems = [
    { id: NAV_ITEMS.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: NAV_ITEMS.MANAGE_CARDS, label: 'Manage Cards', icon: '📝' },
    { id: NAV_ITEMS.FILES, label: 'Study Sets', icon: '📁' },
    { id: NAV_ITEMS.PROGRESS, label: 'Progress', icon: '📈' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>FlashCards</Text>
      </View>
      <View style={styles.navItems}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              currentScreen === item.id && styles.navItemActive,
            ]}
            onPress={() => onNavigate(item.id)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                currentScreen === item.id && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export { NAV_ITEMS };

const styles = StyleSheet.create({
  container: {
    width: isMobile ? 200 : 240,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: '100%',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    padding: isMobile ? 16 : 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: isMobile ? 20 : 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  navItems: {
    paddingTop: 12,
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
  navItemActive: {
    backgroundColor: colors.primary + '15',
  },
  navIcon: {
    fontSize: isMobile ? 18 : 20,
    marginRight: isMobile ? 10 : 12,
  },
  navLabel: {
    fontSize: isMobile ? 14 : 16,
    fontWeight: '500',
    color: colors.text,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});

