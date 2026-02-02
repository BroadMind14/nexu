
import { initializeApp, FirebaseApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

// Safety check for process.env to prevent ReferenceError in browser
const getEnv = (key: string) => {
  try {
    return (process?.env as any)?.[key];
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID'),
  measurementId: getEnv('FIREBASE_MEASUREMENT_ID')
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Only initialize if we have at least an API Key and Project ID
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase config missing. Usage tracking is disabled, but app will continue to work.");
}

/**
 * Tracks a search event in Firestore.
 * If Firebase is not configured, it fails gracefully.
 */
export const trackUsage = async (query: string, mode: string, leadCount: number) => {
  if (!db) return;

  try {
    await addDoc(collection(db, "usage_logs"), {
      query,
      mode,
      leadCount,
      timestamp: serverTimestamp(),
      platform: 'web',
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error("Firebase Logging Error:", error);
  }
};
