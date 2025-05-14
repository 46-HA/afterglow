import { useState, useEffect, useCallback } from 'react'; // ✅ Added useCallback
import './css/Friends.css'; // ✅ Fixed backticks to quotes
import axios from 'axios';

export default function Friends() {
  const [friendEmail, setFriendEmail] = useState('');
  const [friendsList, setFriendsList] = useState([]); // ✅ Fixed typo
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const userEmail = localStorage.getItem('userEmail');

  const fetchFriends = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:2044/api/friends', {
        email: userEmail,
      });
      setFriendsList(res.data.friends);
    } catch {
      setError('could not load friends');
    }
  }, [userEmail]);

  const addFriend = async () => {
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:2044/api/add-friend', {
        userEmail,
        friendEmail,
      });
      setMessage('friend added');
      setFriendEmail('');
      fetchFriends(); // Refresh the list after adding
    } catch (err) {
      setError(err.response?.data?.message || 'failed to add friend');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="friends-container">
      <h2>your friends</h2>

      <div className="add-friend-section">
        <input
          type="email"
          placeholder="friend's email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
        />
        <button onClick={addFriend}>add friend</button>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <ul className="friends-list">
        {friendsList.map((friend) => (
          <li key={friend._id}>
            {friend.firstName} ({friend.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
