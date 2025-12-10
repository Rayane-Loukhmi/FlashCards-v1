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

## Customization

Feel free to modify:
- Card styles in `components/FlashCard.js`
- List styles in `components/CardList.js`
- Sample data in `App.js`
- Colors and themes throughout the app

## License

MIT

