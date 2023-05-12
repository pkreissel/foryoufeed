import React, { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage, UserStorage, AppStorage } from "./useLocalStorage";
const AuthContext = createContext({ user: null, loginUser: async (data: any) => { }, logout: () => { } });

export const AuthProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useLocalStorage({ keyName: "user", defaultValue: null } as UserStorage)
    const [app, setApp] = useLocalStorage({ keyName: "app", defaultValue: {} } as AppStorage)
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const loginUser = async (data: UserStorage["defaultValue"]) => {
        console.log("logged in")
        setUser(data);
        navigate("/");
    };

    // call this function to sign out logged in user
    const logout = async () => {
        const body = new FormData();
        body.append("token", user.access_token);
        body.append("client_id", app.client_id);
        body.append("client_secret", app.client_secret);
        fetch(user.server + '/oauth/revoke',
            {
                method: 'POST',
                body: body
            }
        );
        setUser(null);
        navigate("/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            loginUser,
            logout
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};