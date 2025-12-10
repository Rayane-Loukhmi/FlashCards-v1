# Firebase Setup Instructions

This app uses **Firebase Authentication** and **Cloud Firestore** for user authentication and data storage.

## Database Used: Firebase (Firestore)

- **Authentication**: Firebase Authentication (Email/Password)
- **Database**: Cloud Firestore (NoSQL database)
- **Why Firebase?**: 
  - Easy to integrate with React Native/Expo
  - No backend code needed
  - Real-time database
  - Free tier available (generous limits)
  - Secure and scalable

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

### 4. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (give it a nickname like "FlashCards App")
5. Copy the Firebase configuration object

### 5. Update Firebase Config

1. Open `config/firebase.js` in your project
2. Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Set Up Firestore Security Rules (Important!)

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own cards
    match /cards/{cardId} {
      // Allow read if user is authenticated and owns the card
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Allow create if user is authenticated and sets their own userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Allow update/delete if user is authenticated and owns the card
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can only read/write their own study sets
    match /studySets/{setId} {
      // Allow read if user is authenticated and owns the set
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Allow create if user is authenticated and sets their own userId
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Allow update/delete if user is authenticated and owns the set
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **Publish**

### 7. Test the App

1. Run `npm start` or `expo start`
2. Open the app on your device
3. Create an account with email/password
4. Start adding flashcards!

## Data Structure

### Cards Collection

Each card document in Firestore has:
- `userId` (string): The user's Firebase UID
- `question` (string): The flashcard question
- `answer` (string): The flashcard answer
- `createdAt` (timestamp): When the card was created
- `updatedAt` (timestamp, optional): When the card was last updated

## Firebase Free Tier Limits

- **Authentication**: 50,000 MAU (Monthly Active Users)
- **Firestore**: 
  - 1 GB storage
  - 20,000 writes/day
  - 50,000 reads/day
  - 20,000 deletes/day

These limits are generous for most personal/small projects!

## Troubleshooting

### "Permission denied" errors
- Make sure Firestore security rules are set up correctly
- Ensure the user is authenticated

### "PlatformConstants could not be found"
- Make sure you've installed all dependencies: `npm install`
- Clear cache: `npx expo start --clear`

### Cards not loading
- Check Firebase console for errors
- Verify Firestore is enabled
- Check network connection

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

