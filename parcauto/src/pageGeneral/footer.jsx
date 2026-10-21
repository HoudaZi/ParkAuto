import { Container, Row, Col } from 'react-bootstrap';
import { ShieldCheck, MapPin, Heart } from 'lucide-react';
export default function Footer() {
  return (
    <footer 
      className="py-3 mt-auto bg-white border-top border-success-subtle shadow-sm"
      style={{
        position: 'relative',
        bottom: 0,
        width: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      <Container fluid className="px-4">
        <Row className="align-items-center justify-content-between gy-2">
          <Col md={6} className="text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <span className="p-1 rounded-circle bg-success-subtle text-success d-inline-flex">
                <ShieldCheck size={16} />
              </span>
              <span className="fw-semibold text-dark fs-7">
                ParcAuto <span className="text-success">Enterprise</span>
              </span>
              <span className="text-muted opacity-50">|</span>
              <small className="text-secondary fw-medium" style={{ fontSize: '0.82rem' }}>
                © {new Date().getFullYear()} Tous droits réservés.
              </small>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3 text-secondary small" style={{ fontSize: '0.8rem' }}>
              <span className="d-inline-flex align-items-center gap-1 bg-light px-2.5 py-1 rounded-pill border">
                <MapPin size={13} className="text-success" />
                Gestion centralisée Maroc
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill">
                v1.0.0
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}