import React from 'react'
import Accordion from 'react-bootstrap/esm/Accordion'
import Form from 'react-bootstrap/esm/Form'
import { settingsType, weightsType } from "../types";
import TheAlgorithm from "fedialgo"
import { usePersistentState } from "react-persistent-state";
import { useAuth } from '../hooks/useAuth';

interface WeightSetterProps {
    weights: weightsType,
    updateWeights: (weights: weightsType) => void,
    settings: settingsType,
    updateSettings: (settings: settingsType) => void,
    languages: string[],
    setSelectedLanguages: (languages: string[]) => void,
    algoObj: TheAlgorithm
}

const WeightSetter = ({ weights, updateWeights, settings, updateSettings, languages, setSelectedLanguages, algoObj }: WeightSetterProps) => {
    const { user } = useAuth();
    const [selectedLang, setLang] = usePersistentState<string[]>([], user.id + "selectedLangs")

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
                                    min={Math.min(...Object.values(weights).filter(x => !isNaN(x)) ?? [0]) - 1 * 1.2}
                                    max={Math.max(...Object.values(weights).filter(x => !isNaN(x)) ?? [0]) + 1 * 1.2}
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
                    <Form.Group className="mb-3">
                        <Form.Label><b>Show only these Languages</b></Form.Label>
                        {languages.map((lang, index) => {
                            return (
                                <Form.Check
                                    type="checkbox"
                                    label={lang}
                                    id={lang}
                                    key={index}
                                    checked={selectedLang.includes(lang)}
                                    disabled={false}
                                    onChange={(e) => {
                                        const newLang = [...selectedLang]
                                        if (e.target.checked) {
                                            newLang.push(lang)
                                        } else {
                                            newLang.splice(newLang.indexOf(lang), 1)
                                        }
                                        setLang(newLang)
                                        setSelectedLanguages(newLang)
                                    }}
                                />
                            )
                        })}
                    </Form.Group>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default WeightSetter