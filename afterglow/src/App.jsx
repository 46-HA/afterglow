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
      <button onClick={() => navigate('/login')}>log in</button>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailLowerCase = email.toLowerCase();
    setEmail(emailLowerCase);

    if (!validateEmail(emailLowerCase)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/check-user`, { email: emailLowerCase });
      
      if (!response.data.exists) {
        setError('no account found with that email..');
        return;
      }
      
      const newCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(newCode);
      console.log(`verification code sent to ${emailLowerCase}: ${newCode}`);
      setError('');
    } catch (error) {
      setError('server error, please try again later..');
      console.error('login error:', error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (parseInt(code) === generatedCode) {
      try {
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      } catch (error) {
        setError('server error, please try again later..');
        console.error('verification error:', error);
      }
    } else {
      setError('incorrect verification code.');
    }
  };

  return (
    <div className="login">
      <h2>log in</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!generatedCode ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="enter your email..."
              required
            />
          </div>
          <button type="submit">send code</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div>
            <label>enter verification code</label>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="enter verification code..."
              required
            />
          </div>
          <button type="submit">verify</button>
        </form>
      )}

      <button onClick={() => navigate('/signup')}>sign up</button>
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

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const emailLowerCase = email.toLowerCase();
    setEmail(emailLowerCase);

    if (!validateEmail(emailLowerCase)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const checkResponse = await axios.post(`${API_URL}/check-user`, { email: emailLowerCase });
      
      if (checkResponse.data.exists) {
        setError('email already has an account..');
        return;
      }

      const newCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(newCode);
      console.log(`verification code sent to ${emailLowerCase}: ${newCode}`);
      setError('');
    } catch (error) {
      setError('server error, please try again later.');
      console.error('sign-up error:', error);
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
        
        alert('account created successfully!');
        navigate('/login');
      } catch (error) {
        setError('server error, please try again later..');
        console.error('verification error:', error);
      }
    } else {
      setError('incorrect verification code..');
    }
  };

  return (
    <div className="login">
      <h2>sign up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!generatedCode ? (
        <form onSubmit={handleSignUp}>
          <div>
            <label>name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value.toLowerCase())}
              placeholder="enter your name"
              required
            />
          </div>
          <div>
            <label>birthday</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div>
            <label>email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit">send code</button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <div>
            <label>enter verification code</label>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="enter the code"
              required
            />
          </div>
          <button type="submit">verify</button>
        </form>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>dashboard</h2>
      <p>welcome to the app!</p>
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
