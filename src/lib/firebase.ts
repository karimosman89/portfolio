import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Check if Firebase config is actually provisioned
export const isFirebaseConfigured = !!(firebaseConfig && firebaseConfig.apiKey);

let app;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // getFirestore can take databaseId
    const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
    db = getFirestore(app, dbId);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error("Failed to initialize Firebase SDK:", err);
  }
}

export { auth, db, googleProvider };

export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error("Firebase is not fully configured yet. Please complete the setup via the AI Studio console.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logout() {
  if (auth) {
    await signOut(auth);
  }
}

// Error handling helper for Firestore operations as required by the Firebase Skill
export interface FirestoreErrorInfo {
  code: string;
  message: string;
  operation: string;
}

export function handleFirestoreError(error: any, operation: string): never {
  console.error(`Firestore error during ${operation}:`, error);
  const info: FirestoreErrorInfo = {
    code: error.code || 'unknown',
    message: error.message || 'An unknown error occurred',
    operation
  };
  throw new Error(JSON.stringify(info));
}
