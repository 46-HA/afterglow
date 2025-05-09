import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/MoodTracker.css';

const moods = [
  { emoji: '😀', label: 'happy', color: "#ffeb3b" },
  { emoji: '😔', label: 'sad', color: "#90caf9" },
  { emoji: '😡', label: 'angry', color: "#ef5350" },
  { emoji: '😰', label: 'anxious', color: "#b39ddb" },
  { emoji: '😐', label: 'neutral', color: "#b0bbec5" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [feeling, setFeeling] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const email = localStorage.getItem('userEmail');

    if (!selectedMood || !feeling) {
      setError('please select a mood and write how you feel!');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:2044/api/check-user`, { email });

      const userId = res.data.userId;

      await axios.post("http://localhost:2044/api/mood", {
        userId,
        mood: selectedMood.label,
        color: selectedMood.color,
        note: feeling.toLowerCase(),
      });

      setSubmitted(true);
    } catch (err) {
      console.log(err);
      setError("something went wrong, try again later..");
    }
  };

  return (
    <div
      className="mood-container"
      style={{ backgroundColor: selectedMood ? selectedMood.color : '#111', transition: 'background-color 0.5s' }}
    >
      <h2>how are you feeling today?</h2>

      <div className="mood-options">
        {moods.map((mood) => (
          <div
            key={mood.label}
            className={`mood-item ${selectedMood?.label === mood.label ? 'selected' : ''}`}
            onClick={() => setSelectedMood(mood)} 
            style={{ transform: selectedMood?.label === mood.label ? 'scale(1.3)' : 'scale(1)' }}
          >
            <span role="img" aria-label={mood.label}>
              {mood.emoji}
            </span>
          </div>
        ))}
      </div>

      <textarea
        placeholder="why do you feel this way?"
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        className="mood-textarea"
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button className="submit-btn" onClick={handleSubmit}>submit mood</button>

      {submitted && (
        <div className="thank-you">
          <p>thanks for sharing 💜</p>
          <button onClick={() => navigate('/dashboard')}>back to dashboard</button>
        </div>
      )}
    </div>
  );
}
