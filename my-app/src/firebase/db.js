import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase environment variables loaded:", {
  apiKeyExists: !!process.env.REACT_APP_FIREBASE_API_KEY,
  projectIdExists: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
});
export { db };
