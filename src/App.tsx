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
import { inject } from '@vercel/analytics';

const App: React.FC = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
  if (process.env.NODE_ENV === "production") inject();
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