import "./App.css";
// Import the functions you need from the SDKs you need
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getFirebaseApp, setFirebaseAppsWithConfig } from "./configs";
import Budgets from "./pages/Budgets/Budgets";
import Card from "./pages/Card/Card";
import CardSummary from "./pages/CardsSummary/CardSummary";
import CardsSummaryTimeline from "./pages/CardsSummaryTimeline/CardsSummaryTimeline";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import EditCard from "./pages/EditCard/EditCard";
import OldCard from "./pages/OldCard/OldCard";

function App() {
    useEffect(() => {
        const app = getFirebaseApp();

        if (!app) {
            setFirebaseAppsWithConfig({
                apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
                projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                appId: import.meta.env.VITE_FIREBASE_APP_ID,
                measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
            });
        }
    }, [])

    return (
        <BrowserRouter>
            <Routes >
                <Route path="/" element={<Budgets />} />
                <Route path="/cards/:cardId/history/:oldCardIndex" element={<ProtectedRoute><OldCard /></ProtectedRoute>} />
                <Route path="/cards/:cardId" element={<ProtectedRoute><Card /></ProtectedRoute>} />
                <Route path="/cards/:cardId/edit" element={<ProtectedRoute><EditCard /></ProtectedRoute>} />
                <Route path="/cards-summary" element={<ProtectedRoute><CardSummary /></ProtectedRoute>} />
                <Route path="/cards-summary-timeline" element={<ProtectedRoute><CardsSummaryTimeline /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
