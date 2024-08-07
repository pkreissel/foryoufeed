import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';


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