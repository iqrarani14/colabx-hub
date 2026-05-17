import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import logo from '../assets/logo (1).png';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(11,15,20,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(16,185,129,0.15)',
      padding: '0 6%'
    }}>
      <div style={{
        height: '72px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="CoLabX" style={{ height: '44px', objectFit: 'contain' }} />
        </div>

        

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-outline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            className="btn-green"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;