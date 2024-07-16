import React, { useState, useEffect, useRef } from "react";
import { StatusType, settingsType, weightsType } from "../types";
import { useAuth } from "../hooks/useAuth";
import useOnScreen from "../hooks/useOnScreen";
import { mastodon, createRestAPIClient as loginMasto } from "masto";
import StatusComponent from "../components/Status";
import FullPageIsLoading from "../components/FullPageIsLoading";
import Container from "react-bootstrap/esm/Container";
import TheAlgorithm from "fedialgo"
import WeightSetter from "../components/WeightSetter";
import { usePersistentState } from "react-persistent-state";
import { Modal } from "react-bootstrap";


const Feed = () => {
    //Contruct Feed on Page Load
    const { user, logout } = useAuth();

    const [feed, setFeed] = usePersistentState<StatusType[]>([], user.id + "feed"); //feed to display
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); //
    const [records, setRecords] = usePersistentState<number>(20, user.id + "records"); //how many records to show
    const [scrollPos, setScrollPos] = usePersistentState<number>(0, user.id + "scroll"); //scroll position
    const [weights, setWeights] = useState<weightsType>({}); //weights for each factor
    const [settings, setSettings] = usePersistentState<settingsType>({
        "reposts": true,
        "onlyLinks": false,
    }, "settings"); //settings for feed

    window.addEventListener("scroll", () => {
        if (window.scrollY % 10 == 0) setScrollPos(window.scrollY)
    })

    const [algoObj, setAlgo] = useState<TheAlgorithm>(null); //algorithm to use 
    const api = loginMasto({
        url: user.server,
        accessToken: user.access_token,
    });
    const bottomRef = useRef<HTMLDivElement>(null);
    const isBottom = useOnScreen(bottomRef)
    useEffect(() => {
        // only reload feed if the newest status is older than 10 minutes
        const lastStatus = feed.reduce((prev, current) => (prev.createdAt > current.createdAt) ? prev : current, { createdAt: "1970-01-01T00:00:00.000Z" })
        console.log("last status", lastStatus)
        if (lastStatus && (Date.now() - (new Date(lastStatus.createdAt)).getTime()) > 1800 * 1000) {
            setRecords(20)
            constructFeed()
            setLoading(false)
        } else {
            console.log("loaded from cache")
            restoreFeedCache()
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        if (isBottom) {
            console.log("bottom")
            loadMore()
        }
    }, [isBottom])

    const restoreFeedCache = async () => {
        if (user) {
            let currUser: mastodon.v1.Account
            try {
                currUser = await api.v1.accounts.verifyCredentials();
            } catch (error) {
                console.log(error)
                logout()
            }
            const algo = new TheAlgorithm(api, currUser)
            window.scrollTo(0, scrollPos)
            setWeights(await algo.getWeights())
            setAlgo(algo)
        }
    }

    const constructFeed = async () => {
        if (user) {
            let currUser: mastodon.v1.Account
            try {
                currUser = await api.v1.accounts.verifyCredentials();
            } catch (error) {
                console.log(error)
                logout()
            }
            const algo = new TheAlgorithm(api, currUser)

            const feed: StatusType[] = await algo.getFeed()

            setWeights(await algo.getWeights())
            setFeed(feed)
            setAlgo(algo)
        }
    };

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

    const updateSettings = async (newSettings: settingsType) => {
        console.log(newSettings)
        setSettings(newSettings)
        setFeed([...feed])
    }



    return (
        <Container style={{ maxWidth: "600px", height: "auto" }}>
            <Modal show={error !== ""} onHide={() => setError("")}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
            </Modal>
            <WeightSetter
                weights={weights}
                updateWeights={updateWeights}
                algoObj={algoObj}
                settings={settings}
                updateSettings={updateSettings}
            />
            {!loading && api && (feed.length > 1) && feed.filter((status: StatusType) => {
                let pass = true
                if (settings.onlyLinks) {
                    pass = !(status.card == null && status?.reblog?.card == null)
                }
                if (!settings.reposts) {
                    pass = pass && (status.reblog == null)
                }
                return pass
            }).slice(0, Math.max(20, records)).map((status: StatusType) => {
                return (
                    <StatusComponent
                        status={status}
                        api={api}
                        user={user}
                        weightAdjust={weightAdjust}
                        key={status.uri}
                        setError={setError}
                    />
                )
            })}
            {feed.length < 1 || loading &&
                <FullPageIsLoading />
            }
            <div ref={bottomRef} onClick={loadMore}>Load More</div>
        </Container>
    )
};

export default Feed;