import { useState } from 'react';
import { Container, Card, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Car, Pencil, Trash2, ChevronLeft, ChevronRight, Calendar, MapPin, User, Phone, LayoutDashboard } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';


export default function ListeVehicules({ vehicules, setVehicules }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [currentVehicule, setCurrentVehicule] = useState(null);
  const location = useLocation();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicules = vehicules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vehicules.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }
  const handleDelete = async (id, immatriculation) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le véhicule ${immatriculation} ?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/vehicules/${id}/`, {
          method: 'DELETE',
        })
        if (response.ok || response.status === 204) {
          const updatedVehicules = vehicules.filter(v => v.id !== id);
          setVehicules(updatedVehicules);
          toast.success('Véhicule supprimé avec succès');
        } else {
          toast.warn("Erreur lors de la suppression du véhicule.");
        }
      } catch (error) {
        toast.warn("Impossible de contacter le serveur.");
      }
    }
  }
  const handleEditClick = (vehicule) => {
    setCurrentVehicule({ ...vehicule });
    setShowModal(true);
  }
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vehicules/${currentVehicule.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentVehicule),
      })
      if (response.ok) {
        const updatedData = await response.json();
        const updatedVehicules = vehicules.map(v => v.id === updatedData.id ? updatedData : v);
        setVehicules(updatedVehicules)
        setShowModal(false)
        toast.success("Modifications enregistrées avec succès !")
      } else {
        alert("Erreur lors de la mise à jour.")
      }
    } catch (error) {
      console.error("Erreur réseau:", error)
      alert("Impossible de contacter le serveur.")
    }
  }
  return (
    <Container className="my-4 px-3" fluid>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 pb-3 border-bottom border-success-subtle gap-3">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              flexShrink: 0
            }}
          >
            <Car size={24} />
          </div>
          <div>
            <h1 className="fw-bold text-dark mb-0 fs-3" style={{ letterSpacing: '-0.5px', textAlign: 'left' }}>
              Liste des véhicules
            </h1>
            <p className="text-muted small mb-0">
              Gérez et suivez l'état de votre parc automobile en temps réel
            </p>
          </div>
        </div>
        <Link 
          to="/assurance/dash" 
          className={`d-inline-flex align-items-center gap-2 px-4 py-2.5 rounded-3 text-decoration-none fw-semibold shadow-sm transition-all ${
            location.pathname === '/assurance/dash' 
              ? 'bg-success text-white' 
              : 'bg-white text-success border border-success'
          }`}
          style={{ transition: 'all 0.2s ease' }}
        >
          <LayoutDashboard size={18} />
          <span>Tableau de bord (Dashboard)</span>
        </Link>
      </div>
      <ToastContainer />
      <style>{`
        .custom-fleet-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .custom-fleet-table {
          width: 100%;
          margin-bottom: 0;
        }
        .custom-fleet-table thead th {
          background-color: #026523 !important;
          color: #FFFFFF !important;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 14px 12px;
          border: none;
          white-space: nowrap;
        }
        .custom-fleet-table tbody tr {
          background-color: #FFFFFF;
          transition: background-color 0.15s ease-in-out;
        }
        .custom-fleet-table tbody tr:hover {
          background-color: #F8FAFC !important;
        }
        .custom-fleet-table tbody td {
          padding: 14px 12px;
          vertical-align: middle;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
          font-size: 0.85rem;
          white-space: nowrap;
        }
        .immat-badge {
          font-family: 'Monaco', 'Consolas', monospace;
          font-weight: 600;
          background: #026523;
          color: #ffffff;
          padding: 5px 10px;
          border-radius: 6px;
          letter-spacing: 0.5px;
          display: inline-block;
          font-size: 0.8rem;
        }
        .date-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
          background: #F8FAFC;
          color: #475569;
          border: 1px solid #CBD5E1;
        }
        .date-badge.valid {
          background: #ECFDF5;
          color: #047857;
          border-color: #A7F3D0;
        }
        .date-badge.empty {
          background: #FEF2F2;
          color: #B91C1C;
          border-color: #FECACA;
        }
        .custom-pagination-btn {
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          color: #334155;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          height: 34px;
          font-size: 0.85rem;
        }
        .custom-pagination-btn:hover:not(:disabled) {
          background: #F1F5F9;
          color: #026523;
          border-color: #026523;
        }
        .custom-pagination-btn.active {
          background: #026523;
          color: white;
          border-color: #026523;
        }
        .custom-pagination-btn:disabled {
          background: #F8FAFC;
          color: #CBD5E1;
          border-color: #E2E8F0;
          cursor: not-allowed;
        }
        @media all and (max-width: 991px) {
          .custom-responsive-table thead {
            display: none;
          }
          .custom-responsive-table tr {
            display: block;
            background-color: #FFFFFF;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            border-radius: 8px;
            margin-bottom: 12px;
            padding: 12px;
            border: 1px solid #E2E8F0;
          }
          .custom-responsive-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0 !important;
            border-bottom: 1px solid #F1F5F9;
            width: 100%;
          }
          .custom-responsive-table td:last-child {
            border-bottom: none;
          }
          .custom-responsive-table td::before {
            content: attr(data-label);
            color: #64748B;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }
        }
      `}</style>
      <Card className="custom-fleet-card p-0">
        <div style={{ overflowX: 'auto' }}>
          <Table className="align-middle mb-0 custom-fleet-table custom-responsive-table">
            <thead>
              <tr>
                <th className="px-3">Type Véhicule</th>
                <th>Immatriculation</th>
                <th>Ville</th>
                <th>Chauffeur</th>
                <th>Contact</th>
                <th>Assurance</th>
                <th>Visite Technique</th>
                <th>Vignette</th>
                <th>Mise en circulation</th>
                <th>Permis de circulation</th>
                <th className="text-end px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVehicules.length > 0 ? (
                currentVehicules.map((v) => (
                  <tr key={v.id} >
                    <td data-label="Type véhicule">
                      <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-3 d-inline-flex align-items-center gap-2">
                        <Car size={15} />
                        {v.type_vehicule || 'N/A'}
                      </span>
                    </td>
                    <td data-label="Immatriculation">
                      <span className="immat-badge">{v.immatriculation}</span>
                    </td>
                    <td data-label="Ville">
                      {v.ville ? (
                        <span className="fw-semibold text-secondary d-inline-flex align-items-center gap-1">
                          <MapPin size={13} className="text-muted" />
                          {v.ville.toUpperCase()}
                        </span>
                      ) : '-'}
                    </td>
                    <td data-label="Chauffeur">
                      {v.chauffeur ? (
                        <span className="fw-semibold text-dark d-inline-flex align-items-center gap-1">
                          <User size={13} className="text-muted" />
                          {v.chauffeur.toUpperCase()}
                        </span>
                      ) : '-'}
                    </td>
                    <td data-label="Contact">
                      {v.contact ? (
                        <span className="text-muted small d-inline-flex align-items-center gap-1">
                          <Phone size={13} />
                          {v.contact}
                        </span>
                      ) : '-'}
                    </td>
                    <td data-label="Assurance">
                      <span className={`date-badge ${v.assurance_fin ? 'valid' : 'empty'}`}>
                        <Calendar size={12} />
                        {v.assurance_fin || 'Non renseigné'}
                      </span>
                    </td>
                    <td data-label="Visite technique">
                      <span className={`date-badge ${v.visite_technique ? 'valid' : 'empty'}`}>
                        <Calendar size={12} />
                        {v.visite_technique || 'Non renseigné'}
                      </span>
                    </td>
                    <td data-label="Vignette">
                      <span className={`date-badge ${v.vignettes ? 'valid' : 'empty'}`}>
                        <Calendar size={12} />
                        {v.vignettes || 'Non renseigné'}
                      </span>
                    </td>
                    <td data-label="Mise en circulation">
                      <span className={`date-badge ${v.mise_en_circulation ? 'valid' : 'empty'}`}>
                        <Calendar size={12} />
                        {v.mise_en_circulation || 'Non renseigné'}
                      </span>
                    </td>
                    <td data-label="Permis de circulation">
                      <span className={`date-badge ${v.permis_circulation ? 'valid' : 'empty'}`}>
                        <Calendar size={12} />
                        {v.permis_circulation || 'Non renseigné'}
                      </span>
                    </td>
                    <td className="text-end px-3" data-label="Actions">
                      <div className="d-flex justify-content-end gap-1">
                        <Button 
                          variant="light" 
                          size="sm"
                          className="text-primary border shadow-sm p-2 rounded-2"
                          onClick={() => handleEditClick(v)}
                          title="Modifier"
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm"
                          className="text-danger border shadow-sm p-2 rounded-2"
                          onClick={() => handleDelete(v.id, v.immatriculation)}
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-5 text-muted">
                    <Car size={32} className="mb-2 opacity-50" />
                    <p className="mb-0 fw-semibold">Aucun véhicule trouvé.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top bg-white gap-3">
            <span className="text-muted small">
              Affichage de <span className="fw-semibold text-dark">{indexOfFirstItem + 1}</span> à <span className="fw-semibold text-dark">{Math.min(indexOfLastItem, vehicules.length)}</span> sur <span className="fw-semibold text-dark">{vehicules.length}</span> véhicules
            </span>
            <div className="d-flex align-items-center gap-1">
              <button
                className="custom-pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      className={`custom-pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-1 text-muted">...</span>;
                }
                return null;
              })}
              <button
                className="custom-pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </Card>
      {currentVehicule && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-light border-bottom">
            <Modal.Title className="fw-bold fs-5 text-success d-flex align-items-center gap-2">
              <Pencil size={18} />
              Modifier le véhicule : {currentVehicule.immatriculation}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdateSubmit}>
            <Modal.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Type véhicule</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentVehicule.type_vehicule || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, type_vehicule: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Immatriculation</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentVehicule.immatriculation || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, immatriculation: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Ville</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentVehicule.ville || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, ville: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Chauffeur</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentVehicule.chauffeur || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, chauffeur: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Contact</Form.Label>
                    <Form.Control
                      type="text"
                      value={currentVehicule.contact || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, contact: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Assurance</Form.Label>
                    <Form.Control
                      type="date"
                      value={currentVehicule.assurance_fin || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, assurance_fin: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Visite technique</Form.Label>
                    <Form.Control
                      type="date"
                      value={currentVehicule.visite_technique || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, visite_technique: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Vignette</Form.Label>
                    <Form.Control
                      type="date"
                      value={currentVehicule.vignettes || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, vignettes: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Mise en circulation</Form.Label>
                    <Form.Control
                      type="date"
                      value={currentVehicule.mise_en_circulation || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, mise_en_circulation: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold small">Permis de circulation</Form.Label>
                    <Form.Control
                      type="date"
                      value={currentVehicule.permis_circulation || ''}
                      onChange={(e) => setCurrentVehicule({ ...currentVehicule, permis_circulation: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="bg-light border-top">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="success" type="submit">
                Enregistrer les modifications
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  )
}