import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import { Toaster } from 'react-hot-toast';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <div className="App">
        <Routes>
          {/* Public route - Login page */}
          <Route path="/" element={<Auth />} />
          
          {/* Protected route - Chat page */}
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
