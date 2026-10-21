import { Container, Form, Row, Col } from 'react-bootstrap';
import { CheckCircle, ArrowLeft, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './AddVehicle.css'

export default function AddVehiclePage({ formData, setFormData, onAddVehicle }) {
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  return (
    <div className="py-4 px-3 w-100 min-vh-100">
      <style>{`
        .form-control:focus, .form-select:focus {
          border-color: #059669 !important;
          box-shadow: 0 0 0 0.25rem rgba(5, 150, 105, 0.25) !important;
        }
        .star-back-btn {
          position: relative;
          padding: 10px 24px;
          background: #059669;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          border: 2px solid #059669;
          border-radius: 8px;
          box-shadow: 0 0 0 rgba(5, 150, 105, 0.4);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }
        .star-back-btn:hover {
          background: transparent;
          color: #059669;
          box-shadow: 0 0 20px rgba(5, 150, 105, 0.4);
        }
      `}</style>
      <Container style={{ maxWidth: '850px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-4 shadow-sm"
              style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
            >
              <Car size={24} />
            </div>
            <div>
              <h4 className="fw-bold text-dark mb-1" style={{ textAlign: 'left' }}>
                Ajouter un Véhicule
              </h4>
              <p className="text-muted small mb-0">
                Enregistrez un nouveau véhicule selon les données de la flotte
              </p>
            </div>
          </div>
          <Link to="/assurance/accueil" className="star-back-btn">
            <ArrowLeft size={16} />
            <span>Retour</span>
          </Link>
        </div>
        <div className="p-4 p-md-5 rounded-4 shadow-sm bg-white border" style={{ background: 'rgba(255, 255, 255, 0.95) !important' }}>
          <Form onSubmit={(e) => onAddVehicle(e, navigate)}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Type de véhicule</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Type de véhicule" 
                    name="type_vehicule"
                    value={formData.type_vehicule || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Immatriculation</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ex: AB-123-CD" 
                    name="immatriculation"
                    value={formData.immatriculation || ''}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Ville</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ex: Casablanca" 
                    name="ville"
                    value={formData.ville || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Chauffeur</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nom du chauffeur" 
                    name="chauffeur"
                    value={formData.chauffeur || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Contact</span>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Numéro de téléphone" 
                    name="contact"
                    value={formData.contact || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>L'assurance (Date de fin)</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="assurance_fin"
                    value={formData.assurance_fin || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Visite Technique</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="visite_technique"
                    value={formData.visite_technique || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Vignettes</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="vignettes"
                    value={formData.vignettes || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Mise en circulation</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="mise_en_circulation"
                    value={formData.mise_en_circulation || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold small text-secondary d-flex align-items-center gap-2 text-start w-100">
                    <span>Permis de circulation (Date de fin)</span>
                  </Form.Label>
                  <Form.Control 
                    type="date" 
                    name="permis_circulation"
                    value={formData.permis_circulation || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-3 pt-3 border-top mt-4">
              <Link to="/assurance/accueil" className="btn btn-light px-4 py-2 fw-semibold text-secondary text-decoration-none d-flex align-items-center">
                Annuler
              </Link>
              <button type="submit" className="star-back-btn">
                <CheckCircle size={16} />
                <span>Ajouter le véhicule</span>
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  )
}