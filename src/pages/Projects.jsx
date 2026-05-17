import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getProjects, saveProjects } from '../utils/storage';

const Projects = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({
    name: '', description: '', tag: 'Design', link: '', visibility: 'Public'
  });

  useEffect(() => {
    const stored = getProjects();
    if (stored.length === 0) {
      const defaultProjects = [
        { id: 1, name: 'CoLabX UI Design', description: 'Full UI/UX design for CoLabX collaboration hub.', tag: 'Design', link: '', visibility: 'Public', owner: 'Sarah', contributors: ['Sarah', 'Alex'], votes: 12, progress: 75, createdAt: '01/05/2025' },
        { id: 2, name: 'Backend API', description: 'RESTful API for CoLabX using Node.js and Express.', tag: 'Dev', link: '', visibility: 'Public', owner: 'Alex', contributors: ['Alex', 'Mentor Ali'], votes: 8, progress: 40, createdAt: '02/05/2025' },
        { id: 3, name: 'Mobile App', description: 'React Native mobile version of CoLabX.', tag: 'Mobile', link: '', visibility: 'Team', owner: 'Mentor Ali', contributors: ['Mentor Ali'], votes: 5, progress: 60, createdAt: '03/05/2025' },
      ];
      saveProjects(defaultProjects);
      setProjects(defaultProjects);
    } else {
      setProjects(stored);
    }
  }, []);

  const handleCreate = () => {
    if (!form.name || !form.description) return;
    const newProject = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      tag: form.tag,
      link: form.link,
      visibility: form.visibility,
      owner: user?.name || 'You',
      contributors: [user?.name || 'You'],
      votes: 0,
      progress: 0,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...projects, newProject];
    saveProjects(updated);
    setProjects(updated);
    setForm({ name: '', description: '', tag: 'Design', link: '', visibility: 'Public' });
    setShowModal(false);
  };

  const handleVote = (e, id) => {
    e.stopPropagation();
    const votedProjects = JSON.parse(localStorage.getItem('colabx_voted_projects') || '[]');
    if (votedProjects.includes(String(id))) return;
    votedProjects.push(String(id));
    localStorage.setItem('colabx_voted_projects', JSON.stringify(votedProjects));
    const updated = projects.map(p =>
      p.id === id ? { ...p, votes: (p.votes || 0) + 1 } : p
    );
    saveProjects(updated);
    setProjects(updated);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.tag === filter;
    return matchSearch && matchFilter;
  });

  const tagColor = {
    Design: 'var(--green)', Dev: 'var(--gold)',
    Mobile: 'var(--blue)', Research: 'var(--amber)', Other: 'var(--text-muted)'
  };
  const visibilityIcon = { Public: '🌐', Team: '👥', Private: '🔒' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ color: 'var(--gold)' }}>Projects</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Share, explore, and collaborate on projects.
          </p>
        </div>
        <button className="btn-green" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <input
          className="input-field"
          placeholder="🔍 Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Design', 'Dev', 'Mobile', 'Research', 'Other'].map(f => (
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

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(project => {
          const color = tagColor[project.tag] || 'var(--green)';
          const isVoted = JSON.parse(localStorage.getItem('colabx_voted_projects') || '[]').includes(String(project.id));
          return (
            <div key={project.id} className="card"
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ transition: '0.3s', cursor: 'pointer' , display: 'flex', flexDirection: 'column'}}

              onMouseOver={e => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  background: `${color}15`, border: `1px solid ${color}30`,
                  color, padding: '4px 12px', borderRadius: '20px',
                  fontSize: '11px', fontWeight: 600
                }}>{project.tag}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {visibilityIcon[project.visibility]} {project.visibility}
                </span>
              </div>

              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>{project.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                {project.description}
              </p>

              {/* Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Progress</span>
                  <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{project.progress || 0}%</span>
                </div>
                <div style={{ background: 'var(--bg-hover)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${project.progress || 0}%`,
                    background: color, borderRadius: '10px', transition: '0.5s'
                  }} />
                </div>
              </div>

              {/* Contributors */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex' }}>
                  {project.contributors?.slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: `hsl(${i * 80 + 120}, 60%, 40%)`,
                      border: '2px solid var(--bg-surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, color: '#fff',
                      marginLeft: i > 0 ? '-8px' : '0'
                    }}>{c?.charAt(0)}</div>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {project.contributors?.length || 0} contributor{project.contributors?.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                <button
                  onClick={e => handleVote(e, project.id)}
                  style={{
                    background: isVoted ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: isVoted ? 'var(--green)' : 'var(--green)',
                    padding: '8px 14px', borderRadius: '8px',
                    cursor: isVoted ? 'default' : 'pointer',
                    fontSize: '13px', fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  {isVoted ? '✓' : '👍'} {project.votes || 0}
                </button>

                <button
                  onClick={e => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                  className="btn-outline"
                  style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '13px' }}
                >
                  View Details →
                </button>

                {(user?.role === 'Admin' || project.owner === user?.name || user?.role === 'Mentor') && (
                  <button
                    onClick={e => handleDelete(e, project.id)}
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'var(--red)', padding: '8px 12px',
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No projects found</div>
            <div style={{ fontSize: '14px' }}>Create your first project!</div>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>📁 New Project</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Project Name</label>
              <input className="input-field" placeholder="e.g. CoLabX Mobile App"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="input-field" placeholder="Describe your project..."
                rows={3} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category</label>
                <select className="input-field" value={form.tag}
                  onChange={e => setForm({ ...form, tag: e.target.value })}>
                  <option value="Design">🎨 Design</option>
                  <option value="Dev">💻 Dev</option>
                  <option value="Mobile">📱 Mobile</option>
                  <option value="Research">🔬 Research</option>
                  <option value="Other">📌 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Visibility</label>
                <select className="input-field" value={form.visibility}
                  onChange={e => setForm({ ...form, visibility: e.target.value })}>
                  <option value="Public">🌐 Public</option>
                  <option value="Team">👥 Team Only</option>
                  <option value="Private">🔒 Private</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Project Link (optional)</label>
              <input className="input-field" placeholder="https://github.com/..."
                value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-green" onClick={handleCreate} style={{ flex: 1, justifyContent: 'center' }}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;