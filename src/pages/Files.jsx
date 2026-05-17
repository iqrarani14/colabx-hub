import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getFiles, saveFiles } from '../utils/storage';

const Files = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ name: '', type: 'PDF', size: '', room: 'General' });

  useEffect(() => {
    const stored = getFiles();
    if (stored.length === 0) {
      const defaultFiles = [
        { id: 1, name: 'Project_Proposal.pdf', type: 'PDF', size: '2.4 MB', room: 'SCD Project Room', uploadedBy: 'Admin User', uploadedAt: '01/05/2025' },
        { id: 2, name: 'UI_Design.fig', type: 'Figma', size: '8.7 MB', room: 'Design Team', uploadedBy: 'Sarah', uploadedAt: '02/05/2025' },
        { id: 3, name: 'Requirements.docx', type: 'DOCX', size: '1.2 MB', room: 'SCD Project Room', uploadedBy: 'Mentor Ali', uploadedAt: '03/05/2025' },
        { id: 4, name: 'Database_Schema.xlsx', type: 'XLSX', size: '0.8 MB', room: 'Backend Team', uploadedBy: 'Alex Dev', uploadedAt: '04/05/2025' },
        { id: 5, name: 'Presentation.pptx', type: 'PPTX', size: '5.1 MB', room: 'General', uploadedBy: 'Mentor Ali', uploadedAt: '05/05/2025' },
      ];
      saveFiles(defaultFiles);
      setFiles(defaultFiles);
    } else {
      setFiles(stored);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const ext = file.name.split('.').pop().toUpperCase();
    const validTypes = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'ZIP'];
    const fileType = validTypes.includes(ext) ? ext
      : ['FIG'].includes(ext) ? 'Figma'
      : ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP'].includes(ext) ? 'IMG'
      : 'Other';
    setForm(prev => ({ ...prev, name: file.name, type: fileType, size: sizeMB }));
  };

  const handleUpload = () => {
    if (!form.name) return;
    const newFile = {
      id: Date.now(),
      name: form.name,
      type: form.type,
      size: form.size || '—',
      room: form.room,
      uploadedBy: user?.name || 'You',
      uploadedAt: new Date().toLocaleDateString(),
    };
    const updated = [...files, newFile];
    saveFiles(updated);
    setFiles(updated);
    setForm({ name: '', type: 'PDF', size: '', room: 'General' });
    setShowModal(false);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updated = files.filter(f => f.id !== id);
    saveFiles(updated);
    setFiles(updated);
  };

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || f.type === filter;
    return matchSearch && matchFilter;
  });

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

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ color: 'var(--gold)' }}>Files</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Upload and manage your project files.
          </p>
        </div>
        <button className="btn-green" onClick={() => setShowModal(true)}>
          + Upload File
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Files', val: files.length, icon: '📂', color: 'var(--green)' },
          { label: 'PDFs', val: files.filter(f => f.type === 'PDF').length, icon: '📄', color: 'var(--red)' },
          { label: 'Docs', val: files.filter(f => f.type === 'DOCX').length, icon: '📝', color: 'var(--blue)' },
          { label: 'Design Files', val: files.filter(f => f.type === 'Figma').length, icon: '🎨', color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
            <div style={{
              width: '42px', height: '42px',
              background: `${s.color}15`, border: `1px solid ${s.color}30`,
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="input-field"
          placeholder="🔍 Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'PDF', 'DOCX', 'XLSX', 'PPTX', 'Figma'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '10px 16px', borderRadius: '8px',
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

      {/* Files Table */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
          padding: '14px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)'
        }}>
          {['File Name', 'Type', 'Size', 'Room', 'Uploaded By', 'Actions'].map(h => (
            <div key={h} style={{
              fontSize: '12px', fontWeight: 700, color: 'var(--text-dim)',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>{h}</div>
          ))}
        </div>

        {/* Table Rows */}
        {filtered.map((file, i) => (
          <div
            key={file.id}
            onClick={() => navigate(`/files/${file.id}`)}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
              padding: '16px 24px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              transition: '0.2s', alignItems: 'center', cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px',
                background: `${fileColor[file.type] || 'var(--text-muted)'}15`,
                border: `1px solid ${fileColor[file.type] || 'var(--text-muted)'}30`,
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0
              }}>
                {fileIcon[file.type] || '📎'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{file.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{file.uploadedAt}</div>
              </div>
            </div>

            {/* Type */}
            <div>
              <span style={{
                fontSize: '11px', fontWeight: 700,
                color: fileColor[file.type] || 'var(--text-muted)',
                background: `${fileColor[file.type] || 'var(--text-muted)'}15`,
                border: `1px solid ${fileColor[file.type] || 'var(--text-muted)'}30`,
                padding: '3px 10px', borderRadius: '20px'
              }}>{file.type}</span>
            </div>

            {/* Size */}
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{file.size}</div>

            {/* Room */}
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{file.room}</div>

            {/* Uploaded By */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: '#fff'
              }}>
                {file.uploadedBy?.charAt(0)}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{file.uploadedBy}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={e => { e.stopPropagation(); navigate(`/files/${file.id}`); }}
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: 'var(--green)', padding: '6px 12px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                  transition: '0.2s', fontWeight: 600
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
              >👁️ View</button>

              {(user?.role === 'Admin' || file.uploadedBy === user?.name) && (
                <button
                  onClick={e => handleDelete(e, file.id)}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: 'var(--red)', padding: '6px 12px',
                    borderRadius: '8px', cursor: 'pointer',
                    fontSize: '12px', transition: '0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                >🗑️</button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No files found</div>
            <div style={{ fontSize: '14px' }}>Upload your first file!</div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📂 Upload File</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {/* File Drop Zone */}
            <div className="form-group">
              <label>Select File</label>
              <div
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  background: 'var(--bg-card)',
                  border: `2px dashed ${form.name ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: '12px', padding: '32px',
                  textAlign: 'center', cursor: 'pointer',
                  transition: '0.3s', marginBottom: '4px'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseOut={e => e.currentTarget.style.borderColor = form.name ? 'var(--green)' : 'var(--border)'}
              >
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                  {form.name ? '✅' : '📂'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: form.name ? 'var(--green)' : 'var(--text)', marginBottom: '4px' }}>
                  {form.name ? form.name : 'Click to select file'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                  {form.name ? `${form.size} • ${form.type}` : 'PDF, DOCX, XLSX, PPTX, Images, ZIP'}
                </div>
              </div>
            </div>

            {/* Type + Size */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>File Type</label>
                <select className="input-field" value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="PDF">📄 PDF</option>
                  <option value="DOCX">📝 DOCX</option>
                  <option value="XLSX">📊 XLSX</option>
                  <option value="PPTX">📊 PPTX</option>
                  <option value="Figma">🎨 Figma</option>
                  <option value="ZIP">📦 ZIP</option>
                  <option value="IMG">🖼️ Image</option>
                  <option value="Other">📎 Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>File Size</label>
                <input className="input-field" placeholder="e.g. 2.4 MB"
                  value={form.size}
                  onChange={e => setForm({ ...form, size: e.target.value })} />
              </div>
            </div>

            {/* Room */}
            <div className="form-group">
              <label>Room</label>
              <select className="input-field" value={form.room}
                onChange={e => setForm({ ...form, room: e.target.value })}>
                <option value="General">General</option>
                <option value="Frontend Team">Frontend Team</option>
                <option value="Backend Team">Backend Team</option>
                <option value="Design Team">Design Team</option>
                <option value="SCD Project Room">SCD Project Room</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-green" onClick={handleUpload}
                style={{ flex: 1, justifyContent: 'center', opacity: form.name ? 1 : 0.6 }}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;