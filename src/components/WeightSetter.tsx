import React from 'react'
import Accordion from 'react-bootstrap/esm/Accordion'
import Form from 'react-bootstrap/esm/Form'
import { StatusType, weightsType } from "../types";
import TheAlgorithm from "fedialgo"

const WeightSetter = ({ weights, updateWeights, algoObj }: { weights: weightsType, updateWeights: (weights) => void, algoObj: TheAlgorithm }) => (
    <Accordion>
        <Accordion.Item eventKey="0">
            <Accordion.Header>Feed Algorithmus</Accordion.Header>
            <Accordion.Body>
                {weights && Object.keys(weights).map((key) => {
                    return (
                        <Form.Group className="mb-3">
                            <Form.Label><b>{key + " - "}</b>{algoObj.getDescription(key) + ": " + weights[key].toFixed(2)}</Form.Label>
                            <Form.Range
                                min={0}
                                max={Math.max(...Object.values(weights)) + 1 * 1.2}
                                step={0.01}
                                id={key}
                                value={weights[key]}
                                onChange={(e) => {
                                    const newWeights = weights
                                    newWeights[key] = Number(e.target.value)
                                    updateWeights(newWeights)
                                }}
                            />
                        </Form.Group>
                    )
                })}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
)

export default WeightSetter