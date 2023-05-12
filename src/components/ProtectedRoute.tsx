import React from "react";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = (props: { children: ReactElement }): ReactElement => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return props.children;
};