import { useState, useEffect, useCallback } from 'react';
import './css/Friends.css';
import axios from 'axios';

export default function Friends() {
  const [friendEmail, setFriendEmail] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
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

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:2044/api/friend-requests', {
        email: userEmail,
      });
      setPendingRequests(res.data.requests);
    } catch {
      setError('could not load friend requests');
    }
  }, [userEmail]);

  const sendRequest = async () => {
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:2044/api/send-friend-request', {
        fromEmail: userEmail,
        toEmail: friendEmail,
      });
      setMessage('friend request sent');
      setFriendEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'failed to send request');
    }
  };

  const acceptRequest = async (requesterEmail) => {
    try {
      await axios.post('http://localhost:2044/api/accept-friend-request', {
        userEmail,
        requesterEmail,
      });
      fetchFriends();
      fetchRequests();
    } catch {
      setError('failed to accept request');
    }
  };

  const rejectRequest = async (requesterEmail) => {
    try {
      await axios.post('http://localhost:2044/api/reject-friend-request', {
        userEmail,
        requesterEmail,
      });
      fetchRequests();
    } catch {
      setError('failed to reject request');
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, [fetchFriends, fetchRequests]);

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
        <button onClick={sendRequest}>send request</button>
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

      <h3>pending requests</h3>
      <ul className="requests-list">
        {pendingRequests.map((req) => (
          <li key={req._id}>
            {req.firstName} ({req.email})
            <button onClick={() => acceptRequest(req.email)}>accept</button>
            <button onClick={() => rejectRequest(req.email)}>reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
