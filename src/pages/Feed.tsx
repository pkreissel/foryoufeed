import React, { useState, useEffect, useRef } from "react";
import { StatusType, weightsType } from "../types";
import { useAuth } from "../hooks/useAuth";
import useOnScreen from "../hooks/useOnScreen";
import { login, mastodon } from "masto";
import StatusComponent from "../components/Status";
import Container from "react-bootstrap/esm/Container";
import Accordion from "react-bootstrap/esm/Accordion";
import Form from "react-bootstrap/esm/Form";
import { usePersistentState } from 'react-persistent-state'
import TheAlgorithm from "fedialgo"


const Feed = () => {
    //Contruct Feed on Page Load
    const [feed, setFeed] = useState<StatusType[]>([]); //feed to display
    const [api, setApi] = useState<mastodon.Client>(null); //save api object for later use
    const [error, setError] = useState<string>("");
    const [records, setRecords] = useState<number>(20); //how many records to show
    const [weights, setWeights] = useState<weightsType>({}); //weights for each category [category: weight
    const [autoAdjust, setAutoAdjust] = usePersistentState<boolean>(true); //auto adjust weights
    const [algoObj, setAlgo] = useState<TheAlgorithm>(null); //algorithm to use 
    const { user } = useAuth();
    const bottomRef = useRef<HTMLDivElement>(null);
    const isBottom = useOnScreen(bottomRef)
    useEffect(() => {
        const constructFeed = async () => {
            if (user) {
                const api: mastodon.Client = await login({
                    url: user.server,
                    accessToken: user.access_token,
                });
                setApi(api);

                const currUser = await api.v1.accounts.verifyCredentials()
                // @ts-ignore
                const algo = new TheAlgorithm(api, currUser)
                setAlgo(algo)
                const feed = await algo.getFeed()
                setWeights(await algo.getWeights())
                if (isNaN(feed[0].value)) {
                    throw new Error("Feed Value is not a number")
                }
                setFeed(feed)
            }
        };
        constructFeed();
    }, []);

    useEffect(() => {
        if (isBottom) {
            console.log("bottom")
            loadMore()
        }
    }, [isBottom])

    const loadMore = () => {
        if (records < feed.length) {
            console.log("load more")
            console.log(records)
            setRecords(records + 10)
        }
    }

    //Adjust Weights
    const weightAdjust = async (scores: weightsType) => {
        const newWeights = await algoObj.weightAdjust(scores)
        console.log(newWeights)
        setWeights(newWeights)
    }

    const updateWeights = async (newWeights: weightsType) => {
        setWeights(newWeights)
        if (algoObj) {
            const newFeed = await algoObj.setWeights(newWeights)
            setFeed(newFeed)
        }
    }

    return (
        <Container style={{ maxWidth: "600px" }}>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Feed Algorithmus</Accordion.Header>
                    <Accordion.Body>
                        {weights && Object.keys(weights).map((key) => {
                            return (
                                <Form.Group className="mb-3">
                                    <Form.Label><b>{key + " - "}</b>{algoObj.getDescription(key) + ": " + weights[key]}</Form.Label>
                                    <Form.Range min={0} max={weights[key] * 2} step={0.01} id={key} value={weights[key]} onChange={(e) => {
                                        const newWeights = weights
                                        newWeights[key] = Number(e.target.value)
                                        updateWeights(newWeights)
                                    }} />
                                </Form.Group>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {(feed.length > 1) && feed.slice(0, Math.max(20, records)).map((status: any, index) => {
                return (
                    <StatusComponent
                        status={status}
                        api={api}
                        user={user}
                        weightAdjust={weightAdjust}
                        key={status.uri}
                    />
                )
            })}
            <div ref={bottomRef} onClick={loadMore}>Mehr Laden</div>
        </Container>
    )
};

export default Feed;