import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, addUser, saveUser } from '../utils/storage';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'Learner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const exists = users.find(u => u.email === form.email);
      if (exists) {
        setError('Email already registered!');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        points: 0,
        joinedAt: new Date().toLocaleDateString(),
      };

      // Add demo accounts if first signup
      if (users.length === 0) {
        const demoUsers = [
          { id: 1, name: 'Admin User', email: 'admin@colabx.com', password: 'admin123', role: 'Admin', points: 500, joinedAt: '01/01/2025' },
          { id: 2, name: 'Mentor Ali', email: 'mentor@colabx.com', password: 'mentor123', role: 'Mentor', points: 320, joinedAt: '01/01/2025' },
          { id: 3, name: 'Learner Sara', email: 'learner@colabx.com', password: 'learner123', role: 'Learner', points: 150, joinedAt: '01/01/2025' },
        ];
        demoUsers.forEach(u => addUser(u));
      }

      addUser(newUser);
      saveUser(newUser);
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* BG Glows */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', right: '-150px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(92,69,40,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        zIndex: 2
      }}>
        {/* Logo + Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div
            onClick={() => navigate('/')}
            style={{
              fontFamily: 'Syne, sans-serif', fontSize: '24px',
              fontWeight: 800, cursor: 'pointer', display: 'inline-block'
            }}
          >
            CoLab<span style={{ color: 'var(--green)' }}>X</span>
          </div>

          {/* Cross Button */}
          <div
            onClick={() => navigate(-1)}
            style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '16px', color: 'var(--text-muted)',
              transition: '0.3s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'var(--red)';
              e.currentTarget.style.color = 'var(--red)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >✕</div>
        </div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '1.8rem',
          fontWeight: 800, marginBottom: '8px'
        }}>
          Create Account 
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Join CoLabX and start collaborating today
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 16px',
            fontSize: '13px', color: 'var(--red)',
            marginBottom: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label>Select Role</label>
          <select
            className="input-field"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="Learner">🎓 Learner</option>
            <option value="Mentor">👨‍🏫 Mentor</option>
            <option value="Admin">🛡️ Admin</option>
          </select>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />
        </div>

        {/* Signup Button */}
        <button
          className="btn-green"
          onClick={handleSignup}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;