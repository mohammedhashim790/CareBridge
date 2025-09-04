import {Navigate} from "react-router-dom";
import {getCurrentUser} from "../../../../shared-modules/src/user_auth/user_auth.ts";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const user = getCurrentUser();
    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};
