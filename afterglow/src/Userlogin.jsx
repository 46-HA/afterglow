// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:2044/api'; // don't change

export default function Login() {
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
      setError("please enter a valid email");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/check-user`, { email: emailLowerCase });
      if (!response.data.exists) {
        setError('no accounts found with that email..');
        return;
      }

      const newCode = Math.floor(1000 + Math.random() * 9000);
      setGeneratedCode(newCode);
      console.log(`verification code sent to ${emailLowerCase}: ${newCode}`);
      setError('');
    } catch (error) {
      setError('server error, please try again later');
      console.error(`login error: ${error}`);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (parseInt(code) === generatedCode) {
      try {
        localStorage.setItem('userEmail', email); // fixed incorrect string interpolation
        navigate('/dashboard');
      } catch (error) {
        setError('server error, please try again later..');
        console.error(`verification error: ${error}`);
      }
    } else {
      setError('incorrect verification code..');
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
              placeholder="enter your email.."
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
