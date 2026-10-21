import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { Car, AlertTriangle, FileSpreadsheet, MapPin, CheckCircle, ArrowLeft, Filter, RefreshCw, Calendar, Search, ShieldAlert, FileText, User, Phone } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './dash.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
const ParcAutoDashboard = ({ vehicules = [], refreshVehicules }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [villeSearchInput, setVilleSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showTkhlsatModal, setShowTkhlsatModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVisiteDate, setNewVisiteDate] = useState('');
  const [showAssuranceModal, setShowAssuranceModal] = useState(false);
  const [newAssuranceDate, setNewAssuranceDate] = useState('');
  const [showPermisModal, setShowPermisModal] = useState(false);
  const [newPermisDate, setNewPermisDate] = useState('');
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])
  const handleOpenTkhlsatModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setNewVisiteDate('');
    setShowTkhlsatModal(true);
  }
  const handleCloseTkhlsatModal = () => {
    setShowTkhlsatModal(false)
    setSelectedVehicle(null)
  }
  const handleOpenAssuranceModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setNewAssuranceDate('')
    setShowAssuranceModal(true)
  }
  const handleCloseAssuranceModal = () => {
    setShowAssuranceModal(false)
    setSelectedVehicle(null)
  }
  const handleOpenPermisModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setNewPermisDate('')
    setShowPermisModal(true)
  }
  const handleClosePermisModal = () => {
    setShowPermisModal(false)
    setSelectedVehicle(null);
  }
  const handleUpdateVisite = async (e) => {
    e.preventDefault();
    if (!newVisiteDate) {
      toast.warn("⚠️ Veuillez entrer la nouvelle date de visite technique !", { theme: "colored" });
      return;
    }
    try {
      const vehicleId = selectedVehicle.id || selectedVehicle.pk;
      await axios.patch(`http://127.0.0.1:8000/api/vehicules/${vehicleId}/`, {
        visite_technique: newVisiteDate
      });
      toast.success("✅ Visite technique renouvelée avec succès !", { theme: "colored" });
      setShowTkhlsatModal(false)
      if (refreshVehicules) {
        refreshVehicules()
      } else {
        window.location.reload()
      }
    } catch (error) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      toast.error(`❌ Erreur : ${errorDetail}`, { theme: "colored" });
    }
  }
  const handleUpdateAssurance = async (e) => {
    e.preventDefault();
    if (!newAssuranceDate) {
      toast.warn("⚠️ Veuillez entrer la nouvelle date d'assurance !", { theme: "colored" });
      return;
    }
    try {
      const vehicleId = selectedVehicle.id || selectedVehicle.pk;
      await axios.patch(`http://127.0.0.1:8000/api/vehicules/${vehicleId}/`, {
        assurance_fin: newAssuranceDate
      });
      toast.success("✅ Assurance renouvelée avec succès !", { theme: "colored" });
      setShowAssuranceModal(false);
      if (refreshVehicules) {
        refreshVehicules();
      } else {
        window.location.reload();
      }
    } catch (error) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      toast.error(`❌ Erreur : ${errorDetail}`, { theme: "colored" });
    }
  }
  const handleUpdatePermis = async (e) => {
    e.preventDefault();
    if (!newPermisDate) {
      toast.warn("⚠️ Veuillez entrer la nouvelle date du permis de circulation !", { theme: "colored" });
      return;
    }
    try {
      const vehicleId = selectedVehicle.id || selectedVehicle.pk;
      await axios.patch(`http://127.0.0.1:8000/api/vehicules/${vehicleId}/`, {
        permis_circulation: newPermisDate
      })
      toast.success("✅ Permis de circulation renouvelé avec succès !", { theme: "colored" });
      setShowPermisModal(false);
      if (refreshVehicules) {
        refreshVehicules();
      } else {
        window.location.reload();
      }
    } catch (error) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      toast.error(`❌ Erreur : ${errorDetail}`, { theme: "colored" });
    }
  }
  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false
    let formattedDate = dateStr
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(formattedDate);
    targetDate.setHours(0, 0, 0, 0);
    if (isNaN(targetDate.getTime())) return false;
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30
  }
  const uniqueVilles = [...new Set(vehicules.map(v => v.ville).filter(Boolean))];
  const filteredVillesList = uniqueVilles.filter(ville => 
    ville.toLowerCase().includes(villeSearchInput.toLowerCase().trim())
  )
  const filteredVehicules = vehicules.filter(v => {
    const search = searchTerm.toLowerCase().trim();
    const matchSearch = search === '' || 
      v.immatriculation?.toLowerCase().includes(search) || 
      v.type_vehicule?.toLowerCase().includes(search) ||
      v.ville?.toLowerCase().includes(search);
    const matchVille = selectedVille === '' || 
      (v.ville && v.ville.toLowerCase().includes(selectedVille.toLowerCase().trim()));   
    const matchType = selectedType === '' || v.type_vehicule === selectedType;
    return matchSearch && matchVille && matchType;
  })
  const alertVehicles = filteredVehicules.filter(v => 
    isExpiringSoon(v.visite_technique) || isExpiringSoon(v.assurance_fin) || isExpiringSoon(v.permis_circulation)
  )
  const alertCount = alertVehicles.length
  const assuranceAlertCount = filteredVehicules.filter(v => isExpiringSoon(v.assurance_fin)).length;
  const visiteAlertCount = filteredVehicules.filter(v => isExpiringSoon(v.visite_technique)).length;
  const permisAlertCount = filteredVehicules.filter(v => isExpiringSoon(v.permis_circulation)).length;
  useEffect(() => {
    if (alertCount > 0) {
      toast.error(`⚠️ Attention : ${alertCount} véhicule(s) ont une échéance (Visite, Assurance ou Permis) proche !`, {
        position: "top-right",
        autoClose: false,
        theme: "colored",
      })
    }
  }, [alertCount])
  const typeCounts = filteredVehicules.reduce((acc, v) => {
    const type = v.type_vehicule ? v.type_vehicule.trim() : 'Inconnu';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {})
  const typesInFiltered = Object.keys(typeCounts);
  const countPerType = Object.values(typeCounts);
  const barChartData = {
    labels: typesInFiltered.length > 0 ? typesInFiltered : ['Aucun type'],
    datasets: [{
      label: 'Nombre de véhicules',
      data: countPerType.length > 0 ? countPerType : [0],
      backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#20c997', '#fd7e14', '#0dcaf0'],
      borderRadius: 6,
      maxBarThickness: 80,
    }],
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 }
      }
    }
  }
  const doughnutData = {
    labels: ['Valide', 'Échéance proche (< 30 jours)', 'Sans affectation'],
    datasets: [{
      data: [filteredVehicules.length - alertCount, alertCount, 0],
      backgroundColor: ['#198754', '#dc3545', '#ffc107'],
    }],
  }
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedVille('')
    setSelectedType('')
    setVilleSearchInput('')
  }
  return (
    <div className="min-vh-100 pb-5">
      <ToastContainer />
      <style>{`
        .custom-fleet-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .custom-fleet-table {
          width: 100%;
        }
        .custom-fleet-table thead th {
          background-color: #F1F5F9;
          color: #334155;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 14px 12px;
          border: none;
          white-space: nowrap;
        }
        .custom-fleet-table tbody tr {
          background-color: #ffffff;
          transition: all 0.2s ease-in-out;
        }
        .custom-fleet-table tbody tr:hover {
          background-color: #F8FAFC !important;
        }
        .custom-fleet-table tbody td {
          padding: 14px 12px;
          vertical-align: middle;
          border-bottom: 1px solid #F1F5F9;
          color: #334155; /* CORRIGÉ : Texte sombre bien lisible */
          font-size: 0.85rem;
          white-space: nowrap;
        }
        .immat-badge-pro {
          font-family: 'Monaco', 'Consolas', monospace;
          font-weight: 700;
          background: #065f46;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          letter-spacing: 1px;
          display: inline-block;
          font-size: 0.85rem;
        }
        .type-badge-pro {
          background: #d1fae5;
          color: #065f46;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
      <Container fluid className="px-4 pt-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold text-dark" style={{ textAlign: 'left', fontSize: '1.75rem' }}>Gestion du Parc Auto</h1>
            <p className="text-muted fw-medium mb-0">Suivi des échéances, des assurances et des chauffeurs en temps réel.</p>
          </div>
          <Link to="/assurance/accueil" className="btn d-flex align-items-center gap-2 text-decoration-none shadow-sm px-4 py-2 rounded-3" style={{ backgroundColor: '#026523', color: '#ffffff' }}>
             <ArrowLeft size={16} />
            Retour
          </Link>
        </div>
        <Card className="shadow-sm border-0 mb-4 p-4 bg-white rounded-4" style={{ border: '1px solid #E2E8F0' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <Filter size={18} className="text-success" />
            <h5 className="mb-0 fw-bold text-dark">Filtres et Recherche</h5>
          </div>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group className="position-relative" ref={dropdownRef}>
                <Form.Label style={{textAlign: 'left'}} className="fw-semibold small text-secondary">Filtrer par Ville</Form.Label>
                <div 
                  className="form-control d-flex justify-content-between align-items-center bg-light py-2 border-0 rounded-3"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ cursor: 'pointer', minHeight: '40px' }}
                >
                  <span className={selectedVille ? "text-dark fw-semibold" : "text-muted"}>
                    {selectedVille ? selectedVille.toUpperCase() : "Toutes les villes"}
                  </span>
                  <span className="text-muted small">▼</span>
                </div>
                {isDropdownOpen && (
                  <div className="position-absolute w-100 bg-white border shadow-sm rounded-3 mt-1 p-2" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
                    <div className="input-group mb-2">
                      <span className="input-group-text bg-light border-end-0">
                        <Search size={14} className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Rechercher une ville par lettres..."
                        value={villeSearchInput}
                        onChange={(e) => setVilleSearchInput(e.target.value)}
                        className="border-start-0 shadow-none form-control-sm bg-light"
                        autoFocus
                      />
                    </div>
                    <div 
                      className="p-2 rounded text-secondary"
                      style={{ fontSize: '14px', cursor: 'pointer', backgroundColor: selectedVille === '' ? '#f8f9fa' : 'transparent' }}
                      onClick={() => {
                        setSelectedVille('');
                        setIsDropdownOpen(false);
                        setVilleSearchInput('');
                      }}
                    >
                      <strong>Toutes les villes</strong>
                    </div>
                    {filteredVillesList.length > 0 ? (
                      filteredVillesList.map((ville, idx) => (
                        <div 
                          key={idx}
                          className="p-2 rounded text-dark"
                          style={{ fontSize: '14px', cursor: 'pointer', backgroundColor: selectedVille === ville ? '#e9ecef' : 'transparent' }}
                          onClick={() => {
                            setSelectedVille(ville);
                            setIsDropdownOpen(false);
                            setVilleSearchInput('');
                          }}
                        >
                          {ville.toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted text-center py-2 small">Aucune ville trouvée</div>
                    )}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button 
                variant="light" 
                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 text-secondary border-0 fw-medium"
                onClick={handleResetFilters}
                style={{ backgroundColor: '#F1F5F9' }}
              >
                <RefreshCw size={14} /> Réinitialiser
              </Button>
            </Col>
          </Row>
        </Card>
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 bg-white rounded-4 p-2">
              <Card.Body className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <h6 className="text-muted small mb-1">Total Véhicules</h6>
                  <h3 className="fw-bold mb-0 text-dark">{filteredVehicules.length}</h3>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: '#E6F0EB', color: '#026523' }}>
                  <Car size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 bg-white rounded-4 p-2 border-start border-primary border-4">
              <Card.Body className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <h6 className="text-muted small mb-1">Assurances</h6>
                  <h3 className="fw-bold text-primary mb-0">{assuranceAlertCount}</h3>
                </div>
                <div className="p-3 rounded-3 bg-light text-primary">
                  <ShieldAlert size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 bg-white rounded-4 p-2 border-start border-warning border-4">
              <Card.Body className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <h6 className="text-muted small mb-1">Visites Tech</h6>
                  <h3 className="fw-bold text-warning mb-0">{visiteAlertCount}</h3>
                </div>
                <div className="p-3 rounded-3 bg-light text-warning">
                  <Calendar size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 bg-white rounded-4 p-2 border-start border-success border-4">
              <Card.Body className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <h6 className="text-muted small mb-1">Permis Circ.</h6>
                  <h3 className="fw-bold text-success mb-0">{permisAlertCount}</h3>
                </div>
                <div className="p-3 rounded-3 bg-light text-success">
                  <FileText size={24} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4 mb-4">
          <Col md={8}>
            <Card className="shadow-sm border-0 p-4 h-100 rounded-4">
              <h5 className="mb-3 text-center fw-bold fs-6 text-dark" title={selectedVille}>
                {selectedVille 
                  ? `Répartition des types à ${selectedVille.length > 20 ? selectedVille.substring(0, 20) + '...' : selectedVille.toUpperCase()}` 
                  : 'Répartition des véhicules par type'}
              </h5>
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 p-4 h-100 rounded-4">
              <h5 className="mb-3 text-center fw-bold fs-6 text-dark">État des Échéances</h5>
              <div style={{ height: '300px', position: 'relative' }}>
                <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </Card>
          </Col>
        </Row>
        <Card className="custom-fleet-card p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
            <div className="d-flex align-items-center gap-2">
              <AlertTriangle className="text-danger" size={20} />
              <h5 className="mb-0 fw-bold text-dark fs-6">
                Véhicules avec Visite, Assurance ou Permis de circulation proche de l'expiration
              </h5>
            </div>
            {alertCount > 0 && (
              <Badge bg="danger" pill className="px-3 py-2 fs-6">
                {alertCount} alerte(s)
              </Badge>
            )}
          </div>
          <div className="table-responsive">
            <Table className="align-middle mb-0 custom-fleet-table text-center">
              <thead>
                <tr>
                  <th className="py-3 px-3 text-start">Type Véhicule</th>
                  <th className="py-3">Immatriculation</th>
                  <th className="py-3 text-start">Ville</th>
                  <th className="py-3 text-start">Chauffeur</th>
                  <th className="py-3">Assurance</th>
                  <th className="py-3">Visite Technique</th>
                  <th className="py-3">Permis Circulation</th>
                  <th className="py-3 text-end px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {alertVehicles.length > 0 ? (
                  alertVehicles.map((v) => {
                    const isVisiteExpiring = isExpiringSoon(v.visite_technique);
                    const isAssuranceExpiring = isExpiringSoon(v.assurance_fin);
                    const isPermisExpiring = isExpiringSoon(v.permis_circulation);
                    return (
                      <tr key={v.id || v.immatriculation}>
                        <td className="fw-semibold px-3 text-start">
                          <span className="type-badge-pro">
                            <Car size={16} />
                            {v.type_vehicule || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="immat-badge-pro">{v.immatriculation}</span>
                        </td>
                        <td className="text-start">
                          <span className="fw-semibold text-secondary d-inline-flex align-items-center gap-1">
                            <MapPin size={14} className="text-muted" />
                            {v.ville ? v.ville.toUpperCase() : '-'}
                          </span>
                        </td>
                        <td className="fw-semibold text-start">
                          <span className="d-inline-flex align-items-center gap-1 text-dark">
                            <User size={14} className="text-muted" />
                            {v.chauffeur ? v.chauffeur.toUpperCase() : '-'}
                          </span>
                        </td>
                        <td>
                          {isAssuranceExpiring ? (
                            <Badge bg="danger" className="px-2 py-1 text-white fw-bold">
                              ⚠️ {v.assurance_fin}
                            </Badge>
                          ) : (
                            <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold">
                              <Calendar size={13} /> {v.assurance_fin || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {isVisiteExpiring ? (
                            <Badge bg="danger" className="px-2 py-1 text-white fw-bold">
                              ⚠️ {v.visite_technique}
                            </Badge>
                          ) : (
                            <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold">
                              <Calendar size={13} /> {v.visite_technique || '-'}
                            </span>
                          )}
                        </td>
                        <td>
                          {isPermisExpiring ? (
                            <Badge bg="danger" className="px-2 py-1 text-white fw-bold">
                              ⚠️ {v.permis_circulation}
                            </Badge>
                          ) : (
                            <span className="d-inline-flex align-items-center gap-1 text-success fw-semibold">
                              <FileText size={13} /> {v.permis_circulation || '-'}
                            </span>
                          )}
                        </td>
                        <td className="text-end px-3">
                          <div className="d-flex justify-content-end gap-1">
                            {isVisiteExpiring && (
                              <Button 
                                variant="success" 
                                size="sm" 
                                onClick={() => handleOpenTkhlsatModal(v)}
                                className="d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1 rounded-2"
                                style={{ fontSize: '11px' }}
                              >
                                <RefreshCw size={11} /> Visite
                              </Button>
                            )}
                            {isAssuranceExpiring && (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleOpenAssuranceModal(v)}
                                className="d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1 rounded-2"
                                style={{ fontSize: '11px' }}
                              >
                                <ShieldAlert size={11} /> Assurance
                              </Button>
                            )}
                            {isPermisExpiring && (
                              <Button 
                                variant="dark" 
                                size="sm" 
                                onClick={() => handleOpenPermisModal(v)}
                                className="d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1 rounded-2"
                                style={{ fontSize: '11px' }}
                              >
                                <FileText size={11} /> Permis
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-success fw-semibold bg-white">
                      <CheckCircle size={24} className="me-2 d-inline-block align-text-bottom text-success" />
                      Aucun véhicule en alerte (Visite, Assurance ou Permis) pour le moment. Tout est en ordre !
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
      <Modal show={showTkhlsatModal} onHide={handleCloseTkhlsatModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2 fs-5 text-success fw-bold">
            <Calendar className="text-success" size={20} />
            Renouveler la Visite Technique
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateVisite}>
          <Modal.Body className="p-4">
            {selectedVehicle && (
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <small className="text-muted d-block">Véhicule concerné :</small>
                <strong className="text-dark fs-6">{selectedVehicle.immatriculation}</strong> ({selectedVehicle.type_vehicule})
              </div>
            )}
            <Form.Group>
              <Form.Label className="fw-semibold small">Nouvelle Date de Visite Technique</Form.Label>
              <Form.Control
                type="date"
                value={newVisiteDate}
                onChange={(e) => setNewVisiteDate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={handleCloseTkhlsatModal}>Annuler</Button>
            <Button variant="success" type="submit">Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showAssuranceModal} onHide={handleCloseAssuranceModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2 fs-5 text-primary fw-bold">
            <ShieldAlert className="text-primary" size={20} />
            Renouveler l'Assurance
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateAssurance}>
          <Modal.Body className="p-4">
            {selectedVehicle && (
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <small className="text-muted d-block">Véhicule concerné :</small>
                <strong className="text-dark fs-6">{selectedVehicle.immatriculation}</strong> ({selectedVehicle.type_vehicule})
              </div>
            )}
            <Form.Group>
              <Form.Label className="fw-semibold small">Nouvelle Date de Fin d'Assurance</Form.Label>
              <Form.Control
                type="date"
                value={newAssuranceDate}
                onChange={(e) => setNewAssuranceDate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={handleCloseAssuranceModal}>Annuler</Button>
            <Button variant="primary" type="submit">Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showPermisModal} onHide={handleClosePermisModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="d-flex align-items-center gap-2 fs-5 text-dark fw-bold">
            <FileText className="text-dark" size={20} />
            Renouveler le Permis de Circulation
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdatePermis}>
          <Modal.Body className="p-4">
            {selectedVehicle && (
              <div className="bg-light p-3 rounded-3 mb-3 border">
                <small className="text-muted d-block">Véhicule concerné :</small>
                <strong className="text-dark fs-6">{selectedVehicle.immatriculation}</strong> ({selectedVehicle.type_vehicule})
              </div>
            )}
            <Form.Group>
              <Form.Label className="fw-semibold small">Nouvelle Date du Permis de Circulation</Form.Label>
              <Form.Control
                type="date"
                value={newPermisDate}
                onChange={(e) => setNewPermisDate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={handleClosePermisModal}>Annuler</Button>
            <Button variant="dark" type="submit">Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}
export default ParcAutoDashboard;