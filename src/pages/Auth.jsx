import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('https://aiva-livid.vercel.app/api/login', formData);
      console.log('Login successful:', response.data);
      
      // Store the token in localStorage
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userName', formData.name);
      
      // Show success message (optional)
      setError('');
      
      // Redirect to chat or home page
      navigate('/'); // or wherever you want to redirect after login
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      localStorage.removeItem('userToken'); // Clear any existing token on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <h2 className='auth-head'>Login to continue</h2>
      
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input 
            type="tel" 
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
