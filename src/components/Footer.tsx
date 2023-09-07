import React from "react";
import Navbar from "react-bootstrap/esm/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";


const Footer = () => (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container>
            <Navbar.Brand style={{ color: "white" }}>FediFeed</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/" style={{ color: "white" }}>Home</Nav.Link>
                <Nav.Link href="https://github.com/pkreissel/foryoufeed/tree/main/src" style={{ color: "white" }}>
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Github Logo" style={{ height: 20, width: 20, borderRadius: 5 }} className="d-inline-block align-top" />
                    <span className="p-2"> Code on Github</span>
                </Nav.Link>
                <Nav.Link href="https://chaos.social/@pkreissel" style={{ color: "white" }}>
                    <img src="https://assets.chaos.social/accounts/avatars/000/242/007/original/97b58ba7002b2c8b.jpg" alt="Chaos.social Logo" style={{ height: 20, width: 20, borderRadius: 5 }} className="d-inline-block align-top" />
                    <span className="p-2"> Follow me on Mastodon</span>
                </Nav.Link>
            </Nav>
        </Container>
    </Navbar>
);

export default Footer;