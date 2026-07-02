import React from 'react';

import { Modal, Table } from 'react-bootstrap';
import { StatusType, weightsType } from '../types';

interface ScoreModalProps {
    scoreModal: boolean,
    setScoreModal: (scoreModal: boolean) => void,
    status: StatusType,
    weights: weightsType,
}

export const ScoreModal = ({ scoreModal, setScoreModal, status, weights }: ScoreModalProps) => {

    return (
        <Modal dialogClassName="modal-90w" show={scoreModal} onHide={() => setScoreModal(false)} style={{ color: "black" }}>
            <Modal.Header closeButton>
                <Modal.Title>Score</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p>Weights:</p>
                <Table striped bordered hover variant='dark'>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Score</th>
                            <th>Weight</th>
                            <th>Weighted Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(weights).map(key => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{status.scores[key]}</td>
                                    <td>{(weights[key] || 0)?.toFixed(2)}</td>
                                    <td>{(status.scores[key] * (weights[key] || 0))?.toFixed(2)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>Total</td>
                            <td>{Object.keys(status.scores).reduce((acc, key) => acc + status.scores[key] * (weights[key] || 0), 0)?.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </Table>
                <p>Score with time penalty: {status.value}</p>

                <p>
                    Origin: {status.account.url}
                </p>
            </Modal.Body>
        </Modal >
    )
}