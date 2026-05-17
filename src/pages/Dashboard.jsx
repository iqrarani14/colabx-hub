import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, saveUser, getTasks, getRooms, getProjects, getMessages, saveNotifications, getNotifications, getUsers } from '../utils/storage';

const tagColor = {
  Design: 'var(--green)', Dev: 'var(--gold)',
  Mobile: 'var(--blue)', Research: 'var(--amber)', Other: 'var(--text-muted)'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const role = user?.role || 'Learner';
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Admin ko admin panel pe redirect karo
    if (role === 'Admin') {
      navigate('/admin');
      return;
    }

    const t = getTasks();
    const r = getRooms();
    const p = getProjects();
    const msgs = getMessages();
    const u = getUsers();
    setTasks(t);
    setRooms(r);
    setProjects(p);
    setAllUsers(u);

    // Activity
    const acts = [];
    r.slice(-2).reverse().forEach(room => {
      acts.push({ text: `Room created: ${room.name}`, time: room.createdAt || 'Recently', color: 'var(--green)', icon: '🏢' });
    });
    p.slice(-2).reverse().forEach(proj => {
      acts.push({ text: `Project added: ${proj.name}`, time: proj.createdAt || 'Recently', color: 'var(--gold)', icon: '📁' });
    });
    t.filter(tk => tk.status === 'Done').slice(-2).reverse().forEach(tk => {
      acts.push({ text: `Task completed: ${tk.title}`, time: tk.createdAt || 'Recently', color: 'var(--blue)', icon: '✅' });
    });
    msgs.slice(-1).forEach(m => {
      acts.push({ text: `Message from ${m.from}`, time: m.time || 'Recently', color: 'var(--amber)', icon: '💬' });
    });
    if (acts.length === 0) {
      acts.push({ text: 'Welcome to CoLabX! Start by creating a room.', time: 'Just now', color: 'var(--green)', icon: '🚀' });
    }
    setActivity(acts.slice(0, 5));

    // Notifications
    const notifs = [];
    p.slice(-2).reverse().forEach(proj => {
      notifs.push({ text: `New project "${proj.name}" was added`, time: proj.createdAt || 'Recently', icon: '📁', color: 'var(--gold)', read: false });
    });
    t.filter(tk => tk.status === 'Done').slice(-2).reverse().forEach(tk => {
      notifs.push({ text: `Task "${tk.title}" marked as done`, time: tk.dueDate || 'Recently', icon: '✅', color: 'var(--green)', read: false });
    });
    r.slice(-1).reverse().forEach(room => {
      notifs.push({ text: `You joined room "${room.name}"`, time: room.createdAt || 'Recently', icon: '🏢', color: 'var(--blue)', read: false });
    });
    msgs.slice(-2).reverse().forEach(m => {
      notifs.push({ text: `New message from ${m.from}`, time: m.time || 'Recently', icon: '💬', color: 'var(--amber)', read: false });
    });
    if (notifs.length === 0) {
      notifs.push({ text: 'No new notifications', time: 'Now', icon: '🔔', color: 'var(--text-muted)', read: true });
    }
    setNotifications(notifs.slice(0, 5));
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Done').length;
  const totalMessages = getMessages().length;
  const totalVotes = projects.reduce((sum, p) => sum + (p.votes || 0), 0);
  const userPoints = user?.points || 0;
  const nextLevel = Math.ceil((userPoints + 1) / 100) * 100;
  const progressPct = Math.min((userPoints % 100), 100);
  const upcomingDeadlines = tasks.filter(t => t.status !== 'Done' && t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  const priorityColor = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' };
  const recentProjects = projects.slice(-3).reverse();
  const learners = allUsers.filter(u => u.role === 'Learner');

  // ===== LEARNER CONFIG =====
  const learnerStats = [
    { label: 'Active Rooms', value: rooms.length, icon: '🏢', color: 'var(--green)', path: '/rooms' },
    { label: 'My Projects', value: projects.filter(p => p.owner === user?.name).length, icon: '📁', color: 'var(--gold)', path: '/projects' },
    { label: 'Tasks Done', value: completedTasks, icon: '✅', color: 'var(--blue)', path: '/tasks' },
    { label: 'Pending Tasks', value: pendingTasks, icon: '⏳', color: 'var(--amber)', path: '/tasks' },
  ];
  const learnerActions = [
    { label: 'Add Task', icon: '✅', path: '/tasks', color: 'var(--blue)' },
    { label: 'Messages', icon: '💬', path: '/messages', color: 'var(--amber)' },
    { label: 'Join Room', icon: '🏢', path: '/rooms', color: 'var(--green)' },
    { label: 'Projects', icon: '📁', path: '/projects', color: 'var(--gold)' },
  ];

  // ===== MENTOR CONFIG =====
  const mentorStats = [
    { label: 'Total Learners', value: learners.length, icon: '🎓', color: 'var(--green)', path: '/dashboard' },
    { label: 'All Projects', value: projects.length, icon: '📁', color: 'var(--gold)', path: '/projects' },
    { label: 'Active Rooms', value: rooms.length, icon: '🏢', color: 'var(--blue)', path: '/rooms' },
    { label: 'Total Messages', value: totalMessages, icon: '💬', color: 'var(--amber)', path: '/messages' },
  ];
  const mentorActions = [
    { label: 'Create Room', icon: '🏢', path: '/rooms', color: 'var(--green)' },
    { label: 'Review Projects', icon: '📁', path: '/projects', color: 'var(--gold)' },
    { label: 'Messages', icon: '💬', path: '/messages', color: 'var(--amber)' },
    { label: 'Files', icon: '📂', path: '/files', color: 'var(--blue)' },
  ];

  if (role === 'Admin') return null;

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
              Welcome back, <span style={{ color: 'var(--green)' }}>{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {role === 'Mentor'
                ? "Here's your mentoring workspace overview."
                : "Here's what's happening in your workspace today."}
            </p>
          </div>
          <div style={{
            background: role === 'Mentor' ? 'rgba(16,185,129,0.1)' : 'var(--gold-dark)',
            border: `1px solid ${role === 'Mentor' ? 'rgba(16,185,129,0.3)' : 'var(--gold-mid)'}`,
            padding: '8px 18px', borderRadius: '20px',
            fontSize: '13px',
            color: role === 'Mentor' ? 'var(--green)' : 'var(--gold)',
            fontWeight: 600
          }}>
            {role === 'Mentor' ? '👨‍🏫' : '🎓'} {role}
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {(role === 'Mentor' ? mentorStats : learnerStats).map((s) => (
          <div key={s.label} className="card"
            onClick={() => navigate(s.path)}
            style={{ transition: '0.3s', cursor: 'pointer' }}
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

      {/* ===== MAIN GRID ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>Recent Activity</h3>
            <span style={{
              fontSize: '11px', color: 'var(--green)', background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: '20px'
            }}>Live</span>
          </div>
          {activity.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 0', borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <div style={{
                width: '36px', height: '36px', background: `${a.color}15`,
                border: `1px solid ${a.color}30`, borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0
              }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>{a.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions + Reputation/Learners */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {(role === 'Mentor' ? mentorActions : learnerActions).map((a) => (
                <div key={a.label} onClick={() => navigate(a.path)} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: '0.3s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center'
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: '24px' }}>{a.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: a.color }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learner — Reputation */}
          {role === 'Learner' && (
            <div className="card-gold">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--gold)' }}>🏆 Your Reputation</h3>
                <span style={{
                  background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'var(--gold)', fontWeight: 700
                }}>{userPoints} pts</span>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress to next level</span>
                  <span style={{ fontSize: '12px', color: 'var(--gold)' }}>{userPoints}/{nextLevel}</span>
                </div>
                <div style={{ background: 'var(--bg-card)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${progressPct}%`,
                    background: 'linear-gradient(to right, var(--gold-mid), var(--gold))',
                    borderRadius: '10px', transition: '0.5s'
                  }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {[
                  { label: 'Projects', val: projects.filter(p => p.owner === user?.name).length },
                  { label: 'Upvotes', val: totalVotes },
                  { label: 'Messages', val: totalMessages },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--bg-card)', borderRadius: '8px', padding: '10px',
                    textAlign: 'center', border: '1px solid var(--gold-dark)'
                  }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--gold)' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentor — Learners Overview */}
          {role === 'Mentor' && (
            <div className="card">
              <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--green)' }}>🎓 Learners Overview</h3>
              {learners.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontSize: '13px' }}>
                  No learners signed up yet
                </div>
              ) : (
                learners.slice(0, 4).map((l, i) => (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 0',
                    borderBottom: i < Math.min(learners.length, 4) - 1 ? '1px solid var(--border)' : 'none'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0
                    }}>{l.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{l.email}</div>
                    </div>
                    <span style={{
                      fontSize: '10px', color: 'var(--gold)',
                      background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                      padding: '2px 8px', borderRadius: '20px', fontWeight: 600
                    }}>🎓 Learner</span>
                  </div>
                ))
              )}
              {learners.length > 4 && (
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px' }}>
                  +{learners.length - 4} more learners
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== NOTIFICATIONS + DEADLINES ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>🔔 Notifications</h3>
            <span style={{
              fontSize: '11px', color: 'var(--green)', background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)', padding: '3px 10px', borderRadius: '20px'
            }}>{notifications.filter(n => !n.read).length} new</span>
          </div>
          {notifications.map((n, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 0',
              borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: n.read ? 0.6 : 1
            }}>
              <div style={{
                width: '36px', height: '36px', background: `${n.color}15`,
                border: `1px solid ${n.color}30`, borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0
              }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>{n.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{n.time}</div>
              </div>
              {!n.read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>📅 Upcoming Deadlines</h3>
            <span onClick={() => navigate('/tasks')}
              style={{ fontSize: '13px', color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </span>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎉</div>
              <div style={{ fontSize: '13px' }}>No upcoming deadlines!</div>
            </div>
          ) : (
            upcomingDeadlines.map((task, i) => (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 0',
                borderBottom: i < upcomingDeadlines.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: `${priorityColor[task.priority] || 'var(--text-muted)'}15`,
                  border: `1px solid ${priorityColor[task.priority] || 'var(--text-muted)'}30`,
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px', flexShrink: 0
                }}>📌</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>Due: {task.dueDate}</div>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  color: priorityColor[task.priority] || 'var(--text-muted)',
                  background: `${priorityColor[task.priority] || 'var(--text-muted)'}15`,
                  border: `1px solid ${priorityColor[task.priority] || 'var(--text-muted)'}30`,
                  padding: '3px 10px', borderRadius: '20px', flexShrink: 0
                }}>{task.priority || 'Normal'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== MENTOR: Projects to Review ===== */}
      {role === 'Mentor' && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>📁 Projects to Review</h3>
            <span onClick={() => navigate('/projects')}
              style={{ fontSize: '13px', color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {projects.slice(-3).reverse().map((p) => {
              const color = tagColor[p.tag] || 'var(--green)';
              return (
                <div key={p.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '16px', transition: '0.3s', cursor: 'pointer'
                }}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  onMouseOver={e => e.currentTarget.style.borderColor = color}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: '11px', color, background: `${color}15`, padding: '2px 8px', borderRadius: '20px' }}>{p.tag}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>👤 {p.owner}</div>
                  <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
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
        </div>
      )}

      {/* ===== LEARNER: Recent Projects ===== */}
      {role === 'Learner' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px' }}>Recent Projects</h3>
            <span onClick={() => navigate('/projects')}
              style={{ fontSize: '13px', color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}>
              View all →
            </span>
          </div>
          {recentProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontSize: '14px', marginBottom: '12px' }}>No projects yet!</div>
              <button className="btn-green" onClick={() => navigate('/projects')} style={{ fontSize: '13px', padding: '10px 20px' }}>
                + Create First Project
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {recentProjects.map((p) => {
                const color = tagColor[p.tag] || 'var(--green)';
                return (
                  <div key={p.id} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '16px', transition: '0.3s'
                  }}
                    onMouseOver={e => e.currentTarget.style.borderColor = color}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ fontSize: '11px', color, background: `${color}15`, padding: '2px 8px', borderRadius: '20px' }}>{p.tag}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>👤 {p.owner}</div>
                    <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
                      <div style={{ height: '100%', width: `${p.progress || 0}%`, background: color, borderRadius: '10px', transition: '0.5s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>👍 {p.votes || 0} votes</span>
                      <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{p.progress || 0}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===== ACTIVE ROOMS ===== */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px' }}>Active Rooms</h3>
          <span onClick={() => navigate('/rooms')}
            style={{ fontSize: '13px', color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}>
            View all →
          </span>
        </div>
        {rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏢</div>
            <div style={{ fontSize: '14px', marginBottom: '12px' }}>No rooms yet!</div>
            <button className="btn-green" onClick={() => navigate('/rooms')} style={{ fontSize: '13px', padding: '10px 20px' }}>
              + Create First Room
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {rooms.slice(-4).reverse().map((r) => {
              const typeColor = { Public: 'var(--green)', Private: 'var(--gold)', Restricted: 'var(--red)' };
              const typeIcon = { Public: '🌐', Private: '🔒', Restricted: '🛡️' };
              const color = typeColor[r.type] || 'var(--green)';
              return (
                <div key={r.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '16px', transition: '0.3s', cursor: 'pointer'
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor = color}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  onClick={() => navigate('/rooms')}
                >
                  <div style={{ fontSize: '22px', marginBottom: '10px' }}>{typeIcon[r.type] || '🏢'}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{r.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '8px' }}>👥 {r.members} members</div>
                  <span style={{
                    fontSize: '10px', color, background: `${color}15`,
                    border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: '20px', fontWeight: 600
                  }}>{r.type}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;