import { useState } from 'react';
import { api } from '../api/api';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const unlock = async () => {
    try {
      const res = await api.post('/admin/unlock', { username });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to unlock account.');
    }
  };

  const clearLogs = async () => {
    try {
      const res = await api.post('/admin/clear-logs');
      setMessage(res.data.message);
    } catch (error) {
      setMessage('Failed to clear logs.');
    }
  };

  return (
    <section className="card">
      <h2>Admin Panel</h2>
      <div className="form row">
        <input
          placeholder="Username to unlock"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={unlock}>Unlock Account</button>
        <button className="danger" onClick={clearLogs}>Clear Logs</button>
      </div>
      {message && <p className="message success">{message}</p>}
    </section>
  );
}
