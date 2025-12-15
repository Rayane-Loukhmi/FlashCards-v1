# Gamification System Implementation Plan

## 1. Technical Summary
The Gamification System is built around a centralized `XpContext` that manages user progression, persistence, and event handling.

### Data Structures
- **User Data (`AsyncStorage` key: `xp_data_{uid}`)**:
  ```json
  {
    "weeklyXp": 120,          // Resets weekly
    "totalXp": 3500,          // Lifetime XP
    "dailyGoal": 20,          // User preference (10, 20, 30, 50)
    "dailyProgress": 15,      // Resets daily
    "streak": 5,              // Consecutive days meeting goal
    "lastActiveDate": "2023-10-27T...",
    "questsProgress": {
      "2023-10-27": {
        "IRON_1": 5,          // Progress for specific quest IDs
        "BRONZE_2": 10
      }
    }
  }
  ```

### Key Components
- **`XpContext.js`**: 
  - Handles `addXp(amount)`.
  - Manages Weekly Reset (Monday 00:00 UTC).
  - Manages Daily Reset (Local Midnight).
  - Exposes `updateQuestProgress(id, value, operation)` for event-driven updates.
- **`QuestsScreen.js`**:
  - Visualizes Rank (Iron, Bronze, Gold, Diamond).
  - Lists Daily Quests based on current Rank.
  - Allows Daily Goal modification.
- **Integration Points**:
  - `WriteMode.js`: Updates XP and Quest 'BRONZE_2' (Type Answer).
  - `StudyModesScreen.js`: Updates XP for Flashcard "Known" state.

## 2. README Draft

# 🎮 FlashCards Gamification & Pro Features

Welcome to the new Gamification update! Learning is now more rewarding with XP, Ranks, and Daily Quests.

## 🏆 Ranking System
Earn **XP** by studying cards. Every week (Monday), the leaderboards reset. Can you reach Diamond?

| Rank | Requirement (Weekly) | Badge |
| :--- | :--- | :--- |
| **Iron** | 20 XP | 🛡️ |
| **Bronze** | 40 XP | 🥉 |
| **Gold** | 60 XP | 🥇 |
| **Diamond** | 80 XP | 💎 |

## 📅 Daily Goals & Streak
Set your pace! Choose a daily goal of **10, 20, 30, or 50 XP**.
- **Streak Bonus**: Hit your daily goal consistently to build your streak and earn respect (and soon, multipliers!).

## ⚔️ Daily Quests
Check the **Quests** tab to see your missions. Quests evolve as you rank up!
- **Iron Quests**: Focus on consistency and reviewing old sets.
- **Bronze Quests**: Challenge yourself with "Type Answer" mode and perfect runs.
- **Gold/Diamond**: For the true power users—perfect sets and shuffle mastery.

## 🚀 How to Earn XP
1. **Flashcards**: Mark a card as "✅ Known" in Flashcard mode (+1 XP).
2. **Write Mode**: Type the correct answer (+1 XP).
3. **Quests**: Complete daily objectives for satisfaction (and future rewards!).

*Happy Studying!*
