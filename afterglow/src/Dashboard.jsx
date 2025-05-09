import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:2044/api';

export default function Dashboard() {
  const [journalPrompt, setJournalPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getJournalIdea = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://ai.hackclub.com/chat/completions',
        {
          messages: [
            {
              role: 'user',
              content:
                'give me a thought idea for a journal. just give the the idea, make it 2 sentences max. ALL LOWERCASE',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      setJournalPrompt(content || 'no prompt returned');
    } catch (err) {
      console.error(`error fetching journal prompt: ${err}`);
      setError('failed to fetch journal prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleEntryChange = (e) => {
    const lowercaseText = e.target.value.toLowerCase();
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
      alert('journal updated');
    } catch (err) {
      console.error(`error saving journal: ${err}`);
      setError('failed to save journal entry');
    }
  };

  return (
    <div className="dashboard">
      <h2>dashboard</h2>
      <p>welcome to afterglow!</p>

      <button onClick={() => navigate('/mood')} style={{ marginTop: '1rem' }}>
        track your mood
      </button>

<button onClick={() => navigate('/emotion')} style={{ marginTop: '1rem' }}>
  custom mood tracker
</button>

      <button onClick={getJournalIdea} style={{ marginTop: '1rem' }}>
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
            placeholder="start writing here..."
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
