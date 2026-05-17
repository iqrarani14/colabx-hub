import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFiles } from '../utils/storage';

const fileIcon = {
  PDF: '📄', DOCX: '📝', XLSX: '📊',
  PPTX: '📊', Figma: '🎨', ZIP: '📦',
  IMG: '🖼️', Other: '📎'
};

const fileColor = {
  PDF: 'var(--red)', DOCX: 'var(--blue)', XLSX: 'var(--green)',
  PPTX: 'var(--amber)', Figma: 'var(--gold)', ZIP: 'var(--text-muted)',
  IMG: 'var(--blue)', Other: 'var(--text-muted)'
};

const FileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = JSON.parse(localStorage.getItem('colabx_user') || '{}');

  useEffect(() => {
    const files = getFiles();
    const found = files.find(f => String(f.id) === String(id));
    if (!found) { navigate('/files'); return; }
    setFile(found);
    const saved = JSON.parse(localStorage.getItem(`colabx_file_comments_${id}`) || '[]');
    setComments(saved);
  }, [id]);

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
    localStorage.setItem(`colabx_file_comments_${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  if (!file) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>Loading...</div>
  );

  const color = fileColor[file.type] || 'var(--text-muted)';
  const icon = fileIcon[file.type] || '📎';

  return (
    <div>
      {/* Back */}
      <div onClick={() => navigate('/files')} style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer',
        marginBottom: '24px', transition: '0.2s'
      }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--green)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >← Back to Files</div>

      {/* File Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          {/* File Icon */}
          <div style={{
            width: '80px', height: '80px', flexShrink: 0,
            background: `${color}15`, border: `1px solid ${color}30`,
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '36px'
          }}>{icon}</div>

          {/* File Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800 }}>
                {file.name}
              </h1>
              <span style={{
                fontSize: '11px', fontWeight: 700, color,
                background: `${color}15`, border: `1px solid ${color}30`,
                padding: '4px 12px', borderRadius: '20px'
              }}>{file.type}</span>
            </div>

            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                📦 Size: <span style={{ color: 'var(--text)' }}>{file.size}</span>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                🏢 Room: <span style={{ color: 'var(--text)' }}>{file.room}</span>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                👤 By: <span style={{ color: 'var(--text)' }}>{file.uploadedBy}</span>
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                📅 Date: <span style={{ color: 'var(--text)' }}>{file.uploadedAt}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Area */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>{icon}</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
          {file.name}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '24px' }}>
          {file.type} • {file.size} • Uploaded by {file.uploadedBy}
        </div>
        <div style={{
          display: 'inline-block',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '12px', padding: '16px 32px',
          fontSize: '14px', color: 'var(--text-muted)'
        }}>
          📁 This is a <strong style={{ color }}>{file.type}</strong> file stored in <strong style={{ color: 'var(--green)' }}>{file.room}</strong> room.
          <br />
          <span style={{ fontSize: '12px', marginTop: '8px', display: 'block', color: 'var(--text-dim)' }}>
            Real file preview requires backend storage integration.
          </span>
        </div>
      </div>

      {/* File Details + Comments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>

        {/* File Details */}
        <div className="card">
          <h3 style={{ fontSize: '15px', marginBottom: '20px' }}>📋 File Details</h3>
          {[
            { label: 'File Name', val: file.name },
            { label: 'Type', val: file.type },
            { label: 'Size', val: file.size },
            { label: 'Room', val: file.room },
            { label: 'Uploaded By', val: file.uploadedBy },
            { label: 'Upload Date', val: file.uploadedAt },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{item.label}</span>
              <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500, maxWidth: '180px', textAlign: 'right' }}>
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* Comments */}
        <div className="card">
          <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>
            💬 Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              className="input-field"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            />
            <button className="btn-green" onClick={handleAddComment} style={{ flexShrink: 0, padding: '10px 16px' }}>
              Post
            </button>
          </div>

          {/* Comments List */}
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '13px' }}>No comments yet. Be the first!</div>
              </div>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{
                  display: 'flex', gap: '10px', marginBottom: '12px'
                }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>
                    {c.author?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{
                    flex: 1, background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px', padding: '10px 14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.author}</span>
                        <span style={{
                          fontSize: '10px', color: 'var(--gold)',
                          background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                          padding: '1px 6px', borderRadius: '10px'
                        }}>{c.role}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        {c.date} {c.time}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetail;