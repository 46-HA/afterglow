import './css/Habit.css';
import { useEffect, useState } from 'react';

const timeUnits = ['seconds', 'minutes', 'hours', 'days', 'months'];

const habits = [
  { name: 'no social media', key: 'habit_social' },
  { name: 'no sugar', key: 'habit_sugar' },
  { name: 'woke up before 8am', key: 'habit_wakeup' },
];

export default function Habit() {
  const [unit, setUnit] = useState('days');
  const [timestamps, setTimestamps] = useState({});

  useEffect(() => {
    const stored = {};
    habits.forEach(habit => {
      const storedTime = localStorage.getItem(habit.key);
      stored[habit.key] = storedTime ? parseInt(storedTime) : Date.now();
    });
    setTimestamps(stored);
  }, []);

  const resetHabit = (key) => {
    const now = Date.now();
    const updated = { ...timestamps, [key]: now };
    setTimestamps(updated);
    localStorage.setItem(key, now.toString());
  };

  const getElapsed = (startTime) => {
    const now = Date.now();
    const elapsedMs = now - startTime;

    const conversions = {
      seconds: elapsedMs / 1000,
      minutes: elapsedMs / (1000 * 60),
      hours: elapsedMs / (1000 * 60 * 60),
      days: elapsedMs / (1000 * 60 * 60 * 24),
      months: elapsedMs / (1000 * 60 * 60 * 24 * 30),
    };

    return Math.floor(conversions[unit]);
  };

  return (
    <div className="habit-container">
      <h2>habit tracker</h2>
      <div className="unit-selector">
        <label>see time in:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          {timeUnits.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="habit-list">
        {habits.map((habit) => (
          <div className="habit-card" key={habit.key}>
            <p className="habit-name">{habit.name}</p>
            <p className="habit-time">{getElapsed(timestamps[habit.key])} {unit} since</p>
            <button onClick={() => resetHabit(habit.key)}>reset</button>
          </div>
        ))}
      </div>
    </div>
  );
}
