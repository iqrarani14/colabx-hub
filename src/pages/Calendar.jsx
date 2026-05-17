import { useState } from 'react';

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`, time: '10:00 AM', color: 'var(--green)', type: 'Meeting' },
    { id: 2, title: 'Project Deadline', date: `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()+3).padStart(2,'0')}`, time: '05:00 PM', color: 'var(--red)', type: 'Deadline' },
    { id: 3, title: 'Design Review', date: `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()+5).padStart(2,'0')}`, time: '02:00 PM', color: 'var(--gold)', type: 'Review' },
    { id: 4, title: 'Sprint Planning', date: `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()+7).padStart(2,'0')}`, time: '11:00 AM', color: 'var(--blue)', type: 'Meeting' },
  ]);
  const [form, setForm] = useState({ title: '', time: '', type: 'Meeting', color: 'var(--green)' });

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDay = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getEventsForDay = (day) =>
    events.filter(e => e.date === formatDate(day));

  const selectedDateStr = formatDate(selectedDay);
  const selectedEvents = events.filter(e => e.date === selectedDateStr);

  const handleAddEvent = () => {
    if (!form.title) return;
    const newEvent = {
      id: Date.now(),
      title: form.title,
      date: selectedDateStr,
      time: form.time || '12:00 PM',
      color: form.color,
      type: form.type,
    };
    setEvents([...events, newEvent]);
    setForm({ title: '', time: '', type: 'Meeting', color: 'var(--green)' });
    setShowModal(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDay(currentMonth, currentYear);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const typeColor = { Meeting: 'var(--green)', Deadline: 'var(--red)', Review: 'var(--gold)', Event: 'var(--blue)' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            <span style={{ color: 'var(--gold)' }}>Calendar</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Track your meetings, deadlines, and events.
          </p>
        </div>
        <button className="btn-green" onClick={() => setShowModal(true)}>
          + Add Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        {/* Calendar Grid */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          {/* Month Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 24px', borderBottom: '1px solid var(--border)'
          }}>
            <button onClick={prevMonth} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 16px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '16px', transition: '0.2s',
              fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >←</button>

            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.3rem', fontWeight: 700 }}>
              {monthNames[currentMonth]} <span style={{ color: 'var(--gold)' }}>{currentYear}</span>
            </h2>

            <button onClick={nextMonth} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 16px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '16px', transition: '0.2s',
              fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >→</button>
          </div>

          {/* Day Names */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid var(--border)'
          }}>
            {dayNames.map(d => (
              <div key={d} style={{
                padding: '12px', textAlign: 'center',
                fontSize: '12px', fontWeight: 700,
                color: d === 'Sun' || d === 'Sat' ? 'var(--gold)' : 'var(--text-dim)',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: totalCells }).map((_, i) => {
              const day = i - firstDay + 1;
              const isValid = day >= 1 && day <= daysInMonth;
              const isToday = isValid && day === today.getDate() &&
                currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = isValid && day === selectedDay;
              const dayEvents = isValid ? getEventsForDay(day) : [];

              return (
                <div
                  key={i}
                  onClick={() => isValid && setSelectedDay(day)}
                  style={{
                    minHeight: '80px', padding: '8px',
                    borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: i < totalCells - 7 ? '1px solid var(--border)' : 'none',
                    background: isSelected ? 'rgba(16,185,129,0.08)' : 'transparent',
                    cursor: isValid ? 'pointer' : 'default',
                    transition: '0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={e => { if (isValid && !isSelected) e.currentTarget.style.background = 'var(--bg-card)'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {isValid && (
                    <>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: isToday ? 'var(--green)' : isSelected ? 'rgba(16,185,129,0.2)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: isToday ? 700 : 400,
                        color: isToday ? '#fff' : isSelected ? 'var(--green)' : 'var(--text)',
                        marginBottom: '4px'
                      }}>{day}</div>

                      {/* Event Dots */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayEvents.slice(0, 2).map(ev => (
                          <div key={ev.id} style={{
                            fontSize: '10px', fontWeight: 600,
                            color: ev.color, background: `${ev.color}15`,
                            padding: '1px 5px', borderRadius: '4px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Selected Day Events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Selected Day */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
                {monthNames[currentMonth]} <span style={{ color: 'var(--green)' }}>{selectedDay}</span>
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                <div style={{ fontSize: '13px' }}>No events today</div>
                <div
                  onClick={() => setShowModal(true)}
                  style={{ fontSize: '12px', color: 'var(--green)', marginTop: '8px', cursor: 'pointer' }}
                >
                  + Add event
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedEvents.map(ev => (
                  <div key={ev.id} style={{
                    background: 'var(--bg-card)', border: `1px solid ${ev.color}30`,
                    borderLeft: `3px solid ${ev.color}`,
                    borderRadius: '10px', padding: '12px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{ev.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>🕐 {ev.time}</div>
                      <div style={{
                        fontSize: '11px', color: ev.color,
                        background: `${ev.color}15`, padding: '2px 8px',
                        borderRadius: '20px', display: 'inline-block', marginTop: '6px'
                      }}>{ev.type}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      style={{
                        background: 'none', border: 'none',
                        color: 'var(--text-dim)', cursor: 'pointer',
                        fontSize: '14px', transition: '0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
              Upcoming Events
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {events
                .filter(e => e.date >= formatDate(today.getDate()))
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 4)
                .map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px', background: 'var(--bg-card)',
                    borderRadius: '10px', border: '1px solid var(--border)'
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: ev.color, flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{ev.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{ev.date} • {ev.time}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 Add Event</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              fontSize: '13px', color: 'var(--green)'
            }}>
              📅 Adding event for: <strong>{monthNames[currentMonth]} {selectedDay}, {currentYear}</strong>
            </div>

            <div className="form-group">
              <label>Event Title</label>
              <input
                className="input-field"
                placeholder="e.g. Team Meeting"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Time</label>
                <input
                  className="input-field"
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <select className="input-field" value={form.type}
                  onChange={e => setForm({
                    ...form, type: e.target.value,
                    color: typeColor[e.target.value] || 'var(--green)'
                  })}>
                  <option value="Meeting">🟢 Meeting</option>
                  <option value="Deadline">🔴 Deadline</option>
                  <option value="Review">🟡 Review</option>
                  <option value="Event">🔵 Event</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-green" onClick={handleAddEvent} style={{ flex: 1, justifyContent: 'center' }}>Add Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;