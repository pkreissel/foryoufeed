import React, { useEffect } from 'react'
import Accordion from 'react-bootstrap/esm/Accordion'
import Form from 'react-bootstrap/esm/Form'
import { settingsType, weightsType } from "../types";
import TheAlgorithm from "fedialgo"

interface WeightSetterProps {
    weights: weightsType,
    updateWeights: (weights) => void,
    settings: settingsType,
    updateSettings: (settings) => void,
    algoObj: TheAlgorithm
}

const WeightSetter = ({ weights, updateWeights, settings, updateSettings, algoObj }: WeightSetterProps) => {
    useEffect(() => {
        console.log(settings)
    }, [settings])
    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Feed Algorithmus</Accordion.Header>
                <Accordion.Body>
                    {weights && Object.keys(weights).map((key, index) => {
                        return (
                            <Form.Group className="mb-3" key={index}>
                                <Form.Label><b>{key + " - "}</b>{algoObj.getDescription(key) + ": " + (weights[key]?.toFixed(2) ?? "1")}</Form.Label>
                                <Form.Range
                                    min={0}
                                    max={Math.max(...Object.values(weights) ?? [0]) + 1 * 1.2}
                                    step={0.01}
                                    id={key}
                                    value={weights[key] ?? 1}
                                    onChange={(e) => {
                                        const newWeights = weights
                                        newWeights[key] = Number(e.target.value)
                                        updateWeights(newWeights)
                                    }}
                                />
                            </Form.Group>
                        )
                    })}
                    {settings && Object.keys(settings).map((key, index) => {
                        return (
                            <Form.Group className="mb-3" key={index}>
                                <Form.Check
                                    type="checkbox"
                                    label={key}
                                    id={key}
                                    checked={settings[key]}
                                    disabled={false}
                                    onChange={(e) => {
                                        const newSettings = { ...settings }
                                        newSettings[key] = e.target.checked
                                        updateSettings(newSettings)
                                    }}
                                />
                            </Form.Group>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default WeightSetter