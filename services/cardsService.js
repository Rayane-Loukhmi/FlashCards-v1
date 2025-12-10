import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getCards = async (userId) => {
  try {
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const cards = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    // Sort by createdAt in JavaScript to avoid needing a Firestore index
    cards.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
    return cards;
  } catch (error) {
    console.error('Error getting cards:', error);
    throw error;
  }
};

export const addCard = async (userId, question, answer) => {
  try {
    const cardsRef = collection(db, 'cards');
    const newCard = {
      userId,
      question,
      answer,
      mastered: false,
      timesStudied: 0,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(cardsRef, newCard);
    return { id: docRef.id, ...newCard };
  } catch (error) {
    console.error('Error adding card:', error);
    throw error;
  }
};

export const updateCard = async (cardId, question, answer) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      question,
      answer,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const markCardAsDone = async (cardId, currentTimesStudied = 0) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      mastered: true,
      lastStudied: Timestamp.now(),
      timesStudied: currentTimesStudied + 1,
    });
  } catch (error) {
    console.error('Error marking card as done:', error);
    throw error;
  }
};

export const markCardAsNotDone = async (cardId) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      mastered: false,
    });
  } catch (error) {
    console.error('Error marking card as not done:', error);
    throw error;
  }
};

export const deleteCard = async (cardId) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

