import React, { useState } from 'react';
import './css/Emotions.css';
import { useNavigate } from 'react-router-dom';

const Emotions = () => {
  const [mood, setMood] = useState(null);
  const navigate = useNavigate();

  const handleMoodClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = -((y / rect.height) * 2 - 1);

    setMood({
      x: normalizedX.toFixed(1),
      y: normalizedY.toFixed(2),
    });
  };

  return (
    <div className="mood-page">
      <h2>how do you feel right now?</h2>
      <p>click anywhere on the graph below to mark your current emotion</p>

      <div className="mood-graph" onClick={handleMoodClick}>
        <div className="axis x-axis">pleasant →</div>
        <div className="axis y-axis">↑ energy</div>

        {mood && (
          <div
            className="mood-dot"
            style={{
              left: `${((parseFloat(mood.x) + 1) / 2) * 100}%`,
              top: `${((1 - parseFloat(mood.y)) / 2) * 100}%`,
            }}
          />
        )}
      </div>

      {mood && (
        <div className="mood-data">
          <p><strong>pleasantness:</strong> {mood.x}</p>
          <p><strong>energy:</strong> {mood.y}</p>
        </div>
      )}

      <button onClick={() => navigate('/dashboard')} className="back-btn">
        back to dashboard
      </button>
    </div>
  );
};

export default Emotions;
