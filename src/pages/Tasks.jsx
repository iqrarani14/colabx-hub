import { useState, useEffect } from 'react';
import { getUser, getTasks, saveTasks } from '../utils/storage';

const Tasks = () => {
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: ''
  });

  useEffect(() => {
    const stored = getTasks();
    if (stored.length === 0) {
      const defaultTasks = [
        { id: 1, title: 'Setup React Project', description: 'Initialize Vite + React project with routing.', priority: 'High', status: 'Done', dueDate: '10/05/2025', assignedTo: 'You', createdAt: '01/05/2025' },
        { id: 2, title: 'Design Landing Page', description: 'Create hero section, features, and CTA.', priority: 'High', status: 'In Progress', dueDate: '15/05/2025', assignedTo: 'You', createdAt: '02/05/2025' },
        { id: 3, title: 'Build Dashboard UI', description: 'Stats cards, activity feed, quick actions.', priority: 'Medium', status: 'In Progress', dueDate: '18/05/2025', assignedTo: 'You', createdAt: '03/05/2025' },
        { id: 4, title: 'Connect Local Storage', description: 'Save and retrieve all data from localStorage.', priority: 'High', status: 'Todo', dueDate: '20/05/2025', assignedTo: 'You', createdAt: '04/05/2025' },
        { id: 5, title: 'Write Documentation', description: 'Document all features and components.', priority: 'Low', status: 'Todo', dueDate: '25/05/2025', assignedTo: 'You', createdAt: '05/05/2025' },
      ];
      saveTasks(defaultTasks);
      setTasks(defaultTasks);
    } else {
      setTasks(stored);
    }
  }, []);

  const handleCreate = () => {
    if (!form.title) return;
    const newTask = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      assignedTo: user?.name || 'You',
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...tasks, newTask];
    saveTasks(updated);
    setTasks(updated);
    setForm({ title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' });
    setShowModal(false);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    saveTasks(updated);
    setTasks(updated);
  };

  const handleDelete = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
    setTasks(updated);
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || t.status === filter;
    return matchSearch && matchFilter;
  });

  const priorityColor = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' };
  const statusColor = { 'Todo': 'var(--text-dim)', 'In Progress': 'var(--blue)', 'Done': 'var(--green)' };
  const statusBg = { 'Todo': 'rgba(100,116,139,0.1)', 'In Progress': 'rgba(59,130,246,0.1)', 'Done': 'rgba(16,185,129,0.1)' };

  const counts = {
    All: tasks.length,
    Todo: tasks.filter(t => t.status === 'Todo').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Done: tasks.filter(t => t.status === 'Done').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            My <span style={{ color: 'var(--gold)' }}>Tasks</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage and track your tasks efficiently.
          </p>
        </div>
        <button className="btn-green" onClick={() => setShowModal(true)}>
          + Add Task
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total', val: counts.All, color: 'var(--text-muted)' },
          { label: 'Todo', val: counts.Todo, color: 'var(--text-dim)' },
          { label: 'In Progress', val: counts['In Progress'], color: 'var(--blue)' },
          { label: 'Done', val: counts.Done, color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="input-field"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Todo', 'In Progress', 'Done'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 18px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              background: filter === f ? 'var(--green)' : 'var(--bg-surface)',
              color: filter === f ? '#fff' : 'var(--text-muted)',
              border: filter === f ? 'none' : '1px solid var(--border)',
              transition: '0.2s'
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(task => (
          <div key={task.id} className="card" style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '18px 24px', transition: '0.3s',
            opacity: task.status === 'Done' ? 0.7 : 1
          }}
            onMouseOver={e => e.currentTarget.style.borderColor = statusColor[task.status]}
            onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {/* Checkbox */}
            <div
              onClick={() => handleStatusChange(task.id, task.status === 'Done' ? 'Todo' : 'Done')}
              style={{
                width: '22px', height: '22px', borderRadius: '6px',
                border: `2px solid ${task.status === 'Done' ? 'var(--green)' : 'var(--border)'}`,
                background: task.status === 'Done' ? 'var(--green)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, transition: '0.2s', fontSize: '12px'
              }}
            >
              {task.status === 'Done' && '✓'}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '15px', fontWeight: 600,
                  textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                  color: task.status === 'Done' ? 'var(--text-dim)' : 'var(--text)'
                }}>{task.title}</span>
                {/* Priority Badge */}
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  color: priorityColor[task.priority],
                  background: `${priorityColor[task.priority]}15`,
                  border: `1px solid ${priorityColor[task.priority]}30`,
                  padding: '2px 8px', borderRadius: '20px'
                }}>{task.priority}</span>
              </div>
              {task.description && (
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{task.description}</div>
              )}
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', flexShrink: 0 }}>
                📅 {task.dueDate}
              </div>
            )}

            {/* Status Dropdown */}
            <select
              value={task.status}
              onChange={e => handleStatusChange(task.id, e.target.value)}
              style={{
                background: statusBg[task.status],
                border: `1px solid ${statusColor[task.status]}30`,
                color: statusColor[task.status],
                padding: '6px 12px', borderRadius: '8px',
                fontSize: '12px', fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                cursor: 'pointer', outline: 'none', flexShrink: 0
              }}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            {/* Delete */}
            <button
              onClick={() => handleDelete(task.id)}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-dim)', cursor: 'pointer',
                fontSize: '16px', transition: '0.2s', flexShrink: 0
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-dim)'}
            >🗑️</button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No tasks found</div>
            <div style={{ fontSize: '14px' }}>Add your first task!</div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✅ Add New Task</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Task Title</label>
              <input
                className="input-field"
                placeholder="e.g. Design Login Page"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                className="input-field"
                placeholder="Task details..."
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Priority</label>
                <select className="input-field" value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="input-field" value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                className="input-field"
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-green" onClick={handleCreate} style={{ flex: 1, justifyContent: 'center' }}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;