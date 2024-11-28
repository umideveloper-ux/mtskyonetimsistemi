import { 
  ref,
  get,
  set,
  update,
  onValue,
  DatabaseReference,
  DataSnapshot
} from 'firebase/database';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase.config';
import { School } from '../types';

// Enable offline persistence
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
setPersistence(auth, browserLocalPersistence).catch(console.error);

export const getSchoolsData = async (schoolId: string): Promise<School | null> => {
  try {
    const schoolRef = ref(db, `schools/${schoolId}`);
    const snapshot = await get(schoolRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.key, ...snapshot.val() } as School;
    }
    return null;
  } catch (error) {
    console.error('Error getting school data:', error);
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('İnternet bağlantınızı kontrol edin ve sayfayı yenileyin.');
    }
    throw error;
  }
};

export const updateCandidates = async (schoolId: string, candidates: any) => {
  try {
    const schoolRef = ref(db, `schools/${schoolId}`);
    await update(schoolRef, { candidates });
  } catch (error) {
    console.error('Error updating candidates:', error);
    if (error.code === 'NETWORK_ERROR') {
      throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    }
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
  onUpdate: (data: any) => void
) => {
  const schoolRef = ref(db, `schools/${schoolId}`);
  return onValue(schoolRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.val());
    }
  }, (error) => {
    console.error('Error subscribing to school:', error);
  });
};
