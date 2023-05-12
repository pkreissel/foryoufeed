import React from 'react';
import { useAuth } from '../hooks/useAuth';


const LogoutPage = () => {

    const { logout } = useAuth();
    logout();
    return (
        <div>
            <h1>Logged Out</h1>
        </div>
    )
};

export default LogoutPage;