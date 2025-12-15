# Quizlet Replication Plan

## 1. Visual Identity Overhaul
- **Colors**: Update `constants/colors.js` to match Quizlet's modern palette:
  - Primary: `#2E3856` (Deep Navy)
  - Secondary: `#4257B2` (Bright Blue for accents/buttons)
  - Accent: `#FFCD1F` (Golden Yellow for streaks/highlights)
  - Background: `#F6F7FB` (Light Gray/Blue tint)
- **Typography**: Ensure headings are bold and rounded sans-serif look.

## 2. Navigation Structure
- **Move to Bottom Tabs**: Quizlet uses a bottom tab bar on mobile.
  - Tabs: `Home`, `Solutions` (Library), `Create` (Center +), `Profile`.
- **Action**: Replace `NavigationSidebar.js` with `BottomTabBar.js`.
- **Update**: `App.js` to manage the tab state.

## 3. Screen Redesigns

### Home (Dashboard)
- **Header**: "Hello, User" with "Search flashcards" bar.
- **Recent Sets**: Horizontal scroll view of recently accessed sets.
- **Achievements/Streaks**: Small widget showing daily streak.

### Library (Files)
- **Layout**: Clear distinction between `Sets`, `Folders`, and `Classes`.
- **Set Cards**: Update `StudySetCard` to look cleaner (white card, soft shadow, title, term count).

### Study Set Detail (`StudyModesScreen` / New `SetDetailScreen`)
- **Header**: Large Title, Author.
- **Mode Buttons**: A grid or list of large, colorful buttons for modes:
  - `Flashcards` (Icon + Text)
  - `Learn` (Icon + Text)
  - `Test` (Icon + Text)
  - `Match` (New!)
- **Terms List**: Scrollable list of terms below the modes.

### Study Modes
- **Flashcards**:
  - refine `FlashCard.js` to take up more screen space.
  - Add "swipe" gestures (simulated with buttons if gesture lib is complex) for "Still Learning" vs "Know".
- **Match**:
  - Implement a simple matching game (grid of items, tap pairs to clear).

## 4. Implementation Steps
1.  Update Colors.
2.  Implement Bottom Navigation.
3.  Refactor Dashboard.
4.  Refactor Study Set List.
5.  Refactor Set Detail Page.
6.  Polish Study Modes.
