import React from 'react'
import Spinner from 'react-bootstrap/esm/Spinner'

const FullPageIsLoading = () => (
    <div style={{ display: 'flex', height: "100vh", justifyContent: "center", alignItems: "center", verticalAlign: "center", flex: 1 }}>
        <Spinner animation="grow" />
    </div>
)

export default FullPageIsLoading
