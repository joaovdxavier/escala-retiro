import { db } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

// Função para salvar os dados da escala no Firestore
export const salvarEscalaNoFirebase = async (uid, dados) => {
  const docRef = doc(db, "escalas", uid); // Usando o UID do usuário para o documento
  await setDoc(docRef, {
    dados,
    criadoEm: new Date().toISOString(),
  });
};

// Função para buscar os dados da escala do Firestore
export const buscarEscalaDoFirebase = async (uid) => {
  const docRef = doc(db, "escalas", uid); // Usando o UID do usuário
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data().dados : {};
};