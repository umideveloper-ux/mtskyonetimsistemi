import { 
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.config';
import { School } from '../types';

export const getSchoolsData = async (schoolId: string): Promise<School | null> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnap = await getDoc(schoolRef);
    
    if (schoolSnap.exists()) {
      return { id: schoolSnap.id, ...schoolSnap.data() } as School;
    }
    return null;
  } catch (error) {
    console.error('Error getting school data:', error);
    throw error;
  }
};

export const updateCandidates = async (schoolId: string, candidates: any) => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { candidates });
  } catch (error) {
    console.error('Error updating candidates:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const subscribeToSchool = (
  schoolId: string,
  onUpdate: (data: DocumentData) => void
) => {
  const schoolRef = doc(db, 'schools', schoolId);
  return onSnapshot(schoolRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data());
    }
  });
};
