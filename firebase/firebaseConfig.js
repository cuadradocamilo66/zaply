import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_pOY995JAUTHcIVFL2KYJJand1s6ARMg",
  authDomain: "zaply-93e61.firebaseapp.com",
  projectId: "zaply-93e61",
  storageBucket: "zaply-93e61.firebasestorage.app",
  messagingSenderId: "968945581553",
  appId: "1:968945581553:web:d777e092340a7a0ce61850",
  measurementId: "G-K2M926ETRK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Analytics solo en el navegador (evita errores en SSR)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, analytics };
