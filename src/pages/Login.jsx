import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUser } from '../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (user) {
        saveUser(user);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password!');
      }
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
        position: 'absolute', top: '-200px', right: '-200px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(92,69,40,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        zIndex: 2
      }}>
        {/* Logo */}
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
            onClick={() => navigate('/')}
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
          Welcome Back
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Login to your CoLabX account
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

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Forgot Password */}
        <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '20px' }}>
          <span
            onClick={() => setShowForgot(true)}
            style={{ fontSize: '13px', color: 'var(--green)', cursor: 'pointer', fontWeight: 500 }}
            onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Forgot Password?
          </span>
        </div>

        {/* Login Button */}
        <button
          className="btn-green"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Signup Link */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px' }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}
          onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
        >
          <div style={{
            background: '#111827', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px',
            width: '90%', maxWidth: '380px',
            textAlign: 'center',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
          }}
            onClick={e => e.stopPropagation()}
          >
            {!forgotSent ? (
              <>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '28px',
                  margin: '0 auto 20px'
                }}>🔑</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
                  Forgot Password?
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Enter your email and we'll send you a reset link.
                </p>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  style={{ marginBottom: '16px', textAlign: 'left' }}
                />
                <button
                  className="btn-green"
                  onClick={() => { if (!forgotEmail) return; setForgotSent(true); }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Send Reset Link
                </button>
                <button
                  onClick={() => { setShowForgot(false); setForgotEmail(''); }}
                  style={{
                    width: '100%', marginTop: '10px', background: 'transparent',
                    border: '1px solid var(--border)', color: 'var(--text-muted)',
                    padding: '10px', borderRadius: '10px', cursor: 'pointer',
                    fontSize: '14px', fontFamily: 'DM Sans, sans-serif'
                  }}
                >Cancel</button>
              </>
            ) : (
              <>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '28px',
                  margin: '0 auto 20px'
                }}>✅</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
                  Email Sent!
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                  Reset link sent to <span style={{ color: 'var(--green)', fontWeight: 600 }}>{forgotEmail}</span>. Check your inbox!
                </p>
                <button
                  className="btn-green"
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Back to Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;