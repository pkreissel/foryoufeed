import React from 'react';
import "../birdUI.css";
import "../default.css";
import { StatusType, weightsType } from '../types';
import Modal from 'react-bootstrap/Modal';
import parse from 'html-react-parser'
import { mastodon } from 'masto';
import { User } from '../types';
import Toast from 'react-bootstrap/Toast';

interface StatusComponentProps {
    status: StatusType,
    api: mastodon.rest.Client,
    user: User,
    weightAdjust: (statusWeight: weightsType) => void
    setError: (error: string) => void
}

export default function StatusComponent(props: StatusComponentProps) {
    const status = props.status.reblog ? props.status.reblog : props.status;
    status.scores = props.status.scores;
    const [favourited, setFavourited] = React.useState<boolean>(status.favourited);
    const [reblogged, setReblogged] = React.useState<boolean>(status.reblogged);
    const [imageModal, setImageModal] = React.useState<boolean>(false);
    const [scoreModal, setScoreModal] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    status.reblogBy = props.status.reblog ? props.status.account.displayName : props.status?.reblogBy;
    const masto = props.api;
    if (!masto) throw new Error("No Mastodon API");
    const weightAdjust = props.weightAdjust;

    const resolve = async (status: StatusType): Promise<StatusType> => {
        if (status.uri.includes(props.user.server)) {
            return status;
        } else {
            const res = await masto.v2.search.fetch({ q: status.uri, resolve: true })
            return res.statuses[0]
        }
    }

    const reblog = async () => {
        //Reblog a post
        const status_ = await resolve(status);
        reblogged ? console.log("skip") : weightAdjust(status.scores)
        const id = status_.id;
        (async () => {
            reblogged ? await masto.v1.statuses.$select(id).unreblog() : await masto.v1.statuses.$select(id).reblog();
            setReblogged(!reblogged)
        })();
    }

    const fav = async () => {
        //Favourite a post
        console.log(status.scores)

        const status_ = await resolve(status);
        favourited ? console.log("skip") : weightAdjust(status.scores)
        const id = status_.id;
        (async () => {
            favourited ? await masto.v1.statuses.$select(id).unfavourite() : await masto.v1.statuses.$select(id).favourite();
            setFavourited(!favourited)
        })();
    }

    const followUri = async (e) => {
        //Follow a link to another instance on the homeserver
        e.preventDefault()
        const status_ = await resolve(status);
        weightAdjust(status.scores)
        console.log(status_)
        //new tab:
        window.location.href = props.user.server + "/@" + status_.account.acct + "/" + status_.id
    }

    const showScore = async () => {
        //Show the score of a post
        setScoreModal(true)
    }


    return (
        <div>
            {
                status.mediaAttachments.length > 0 && status.mediaAttachments[0].type === "image" && (
                    <Modal show={imageModal} onHide={() => setImageModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{parse(status.content)[100]}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img width={"100%"} src={status.mediaAttachments[0].url} alt={status.mediaAttachments[0].description ?? ""} />
                        </Modal.Body>
                    </Modal>
                )
            }
            {
                <Modal show={scoreModal} onHide={() => setScoreModal(false)} style={{ color: "black" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Score</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Score: {status.value}</p>
                        <p>Weights: {
                            Object.keys(status.scores).map(key => (
                                <p>{key}: {status.scores[key]}</p>
                            ))
                        }</p>
                    </Modal.Body>
                </Modal>
            }
            <Toast show={Boolean(error)} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>{error}</Toast.Body>
            </Toast>


            <div className="status__wrapper status__wrapper-public focusable" aria-label={`${status.account.displayName}, ${status.account.note} ${status.account.acct}`}>
                {status.reblogBy &&
                    <div className="status__prepend">
                        <div className="status__prepend-icon-wrapper">
                            <i className="fa fa-retweet status__prepend-icon fa-fw">
                            </i>
                        </div>
                        <span>
                            <a data-id="109357260772763021" href="/@mcnees@mastodon.social" className="status__display-name muted">
                                <bdi><strong>{status.reblogBy}</strong></bdi>
                            </a> teilte
                        </span>
                    </div>
                }
                <div className="status status-public" data-id="110208921130165916">
                    <div className="status__info">
                        <a href={status.uri} className="status__relative-time" target="_blank" rel="noopener noreferrer">
                            <span className="status__visibility-icon">
                                <i className="fa fa-globe" title="Öffentlich">
                                </i>
                                {status?.topPost && (
                                    <i className="fa fa-fire" title="Top Post">
                                    </i>
                                )}
                                {status?.recommended && (
                                    <i className="fa fa-bolt" title="Empfohlen">
                                    </i>
                                )}

                            </span>
                            <time dateTime={status.createdAt} title={status.createdAt}>{(new Date(status.createdAt)).toLocaleTimeString()}</time>
                        </a>
                        <a href={props.user.server + "/@" + status.account.acct} title={status.account.acct} className="status__display-name" target="_blank" rel="noopener noreferrer">
                            <div className="status__avatar">
                                <div className="account__avatar" style={{ width: "46px", height: "46px" }}>
                                    <img src={status.account.avatar} alt="{status.account.acct}" />
                                </div>
                            </div>

                            <span className="display-name">
                                <bdi>
                                    <strong className="display-name__html">{status.account.displayName}
                                    </strong>
                                </bdi>
                                <span className="display-name__account">@{status.account.acct}</span>
                            </span>
                        </a>
                    </div>
                    <div className="status__content status__content--with-action" >
                        <div className="status__content__text status__content__text--visible translate" lang="en">
                            {parse(status.content)}
                        </div>
                    </div>
                    {status.card && (
                        <a href={status.card.url} onClick={() => weightAdjust(status.scores)} className="status-card compact" target="_blank" rel="noopener noreferrer">
                            <div className="status-card__image">
                                <canvas className="status-card__image-preview status-card__image-preview--hidden" width="32" height="32"></canvas>
                                <img style={{ maxHeight: "30vh" }} src={status.card.image} alt="" className="status-card__image-image" />
                            </div>
                            <div className='status-card__content'>
                                <span className='status-card__host'>{status.card.providerName}</span>
                                {status.card.title}
                                {<p className='status-card__description'>{status.card.description.slice(0, 200)}</p>}
                            </div>
                        </a>
                    )}
                    {!status.card &&
                        status.mediaAttachments.filter(att => att.type === "image").length > 0 && (
                            <div className="media-gallery" style={{ height: "314.4375px" }}>
                                {status.mediaAttachments.filter(att => att.type === "image").map(att => (
                                    <div className="media-gallery__item" style={{ inset: "auto", width: "100%", height: "100%" }}>
                                        <canvas className="media-gallery__preview media-gallery__preview--hidden" width="32" height="32" />
                                        <img src={att.url} onClick={() => setImageModal(true)} sizes="559px" alt={att.description} style={{ objectPosition: "50%", width: "100%" }} />
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    <div className="status__action-bar">
                        <button onClick={followUri} type="button" aria-label="Antworten" aria-hidden="false" title="Antworten" className="status__action-bar__button icon-button icon-button--with-counter" style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-reply fa-fw" aria-hidden="true">
                            </i> <span className="icon-button__counter">
                                <span className="animated-number">
                                    <span style={{ position: "static" }}> {status.repliesCount}</span>
                                </span>
                            </span>
                        </button>
                        <button onClick={reblog} type="button" aria-label="Teilen" aria-hidden="false" title="Teilen" className={("status__action-bar__button icon-button icon-button--with-counter" + (reblogged ? " active activate" : " deactivate"))} style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-retweet fa-fw" aria-hidden="true">
                            </i> <span className="icon-button__counter">
                                <span className="animated-number">
                                    <span style={{ position: "static" }}>
                                        <span>{status.reblogsCount}</span>
                                    </span>
                                </span>
                            </span>
                        </button>
                        <button onClick={fav} type="button" aria-label="Favorisieren" aria-hidden="false" title="Favorisieren" className={("status__action-bar__button star-icon icon-button icon-button--with-counter" + (favourited ? " active activate" : " deactivate"))} style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-star fa-fw" aria-hidden="true">
                            </i>
                            <span className="icon-button__counter">
                                <span className="animated-number">
                                    <span style={{ position: "static" }}>
                                        <span>{status.favouritesCount}</span>
                                    </span>
                                </span>
                            </span>
                        </button>
                        <button onClick={showScore} type="button" aria-label="Score" aria-hidden="false" title="Score" className="status__action-bar__button icon-button" style={{ fontSize: "18px", width: "20px", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-pie-chart fa-fw" title="Empfohlen">
                                i
                            </i>
                        </button>
                        <button onClick={followUri} type="button" aria-label="Teilen" aria-hidden="false" title="Teilen" className="status__action-bar__button icon-button" style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-share-alt fa-fw" aria-hidden="true">
                            </i>
                        </button>
                    </div>
                </div>
            </div >
        </div >
    )
}
