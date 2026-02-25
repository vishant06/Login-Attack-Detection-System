import { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await api.get('/logs');
      setLogs(res.data);
    };
    fetchLogs();
  }, []);

  return (
    <section className="card">
      <h2>Security Logs</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Username</th>
              <th>Status</th>
              <th>IP</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.username}</td>
                <td><span className={`badge ${log.status.toLowerCase()}`}>{log.status}</span></td>
                <td>{log.ip}</td>
                <td>{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
