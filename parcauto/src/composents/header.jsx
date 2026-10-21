import { Container } from 'react-bootstrap';
import { Car, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './AddVehicle.css';

export default function NavbarHeader({ vehiculesT }) {
  const location = useLocation()
  return (
    <header className="py-3 px-4 w-100 bg-white border-bottom shadow-sm">
      <Container fluid className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-4 shadow-sm"
              style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
              }}
            >
              <Car size={24} />
            </div>
            <VerifiedBadge />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold text-dark mb-0" style={{ letterSpacing: '-0.3px' }}>
                ParcAuto
              </h5>
              <span className="animated-dot"></span>
            </div>
            <span className="text-success small fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
              ENTERPRISE
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center">
          <Link 
            to="/assurence" 
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none fw-semibold transition-all ${
              location.pathname === '/' 
                ? 'bg-success-subtle text-success' 
                : 'text-secondary hover-success'
            }`}
          >
            Flotte
          </Link>
          <Link 
            to="/assurance/dash" 
            className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none fw-semibold transition-all ${
              location.pathname === '/dash' 
                ? 'bg-success-subtle text-success' 
                : 'text-secondary hover-success'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
        </div>
      </Container>
    </header>
  )
}
function VerifiedBadge() {
  return (
    <div 
      className="position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
      style={{ 
        width: '20px', 
        height: '20px', 
        bottom: '-2px', 
        right: '-2px', 
        border: '2px solid #ffffff' 
      }}
    >
      <ShieldCheck size={13} className="text-success" />
    </div>
  )
}