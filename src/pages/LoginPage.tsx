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
            <Container>
                <Form.Group className="mb-3">
                    <Form.Label className="text-center w-100">Enter Mastodon Server in the form: https://example.social</Form.Label >
                    <Form.Control type="url" id="mastodon_server" placeholder="https://mastodon.social" onChange={(e) => {
                        setServer(e.target.value);
                    }} />
                </Form.Group>
            </Container>

            <Button onClick={loginRedirect}>Login</Button>
            <Card
                bg={"danger"}
                text={"white"}
                style={{ width: '18rem', marginTop: '100px' }}
                className="mb-2"
            >
                <Card.Header>Attention</Card.Header>
                <Card.Body>
                    <Card.Text>
                        This is a demo application. It might contain security issues. Please use at your own risk.
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}