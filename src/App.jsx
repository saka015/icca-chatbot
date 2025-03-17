import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    // Show toast notification when redirecting
    toast.error('Please login to access the chat', {
      duration: 3000,
      position: 'top-center',
    });
    
    // Redirect to login if there's no token
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  
  if (token) {
    // Redirect to chat if already logged in
    return <Navigate to="/chat" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <div className="App">
        <Routes>
          {/* Public route - Login page */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />
          
          {/* Protected route - Chat page */}
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />

          {/* Catch all route - Redirect to appropriate page */}
          <Route 
            path="*" 
            element={
              <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
