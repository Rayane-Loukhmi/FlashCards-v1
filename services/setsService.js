import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getStudySets = async (userId) => {
  try {
    const setsRef = collection(db, 'studySets');
    const q = query(setsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const sets = [];
    querySnapshot.forEach((doc) => {
      sets.push({ id: doc.id, ...doc.data() });
    });
    return sets;
  } catch (error) {
    console.error('Error getting study sets:', error);
    throw error;
  }
};

export const createStudySet = async (userId, setData) => {
  try {
    const setsRef = collection(db, 'studySets');
    const newSet = {
      userId,
      name: setData.name,
      description: setData.description || '',
      cardIds: setData.cardIds || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(setsRef, newSet);
    return { id: docRef.id, ...newSet };
  } catch (error) {
    console.error('Error creating study set:', error);
    throw error;
  }
};

export const updateStudySet = async (setId, setData) => {
  try {
    const setRef = doc(db, 'studySets', setId);
    await updateDoc(setRef, {
      name: setData.name,
      description: setData.description || '',
      cardIds: setData.cardIds || [],
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating study set:', error);
    throw error;
  }
};

export const deleteStudySet = async (setId) => {
  try {
    const setRef = doc(db, 'studySets', setId);
    await deleteDoc(setRef);
  } catch (error) {
    console.error('Error deleting study set:', error);
    throw error;
  }
};

