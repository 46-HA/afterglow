import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:2044/api';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>afterglow.</h1>
      <p>change the trajectory of your life.</p>
      <p>build good habits.</p>
      <button onClick={() => navigate('/login')}>Log In</button>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/check-user`, { email });
      
      if (!response.data.exists) {
        setError('No account found with that email.');
        return;
      }
      
      const newCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(newCode);
      console.log(`Verification code sent to ${email}: ${newCode}`);
      setError('');
    } catch (error) {
      setError('Server error. Please try again later.');
      console.error('Login error:', error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (parseInt(code) === generatedCode) {
      try {
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      } catch (error) {
        setError('Server error. Please try again later.');
        console.error('Verification error:', error);
      }
    } else {
      setError('Incorrect verification code.');
    }
  };

  return (
    <div className="login">
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!generatedCode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
            />
          </div>
          <button type="submit">Send Code</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div>
            <label>Enter Verification Code</label>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code..."
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}

      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const checkResponse = await axios.post(`${API_URL}/check-user`, { email });
      
      if (checkResponse.data.exists) {
        setError('Email already has an account.');
        return;
      }

      const newCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(newCode);
      console.log(`Verification code sent to ${email}: ${newCode}`);
      setError('');
    } catch (error) {
      setError('Server error. Please try again later.');
      console.error('Sign-up error:', error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (parseInt(code) === generatedCode) {
      try {
        await axios.post(`${API_URL}/signup`, {
          firstName,
          dob,
          email
        });
        
        await axios.post(`${API_URL}/verify`, { email });
        
        alert('Account created successfully!');
        navigate('/login');
      } catch (error) {
        setError('Server error. Please try again later.');
        console.error('Verification error:', error);
      }
    } else {
      setError('Incorrect verification code.');
    }
  };

  return (
    <div className="login">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!generatedCode ? (
        <form onSubmit={handleSignUp}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit">Send Code</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div>
            <label>Enter Verification Code</label>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              required
            />
          </div>
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the app!</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}