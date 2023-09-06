import React, { useEffect, useState } from 'react';
import { createRestAPIClient } from 'masto';
import { stringifyQuery } from 'ufo'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import Container from 'react-bootstrap/Container';
import { useLocalStorage, AppStorage } from "../hooks/useLocalStorage";


export default function LoginPage() {
    const [server, setServer] = React.useState<string>('');
    const [app, setApp] = useLocalStorage({ keyName: "app", defaultValue: {} } as AppStorage)

    const loginRedirect = async (event: any): Promise<void> => {
        const sanitized_server = server.replace("https://", "").replace("http://", "");
        const api = await createRestAPIClient({
            url: `https://${sanitized_server}`,
        });
        const scope = "read:favourites read:follows read:search read:accounts read:statuses write:favourites write:statuses write:follows read:notifications"
        const app = await api.v1.apps.create({
            clientName: "Mastodon Demo",
            redirectUris: window.location.origin + "/callback",
            scopes: scope,
            website: `https://${sanitized_server}`,
        });
        console.log(app)
        setApp(app)
        const query = stringifyQuery({
            client_id: app.clientId,
            scope: scope,
            response_type: 'code',
            redirect_uri: window.location.origin + "/callback",
        })

        window.location.href = `https://${sanitized_server}/oauth/authorize?${query}`
        return
    }
    return (
        <>
            <div className='vh-100' style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: "center",
                display: 'flex',
            }}>
                <div>
                    <p style={{ lineHeight: 2, textAlign: "center" }}>
                        Fedi-Feed features a customizable algorithm for sorting your feed.
                        <br />
                        You can choose which factors influence the sorting of your feed.
                        <br />
                        To get started:
                        <br />
                    </p>
                </div>
                <Form.Group className="mb-3 align-middle">
                    <Form.Label className="text-center w-100">Enter Mastodon Server in the form: https://example.social</Form.Label >
                    <Form.Control type="url" id="mastodon_server" placeholder="https://mastodon.social" onChange={(e) => {
                        setServer(e.target.value);
                    }} />
                </Form.Group>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={loginRedirect}>Login</Button>
                </div>
            </div>
        </>
    )
}