import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="nav">
      <h1>Login Attack Detection System</h1>
      <div className="links">
        <NavLink to="/" end>Login</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/logs">Security Logs</NavLink>
        <NavLink to="/admin">Admin Panel</NavLink>
      </div>
    </nav>
  );
}
