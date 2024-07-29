import React from 'react';
import { Modal } from 'react-bootstrap';
import { StatusType } from '../types';
import parse from 'html-react-parser'

export const AttachmentsModal = ({ attModal, setAttModal, status }: { attModal: number, setAttModal: (attModal: number) => void, status: StatusType }) => {
    return (
        <Modal show={attModal != -1} onHide={() => setAttModal(-1)}>
            <Modal.Header closeButton>
                <Modal.Title>{parse(status.content)[100]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {status.mediaAttachments[attModal]?.type === "image" &&
                    <img width={"100%"} src={status.mediaAttachments[attModal]?.url} alt={status.mediaAttachments[attModal]?.description ?? ""} />
                }
                {status.mediaAttachments[attModal]?.type === "video" &&
                    <video width={"100%"} controls>
                        <source src={status.mediaAttachments[attModal]?.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                }
            </Modal.Body>
        </Modal>
    )
}