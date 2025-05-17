import './css/Habit.css';
import { useEffect, useState } from 'react';

const timeUnits = ['seconds', 'minutes', 'hours', 'days', 'months'];
const STORAGE_KEY = 'afterglow_habits';

export default function Habit() {
  const [unit, setUnit] = useState('days');
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHabits));
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim().toLowerCase(),
      timestamp: Date.now(),
    };

    const updated = [...habits, newHabit];
    saveHabits(updated);
    setNewHabitName('');
  };

  const resetHabit = (id) => {
    const updated = habits.map(habit =>
      habit.id === id ? { ...habit, timestamp: Date.now() } : habit
    );
    saveHabits(updated);
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

      <div className="habit-input">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="enter a new habit..."
        />
        <button onClick={addHabit}>add habit</button>
      </div>

      <div className="unit-selector">
        <label>see time in:</label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          {timeUnits.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {habits.length === 0 ? (
        <p className="no-habits">no habits tracked yet. add one above 👆</p>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => (
            <div className="habit-card" key={habit.id}>
              <p className="habit-name">{habit.name}</p>
              <p className="habit-time">
                {getElapsed(habit.timestamp)} {unit} since
              </p>
              <button onClick={() => resetHabit(habit.id)}>reset</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
