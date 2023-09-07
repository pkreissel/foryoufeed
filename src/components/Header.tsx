import React from 'react';
import { useAuth } from "../hooks/useAuth";
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';


const Header = () => {
    const { user } = useAuth();
    return (
        <Row className='w-100'>
            <Col>
                {
                    user && <div className='text-center d-inline align-middle'>
                        {user?.profilePicture && <img src={user.profilePicture} alt="Avatar" style={{ height: 30, width: 30, borderRadius: 5 }} className="d-inline-block align-top" />}
                        <span style={{ fontSize: 15, padding: 10 }}>Logged in as  {user.username}</span>
                    </div>
                }
            </Col>
            <Col xs={6} className='text-center'>
                <img src={"/assets/logo.png"} style={{ height: 20, width: 20, borderRadius: 5 }} className="d-inline-block align-top" />
                <span className='text-center align-middle p-2' style={{ fontSize: 20 }}>Fedi-Feed</span>
            </Col>

            <Col className='text-end'>
                {user && <Button className='p-2 text-center' variant="outline-primary" href="/logout">Logout</Button>}
            </Col>
        </Row>
    )
}

export default Header
