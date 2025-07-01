import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Já importado do seu firebase.js

// Função para login
export const login = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    throw new Error("Erro no login: " + error.message);
  }
};

// Função de logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Erro no logout: " + error.message);
  }
};