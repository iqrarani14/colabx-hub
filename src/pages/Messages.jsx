import { useState, useEffect, useRef } from 'react';
import { getUser, getMessages, saveMessages } from '../utils/storage';

const contacts = [
  { id: 1, name: 'Admin User', role: 'Admin', online: true, avatar: 'A' },
  { id: 2, name: 'Mentor Ali', role: 'Mentor', online: true, avatar: 'M' },
  { id: 3, name: 'Learner Sara', role: 'Learner', online: false, avatar: 'S' },
  { id: 4, name: 'Alex Dev', role: 'Learner', online: true, avatar: 'D' },
];

const roleColor = { Admin: 'var(--red)', Mentor: 'var(--gold)', Learner: 'var(--green)', Guest: 'var(--blue)' };

const Messages = () => {
  const user = getUser();
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const stored = getMessages();
    if (stored.length === 0) {
      const defaultMsgs = [
        { id: 1, from: 'Mentor Ali', to: user?.name || 'You', text: 'Hey! How is the project going?', time: '10:20 AM', contactId: 2 },
        { id: 2, from: user?.name || 'You', to: 'Mentor Ali', text: 'Going well! Almost done with frontend.', time: '10:22 AM', contactId: 2 },
        { id: 3, from: 'Mentor Ali', to: user?.name || 'You', text: 'Great work! Let me know if you need help.', time: '10:23 AM', contactId: 2 },
        { id: 4, from: 'Admin User', to: user?.name || 'You', text: 'Please push your code to GitHub today.', time: '09:00 AM', contactId: 1 },
        { id: 5, from: user?.name || 'You', to: 'Admin User', text: 'Sure, will do it by evening!', time: '09:05 AM', contactId: 1 },
      ];
      saveMessages(defaultMsgs);
      setMessages(defaultMsgs);
    } else {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: user?.name || 'You',
      to: activeContact.name,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contactId: activeContact.id,
    };
    const updated = [...messages, newMsg];
    saveMessages(updated);
    setMessages(updated);
    setInput('');
  };

  const chatMessages = messages.filter(m => m.contactId === activeContact.id);

  const getLastMessage = (contactId) => {
    const msgs = messages.filter(m => m.contactId === contactId);
    return msgs[msgs.length - 1]?.text || 'No messages yet';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          <span style={{ color: 'var(--gold)' }}>Messages</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Chat with your team members.
        </p>
      </div>

      {/* Chat Layout */}
      <div style={{
        display: 'grid', gridTemplateColumns: '300px 1fr',
        gap: '20px', height: '620px'
      }}>

        {/* Contacts List */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <input
              className="input-field"
              placeholder="🔍 Search contacts..."
              style={{ padding: '10px 14px', fontSize: '13px' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 20px', cursor: 'pointer', transition: '0.2s',
                  background: activeContact.id === contact.id
                    ? 'rgba(16,185,129,0.08)' : 'transparent',
                  borderLeft: activeContact.id === contact.id
                    ? '3px solid var(--green)' : '3px solid transparent',
                }}
                onMouseOver={e => {
                  if (activeContact.id !== contact.id)
                    e.currentTarget.style.background = 'var(--bg-card)';
                }}
                onMouseOut={e => {
                  if (activeContact.id !== contact.id)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${roleColor[contact.role]}, var(--gold-mid))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff'
                  }}>
                    {contact.avatar}
                  </div>
                  {/* Online dot */}
                  <div style={{
                    position: 'absolute', bottom: '1px', right: '1px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: contact.online ? 'var(--green)' : 'var(--text-dim)',
                    border: '2px solid var(--bg-surface)'
                  }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{contact.name}</span>
                    <span style={{
                      fontSize: '10px', color: roleColor[contact.role],
                      background: `${roleColor[contact.role]}15`,
                      padding: '2px 6px', borderRadius: '10px'
                    }}>{contact.role}</span>
                  </div>
                  <div style={{
                    fontSize: '12px', color: 'var(--text-dim)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginTop: '2px'
                  }}>
                    {getLastMessage(contact.id)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${roleColor[activeContact.role]}, var(--gold-mid))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff'
              }}>
                {activeContact.avatar}
              </div>
              <div style={{
                position: 'absolute', bottom: '1px', right: '1px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: activeContact.online ? 'var(--green)' : 'var(--text-dim)',
                border: '2px solid var(--bg-surface)'
              }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{activeContact.name}</div>
              <div style={{ fontSize: '12px', color: activeContact.online ? 'var(--green)' : 'var(--text-dim)' }}>
                {activeContact.online ? '🟢 Online' : '⚫ Offline'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
                <div>No messages yet. Say hello!</div>
              </div>
            )}
            {chatMessages.map(msg => {
              const isMe = msg.from === user?.name || msg.from === 'You';
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '65%',
                    background: isMe
                      ? 'linear-gradient(135deg, var(--green), var(--green-dark))'
                      : 'var(--bg-card)',
                    border: isMe ? 'none' : '1px solid var(--border)',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '12px 16px',
                  }}>
                    <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{
                      fontSize: '10px', marginTop: '4px', textAlign: 'right',
                      color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)'
                    }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: '12px', alignItems: 'center'
          }}>
            <input
              className="input-field"
              placeholder={`Message ${activeContact.name}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1 }}
            />
            <button
              className="btn-green"
              onClick={handleSend}
              style={{ padding: '12px 20px', flexShrink: 0 }}
            >
              Send ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;