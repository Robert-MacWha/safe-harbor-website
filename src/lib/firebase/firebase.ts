// https://console.firebase.google.com/u/0/project/safe-harbor-d9e89/overview
import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { browser } from '$app/environment';

const firebaseConfig = {
    apiKey: "AIzaSyCv3QG-zp-LzECStF9GvhfOlzRi0smUxGI",
    authDomain: "safe-harbor-d9e89.firebaseapp.com",
    projectId: "safe-harbor-d9e89",
    storageBucket: "safe-harbor-d9e89.firebasestorage.app",
    messagingSenderId: "842645704117",
    appId: "1:842645704117:web:38f99c235d9d90fe44ddfc",
    measurementId: "G-JJ30MMCT1T"
};

const app = initializeApp(firebaseConfig);
let analytics: Analytics | undefined;
if (browser) {
    analytics = getAnalytics(app);
}

export { analytics };
export const db = getFirestore(app, '(default)');