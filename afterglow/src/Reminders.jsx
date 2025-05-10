import React, { useEffect } from 'react';

function Reminders() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleReminder = () => {
    if (!('Notification' in window)) {
      alert('this browser does not support desktop notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      scheduleNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleNotification();
        } else {
          alert('notification permission denied');
        }
      });
    } else {
      alert('please enable notifications for this site in your browser settings');
    }
  };

  const scheduleNotification = () => {
    setTimeout(() => {
      new Notification('🕒 time to check your habit!', {
        body: 'stay consistent — your future self thanks you.',
        icon: '/icon.png'
      });
    }, 5000);
  };

  return (
    <div className="reminder">
      <h2>habit reminder</h2>
      <button onClick={handleReminder}>remind me in 5 seconds</button>
    </div>
  );
}

export default Reminders;
