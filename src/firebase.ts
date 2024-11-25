import { initializeApp } from 'firebase/app';
import { getDatabase, set, push, get, remove, update, ref, onValue, off } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { School, Message } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);

export { ref, onValue } from 'firebase/database';

// Tüm okulların verilerini getir
export const getSchoolsData = async (): Promise<School[]> => {
  if (!auth.currentUser) return [];
  
  const schoolsRef = ref(db, 'schools');
  try {
    const snapshot = await get(schoolsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([id, school]: [string, any]) => ({
        id,
        name: school.name,
        email: school.email,
        candidates: school.candidates || {}
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching schools data:', error);
    throw error;
  }
};

// Tek bir okulun verilerini getir
export const getSchoolData = async (email: string): Promise<School | null> => {
  if (!auth.currentUser) return null;
  
  const schoolsRef = ref(db, 'schools');
  try {
    const snapshot = await get(schoolsRef);
    if (snapshot.exists()) {
      const schools = snapshot.val();
      const schoolEntry = Object.entries(schools).find(([_, school]: [string, any]) => 
        school.email === email
      );
      
      if (schoolEntry) {
        const [id, schoolData]: [string, any] = schoolEntry;
        return {
          id,
          name: schoolData.name,
          email: schoolData.email,
          candidates: schoolData.candidates || {}
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching school data:', error);
    throw error;
  }
};

// Eğitmenleri getir (sadece okula ait)
export const getSchoolInstructors = async (schoolId: string) => {
  if (!auth.currentUser) return [];
  
  const instructorsRef = ref(db, `schools/${schoolId}/instructors`);
  try {
    const snapshot = await get(instructorsRef);
    if (snapshot.exists()) {
      const instructors = snapshot.val();
      return Object.entries(instructors).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// Adayları getir (sadece okula ait)
export const getSchoolCandidates = async (schoolId: string) => {
  if (!auth.currentUser) return [];
  
  const candidatesRef = ref(db, `schools/${schoolId}/candidates`);
  try {
    const snapshot = await get(candidatesRef);
    if (snapshot.exists()) {
      const candidates = snapshot.val();
      return Object.entries(candidates).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Eğitmen ekle
export const addInstructor = async (schoolId: string, instructorData: any) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const instructorsRef = ref(db, `schools/${schoolId}/instructors/${Date.now()}`);
  try {
    await set(instructorsRef, {
      ...instructorData,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Error adding instructor:', error);
    throw error;
  }
};

// Aday ekle
export const addCandidate = async (schoolId: string, candidateData: any) => {
  if (!auth.currentUser) throw new Error('Not authenticated');
  
  const candidatesRef = ref(db, `schools/${schoolId}/candidates/${Date.now()}`);
  try {
    await set(candidatesRef, {
      ...candidateData,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const updateCandidates = async (schoolId: string, updatedCandidates: School['candidates']) => {
  try {
    const schoolRef = ref(db, `schools/${schoolId}`);
    const updates = {
      candidates: updatedCandidates
    };
    await update(schoolRef, updates);
  } catch (error) {
    console.error('Error updating candidates:', error);
    throw error;
  }
};

export const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
  const messagesRef = ref(db, 'messages');
  return push(messagesRef, {
    ...message,
    timestamp: Date.now()
  }).catch(error => {
    console.error('Error sending message:', error);
    throw error;
  });
};

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const updateLicenseFees = async (newFees: { [key: string]: number }) => {
  const licenseFeesRef = ref(db, 'licenseFees');
  try {
    await update(licenseFeesRef, newFees);
  } catch (error) {
    console.error('Error updating license fees:', error);
    throw error;
  }
};

export const resetAllCandidates = async () => {
  const schoolsRef = ref(db, 'schools');
  try {
    const snapshot = await get(schoolsRef);
    if (snapshot.exists()) {
      const updates: { [key: string]: any } = {};
      snapshot.forEach((childSnapshot) => {
        const schoolId = childSnapshot.key;
        updates[`${schoolId}/candidates`] = {
          B: 0,
          A1: 0,
          A2: 0,
          C: 0,
          D: 0,
          FARK_A1: 0,
          FARK_A2: 0,
          BAKANLIK_A1: 0,
        };
      });
      await update(schoolsRef, updates);
    }
  } catch (error) {
    console.error('Error resetting all candidates:', error);
    throw error;
  }
};