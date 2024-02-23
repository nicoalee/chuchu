// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";

let firebaseApp: FirebaseApp | undefined;
let budgetId: string | undefined;

const setFirebaseAppsWithConfig = (config: FirebaseOptions) => {
    const firebaseConfig: FirebaseOptions = { ...config }

    const app = initializeApp(firebaseConfig);
    firebaseApp = app;
}

const getFirebaseApp = () => {
    return firebaseApp;
}

const setBudgetId = (aBudgetId: string) => {
    budgetId = aBudgetId;
}

export {
    firebaseApp,
    budgetId,
    setFirebaseAppsWithConfig,
    getFirebaseApp,
    setBudgetId,
}