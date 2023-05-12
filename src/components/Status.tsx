import React from 'react';
import "../birdUI.css";
import "../default.css";
import { StatusType, weightsType } from '../types';
import parse from 'html-react-parser'
import { mastodon } from 'masto';
import { User } from '../types';

interface StatusComponentProps {
    status: StatusType,
    api: mastodon.Client,
    user: User,
    weightAdjust: (statusWeight: weightsType) => void
}

export default function StatusComponent(props: StatusComponentProps) {
    const status = props.status.reblog ? props.status.reblog : props.status;
    const [favourited, setFavourited] = React.useState<boolean>(status.favourited);
    const [reblogged, setReblogged] = React.useState<boolean>(status.reblogged);
    status.reblogBy = props.status.reblog ? props.status.account.displayName : props.status?.reblogBy;
    const masto = props.api;
    const weightAdjust = props.weightAdjust;
    const resolve = async (status: StatusType): Promise<StatusType> => {
        //Resolve Links to other instances on homeserver

        if (status.uri.includes(props.user.server)) {
            return status;
        } else {
            const res = await masto.v2.search({ q: status.uri, resolve: true })
            return res.statuses[0]
        }
    }

    const reblog = async () => {
        //Reblog a post
        const status_ = await resolve(status);
        weightAdjust(status.weights)

        const id = status_.id;
        (async () => {
            const res = await masto.v1.statuses.reblog(id);
            console.log(res);
            setReblogged(!reblogged)
        })();
    }

    const fav = async () => {
        //Favourite a post
        console.log(status.weights)

        const status_ = await resolve(status);
        weightAdjust(status.weights)
        const id = status_.id;
        (async () => {
            const res = await masto.v1.statuses.favourite(id);
            console.log(res);
            setFavourited(!favourited)
        })();
    }

    const followUri = async (e) => {
        //Follow a link to another instance on the homeserver
        e.preventDefault()
        const status_ = await resolve(status);
        weightAdjust(status.weights)
        console.log(status_)
        //new tab:
        window.location.href = props.user.server + "/@" + status_.account.acct + "/" + status_.id
    }

    const followLink = async () => {
        //Follow an article link
        weightAdjust(status.weights)
        window.location.href = status.card.url
    }
    return (
        <div>
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
                        <a href={props.user.server + status.account.acct} onClick={followUri} className="status__relative-time" target="_blank" rel="noopener noreferrer">
                            <span className="status__visibility-icon">
                                <i className="fa fa-globe" title="Öffentlich">
                                </i>
                                {status?.topPost && (
                                    <i className="fa fa-fire" title="Privat">
                                    </i>
                                )}

                            </span>
                            <time dateTime={status.createdAt} title={status.createdAt}>{(new Date(status.createdAt)).toLocaleTimeString()}</time>
                        </a>
                        <a href={props.user.server + status.account.acct} title={status.account.acct} className="status__display-name" target="_blank" rel="noopener noreferrer">
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
                        <a href={status.card.url} onClick={followLink} className="status-card compact" target="_blank" rel="noopener noreferrer">
                            <div className="status-card__image">
                                <canvas className="status-card__image-preview status-card__image-preview--hidden" width="32" height="32"></canvas>
                                <img src={status.card.image} alt="" className="status-card__image-image" />
                            </div>
                            <div className='status-card__content'>
                                <span className='status-card__host'>{status.card.providerName}</span>
                                {status.card.title}
                                {<p className='status-card__description'>{status.card.description.replace(/(.{200})..+/, "$1…")}</p>}
                            </div>
                        </a>
                    )}
                    {!status.card &&
                        status.mediaAttachments.filter(att => att.type === "image").length > 0 && (
                            <div className="media-gallery" style={{ height: "314.4375px" }}>
                                <div className="spoiler-button spoiler-button--minified">
                                    <button type="button" aria-label="Medium ausblenden" aria-hidden="true" title="Medium ausblenden" className="icon-button overlayed" style={{ fontSize: "18px", width: "23.142857px", height: "23.142857px", lineHeight: "18px" }}>
                                        <i className="fa fa-eye-slash fa-fw" aria-hidden="true">
                                        </i>
                                    </button>
                                </div>
                                <div className="media-gallery__item" style={{ inset: "auto", width: "100%", height: "100%" }}><canvas className="media-gallery__preview media-gallery__preview--hidden" width="32" height="32" />
                                    <a className="media-gallery__item-thumbnail" href={status.mediaAttachments[0].url} target="_blank" rel="noopener noreferrer">
                                        <img src={status.mediaAttachments[0].url} sizes="559px" alt={status.mediaAttachments[0].description} style={{ objectPosition: "50%" }} />
                                    </a>
                                </div>
                            </div>
                        )
                    }
                    <div className="status__action-bar">
                        <button type="button" aria-label="Antworten" aria-hidden="false" title="Antworten" className="status__action-bar__button icon-button icon-button--with-counter" style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
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
                            </i> <span className="icon-button__counter">
                                <span className="animated-number">
                                    <span style={{ position: "static" }}>
                                        <span>{status.favouritesCount}</span>
                                    </span>
                                </span>
                            </span>
                        </button>
                        <button type="button" aria-label="Teilen" aria-hidden="false" title="Teilen" className="status__action-bar__button icon-button" style={{ fontSize: "18px", width: "auto", height: "23.142857px", lineHeight: "18px" }} >
                            <i className="fa fa-share-alt fa-fw" aria-hidden="true">
                            </i>
                        </button>
                    </div>
                </div>
            </div >
        </div >
    )
}
