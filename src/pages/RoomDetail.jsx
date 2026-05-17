import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, getRooms, saveRooms } from '../utils/storage';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [room, setRoom] = useState(null);
  const [joined, setJoined] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Discussion');
  const [discussions, setDiscussions] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [inviteInput, setInviteInput] = useState('');
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const rooms = getRooms();
    const found = rooms.find(r => String(r.id) === String(id));
    if (!found) { navigate('/rooms'); return; }
    setRoom(found);
    const joinedRooms = JSON.parse(localStorage.getItem('colabx_joined_rooms') || '[]');
    setJoined(joinedRooms.includes(String(id)));
    const allDiscussions = JSON.parse(localStorage.getItem(`colabx_discussions_${id}`) || '[]');
    setDiscussions(allDiscussions);
    const savedInvites = JSON.parse(localStorage.getItem(`colabx_invites_${id}`) || '[]');
    setInvites(savedInvites);
  }, [id]);

  const handleJoin = () => {
    const joinedRooms = JSON.parse(localStorage.getItem('colabx_joined_rooms') || '[]');
    if (!joinedRooms.includes(String(id))) {
      joinedRooms.push(String(id));
      localStorage.setItem('colabx_joined_rooms', JSON.stringify(joinedRooms));
      const rooms = getRooms();
      const updated = rooms.map(r =>
        String(r.id) === String(id) ? { ...r, members: (r.members || 0) + 1 } : r
      );
      saveRooms(updated);
      setRoom(prev => ({ ...prev, members: (prev.members || 0) + 1 }));
      setJoined(true);
      setSuccessMsg(`Successfully joined ${room.name}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleInvite = () => {
    if (!inviteInput.trim()) return;
    const newInvite = {
      id: Date.now(),
      to: inviteInput.trim(),
      from: user?.name || 'You',
      room: room.name,
      status: 'Pending',
      sentAt: new Date().toLocaleDateString()
    };
    const updated = [...invites, newInvite];
    setInvites(updated);
    localStorage.setItem(`colabx_invites_${id}`, JSON.stringify(updated));
    setInviteInput('');
    setSuccessMsg(`Invite sent to ${newInvite.to}!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    const topic = {
      id: Date.now(),
      title: newTopic.trim(),
      author: user?.name || 'You',
      createdAt: new Date().toLocaleDateString(),
      comments: []
    };
    const updated = [...discussions, topic];
    setDiscussions(updated);
    localStorage.setItem(`colabx_discussions_${id}`, JSON.stringify(updated));
    setNewTopic('');
  };

  const handleAddComment = (topicId) => {
    if (!newComment.trim()) return;
    const updated = discussions.map(d => {
      if (d.id === topicId) {
        return {
          ...d, comments: [...d.comments, {
            id: Date.now(),
            text: newComment.trim(),
            author: user?.name || 'You',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return d;
    });
    setDiscussions(updated);
    localStorage.setItem(`colabx_discussions_${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  const typeColor = { Public: 'var(--green)', Private: 'var(--gold)', Restricted: 'var(--red)' };
  const typeIcon = { Public: '🌐', Private: '🔒', Restricted: '🛡️' };

  if (!room) return (
    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>Loading...</div>
  );

  const color = typeColor[room.type] || 'var(--green)';

  return (
    <div>
      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.4)',
          borderRadius: '12px', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '20px' }}>🎉</span>
          <span style={{ fontSize: '14px', color: 'var(--green)', fontWeight: 600 }}>
            {successMsg}
          </span>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Back Button */}
      <div onClick={() => navigate('/rooms')} style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer',
        marginBottom: '24px', transition: '0.2s'
      }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--green)'}
        onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >← Back to Rooms</div>

      {/* Room Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontSize: '28px' }}>{typeIcon[room.type] || '🏢'}</span>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>
                {room.name}
              </h1>
              <span style={{
                fontSize: '11px', fontWeight: 700, color,
                background: `${color}15`, border: `1px solid ${color}30`,
                padding: '4px 12px', borderRadius: '20px'
              }}>{room.type}</span>
              {joined && (
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: 'var(--green)',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  padding: '4px 12px', borderRadius: '20px'
                }}>✓ Joined</span>
              )}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>
              {room.description}
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>👥 {room.members} members</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>👤 Created by {room.createdBy}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>📅 {room.createdAt}</span>
            </div>
          </div>
          {!joined ? (
            <button className="btn-green" onClick={handleJoin} style={{ flexShrink: 0 }}>
              Join Room
            </button>
          ) : (
            <button style={{
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
              color: 'var(--green)', padding: '12px 28px', borderRadius: '10px',
              fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', cursor: 'default'
            }}>✓ Joined</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['Discussion', 'Members'].map(tab => (
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

      {/* Discussion Tab */}
      {activeTab === 'Discussion' && (
        <div>
          {joined && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>💬 Start a Discussion</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input className="input-field" placeholder="What's on your mind?"
                  value={newTopic} onChange={e => setNewTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTopic()} />
                <button className="btn-green" onClick={handleAddTopic} style={{ flexShrink: 0 }}>Post</button>
              </div>
            </div>
          )}

          {discussions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>No discussions yet</div>
              <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                {joined ? 'Start the first discussion!' : 'Join the room to start discussing!'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {discussions.map(topic => (
                <div key={topic.id} className="card">
                  <div onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
                    style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{topic.title}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>💬 {topic.comments.length} replies</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>By {topic.author} • {topic.createdAt}</div>
                  </div>

                  {selectedTopic?.id === topic.id && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        {topic.comments.length === 0 ? (
                          <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '16px' }}>
                            No replies yet. Be the first!
                          </div>
                        ) : (
                          topic.comments.map(c => (
                            <div key={c.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                              <div style={{
                                width: '30px', height: '30px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0
                              }}>{c.author?.charAt(0).toUpperCase()}</div>
                              <div style={{
                                background: 'var(--bg-card)', borderRadius: '10px',
                                padding: '10px 14px', flex: 1, border: '1px solid var(--border)'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>{c.author}</span>
                                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{c.time}</span>
                                </div>
                                <div style={{ fontSize: '13px', color: 'var(--text)' }}>{c.text}</div>
                              </div>
                            </div>
                          ))
                        )}
                        {joined && (
                          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                            <input className="input-field" placeholder="Write a reply..."
                              value={newComment} onChange={e => setNewComment(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleAddComment(topic.id)} />
                            <button className="btn-green" onClick={() => handleAddComment(topic.id)} style={{ flexShrink: 0 }}>
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'Members' && (
        <div>
          {/* Invite Section */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>✉️ Invite Member</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input className="input-field"
                placeholder="Enter email or username to invite..."
                value={inviteInput}
                onChange={e => setInviteInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()} />
              <button className="btn-green" onClick={handleInvite} style={{ flexShrink: 0 }}>
                Send Invite
              </button>
            </div>

            {/* Sent Invites */}
            {invites.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{
                  fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px'
                }}>Sent Invites</div>
                {invites.map((inv, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: 'var(--bg-card)',
                    borderRadius: '8px', marginBottom: '6px', border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>✉️</span>
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--text)' }}>{inv.to}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                          Invited by {inv.from} • {inv.sentAt}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      color: inv.status === 'Pending' ? 'var(--amber)' : 'var(--green)',
                      background: inv.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      border: `1px solid ${inv.status === 'Pending' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                      padding: '3px 10px', borderRadius: '20px'
                    }}>{inv.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members List */}
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '20px' }}>👥 Room Members ({room.members})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {/* Room Creator */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--gold-dark)',
                borderRadius: '12px', padding: '14px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold-mid), var(--green))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#fff'
                }}>{room.createdBy?.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{room.createdBy}</div>
                  <div style={{
                    fontSize: '11px', color: 'var(--gold)',
                    background: 'var(--gold-dark)', border: '1px solid var(--gold-mid)',
                    padding: '1px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '2px'
                  }}>Creator</div>
                </div>
              </div>

              {/* Current User if joined */}
              {joined && room.createdBy !== user?.name && (
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '12px', padding: '14px',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--green), var(--gold-mid))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: '#fff'
                  }}>{user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name} (You)</div>
                    <div style={{
                      fontSize: '11px', color: 'var(--green)',
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                      padding: '1px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '2px'
                    }}>{user?.role}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;