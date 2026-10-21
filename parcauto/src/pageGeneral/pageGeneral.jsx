import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Car, ShieldCheck, Fuel, CreditCard } from 'lucide-react';
import 'animate.css'
import './pageGeneral.css'
export default function PageGeneral({ vehicules }) {
  return (
    <div style={{minHeight: '100vh' }}>
      <Carousel fade interval={3500} className="mb-5 shadow-sm">
        <Carousel.Item style={{ height: '420px' }}>
          <img
            className="d-block w-100 h-100"
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
            alt="Bienvenue Parc Auto"
            style={{ objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <Carousel.Caption className="text-start pb-4">
            <h2 className="fw-bold text-white display-6">
              Bienvenue dans la Gestion du Parc Auto
            </h2>
            <p className="fs-5 text-light opacity-90">
              Plateforme centralisée pour le suivi global de la flotte, la conformité
              des assurances et badges.
            </p>
            <Link to="/total">
              <Button variant="primary" size="lg" className="fw-semibold shadow-sm border-0">
                Espace Total
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '420px' }}>
          <img
            className="d-block w-100 h-100"
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop"
            alt="Gestion de Flotte"
            style={{ objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <Carousel.Caption className="text-start pb-4">
            <h2 className="fw-bold text-white display-6">
              Gestion Intelligente du Parc Auto
            </h2>
            <p className="fs-5 text-light opacity-90">
              Suivez l'état de votre flotte, vos assurances et vos visites
              techniques en temps réel.
            </p>
            <Link to="/assurance/accueil">
              <Button
                variant="success"
                size="lg"
                className="fw-semibold shadow-sm border-0"
                style={{ backgroundColor: '#026523' }}
              >
                Découvrir les Véhicules
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '420px' }}>
          <img
            className="d-block w-100 h-100"
            src="https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=1200&auto=format&fit=crop"
            alt="Gestion Carburant Total"
            style={{ objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <Carousel.Caption className="text-start pb-4">
            <h2 className="fw-bold text-white display-6">
              Contrôle des Dépenses de Carburant
            </h2>
            <p className="fs-5 text-light opacity-90">
              Optimisez la consommation et suivez les cartes Total facilement.
            </p>
            <Link to="/total">
              <Button variant="primary" size="lg" className="fw-semibold shadow-sm border-0">
                Espace Total
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '420px' }}>
          <img
            className="d-block w-100 h-100"
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"
            alt="Pass Jawaz"
            style={{ objectFit: 'cover', filter: 'brightness(0.55)' }}
          />
          <Carousel.Caption className="text-start pb-4">
            <h2 className="fw-bold text-white display-6">
              Recharge & Suivi Pass Jawaz
            </h2>
            <p className="fs-5 text-light opacity-90">
              Facilitez les déplacements de vos chauffeurs sur les autoroutes.
            </p>
            <Link to="/jawaz">
              <Button
                variant="warning"
                size="lg"
                className="fw-semibold text-white shadow-sm border-0"
              >
                Service Jawaz
              </Button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container className="pb-5">
        <div className="d-flex align-items-center gap-2 mb-2">
            <span 
                className="p-1 bg-success rounded-circle animate-pulse" 
                style={{ width: '10px', height: '10px', display: 'inline-block' }}
            ></span>
            <span className="text-muted small fw-semibold">
                Système de gestion actif - Synchronisé
            </span>
        </div>
        <div className="mb-4">
          <h3 className="fw-bold" style={{ color: '#1E293B', textAlign: 'left' }}>
            Accès Rapide aux Modules
          </h3>
          <p className="text-muted" style={{ textAlign: 'left' }}>
            Sélectionnez la rubrique que vous souhaitez gérer
          </p>
        </div>
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card
              className="h-100 border-0 rounded-4 transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#026523' }}>
                    Assurance & Véhicules
                  </h5>
                  <p className="text-muted small mb-3">
                    Suivi des vignettes, contrôles techniques et assurances.
                  </p>
                </div>
                <Link to="/assurance/accueil">
                  <Button
                    variant="outline-success"
                    className="w-100 fw-semibold rounded-3 py-2"
                    style={{ borderColor: '#026523', color: '#026523' }}
                  >
                    Accéder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="h-100 border-0 rounded-4 transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <h5 className="fw-bold text-primary mb-2">Total Carburant</h5>
                  <p className="text-muted small mb-3">
                    Gestion des recharges et des cartes carburant.
                  </p>
                </div>
                <Link to="/total">
                  <Button variant="outline-primary" className="w-100 fw-semibold rounded-3 py-2">
                    Accéder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="h-100 border-0 rounded-4 transition-all"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <h5 className="fw-bold text-warning text-dark mb-2">
                    Jawaz Autoroutes
                  </h5>
                  <p className="text-muted small mb-3">
                    Recharge et gestion des badges Autoroute.
                  </p>
                </div>
                <Link to="/jawaz">
                  <Button
                    variant="outline-warning"
                    className="w-100 fw-semibold rounded-3 py-2"
                  >
                    Accéder
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4">
          <Col xs={6} md={3}>
            <Card
              className="border-0 rounded-4 text-center p-3 h-100"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                className="d-inline-flex justify-content-center align-items-center mx-auto mb-2 rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E6F0EB',
                }}
              >
                <Car size={28} style={{ color: '#026523' }} />
              </div>
              <div
                className="fw-bold display-6 mb-0 hover-flip "
                style={{ color: '#026523', letterSpacing: '-1px' }}
              >
                {vehicules ? vehicules.length : 0}
              </div>
              <div className="text-muted fw-medium mt-1 small">Total Flotte</div>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 rounded-4 text-center p-3 h-100"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                className="d-inline-flex justify-content-center align-items-center mx-auto mb-2 rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E6F0EB',
                }}
              >
                <ShieldCheck size={28} style={{ color: '#026523' }} />
              </div>
              <div
                className="fw-bold display-6 mb-0 hover-flip "
                style={{ color: '#026523', letterSpacing: '-1px' }}
              >
                43
              </div>
              <div className="text-muted fw-medium mt-1 small">
                Assurances Valides
              </div>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 rounded-4 text-center p-3 h-100"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                className="d-inline-flex justify-content-center align-items-center mx-auto mb-2 rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E6F0EB',
                }}
              >
                <Fuel size={28} style={{ color: '#026523' }} />
              </div>
              <div
                className="fw-bold display-6 mb-0 hover-flip "
                style={{ color: '#026523', letterSpacing: '-1px' }}
              >
                42
              </div>
              <div className="text-muted fw-medium mt-1 small">
                Cartes Total Actives
              </div>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card
              className="border-0 rounded-4 text-center p-3 h-100"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                className="d-inline-flex justify-content-center align-items-center mx-auto mb-2 rounded-circle"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#E6F0EB',
                }}
              >
                <CreditCard size={28} style={{ color: '#026523' }} />
              </div>
              <div
                className="fw-bold display-6 mb-0 hover-flip "
                style={{ color: '#026523', letterSpacing: '-1px' }}
              >
                32
              </div>
              <div className="text-muted fw-medium mt-1 small">
                Badges Jawaz Actifs
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}