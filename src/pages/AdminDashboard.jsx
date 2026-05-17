import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getUsers, saveUsers, getTasks, getRooms, getProjects, getMessages, getFiles } from '../utils/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [activeTab, setActiveTab] = useState('Overview');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    setUsers(getUsers());
    setTasks(getTasks());
    setRooms(getRooms());
    setProjects(getProjects());
    setMessages(getMessages());
    setFiles(getFiles());
  }, []);

  const handleRoleChange = (userId, newRole) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    saveUsers(updated);
    setUsers(updated);
  };

  const handleDeleteUser = (userId) => {
    const updated = users.filter(u => u.id !== userId);
    saveUsers(updated);
    setUsers(updated);
    setShowDeleteConfirm(null);
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = { Admin: 'var(--red)', Mentor: 'var(--green)', Learner: 'var(--gold)', Guest: 'var(--text-muted)' };
  const roleBg = { Admin: 'rgba(239,68,68,0.1)', Mentor: 'rgba(16,185,129,0.1)', Learner: 'var(--gold-dark)', Guest: 'var(--bg-card)' };

  const tabs = [
    { label: 'Overview', icon: '📊' },
    { label: 'Users', icon: '👥' },
    { label: 'Projects', icon: '📁' },
    { label: 'Rooms', icon: '🏢' },
  ];

  const overviewStats = [
    { label: 'Total Users', value: users.length, icon: '👥', color: 'var(--green)', },
    { label: 'Total Projects', value: projects.length, icon: '📁', color: 'var(--gold)' },
    { label: 'Active Rooms', value: rooms.length, icon: '🏢', color: 'var(--blue)' },
    { label: 'Total Tasks', value: tasks.length, icon: '✅', color: 'var(--amber)' },
    { label: 'Messages', value: messages.length, icon: '💬', color: 'var(--green)' },
    { label: 'Files', value: files.length, icon: '📂', color: 'var(--red)' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
              🛡️ <span style={{ color: 'var(--red)' }}>Admin</span> Panel
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Full system control — manage users, projects, and rooms.
            </p>
          </div>
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            padding: '8px 18px', borderRadius: '20px',
            fontSize: '13px', color: 'var(--red)', fontWeight: 600
          }}>
            🛡️ Admin — {currentUser?.name}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        {tabs.map(tab => (
          <button key={tab.label} onClick={() => setActiveTab(tab.label)} style={{
            padding: '10px 22px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
            background: activeTab === tab.label ? 'var(--red)' : 'var(--bg-surface)',
            color: activeTab === tab.label ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === tab.label ? 'none' : '1px solid var(--border)'
          }}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === 'Overview' && (
        <div>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {overviewStats.map(s => (
              <div key={s.label} className="card" style={{ transition: '0.3s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                  </div>
                  <div style={{
                    width: '44px', height: '44px', background: `${s.color}15`,
                    border: `1px solid ${s.color}30`, borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                  }}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Role Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>👥 Users by Role</h3>
              {['Admin', 'Mentor', 'Learner', 'Guest'].map(role => {
                const count = users.filter(u => u.role === role).length;
                const pct = users.length ? Math.round((count / users.length) * 100) : 0;
                return (
                  <div key={role} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: roleColor[role] }}>{role}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{count} users ({pct}%)</span>
                    </div>
                    <div style={{ background: 'var(--bg-card)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: roleColor[role], borderRadius: '10px', transition: '0.5s'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Signups */}
            <div className="card">
              <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>🆕 Recent Signups</h3>
              {users.slice(-5).reverse().map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>{u.name?.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{u.email}</div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: roleColor[u.role], background: roleBg[u.role],
                    border: `1px solid ${roleColor[u.role]}30`,
                    padding: '2px 8px', borderRadius: '20px'
                  }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>📊 Tasks Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[
                { label: 'Todo', count: tasks.filter(t => t.status === 'Todo').length, color: 'var(--text-muted)' },
                { label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length, color: 'var(--blue)' },
                { label: 'Done', count: tasks.filter(t => t.status === 'Done').length, color: 'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-card)', border: `1px solid ${s.color}30`,
                  borderRadius: '12px', padding: '20px', textAlign: 'center'
                }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== USERS ===== */}
      {activeTab === 'Users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700 }}>
              All Users ({users.length})
            </h2>
            <input
              className="input-field"
              placeholder="🔍 Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: '260px' }}
            />
          </div>

          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
              padding: '14px 24px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg-card)'
            }}>
              {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <div key={h} style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {filteredUsers.map((u, i) => (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
                padding: '16px 24px',
                borderBottom: i < filteredUsers.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center', transition: '0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>{u.name?.charAt(0).toUpperCase()}</div>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{u.name}</span>
                </div>

                {/* Email */}
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{u.email}</div>

                {/* Role Dropdown */}
                <div>
                  {u.id === currentUser?.id ? (
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      color: roleColor[u.role], background: roleBg[u.role],
                      border: `1px solid ${roleColor[u.role]}30`,
                      padding: '3px 10px', borderRadius: '20px'
                    }}>{u.role}</span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{
                        background: roleBg[u.role], border: `1px solid ${roleColor[u.role]}30`,
                        color: roleColor[u.role], padding: '4px 8px',
                        borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        cursor: 'pointer', outline: 'none'
                      }}
                    >
                      <option value="Learner">Learner</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Admin">Admin</option>
                      <option value="Guest">Guest</option>
                    </select>
                  )}
                </div>

                {/* Joined */}
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{u.joinedAt || '—'}</div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => setShowDeleteConfirm(u.id)}
                      style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: 'var(--red)', padding: '6px 12px', borderRadius: '8px',
                        cursor: 'pointer', fontSize: '12px', transition: '0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    >🗑️ Delete</button>
                  )}
                  {u.id === currentUser?.id && (
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>You</span>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
                <div style={{ fontSize: '14px' }}>No users found</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PROJECTS ===== */}
      {activeTab === 'Projects' && (
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
            All Projects ({projects.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {projects.map(p => {
              const tagColor = { Design: 'var(--green)', Dev: 'var(--gold)', Mobile: 'var(--blue)', Research: 'var(--amber)', Other: 'var(--text-muted)' };
              const color = tagColor[p.tag] || 'var(--green)';
              return (
                <div key={p.id} className="card" style={{ cursor: 'pointer', transition: '0.3s' }}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '11px', color, background: `${color}15`, padding: '2px 8px', borderRadius: '20px' }}>{p.tag}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>👤 {p.owner}</div>
                  <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', height: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${p.progress || 0}%`, background: color, borderRadius: '10px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>👍 {p.votes || 0} votes</span>
                    <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{p.progress || 0}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          {projects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <div>No projects yet</div>
            </div>
          )}
        </div>
      )}

      {/* ===== ROOMS ===== */}
      {activeTab === 'Rooms' && (
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
            All Rooms ({rooms.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {rooms.map(r => {
              const typeColor = { Public: 'var(--green)', Private: 'var(--gold)', Restricted: 'var(--red)' };
              const typeIcon = { Public: '🌐', Private: '🔒', Restricted: '🛡️' };
              const color = typeColor[r.type] || 'var(--green)';
              return (
                <div key={r.id} className="card" style={{ cursor: 'pointer', transition: '0.3s' }}
                  onClick={() => navigate('/rooms')}
                  onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{typeIcon[r.type] || '🏢'}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{r.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>👥 {r.members} members</div>
                  <span style={{
                    fontSize: '10px', color, background: `${color}15`,
                    border: `1px solid ${color}30`, padding: '3px 10px', borderRadius: '20px', fontWeight: 600
                  }}>{r.type}</span>
                </div>
              );
            })}
          </div>
          {rooms.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
              <div>No rooms yet</div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }} onClick={() => setShowDeleteConfirm(null)}>
          <div style={{
            background: '#111827', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '380px',
            textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', margin: '0 auto 20px'
            }}>🗑️</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>Delete User?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              This action cannot be undone. User will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{
                flex: 1, background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', padding: '12px', borderRadius: '10px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
              }}>Cancel</button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm)} style={{
                flex: 1, background: 'var(--red)', border: 'none', color: '#fff',
                padding: '12px', borderRadius: '10px', cursor: 'pointer',
                fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;