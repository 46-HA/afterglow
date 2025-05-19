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
      setFriendsList(res.data.friends || []);
    } catch {
      setError('Could not load friends');
    }
  }, [userEmail]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:2044/api/friend-requests', {
        email: userEmail,
      });
      setPendingRequests(res.data.requests || []);
    } catch {
      setError('Could not load friend requests');
    }
  }, [userEmail]);

  const sendRequest = async () => {
    setError('');
    setMessage('');
    if (!friendEmail) {
      setError('Please enter an email.');
      return;
    }

    try {
      await axios.post('http://localhost:2044/api/send-friend-request', {
        fromEmail: userEmail,
        toEmail: friendEmail,
      });
      setFriendEmail('');
      setMessage('Request sent!');
      fetchRequests();
    } catch {
      setError('Failed to send friend request');
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
      setError('Failed to accept request');
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
      setError('Failed to reject request');
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchFriends();
      fetchRequests();
    } else {
      setError('No user is logged in.');
    }
  }, [userEmail, fetchFriends, fetchRequests]);

  return (
    <div className="friends-container">
      <h2>your friends</h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="add-friend-section">
        <input
          type="email"
          placeholder="Friend's email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
        />
        <button onClick={sendRequest} disabled={!friendEmail}>
          send friend request
        </button>
      </div>

      <div className="friends-list-section">
        <h3>friends</h3>
        {friendsList.length > 0 ? (
          <ul className="friends-list">
            {friendsList.map((friend) => (
              <li key={friend._id || friend.email}>
                {friend.firstName || 'Unknown'} ({friend.email || 'No email'})
              </li>
            ))}
          </ul>
        ) : (
          <p>no friends yet.</p>
        )}
      </div>

      <div className="requests-section">
        <h3>pending</h3>
        {pendingRequests.length > 0 ? (
          <ul className="requests-list">
            {pendingRequests.map((req) => (
              <li key={req._id || req.email}>
                {req.firstName || 'Unknown'} ({req.email || 'No email'})
                <button onClick={() => acceptRequest(req.email)}>accept</button>
                <button onClick={() => rejectRequest(req.email)}>reject</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>no pending requests.</p>
        )}
      </div>
    </div>
  );
}
