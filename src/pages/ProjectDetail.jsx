import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, getProjects, saveProjects } from '../utils/storage';

const tagColor = {
  Design: 'var(--green)', Dev: 'var(--gold)',
  Mobile: 'var(--blue)', Research: 'var(--amber)', Other: 'var(--text-muted)'
};
const visibilityIcon = { Public: '🌐', Team: '👥', Private: '🔒' };

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const projects = getProjects();
    const found = projects.find(p => String(p.id) === String(id));
    if (!found) { navigate('/projects'); return; }
    setProject(found);
    setEditForm({
      name: found.name, description: found.description,
      tag: found.tag, link: found.link || '',
      visibility: found.visibility, progress: found.progress || 0
    });
    const savedComments = JSON.parse(localStorage.getItem(`colabx_project_comments_${id}`) || '[]');
    setComments(savedComments);
    const votedProjects = JSON.parse(localStorage.getItem('colabx_voted_projects') || '[]');
    setVoted(votedProjects.includes(String(id)));
  }, [id]);

  const handleVote = () => {
    if (voted) return;
    const votedProjects = JSON.parse(localStorage.getItem('colabx_voted_projects') || '[]');
    votedProjects.push(String(id));
    localStorage.setItem('colabx_voted_projects', JSON.stringify(votedProjects));
    const projects = getProjects();
    const updated = projects.map(p =>
      String(p.id) === String(id) ? { ...p, votes: (p.votes || 0) + 1 } : p
    );
    saveProjects(updated);
    setProject(prev => ({ ...prev, votes: (prev.votes || 0) + 1 }));
    setVoted(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: user?.name || 'You',
      role: user?.role || 'Learner',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    const updated = [...comments, comment];
    setComments(updated);
    localStorage.setItem(`colabx_project_comments_${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  const handleEdit = () => {
    const projects = getProjects();
    const updated = projects.map(p =>
      String(p.id) === String(id) ? { ...p, ...editForm, progress: Number(editForm.progress) } : p
    );
    saveProjects(updated);
    setProject(prev => ({ ...prev, ...editForm, progress: Number(editForm.progress) }));
    setShowEditModal(false);
  };

  const handleAddContributor = () => {
    const name = prompt('Enter contributor name:');
    if (!name?.trim()) return;
    const projects = getProjects();
    const updated = projects.map(p =>
      String(p.id) === String(id)
        ? { ...p, contributors: [...(p.contributors || []), name.trim()] }
        : p
    );
    saveProjects(updated);
    setProject(prev => ({ ...prev, contributors: [...(prev.contributors || []), name.trim()] }));
  };

  if (!project) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>Loading...</div>
  );

  const color = tagColor[project.tag] || 'var(--green)';

  return (
    <div>
      {/* Back */}
      <div onClick={() => navigate('/projects')} style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer',
        marginBottom: '24px', transition: '0.2s'
      }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--green)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >← Back to Projects</div>

      {/* Project Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {/* Tags Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{
                background: `${color}15`, border: `1px solid ${color}30`,
                color, padding: '4px 14px', borderRadius: '20px',
                fontSize: '12px', fontWeight: 700
              }}>{project.tag}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                {visibilityIcon[project.visibility]} {project.visibility}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                📅 {project.createdAt}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontSize: '2rem',
              fontWeight: 800, marginBottom: '12px'
            }}>{project.name}</h1>

            <p style={{
              fontSize: '14px', color: 'var(--text-muted)',
              lineHeight: 1.7, marginBottom: '20px', maxWidth: '700px'
            }}>{project.description}</p>

            {/* Meta */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                👤 Owner: <span style={{ color: 'var(--text)' }}>{project.owner}</span>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                👥 {project.contributors?.length || 0} contributors
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                👍 {project.votes || 0} votes
              </span>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" style={{
                  fontSize: '13px', color: 'var(--green)', textDecoration: 'none'
                }}>🔗 View Link</a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
            {/* Vote */}
            <button
              onClick={handleVote}
              disabled={voted}
              style={{
                background: voted ? 'rgba(16,185,129,0.1)' : 'var(--green)',
                border: voted ? '1px solid rgba(16,185,129,0.3)' : 'none',
                color: voted ? 'var(--green)' : '#fff',
                padding: '10px 20px', borderRadius: '10px',
                cursor: voted ? 'default' : 'pointer',
                fontSize: '13px', fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              {voted ? '✓ Voted' : `👍 Upvote (${project.votes || 0})`}
            </button>

            {/* Edit — owner or admin */}
            {(user?.role === 'Admin' || project.owner === user?.name) && (
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-outline"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >✏️ Edit Project</button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Project Progress</span>
            <span style={{ fontSize: '13px', color, fontWeight: 700 }}>{project.progress || 0}%</span>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${project.progress || 0}%`,
              background: 'var(--green)',
              borderRadius: '10px', transition: '0.5s'
            }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['Overview', 'Discussion', 'Contributors'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
            background: activeTab === tab ? 'var(--green)' : 'var(--bg-surface)',
            color: activeTab === tab ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? 'none' : '1px solid var(--border)'
          }}>{tab}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Stats */}
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '20px' }}>📊 Project Stats</h3>
            {[
              { label: 'Total Votes', val: project.votes || 0, color: 'var(--green)', icon: '👍' },
              { label: 'Contributors', val: project.contributors?.length || 0, color: 'var(--gold)', icon: '👥' },
              { label: 'Comments', val: comments.length, color: 'var(--blue)', icon: '💬' },
              { label: 'Progress', val: `${project.progress || 0}%`, color, icon: '📈' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: s.color,
                  fontFamily: 'Syne, sans-serif' }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Project Info */}
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '20px' }}>ℹ️ Project Info</h3>
            {[
              { label: 'Category', val: project.tag },
              { label: 'Visibility', val: `${visibilityIcon[project.visibility]} ${project.visibility}` },
              { label: 'Owner', val: project.owner },
              { label: 'Created', val: project.createdAt },
              { label: 'Link', val: project.link || 'Not provided' },
            ].map(info => (
              <div key={info.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{info.label}</span>
                <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{info.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussion Tab */}
      {activeTab === 'Discussion' && (
        <div>
          {/* Add Comment */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>💬 Add Comment</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                className="input-field"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              />
              <button className="btn-green" onClick={handleAddComment} style={{ flexShrink: 0 }}>
                Post
              </button>
            </div>
          </div>

          {/* Comments */}
          {comments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>No comments yet</div>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Be the first to comment!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: '12px'
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>
                    {c.author?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    flex: 1, background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{c.author}</span>
                        <span style={{
                          fontSize: '11px', color: 'var(--gold)',
                          background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                          padding: '1px 8px', borderRadius: '20px'
                        }}>{c.role}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {c.date} {c.time}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contributors Tab */}
      {activeTab === 'Contributors' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px' }}>👥 Contributors ({project.contributors?.length || 0})</h3>
            {(user?.role === 'Admin' || project.owner === user?.name) && (
              <button className="btn-green" onClick={handleAddContributor}
                style={{ fontSize: '13px', padding: '8px 16px' }}>
                + Add Contributor
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {project.contributors?.map((c, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: c === project.owner ? '1px solid var(--gold-dark)' : '1px solid var(--border)',
                borderRadius: '12px', padding: '14px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${i * 60 + 120}, 60%, 35%), hsl(${i * 60 + 160}, 60%, 45%))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {c?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{c}</div>
                  {c === project.owner && (
                    <div style={{
                      fontSize: '11px', color: 'var(--gold)',
                      background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                      padding: '1px 8px', borderRadius: '20px',
                      display: 'inline-block', marginTop: '2px'
                    }}>Owner</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>✏️ Edit Project</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Project Name</label>
              <input className="input-field" value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="input-field" rows={3} value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category</label>
                <select className="input-field" value={editForm.tag}
                  onChange={e => setEditForm({ ...editForm, tag: e.target.value })}>
                  <option value="Design">🎨 Design</option>
                  <option value="Dev">💻 Dev</option>
                  <option value="Mobile">📱 Mobile</option>
                  <option value="Research">🔬 Research</option>
                  <option value="Other">📌 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Visibility</label>
                <select className="input-field" value={editForm.visibility}
                  onChange={e => setEditForm({ ...editForm, visibility: e.target.value })}>
                  <option value="Public">🌐 Public</option>
                  <option value="Team">👥 Team Only</option>
                  <option value="Private">🔒 Private</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Progress ({editForm.progress}%)</label>
              <input type="range" min="0" max="100" value={editForm.progress}
                onChange={e => setEditForm({ ...editForm, progress: e.target.value })}
                style={{ width: '100%', accentColor: 'var(--green)' }} />
            </div>

            <div className="form-group">
              <label>Project Link</label>
              <input className="input-field" placeholder="https://github.com/..."
                value={editForm.link}
                onChange={e => setEditForm({ ...editForm, link: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowEditModal(false)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button className="btn-green" onClick={handleEdit} style={{ flex: 1, justifyContent: 'center' }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;