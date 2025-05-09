import './css/index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MoodTracker from './MoodTracker.jsx';
import Dashboard from './Dashboard';
import Login from './Userlogin';
import SignUp from "./Usersignup";
import Emotions from './Emotions.jsx';

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mood" element={<MoodTracker />} />
      <Route path="/emotion" element={<Emotions />} />
    </Routes>
  );
}
