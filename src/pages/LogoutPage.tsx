import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { redirect } from 'react-router';


const LogoutPage = () => {
    const { logout } = useAuth();

    useEffect(() => {
        logout()
    }, [])
    return (
        <div>
            <h1>Logging Out</h1>
        </div>
    )
};

export default LogoutPage;