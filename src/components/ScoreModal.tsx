import React from 'react';

import { Modal } from 'react-bootstrap';
import { StatusType } from '../types';

export const ScoreModal = ({ scoreModal, setScoreModal, status }: { scoreModal: boolean, setScoreModal: (scoreModal: boolean) => void, status: StatusType }) => {
    return (
        <Modal show={scoreModal} onHide={() => setScoreModal(false)} style={{ color: "black" }}>
            <Modal.Header closeButton>
                <Modal.Title>Score</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Score: {status.value}</p>
                <p>Weights: {
                    Object.keys(status.scores).map(key => (
                        <p key={key}>{key}: {status.scores[key]}</p>
                    ))
                }</p>
            </Modal.Body>
        </Modal>
    )
}