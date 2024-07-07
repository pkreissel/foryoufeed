import React, { PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStorage, useUserStorage } from "./useLocalStorage";
import { User } from "../types";
const AuthContext = createContext({ user: null, loginUser: async (_user: User) => { }, logout: () => { } });

export const AuthProvider = (props: PropsWithChildren) => {
    const [user, setUser] = useUserStorage({ keyName: "user", defaultValue: null })
    const [app, _setApp] = useAppStorage({ keyName: "app", defaultValue: null })
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const loginUser = async (user: User) => {
        console.log("logged in")
        setUser(user);
        navigate("/");
    };

    // call this function to sign out logged in user
    const logout = async () => {
        const body = new FormData();
        body.append("token", user.access_token);
        body.append("client_id", app.clientId)
        body.append("client_secret", app.clientSecret);
        try {
            await fetch(user.server + '/oauth/revoke',
                {
                    method: 'POST',
                    body: body,
                }
            );
        } catch (error) {
            console.log(error)
        }
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