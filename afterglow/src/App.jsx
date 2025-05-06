import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

///dont change, 2044 is the port for the server
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

function Dashboard() {
  const [journalPrompt, setJournalPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState(''); // added for user journal input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getJournalIdea = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://ai.hackclub.com/chat/completions',
        {
          messages: [{ role: 'user', content: 'give me a thoughtful idea for a journal. just give me the idea, make it 2 sentences max and make the response LOWERCASE' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      setJournalPrompt(content || 'No prompt returned.');
    } catch (err) {
      console.error('Error fetching journal prompt:', err);
      setError('failed to fetch journal prompt.');
    } finally {
      setLoading(false);
    }
  };

  const handleEntryChange = (e) => {
    const lowercaseText = e.target.value.toLowerCase(); // forces input to lowercase
    setJournalEntry(lowercaseText);
  }; 

  const handleSaveEntry = async () => {
    const userEmail = localStorage.getItem('userEmail');

    try {
      const response = await axios.post(`${API_URL}/check-user`, { email: userEmail });

      if (!response.data.userId) {
        setError('user not found');
        return;
      }

      await axios.post(`${API_URL}/journal`, {
        userId: response.data.userId,
        content: journalEntry,
      });

      alert('journal is updated');
    } catch (err) {
      console.error(`error saving journal: ${err}`);
      setError('failed to save journal entry');
    }
  };

  return (
    <div className="dashboard">
      <h2>dashboard</h2>
      <p>welcome to the app!</p>

      <button onClick={getJournalIdea}>
        {loading ? 'getting idea...' : 'get journal idea'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {journalPrompt && (
        <div>
          <h3>journal idea:</h3>
          <p>{journalPrompt}</p>

          <textarea
            value={journalEntry}
            onChange={handleEntryChange}
            rows={6}
            placeholder="start writing here... lowercase only"
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              fontSize: '1rem',
              background: '#1e1e1e',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '8px',
              resize: 'none',
            }}
          /> 

          <button onClick={handleSaveEntry} style={{ marginTop: '1rem' }}>
            save entry
          </button> 
        </div>
      )}
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
