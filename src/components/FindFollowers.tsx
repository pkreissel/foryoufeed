import { mastodon } from 'masto';
import React, { useEffect, useState } from 'react';
import { Row, Col, Accordion, Button, Card } from 'react-bootstrap';
import parse from 'html-react-parser'
import { User } from '../types';


export default function FindFollowers({ api, user }: { api: mastodon.rest.Client, user: User }) {
    const [suggestions, setSuggestions] = useState<mastodon.v1.Suggestion[]>([])

    useEffect(() => {
        api.v2.suggestions.list().then((res) => {
            setSuggestions(res)
        })
    }, [])

    const follow = (id: string) => {
        api.v1.accounts.$select(id).follow().then(() => {
            setSuggestions(suggestions.filter((suggestion: mastodon.v1.Suggestion) => suggestion.account.id !== id))
        })
    }

    const hide = (id: string) => {
        api.v1.suggestions.$select(id).remove(id).then(() => {
            setSuggestions(suggestions.filter((suggestion: mastodon.v1.Suggestion) => suggestion.account.id !== id))
        }
        )
    }

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Find Followers</Accordion.Header>
                <Accordion.Body>
                    <Row className="g-4 m-3">
                        {suggestions.length == 0 && (
                            <div>If this does not work, log out and login again</div>
                        )}
                        {suggestions.filter((suggestion: mastodon.v1.Suggestion) => suggestion.source === "past_interactions")
                            .slice(0, 4)
                            .map((suggestion: mastodon.v1.Suggestion, index: number) => {
                                return (
                                    <Col key={index} sm={12} md={6} >
                                        <a href={`https://${user.server}/@${suggestion.account.acct}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                            <Card className="h-100 shadow-sm">
                                                <Card.Body className="d-flex flex-column">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <img
                                                            src={suggestion.account.avatar}
                                                            alt="Avatar"
                                                            className="rounded-circle me-3"
                                                            style={{ width: '60px', height: '60px' }}
                                                        />
                                                        <div>
                                                            <Card.Title className="mb-0">
                                                                {suggestion.account.displayName}
                                                            </Card.Title>
                                                            <Card.Text className="text-muted small">
                                                                @{suggestion.account.acct}
                                                            </Card.Text>
                                                        </div>
                                                    </div>
                                                    <Card.Text className="flex-grow-1">
                                                        {parse(suggestion.account.note)}
                                                    </Card.Text>
                                                    <div className="mt-3">
                                                        <Button
                                                            variant="primary"
                                                            className="me-2"
                                                            onClick={() => follow(suggestion.account.id)}
                                                        >
                                                            Follow
                                                        </Button>
                                                        <Button
                                                            variant="outline-secondary"
                                                            onClick={() => hide(suggestion.account.id)}
                                                        >
                                                            Hide
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </a>
                                    </Col>
                                )
                            })}
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}