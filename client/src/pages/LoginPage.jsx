import { useState } from 'react';
import { api } from '../api/api';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/auth/login', form);
      setResult({ type: res.data.status || 'Success', message: res.data.message });
    } catch (error) {
      const data = error.response?.data;
      setResult({
        type: data?.status || 'Failed',
        message: data?.message || 'Request failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Login Simulation</h2>
      <p>Try valid and invalid credentials to trigger security controls.</p>
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button disabled={loading}>{loading ? 'Checking...' : 'Login'}</button>
      </form>

      {result && <p className={`message ${result.type.toLowerCase()}`}>{result.type}: {result.message}</p>}

      <div className="hint">
        <strong>Demo users:</strong> student1/password123, admin/admin123
      </div>
    </section>
  );
}
