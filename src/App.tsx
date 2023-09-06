import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container';
import Navbar from 'react-bootstrap/esm/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute';
import CallbackPage from './pages/CallbackPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import Feed from './pages/Feed';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { inject } from '@vercel/analytics';

const App: React.FC = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
  if (process.env.NODE_ENV === "production") inject();
  const { user } = useAuth();

  return (

    <BrowserRouter>
      <AuthProvider>
        <div style={
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            paddingTop: "20px"
          }
        } className='container-fluid'>
          <Row className='w-100'>
            <Col></Col>
            <Col xs={6}>
              <h1 className='text-center' style={{ fontSize: 20 }}>Fedi-Feed</h1>
            </Col>

            <Col className='text-end'>
              {user && <Button className='p-2 text-center' variant="outline-primary" href="/logout">Logout</Button>}
            </Col>
          </Row>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
          <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
              <Navbar.Brand style={{ color: "white" }} color='white'>FediFeed</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/" style={{ color: "white" }}>Home</Nav.Link>

                  <Nav.Link href="https://github.com/pkreissel/foryoufeed/tree/main/src" style={{ color: "white" }}>
                    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Github Logo" style={{ height: 20, width: 20, borderRadius: 5 }} className="d-inline-block align-top" />
                    Code on Github
                  </Nav.Link>
                  <Nav.Link href="https://chaos.social/@pkreissel" style={{ color: "white" }}>
                    <img src="https://assets.chaos.social/accounts/avatars/000/242/007/original/97b58ba7002b2c8b.jpg" alt="Chaos.social Logo" style={{ height: 20, width: 20, borderRadius: 5 }} className="d-inline-block align-top" />
                    Follow me on Mastodon
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div >
      </AuthProvider>
    </BrowserRouter >

  )


};

export default App;