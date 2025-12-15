// Quizlet-inspired color scheme
// Quizlet-inspired color scheme available in Light and Dark modes

const sharedColors = {
  primary: '#4255FF', // Quizlet Bright Blue
  primaryDark: '#2E3856', // Quizlet Navy
  primaryLight: '#6E7CFF',
  secondary: '#FFCD1F', // Golden Yellow
  success: '#23B26D', // Quizlet Green
  error: '#FF725B', // Quizlet Red
  warning: '#FFCD1F',
};

export const lightTheme = {
  ...sharedColors,
  background: '#F6F7FB', // Light Grey-Blue
  surface: '#FFFFFF',
  text: '#2E3856', // Navy text
  textLight: '#586380', // lighter navy-grey
  border: '#E3E5E8',
  cardShadow: 'rgba(46, 56, 86, 0.08)',
  statusBarStyle: 'dark',
};

export const darkTheme = {
  ...sharedColors,
  background: '#0A092D', // Deep Night Blue
  surface: '#2E3856', // Navy surface
  text: '#FFFFFF',
  textLight: '#939BB4',
  border: '#455073',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  statusBarStyle: 'light',
};

// Deprecated: usage should be replaced by useTheme hook
export const colors = lightTheme;


