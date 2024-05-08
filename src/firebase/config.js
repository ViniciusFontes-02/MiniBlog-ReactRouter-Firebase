import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7gsaWd6C5uTDk8ziLEliYzao1cH3Hfv4",
  authDomain: "miniblog-a51a0.firebaseapp.com",
  projectId: "miniblog-a51a0",
  storageBucket: "miniblog-a51a0.appspot.com",
  messagingSenderId: "919698950986",
  appId: "1:919698950986:web:225a5ed36e0482153c8fb3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//inicializando banco de dados
const db = getFirestore(app);

export { db };
