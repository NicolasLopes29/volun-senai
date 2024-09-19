// Importando o SDK do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Suas credenciais do Firebase (Firebase Config)
const firebaseConfig = {
  apiKey: "AIzaSyDqzE1nUwoE7BTRcoLetqnr-1JhRXyDAPg",
  authDomain: "volun-api.firebaseapp.com",
  projectId: "volun-api",
  storageBucket: "volun-api.appspot.com",
  messagingSenderId: "276715044615",
  appId: "1:276715044615:web:d78b93fecef21125124fa2",
  measurementId: "G-61090CTK4V"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando serviços do Firebase
const auth = getAuth(app); // Para autenticação
const storage = getStorage(app);  // Inicialize o Firebase Storage
const firestore = getFirestore(app);

// Exportando os serviços para serem usados no restante do app
export { app, auth, firestore ,storage };
