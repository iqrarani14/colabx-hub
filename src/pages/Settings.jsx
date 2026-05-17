import { useState, useRef } from 'react';
import { getUser, saveUser, getUsers, saveUsers } from '../utils/storage';

const Settings = () => {
  const user = getUser();
  const [activeTab, setActiveTab] = useState('Profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Learner',
    bio: user?.bio || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const avatarRef = useRef(null);
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  });
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [notifs, setNotifs] = useState({
    roomInvites: true,
    projectUpdates: true,
    newMessages: true,
    taskReminders: false,
    reputationUpdates: true,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveProfile = () => {
    setError('');
    if (!profile.name || !profile.email) {
      setError('Name and email are required!');
      return;
    }
    const updated = { ...user, ...profile, avatar };
    saveUser(updated);
    setSaved('Profile saved successfully!');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleChangePassword = () => {
    setError('');
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setError('Please fill all password fields!');
      return;
    }
    if (passwords.current !== user?.password) {
      setError('Current password is incorrect!');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setError('New passwords do not match!');
      return;
    }
    if (passwords.newPass.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    const updated = { ...user, password: passwords.newPass };
    saveUser(updated);

    const allUsers = getUsers();
    const updatedUsers = allUsers.map(u =>
      u.email === user.email ? { ...u, password: passwords.newPass } : u
    );
    saveUsers(updatedUsers);

    setPasswords({ current: '', newPass: '', confirm: '' });
    setSaved('Password changed successfully!');
    setTimeout(() => setSaved(''), 3000);
  };

  const tabs = [
    { label: 'Profile', icon: '👤' },
    { label: 'Password', icon: '🔐' },
    { label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          <span style={{ color: 'var(--gold)' }}>Settings</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Manage your account and preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>

        {/* Sidebar Tabs */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px', height: 'fit-content'
        }}>
          {tabs.map(tab => (
            <div key={tab.label}
              onClick={() => { setActiveTab(tab.label); setError(''); setSaved(''); }}
              style={{
                padding: '12px 16px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                marginBottom: '4px', transition: '0.2s',
                background: activeTab === tab.label ? 'rgba(16,185,129,0.1)' : 'transparent',
                color: activeTab === tab.label ? 'var(--green)' : 'var(--text-muted)',
                border: activeTab === tab.label ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
              }}
              onMouseOver={e => { if (activeTab !== tab.label) e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseOut={e => { if (activeTab !== tab.label) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px'
        }}>
          {/* Success */}
          {saved && (
            <div style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px', padding: '12px 16px',
              fontSize: '13px', color: 'var(--green)', marginBottom: '24px'
            }}>✅ {saved}</div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px',
              fontSize: '13px', color: 'var(--red)', marginBottom: '24px'
            }}>⚠️ {error}</div>
          )}

          {/* ===== PROFILE ===== */}
          {activeTab === 'Profile' && (
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '28px' }}>
                Profile Information
              </h2>

              {/* Avatar Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ position: 'relative' }}>
                  {avatar ? (
                    <img src={avatar} alt="avatar" style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      objectFit: 'cover', border: '3px solid var(--green)'
                    }} />
                  ) : (
                    <div style={{
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#fff'
                    }}>
                      {profile.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Camera icon overlay */}
                  <div
                    onClick={() => avatarRef.current.click()}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: 'var(--green)', border: '2px solid var(--bg-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: '12px'
                    }}
                  >📷</div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={avatarRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />

                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 700 }}>
                    {profile.name || 'Your Name'}
                  </div>
                  <div style={{
                    display: 'inline-block', marginTop: '6px',
                    background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                    padding: '4px 14px', borderRadius: '20px',
                    fontSize: '12px', color: 'var(--gold)', fontWeight: 600
                  }}>🥇 {profile.role}</div>
                  <div
                    onClick={() => avatarRef.current.click()}
                    style={{
                      fontSize: '12px', color: 'var(--green)', cursor: 'pointer',
                      marginTop: '6px', display: 'block'
                    }}
                  >
                    📷 Change Photo
                  </div>
                  {avatar && (
                    <div
                      onClick={() => setAvatar(null)}
                      style={{
                        fontSize: '12px', color: 'var(--red)', cursor: 'pointer', marginTop: '4px'
                      }}
                    >
                      🗑️ Remove Photo
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="input-field" value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="input-field" type="email" value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select className="input-field" value={profile.role}
                  onChange={e => setProfile({ ...profile, role: e.target.value })}
                  disabled={user?.role !== 'Admin'}
                  style={{ opacity: user?.role !== 'Admin' ? 0.6 : 1 }}>
                  <option value="Learner">🎓 Learner</option>
                  <option value="Mentor">👨‍🏫 Mentor</option>
                  <option value="Admin">🛡️ Admin</option>
                  <option value="Guest">👤 Guest</option>
                </select>
                {user?.role !== 'Admin' && (
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                    Only Admin can change roles.
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea className="input-field" rows={3} value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  style={{ resize: 'none' }} />
              </div>

              <button className="btn-green" onClick={handleSaveProfile}>
                💾 Save Profile
              </button>
            </div>
          )}

          {/* ===== PASSWORD ===== */}
          {activeTab === 'Password' && (
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '28px' }}>
                Change Password
              </h2>
              <div style={{ maxWidth: '400px' }}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input className="input-field" type="password"
                    placeholder="Enter current password"
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input className="input-field" type="password"
                    placeholder="Min 6 characters"
                    value={passwords.newPass}
                    onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input className="input-field" type="password"
                    placeholder="Repeat new password"
                    value={passwords.confirm}
                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                </div>
                <button className="btn-green" onClick={handleChangePassword}>
                  🔐 Change Password
                </button>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeTab === 'Notifications' && (
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '28px' }}>
                Notification Preferences
              </h2>
              {[
                { key: 'roomInvites', label: 'Room Invitations', desc: 'Get notified when someone invites you to a room.' },
                { key: 'projectUpdates', label: 'Project Updates', desc: 'Get notified when a project you follow is updated.' },
                { key: 'newMessages', label: 'New Messages', desc: 'Get notified when you receive a new message.' },
                { key: 'taskReminders', label: 'Task Reminders', desc: 'Get reminded about upcoming task deadlines.' },
                { key: 'reputationUpdates', label: 'Reputation Updates', desc: 'Get notified when you earn points or badges.' },
              ].map((n, i, arr) => (
                <div key={n.key} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{n.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{n.desc}</div>
                  </div>
                  <div
                    onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    style={{
                      width: '48px', height: '26px',
                      background: notifs[n.key] ? 'var(--green)' : 'var(--bg-card)',
                      border: notifs[n.key] ? 'none' : '1px solid var(--border)',
                      borderRadius: '13px', cursor: 'pointer',
                      position: 'relative', transition: '0.3s', flexShrink: 0
                    }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#fff', position: 'absolute', top: '3px',
                      left: notifs[n.key] ? '25px' : '3px',
                      transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>
              ))}

              <button className="btn-green" style={{ marginTop: '24px' }}
                onClick={() => {
                  localStorage.setItem('colabx_notifs', JSON.stringify(notifs));
                  setSaved('Notification preferences saved!');
                  setTimeout(() => setSaved(''), 3000);
                }}>
                💾 Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;