import { Link, Outlet, useLocation } from 'react-router-dom';
import img from '../assets/logo2.png'
export default function AppLayout() {
  const location = useLocation();
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `nav-link fw-semibold px-3 py-2 rounded-3 transition-all ${
      isActive 
        ? 'bg-success text-white shadow-sm' 
        : 'text-dark hover-bg-custom'
    }`
  }
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#F8FAFC' }}>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm sticky-top">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2 text-decoration-none" to="/" style={{ color: '#026523' }}>
              <img src={img} alt="Logo" style={{ width: '65px', height: '40px', objectFit: 'contain' }} />
              ParcAuto
            </Link>
            <div className="collapse navbar-collapse show">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2 align-items-center">
                <li className="nav-item">
                  <Link className={getNavLinkClass('/')} to="/">
                    Accueil
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={getNavLinkClass('/assurance/accueil')} to="/assurance/accueil">
                    Assurance
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={getNavLinkClass('/total')} to="/total">
                    Total
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={getNavLinkClass('/jawaz')} to="/jawaz">
                    Jawaz
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container-fluid px-4 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}