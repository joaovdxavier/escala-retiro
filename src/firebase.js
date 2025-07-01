import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig"; // o config que o Firebase te deu

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();