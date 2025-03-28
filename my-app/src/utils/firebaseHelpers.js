// filepath: /Users/vishal_lap/Documents/Semester 2/yt-thumbnail-brain/my-app/src/utils/firebaseHelpers.js
import { db } from "../firebase/db";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addDataToCollection = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getDataFromCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    throw error;
  }
};