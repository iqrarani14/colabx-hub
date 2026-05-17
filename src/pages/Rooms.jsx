import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getRooms, saveRooms } from '../utils/storage';

const Rooms = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ name: '', description: '', type: 'Public' });

  const joinedRooms = JSON.parse(localStorage.getItem('colabx_joined_rooms') || '[]');

  useEffect(() => {
    const stored = getRooms();
    if (stored.length === 0) {
      const defaultRooms = [
        { id: 1, name: 'Frontend Team', description: 'React, CSS, UI/UX discussions', type: 'Public', members: 8, createdBy: 'Admin', createdAt: '01/05/2025' },
        { id: 2, name: 'Backend Team', description: 'Node.js, APIs, Database', type: 'Private', members: 6, createdBy: 'Mentor Ali', createdAt: '02/05/2025' },
        { id: 3, name: 'Design Team', description: 'Figma, Wireframes, Prototypes', type: 'Public', members: 5, createdBy: 'Admin', createdAt: '03/05/2025' },
        { id: 4, name: 'SCD Project Room', description: 'Main collaboration room for SCD project', type: 'Restricted', members: 12, createdBy: 'Mentor Ali', createdAt: '04/05/2025' },
      ];
      saveRooms(defaultRooms);
      setRooms(defaultRooms);
    } else {
      setRooms(stored);
    }
  }, []);

  const handleCreate = () => {
    if (!form.name || !form.description) return;
    const newRoom = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      type: form.type,
      members: 1,
      createdBy: user?.name || 'You',
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...rooms, newRoom];
    saveRooms(updated);
    setRooms(updated);
    setForm({ name: '', description: '', type: 'Public' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const updated = rooms.filter(r => r.id !== id);
    saveRooms(updated);
    setRooms(updated);
  };

  const filtered = rooms.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.type === filter;
    return matchSearch && matchFilter;
  });

  const typeColor = { Public: 'var(--green)', Private: 'var(--gold)', Restricted: 'var(--red)' };
  const typeIcon = { Public: '🌐', Private: '🔒', Restricted: '🛡️' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Collaboration <span style={{ color: 'var(--gold)' }}>Rooms</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Join or create rooms to collaborate with your team.
          </p>
        </div>
        {/* Sab ko Create Room button dikhao */}
        <button className="btn-green" onClick={() => setShowModal(true)}>
          + Create Room
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <input
          className="input-field"
          placeholder="🔍 Search rooms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Public', 'Private', 'Restricted'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 20px', borderRadius: '8px',
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

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(room => {
          const isJoined = joinedRooms.includes(String(room.id));
          const color = typeColor[room.type] || 'var(--green)';
          return (
            <div key={room.id} className="card"
              style={{ transition: '0.3s', position: 'relative', cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.borderColor = color}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Joined Badge */}
              {isJoined && (
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  padding: '3px 10px', borderRadius: '20px',
                  fontSize: '11px', color: 'var(--green)', fontWeight: 600
                }}>✓ Joined</div>
              )}

              {/* Type Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: `${color}15`, border: `1px solid ${color}30`,
                padding: '4px 12px', borderRadius: '20px',
                fontSize: '11px', color, fontWeight: 600, marginBottom: '14px'
              }}>
                {typeIcon[room.type]} {room.type}
              </div>

              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>{room.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                {room.description}
              </p>

              {/* Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  👥 {room.members} members
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  by {room.createdBy}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/rooms/${room.id}`)}
                  style={{
                    flex: 1, padding: '10px',
                    borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '13px',
                    fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                    transition: '0.2s', justifyContent: 'center',
                    background: isJoined ? 'rgba(16,185,129,0.1)' : 'var(--green)',
                    color: isJoined ? 'var(--green)' : '#fff',
                    border: isJoined ? '1px solid rgba(16,185,129,0.3)' : 'none'
                  }}
                  onMouseOver={e => {
                    if (!isJoined) e.currentTarget.style.background = 'var(--green-dark)';
                  }}
                  onMouseOut={e => {
                    if (!isJoined) e.currentTarget.style.background = 'var(--green)';
                  }}
                >
                  {isJoined ? '✓ View Room' : 'Join Room'}
                </button>

                {(user?.role === 'Admin' || room.createdBy === user?.name || user?.role === 'Mentor') && (
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(room.id); }}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'var(--red)', padding: '10px 14px',
                      borderRadius: '8px', cursor: 'pointer',
                      fontSize: '14px', transition: '0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  >🗑️</button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No rooms found</div>
            <div style={{ fontSize: '14px' }}>Try a different search or create a new room.</div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏢 Create New Room</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Room Name</label>
              <input
                className="input-field"
                placeholder="e.g. Frontend Team"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="input-field"
                placeholder="What is this room about?"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select
                className="input-field"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                <option value="Public">🌐 Public — Anyone can join</option>
                <option value="Private">🔒 Private — Invite only</option>
                <option value="Restricted">🛡️ Restricted — Admin approval needed</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn-green" onClick={handleCreate} style={{ flex: 1, justifyContent: 'center' }}>
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;