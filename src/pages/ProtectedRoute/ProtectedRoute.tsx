import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";

function ProtectedRoute({ children }: PropsWithChildren) {
    const hasApp = getFirebaseApp();
    const hasbudgetSet = budgetId;

    if (!hasApp || !hasbudgetSet) {
        return (
            <Navigate to="/" replace={true} />
        )
    }

    return children;
}

export default ProtectedRoute;