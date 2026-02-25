import { useEffect, useState } from 'react';
import { api } from '../api/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalAttempts: 0, failedAttempts: 0, lockedAccounts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get('/stats');
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <section className="grid">
      <article className="card stat"><h3>Total Attempts</h3><p>{stats.totalAttempts}</p></article>
      <article className="card stat"><h3>Failed Attempts</h3><p>{stats.failedAttempts}</p></article>
      <article className="card stat"><h3>Locked Accounts</h3><p>{stats.lockedAccounts}</p></article>
    </section>
  );
}
