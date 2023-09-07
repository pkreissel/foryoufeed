import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createRestAPIClient as loginMasto } from "masto"
import { useLocalStorage, AppStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

export default function CallbackPage() {
    const [error, setError] = React.useState("");
    const [searchParams] = useSearchParams();
    const [app] = useLocalStorage({ keyName: "app", defaultValue: {} } as AppStorage)
    const { user, loginUser } = useAuth();
    console.log(loginUser)
    const code = searchParams.get('code');
    console.log("CallbackPage")
    useEffect(() => {
        if (code !== null && !user) {
            console.log(code)
            oAuth(code)
        }
    }, [code]);

    const oAuth = async (code: string) => {
        console.log(app)
        const body = new FormData();
        const scope = "read:favourites read:follows read:search read:accounts read:statuses write:favourites write:statuses write:follows"
        body.append('grant_type', 'authorization_code');
        body.append('client_id', app.clientId);
        body.append('client_secret', app.clientSecret);
        body.append('redirect_uri', app.redirectUri);
        body.append('code', code);
        body.append('scope', scope);
        const result: any = await fetch(`${app.website}/oauth/token`, {
            method: 'POST',
            body,
        })
        const json = await result.json()
        const api = await loginMasto({
            url: app.website,
            accessToken: json["access_token"],
        })
        api.v1.accounts.verifyCredentials().then((user) => {
            const userData: User = {
                id: user.id,
                username: user.username,
                profilePicture: user.avatar,
                access_token: json["access_token"],
                server: app.website,
            }
            loginUser(userData).then(() => {
                console.log("Logged in!")
            })
        }).catch((error) => {
            console.log(error)
            console.log("Error")
            setError(error.toString())
        }).finally(() => {
            console.log("finally")
        })
    }
    return (
        <div>
            <h1>Validating ....</h1>
            {error &&
                <p>{error}</p>
            }
        </div>
    )
}