import React, { useState, useEffect, useRef } from "react";
import { StatusType, weightsType } from "../types";
import { useAuth } from "../hooks/useAuth";
import useOnScreen from "../hooks/useOnScreen";
import { mastodon, createRestAPIClient as loginMasto } from "masto";
import StatusComponent from "../components/Status";
import FullPageIsLoading from "../components/FullPageIsLoading";
import Container from "react-bootstrap/esm/Container";
import TheAlgorithm from "fedialgo"
import WeightSetter from "../components/WeightSetter";
import { redirect } from "react-router";


const Feed = () => {
    //Contruct Feed on Page Load
    const [feed, setFeed] = useState<StatusType[]>([]); //feed to display
    //const [_api, setApi] = useState<mastodon.rest.Client>(null); //save api object for later use
    const [error, setError] = useState<string>("");
    const [records, setRecords] = useState<number>(20); //how many records to show
    const [weights, setWeights] = useState<weightsType>({}); //weights for each category [category: weight
    const [algoObj, setAlgo] = useState<TheAlgorithm>(null); //algorithm to use 
    const { user, logout } = useAuth();
    const api = loginMasto({
        url: user.server,
        accessToken: user.access_token,
    });
    const bottomRef = useRef<HTMLDivElement>(null);
    const isBottom = useOnScreen(bottomRef)
    useEffect(() => {
        constructFeed();
    }, []);

    useEffect(() => {
        if (isBottom) {
            console.log("bottom")
            loadMore()
        }
    }, [isBottom])

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

            if (isNaN(feed[0].value)) {
                throw new Error("Feed Value is not a number")
            }

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

    return (
        <Container style={{ maxWidth: "600px", height: "auto" }}>
            <WeightSetter weights={weights} updateWeights={updateWeights} algoObj={algoObj} />
            {api && (feed.length > 1) && feed.slice(0, Math.max(20, records)).map((status: any, index) => {
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
            {feed.length < 1 &&
                <FullPageIsLoading />
            }
            <div ref={bottomRef} onClick={loadMore}>Load More</div>
        </Container>
    )
};

export default Feed;