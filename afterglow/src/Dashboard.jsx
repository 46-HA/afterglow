import './css/Dashboard.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:2044/api';
const WEATHER_API_KEY = '0ca7d9ac3fbf28ff0b412e5961fdcd3e';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [weather, setWeather] = useState(null);
  const [journalPrompt, setJournalPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [friendsList, setFriendsList] = useState([]);
                                           const [chatOpen, setChatOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios
        .post(`${API_URL}/get-user-name`, { email })
        .then((res) => setName(res.data.name || 'buddy'))
        .catch(() => setName('buddy'));
    }
  }, []);

  // Fetch friends list
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      axios
        .post(`${API_URL}/friends`, { email })
        .then((res) => setFriendsList(res.data.friends || []))
        .catch(() => setError('Could not load friends'));
    }
  }, []);

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const sendMessage = () => {
    if (message.trim() && selectedFriend) {
      console.log(`Send message: ${message} to ${selectedFriend.email}`);
      setMessage('');
    }
  };

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setChatOpen(true);
  };

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
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const content = response.data.choices?.[0]?.message?.content;
      setJournalPrompt(content || 'no prompt returned');
    } catch {
      setError('failed to fetch journal prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const res = await axios.post(`${API_URL}/check-user`, { email: userEmail });
      if (!res.data.userId) return setError('user not found');

      await axios.post(`${API_URL}/journal`, {
        userId: res.data.userId,
        content: journalEntry,
      });

      alert('journal updated');
    } catch {
      setError('failed to save journal entry');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content fade-in">
        <h2>{greeting}, {name}! 🌞</h2>
        <p>welcome to afterglow.</p>

        {weather && (
          <p className="weather-info">
            it's currently {weather.temp}°C and {weather.condition} in {weather.city}. 🌤️
          </p>
        )}

        <div className="button-group">
          <button onClick={() => navigate('/mood')}>track your mood</button>
          <button onClick={() => navigate('/emotion')}>custom mood tracker</button>
          <button onClick={getJournalIdea}>
            {loading ? 'getting idea...' : 'get journal idea'}
          </button>
          <button onClick={() => navigate('/habit')}>habit tracker</button>
          <button onClick={() => navigate('/friends')}>friends</button>
        </div>

        {/* Friends Chat Button */}
        <button className="chat-toggle" onClick={handleChatToggle}>
          {chatOpen ? 'Close Chat' : 'Chat with Friends'}
        </button>

        {/* Chat UI */}
        {chatOpen && (
          <div className="chat-box">
            <div className="friends-list">
              <h3>Friends</h3>
              <ul>
                {friendsList.map((friend) => (
                  <li key={friend._id || friend.email} onClick={() => handleFriendClick(friend)}>
                    {friend.firstName || 'Unknown'} ({friend.email || 'No email'})
                  </li>
                ))}
              </ul>
            </div>

            {selectedFriend && (
              <div className="chat-window">
                <h4>Chat with {selectedFriend.firstName || 'Unknown'}</h4>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            )}
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {journalPrompt && (
          <div className="journal-section">
            <h3>journal idea:</h3>
            <p className="prompt">{journalPrompt}</p>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value.toLowerCase())}
              placeholder="start writing here..."
            />
            <button onClick={handleSaveEntry}>save entry</button>
          </div>
        )}
      </div>
    </div>
  );
}
