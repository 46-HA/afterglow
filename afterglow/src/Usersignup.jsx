// SignUp.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:2044/api'; // don't change

export default function SignUp() {
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
      setError('please enter a valid email..');
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
      setError('server error, please try again.');
      console.error(`sign up error: ${error}`);
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

        await axios.post(`${API_URL}/verify`, { email }); // fixed typo in endpoint

        alert('account created successfully!');
        navigate('/login');
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
