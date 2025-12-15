# FlashCards - React Native App

A beautiful and intuitive flashcard application built with React Native and Expo with user authentication and cloud storage.

## Features

- 🔐 User authentication (Sign up / Sign in)
- 📚 Create, edit, and delete flashcards
- ☁️ Cloud storage with Firebase Firestore (cards saved per user)
- 🔄 Flip cards with smooth animations
- 📖 Study mode with navigation between cards
- 🎨 Modern and clean UI
- 📱 Works on iOS and Android

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- Firebase account (free)

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Set up Firebase** (Required):
   - See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Update `config/firebase.js` with your Firebase config

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS) or Camera app (Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## Project Structure

```
FlashCards/
├── App.js                 # Main app component with auth flow
├── components/
│   ├── FlashCard.js      # Individual flashcard with flip animation
│   └── CardList.js       # List view with add/edit/delete functionality
├── screens/
│   └── LoginScreen.js    # Login and signup screen
├── contexts/
│   └── AuthContext.js    # Authentication context provider
├── services/
│   └── cardsService.js   # Firestore service for cards CRUD operations
├── config/
│   └── firebase.js       # Firebase configuration
├── package.json
├── babel.config.js
├── README.md
└── FIREBASE_SETUP.md     # Firebase setup instructions
```

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with email and password
2. **Add Cards**: Tap the + button to add new flashcards (saved to cloud)
3. **Edit Cards**: Tap "Edit" on any card to modify it
4. **Delete Cards**: Tap "Delete" on any card to remove it
5. **Study**: Tap "Start Studying" to enter study mode
6. **Flip Cards**: Tap on a card to flip it and see the answer
7. **Navigate**: Use Previous/Next buttons to move between cards
8. **Sign Out**: Tap "Sign Out" to logout (your cards are saved in the cloud)

## Technologies Used

- React Native
- Expo
- Firebase Authentication (user login/signup)
- Cloud Firestore (database - stores cards per user)
- React Native Reanimated (for smooth animations)
- React Native Gesture Handler

## Database

This app uses **Firebase Firestore** for data storage:
- Each user's flashcards are stored separately
- Data syncs across devices when logged in
- No backend code needed - Firebase handles everything
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup instructions

## Component Usage Guide

### FlashCard Component
**Location:** `components/FlashCard.js`

Displays a single flashcard with flip animation functionality.

**Props:**
- `card` (object): Flashcard data with `question` and `answer` properties

**Features:**
- Smooth 3D flip animation on tap
- Displays question on front, answer on back
- Uses `Animated` API for 60fps transitions
- Responsive styling with theme support

**Usage Example:**
```javascript
import FlashCard from './components/FlashCard';

<FlashCard card={{ question: 'What is React?', answer: 'A JS library' }} />
```

### CardList Component
**Location:** `components/CardList.js`

Manages the display and CRUD operations for a collection of flashcards.

**Props:**
- `cards` (array): Array of card objects to display
- `onDelete` (function): Called when card is deleted - receives card id
- `onEdit` (function): Called when card is edited - receives updated card
- `onAdd` (function): Called when new card is added - receives new card data
- `onMarkAsDone` (function): Called when card is marked as completed

**Features:**
- Add new cards via modal dialog
- Edit existing cards inline
- Delete cards with confirmation
- Responsive grid/list layout (mobile/tablet/desktop)
- Input validation for question/answer fields
- Smooth animations for card actions

**Usage Example:**
```javascript
<CardList 
  cards={cards}
  onAdd={(newCard) => addCardToDatabase(newCard)}
  onEdit={(updatedCard) => updateCardInDatabase(updatedCard)}
  onDelete={(cardId) => deleteCardFromDatabase(cardId)}
  onMarkAsDone={(cardId) => markProgress(cardId)}
/>
```

### NavigationSidebar Component
**Location:** `components/NavigationSidebar.js`

Main navigation menu for switching between different app screens and theme control.

**Props:**
- `currentScreen` (string): Current active screen identifier
- `onNavigate` (function): Called when navigation item is tapped - receives screen id

**Navigation Items:**
- Dashboard - View study overview
- Manage Cards - Create/edit/delete cards
- Study Sets - Browse available study sets
- Progress - Track learning progress

**Features:**
- Light/Dark theme toggle switch
- Active screen highlighting
- Icon-based navigation items
- Responsive layout (collapsible on mobile)
- Theme context integration

**Usage Example:**
```javascript
<NavigationSidebar 
  currentScreen={activeScreen}
  onNavigate={(screenId) => setActiveScreen(screenId)}
/>
```

### StudySetCard Component
**Location:** `components/StudySetCard.js`

Displays a study set card with metadata and action buttons.

**Props:**
- `set` (object): Study set data including `name`, `description`, `cardCount`, `lastStudied`
- `onPress` (function): Called when card is tapped
- `onDelete` (function): Called to delete the set
- `onEdit` (function): Called to edit the set
- `onStudy` (function): Called to start studying the set

**Features:**
- Shows set name, description, and card count
- Displays last studied date
- Responsive card layout with shadow effects
- Quick action buttons (Study, Edit, Delete)
- Theme-aware styling

**Usage Example:**
```javascript
<StudySetCard 
  set={{ name: 'Biology 101', description: 'Chapter 1', cardCount: 25, lastStudied: new Date() }}
  onPress={() => viewSetDetails()}
  onStudy={() => startStudySession()}
  onEdit={() => editSet()}
  onDelete={() => deleteSet()}
/>
```

### Study Mode Components
**Location:** `components/studyModes/`

#### LearnMode.js
Interactive learning mode with guided card progression and explanations.

**Features:**
- Sequential card progression
- Review mode for difficult cards
- Visual progress indicator
- Take notes alongside cards

#### TestMode.js
Quiz mode to test knowledge with scoring.

**Features:**
- Multiple choice or fill-in-the-blank questions
- Score tracking
- Performance analytics
- Answer review

#### WriteMode.js
Writing practice mode for language learning.

**Features:**
- Write answers in text input
- Auto-check functionality
- Hint system
- Correction feedback

## Customization

Feel free to modify:
- Card styles in `components/FlashCard.js`
- Navigation items in `components/NavigationSidebar.js`
- Add/Edit modal styling in `components/CardList.js`
- Study set card appearance in `components/StudySetCard.js`
- Theme colors in `constants/colors.js`
- List styles in `components/CardList.js`
- Sample data in `App.js`
- Colors and themes throughout the app

## License

MIT

