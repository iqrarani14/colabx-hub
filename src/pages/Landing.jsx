import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero image .png';
import logo from '../assets/logo (1).png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#080C10', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,12,16,0.97)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(16,185,129,0.15)',
        padding: '0 5%'
      }}>
        <div style={{
          height: '70px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="CoLabX" style={{ height: '44px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '44px' }}>
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Rooms', path: '/rooms' },
              { label: 'Projects', path: '/projects' },
            ].map(link => (
              <span key={link.label} onClick={() => navigate(link.path)} style={{
                color: '#94A3B8', fontSize: '15px', fontWeight: 500,
                cursor: 'pointer', transition: '0.3s'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = '#94A3B8'}
              >{link.label}</span>
            ))}
            <span onClick={() => navigate('/login')} style={{
              color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer'
            }}>Login</span>
            <button onClick={() => navigate('/signup')} style={{
              background: '#10B981', color: '#fff', border: 'none',
              padding: '11px 28px', borderRadius: '8px',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: '0.3s'
            }}
              onMouseOver={e => e.currentTarget.style.background = '#059669'}
              onMouseOut={e => e.currentTarget.style.background = '#10B981'}
            >Sign Up</button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', background: '#080C10',
        padding: '60px 5%', gap: '60px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Left */}
        <div style={{ flex: 1, zIndex: 2 }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '3rem', fontWeight: 800,
            lineHeight: 1.08, marginBottom: '24px', color: '#fff'
          }}>
            From Student to<br />
            <span style={{ color: '#10B981' }}>Professional</span><br />
            <span style={{ color: '#10B981' }}>Master.</span>
          </h1>
          <p style={{
            fontSize: '1rem', color: '#64748B',
            lineHeight: 1.8, maxWidth: '460px', marginBottom: '40px'
          }}>
            CoLabX is your ultimate hub for real-time project collaboration.
            Connect academic theory with industry-standard execution in our
            dedicated workspaces.
          </p>
          <button onClick={() => navigate('/signup')} style={{
            background: '#10B981', color: '#fff', border: 'none',
            padding: '16px 38px', borderRadius: '8px',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: '0.3s'
          }}
            onMouseOver={e => e.currentTarget.style.background = '#059669'}
            onMouseOut={e => e.currentTarget.style.background = '#10B981'}
          >Get Started Now</button>
        </div>

        {/* Right Image */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', zIndex: 2 }}>
          <img src={heroImage} alt="CoLabX Dashboard" style={{
            width: '100%', maxWidth: '600px', borderRadius: '16px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            animation: 'float 6s ease-in-out infinite'
          }} />
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>

      {/* ===== FEATURES ===== */}
      <section id="features" style={{ padding: '110px 5%',  background: '#0A0F13' }}>
        <div style={{
          textAlign: 'center', fontSize: '12px', fontWeight: 700,
          color: '#8A6A3D', letterSpacing: '5px',
          textTransform: 'uppercase', marginBottom: '20px',
          
        }}>
          THE COLABX ADVANTAGE
        </div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '2.8rem',
          fontWeight: 800, textAlign: 'center',
          marginBottom: '80px', color: '#fff', lineHeight: 1.2
        }}>
          Built for the next generation of masters.
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '56px 100px', maxWidth: '960px', margin: '0 auto'
        }}>
          {[
            { num: '01', title: 'Real-Time Rooms', desc: 'Instant virtual workspaces where teams sync and code together.', color: '#10B981' },
            { num: '02', title: 'Interactive Whiteboards', desc: 'Sketch out system architectures and logic flows on a shared canvas.', color: '#8A6A3D' },
            { num: '03', title: 'Agile Task Tracking', desc: 'Assign roles and track project milestones just like a professional dev team.', color: '#8A6A3D' },
            { num: '04', title: 'Peer Review Hub', desc: 'Exchange constructive feedback to bridge the gap to professional mastery.', color: '#10B981' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '28px' }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                border: `2px solid ${f.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontFamily: 'Syne, sans-serif',
                fontSize: '1.5rem', fontWeight: 800, color: f.color,
                transition: '0.3s', cursor: 'default'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.background = `${f.color}12`;
                  e.currentTarget.style.boxShadow = `0 0 30px ${f.color}25`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >{f.num}</div>
              <div style={{ paddingTop: '10px' }}>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '1.15rem',
                  fontWeight: 700, marginBottom: '10px', color: f.color
                }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section id="how" style={{ padding: '110px 5%', background: 'rgba(16,185,129,0.02)' }}>
        <div style={{
          textAlign: 'center', fontSize: '12px', fontWeight: 700,
          color: '#8A6A3D', letterSpacing: '5px',
          textTransform: 'uppercase', marginBottom: '20px'
        }}>
          THE ROADMAP
        </div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '2.8rem',
          fontWeight: 800, textAlign: 'center',
          marginBottom: '80px', color: '#fff'
        }}>
          Your Path to Mastery
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px', maxWidth: '900px', margin: '0 auto',
          position: 'relative'
        }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: '48px', left: '16%', right: '16%',
            height: '1px', background: 'rgba(138,106,61,0.3)', zIndex: 0
          }} />

          {[
            { num: '01', title: 'Initialize', desc: 'Create your CoLabX profile and select your specialized mastery track.' },
            { num: '02', title: 'Sync & Build', desc: 'Join real-time workspaces to collaborate on industry-standard projects.' },
            { num: '03', title: 'Deploy Mastery', desc: 'Verify your skills through peer review and transition to professional roles.' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                background: 'rgba(138,106,61,0.15)',
                border: '2px solid rgba(138,106,61,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
                fontFamily: 'Syne, sans-serif', fontSize: '1.4rem',
                fontWeight: 800, color: '#8A6A3D',
                transition: '0.3s'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#8A6A3D';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(138,106,61,0.3)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(138,106,61,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >{s.num}</div>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.2rem',
                fontWeight: 800, marginBottom: '12px', color: '#fff'
              }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '110px 5%', textAlign: 'center' , background: '#0A0D10' }}>
        <div style={{
          fontSize: '12px', fontWeight: 700, color: '#8A6A3D',
          letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '24px'
        }}>
          FINAL STEP
        </div>
        <h2 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '3rem',
          fontWeight: 800, marginBottom: '20px', color: '#fff', lineHeight: 1.15
        }}>
          Ready to enter the<br />
          <span style={{ color: '#10B981' }}>CoLabX Hub?</span>
        </h2>
        <p style={{
          fontSize: '16px', color: '#64748B',
          marginBottom: '44px', lineHeight: 1.7,
          maxWidth: '620px', margin: '0 auto 44px'
        }}>
          Your professional journey starts here. Connect with top-tier talent
          and turn academic theory into industry-standard execution.
        </p>
        <button onClick={() => navigate('/signup')} style={{
          background: '#8A6A3D', color: '#fff', border: 'none',
          padding: '18px 52px', borderRadius: '10px',
          fontSize: '17px', fontWeight: 700, cursor: 'pointer', transition: '0.3s',
          boxShadow: '0 0 40px rgba(138,106,61,0.3)'
        }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#5C4528';
            e.currentTarget.style.boxShadow = '0 0 50px rgba(138,106,61,0.5)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#8A6A3D';
            e.currentTarget.style.boxShadow = '0 0 40px rgba(138,106,61,0.3)';
          }}
        >Join the Hub Now</button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: '#050810',
        borderTop: '1px solid #1E293B',
        padding: '70px 5% 30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px', marginBottom: '60px',
          maxWidth: '900px', margin: '0 auto 60px'
        }}>

          {/* Col 1 — Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '22px',
              fontWeight: 800, color: '#fff', marginBottom: '16px'
            }}>
              CoLab<span style={{ color: '#10B981' }}>X</span> Hub
            </div>
            <p style={{
              fontSize: '14px', color: '#475569', lineHeight: 1.75,
              marginBottom: '24px'
            }}>
              Bridging the gap between academic theory and real-world project
              execution through seamless collaboration.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {['GH', 'LI', 'DC'].map((s, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#1E293B', border: '1px solid #2D3748',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: '#64748B',
                  cursor: 'pointer', transition: '0.3s'
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.color = '#10B981';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = '#2D3748';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >{s}</div>
              ))}
            </div>
          </div>

          {/* Col 2 — Platform */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{
              fontSize: '12px', fontWeight: 700, color: '#10B981',
              letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px'
            }}>PLATFORM</h4>
            {[
              { label: 'Home', path: '/' },
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Project Rooms', path: '/rooms' },
              { label: 'Find a Mentor', path: '/signup' },
            ].map(l => (
              <div key={l.label} onClick={() => navigate(l.path)} style={{
                color: '#64748B', fontSize: '14px', cursor: 'pointer',
                marginBottom: '12px', transition: '0.3s'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = '#64748B'}
              >{l.label}</div>
            ))}
          </div>

          {/* Col 3 — Stay Connected */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{
              fontSize: '12px', fontWeight: 700, color: '#10B981',
              letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px'
            }}>STAY CONNECTED</h4>
            <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '16px' }}>
              support@colabx.hub
            </div>
            <div style={{ display: 'flex', gap: '0', justifyContent: 'center' }}>
              <input
                placeholder="Email address"
                style={{
                  flex: 1, background: '#111827',
                  border: '1px solid #1E293B', borderRight: 'none',
                  color: '#fff', padding: '11px 14px',
                  borderRadius: '8px 0 0 8px', fontSize: '13px',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif'
                }}
              />
              <button style={{
                background: '#10B981', border: 'none', color: '#fff',
                padding: '11px 16px', borderRadius: '0 8px 8px 0',
                cursor: 'pointer', fontSize: '16px', transition: '0.3s'
              }}
                onMouseOver={e => e.currentTarget.style.background = '#059669'}
                onMouseOut={e => e.currentTarget.style.background = '#10B981'}
              >→</button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          borderTop: '1px solid #1E293B', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: '13px', color: '#475569' }}>
            © 2026 CoLabX Hub. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '28px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(l => (
              <span key={l} style={{
                fontSize: '13px', color: '#475569', cursor: 'pointer', transition: '0.3s'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = '#475569'}
              >{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;