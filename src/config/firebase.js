import { initializeApp } from "firebase/app";
import {
  getAuth, // obtiene los datos de la aplicación (variable firebaseConfig)
  signInWithEmailAndPassword, // realizar login de usuario
  createUserWithEmailAndPassword, // crea usuario desde la aplicación hacia firebase
  signOut, // permite realizar cerrar sesion del usuario
} from "firebase/auth";

// parametros del proyecto creado en firebase para realizar match con proyecto de React
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // trae la configuracion del proyecto

export const login = ({ email, password }) => {
  return signInWithEmailAndPassword(auth, email, password); // pasamos credenciales email y password
  // este método devuelve una promesa
};

export const register = ({ email, password }) => {
  return createUserWithEmailAndPassword(auth, email, password);
  // este método tambien devuelve una promesa
};

export const logout = () => {
  // esto devuelve una promesa
  return signOut(auth);
};
