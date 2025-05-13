import React, { useState, useEffect } from 'react';
import './css/index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MoodTracker from './MoodTracker.jsx';
import Dashboard from './Dashboard';
import Login from './Userlogin';
import SignUp from "./Usersignup";
import Emotions from './Emotions.jsx';
import Reminders from './Reminders.jsx';
import Habit from './Habit.jsx';

import sunIcon from './images/sun.png';
import moonIcon from './images/moon.png';

function Home({ toggleTheme, theme }) {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <h1>afterglow.</h1>
      <p>change the trajectory of your life.</p>
      <p>build good habits.</p>
      <button onClick={() => navigate('/login')}>log in</button>

      <button className="theme-toggle" onClick={toggleTheme}>
        <img src={theme === 'dark' ? sunIcon : moonIcon} alt="Toggle theme" />
      </button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark'); 

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Routes>
      <Route path="/" element={<Home toggleTheme={toggleTheme} theme={theme} />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mood" element={<MoodTracker />} />
      <Route path="/emotion" element={<Emotions />} />
      <Route path="/reminders" element={<Reminders />} />
      <Route path="/habit" element={<Habit />} />
    </Routes>
  );
}
