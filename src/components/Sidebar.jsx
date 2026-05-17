import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, removeUser } from '../utils/storage';
import logo from '../assets/logo (1).png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const role = user?.role || 'Learner';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Role-based nav items
  const allNavItems = [
    { icon: '⊞', label: 'Dashboard', path: '/dashboard', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '🏢', label: 'Rooms', path: '/rooms', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '📁', label: 'Projects', path: '/projects', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '✅', label: 'Tasks', path: '/tasks', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '💬', label: 'Messages', path: '/messages', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '📂', label: 'Files', path: '/files', roles: ['Mentor', 'Admin'] },
    { icon: '📅', label: 'Calendar', path: '/calendar', roles: ['Learner', 'Mentor', 'Admin'] },
    { icon: '⚙️', label: 'Settings', path: '/settings', roles: ['Learner', 'Mentor', 'Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    removeUser();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div style={{
        width: '240px',
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        top: 0, left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <img
            src={logo} alt="CoLabX"
            onClick={() => navigate('/dashboard')}
            style={{ height: '38px', objectFit: 'contain', cursor: 'pointer', display: 'block' }}
          />
        </div>

        

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 14px', borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer', marginBottom: '2px',
                  background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                  color: active ? 'var(--green)' : 'var(--text-muted)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px', transition: 'all 0.2s ease',
                }}
                onMouseOver={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseOut={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div style={{ padding: '10px 10px', borderTop: '1px solid var(--border)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div style={{
              position: 'absolute', bottom: '160px', left: '12px', right: '12px',
              background: '#1a2234', border: '1px solid var(--border)',
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.4)', zIndex: 100
            }}>
              {/* User info */}
              <div style={{
                padding: '14px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '14px', color: '#fff', flexShrink: 0
                }}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{user?.email}</div>
                </div>
              </div>

              {/* Add Another Account */}
              <div
                onClick={() => { navigate('/signup'); setShowProfileDropdown(false); }}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontSize: '13px', color: 'var(--text-muted)', transition: '0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                ➕ Add Another Account
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px',
              background: showProfileDropdown ? 'rgba(16,185,129,0.08)' : 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: showProfileDropdown ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--border)',
              cursor: 'pointer', transition: '0.2s'
            }}
            onMouseOver={e => { if (!showProfileDropdown) e.currentTarget.style.borderColor = 'var(--green)'; }}
            onMouseOut={e => { if (!showProfileDropdown) e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '14px', color: '#fff', flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div style={{
                fontSize: '11px', color: 'var(--gold)',
                background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                padding: '1px 8px', borderRadius: '20px',
                display: 'inline-block', marginTop: '2px'
              }}>
                {user?.role || 'Learner'}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', transition: '0.3s', transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</div>
          </div>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: '100%', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--text-muted)',
              padding: '9px 14px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center',
              justifyContent: 'flex-start', gap: '10px',
              transition: 'all 0.3s', marginBottom: '1px'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            🚪 Logout
          </button>

          {/* Go to Home Page */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '14px', transition: 'all 0.2s ease',marginBottom: '6px'
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.borderColor = 'var(--green)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            🏠 Go to Home Page
          </div>
        </div>
      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div style={{
            background: '#111827', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '380px',
            textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
          }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 20px'
            }}>🚪</div>

            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
              Confirm Logout
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Are you sure you want to logout from <span style={{ color: 'var(--green)', fontWeight: 600 }}>CoLabX</span>?
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{
                flex: 1, background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', padding: '12px', borderRadius: '10px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif', transition: '0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >Cancel</button>
              <button onClick={handleLogout} style={{
                flex: 1, background: 'var(--red)', border: 'none', color: '#fff',
                padding: '12px', borderRadius: '10px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', transition: '0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.background = '#DC2626'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--red)'}
              >Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;