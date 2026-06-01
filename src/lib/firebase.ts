import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, updateProfile, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const loginWithNickname = async (nickname: string) => {
  try {
    const fakeUid = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userObj = { uid: fakeUid, displayName: nickname };
    
    // Create user profile in Firestore directly
    const userRef = doc(db, 'users', fakeUid);
    await setDoc(userRef, {
      displayName: nickname,
      email: '',
      photoURL: '',
      createdAt: Date.now()
    }, { merge: true });
    
    localStorage.setItem('party_app_user', JSON.stringify(userObj));
    // Dispatch a custom event to notify useAuth hook
    window.dispatchEvent(new Event('auth_state_changed'));
    return userObj;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('party_app_user');
    window.dispatchEvent(new Event('auth_state_changed'));
  } catch (error) {
    console.error("Logout failed", error);
  }
};
