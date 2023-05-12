import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/esm/Container';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from './components/ProtectedRoute';
import CallbackPage from './pages/CallbackPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import Feed from './pages/Feed';
import { AuthProvider } from './hooks/useAuth';

const App: React.FC = () => {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Container style={
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }
        }>
          <h1>Mastodon Smart-Feed</h1>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </Container >
      </AuthProvider>
    </BrowserRouter >

  )


};

export default App;