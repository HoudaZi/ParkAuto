import { useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { Car, Coins, Wallet, Upload, Search, RotateCcw, TrendingUp, PlusCircle } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import SuccessToast from "../composents/SuccessToast";
import ErrorToast from "../composents/ErrorToast";
import "./JawazStatsAndToolbar.css";

export default function JawazStatsAndToolbar({
  stats = { totalPassages: 48, totalConsomme: 2720, soldeRestant: 5850 },
  searchTerm = "",
  onSearchChange,
  onResetSearch,
  onDataImported, 
}) {
  const [showModal, setShowModal] = useState(false);
  const [singleImmat, setSingleImmat] = useState("");

  // حالات التحكم في التنبيهات الاحترافية (Toasts)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: "", sub: "" });

  // دالة إظهار نجاح العملية
  const triggerSuccess = (title, sub) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // دالة إظهار خطأ
  const triggerError = (title, sub) => {
    setErrorMessage({ title, sub });
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  // دالة إضافة ماتريكول واحدة يدوياً
  const handleAddSingleMatricule = async (e) => {
    e.preventDefault();
    if (!singleImmat.trim()) {
      triggerError("Attention !", "Veuillez entrer une immatriculation.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/jawaz/", {
        immatriculation: singleImmat.trim()
      });

      triggerSuccess("Succès !", "Immatriculation ajoutée avec succès.");
      setSingleImmat("");
      setShowModal(false);
      if (onDataImported) onDataImported();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erreur lors de l'ajout. Vérifiez si elle existe déjà.";
      triggerError("Erreur !", msg);
    }
  };

  // دالة رفع وقراءة ملف Excel
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target.result;
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          triggerError("Erreur !", "Le fichier Excel est vide.");
          return;
        }

        fetch("http://localhost:8000/api/jawaz/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        })
          .then(async (res) => {
            const data = await res.json();
            if (res.ok) {
              triggerSuccess("Succès !", data.message || "Importation réussie !");
              if (onDataImported) onDataImported();
            } else {
              triggerError("Erreur !", data.error || "Erreur lors de l'importation.");
            }
          })
          .catch(() => triggerError("Erreur de connexion", "Impossible de contacter le serveur."));
      } catch {
        triggerError("Erreur !", "Erreur lors de la lecture du fichier Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  return (
    <div className="jawaz-stats-toolbar-container mb-4">
      {/* 📊 الكروت الثلاثة للإحصائيات */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="jawaz-kpi-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <Card.Body className="p-3 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex align-items-center gap-3">
                <div className="kpi-icon-circle bg-orange-light text-orange">
                  <Car size={26} />
                </div>
                <div><span className="kpi-title text-muted fw-bold">Total Passages du Mois</span></div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between mt-3">
                <h2 className="kpi-value text-dark fw-bold mb-0">{stats.totalPassages}</h2>
                <span className="kpi-badge text-orange fw-semibold d-flex align-items-center gap-1">
                  <TrendingUp size={14} /> +12%
                </span>
              </div>
            </Card.Body>
            <div className="kpi-wave wave-orange"></div>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="jawaz-kpi-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <Card.Body className="p-3 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex align-items-center gap-3">
                <div className="kpi-icon-circle bg-orange-light text-orange">
                  <Coins size={26} />
                </div>
                <div><span className="kpi-title text-muted fw-bold">Montant Total Consommé (MAD)</span></div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between mt-3">
                <h2 className="kpi-value text-dark fw-bold mb-0">
                  {Number(stats.totalConsomme).toLocaleString("fr-FR")} <span className="fs-5">MAD</span>
                </h2>
                <span className="kpi-badge text-orange fw-semibold d-flex align-items-center gap-1">
                  <TrendingUp size={14} /> +8%
                </span>
              </div>
            </Card.Body>
            <div className="kpi-wave wave-orange"></div>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="jawaz-kpi-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <Card.Body className="p-3 d-flex flex-column justify-content-between position-relative z-1">
              <div className="d-flex align-items-center gap-3">
                <div className="kpi-icon-circle bg-green-light text-green">
                  <Wallet size={26} />
                </div>
                <div><span className="kpi-title text-muted fw-bold">Solde Global Restant (MAD)</span></div>
              </div>
              <div className="d-flex align-items-baseline justify-content-between mt-3">
                <h2 className="kpi-value text-dark fw-bold mb-0">
                  {Number(stats.soldeRestant).toLocaleString("fr-FR")} <span className="fs-5">MAD</span>
                </h2>
              </div>
            </Card.Body>
            <div className="kpi-wave wave-green"></div>
          </Card>
        </Col>
      </Row>

      {/* 🛠️ شريط الأدوات */}
      <div className="jawaz-toolbar bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center flex-wrap gap-3">
        
        {/* زر إضافة ماتريكول واحدة */}
        <Button 
          onClick={() => setShowModal(true)}
          className="btn-jawaz-import d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm border-0"
          style={{ backgroundColor: "#059669" }}
        >
          <PlusCircle size={18} />
          <span>Ajouter Immatriculation</span>
        </Button>

        {/* زر استيراد ملف Excel */}
        <label className="btn-jawaz-import d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white shadow-sm mb-0" style={{ cursor: "pointer", backgroundColor: "#059669" }}>
          <Upload size={18} />
          <span>Importer (Excel)</span>
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} style={{ display: "none" }} />
        </label>

        <div className="toolbar-divider d-none d-md-block"></div>

        {/* حقل البحث */}
        <div className="flex-grow-1 position-relative">
          <div className="input-group search-input-group">
            <span className="input-group-text bg-white border-end-0 ps-3">
              <Search size={18} className="text-muted" />
            </span>
            <Form.Control
              type="text"
              placeholder="Rechercher par immatriculation..."
              value={searchTerm}
              onChange={onSearchChange}
              className="border-start-0 ps-0 shadow-none py-2"
            />
          </div>
        </div>

        {/* زر إعادة التعيين */}
        <Button variant="light" onClick={onResetSearch} className="btn-jawaz-reset d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-secondary border">
          <RotateCcw size={16} />
          <span>Réinitialiser</span>
        </Button>
      </div>

      {/* 🪟 Modal النافذة المنبثقة لإدخال الماتريكول */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">Ajouter une Immatriculation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSingleMatricule}>
            <Form.Group className="mb-3">
              <Form.Label className="text-muted small fw-semibold">Numéro d'immatriculation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: 12345-A-67"
                value={singleImmat}
                onChange={(e) => setSingleImmat(e.target.value)}
                required
                autoFocus
                className="py-2"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={() => setShowModal(false)} className="border px-3">
                Annuler
              </Button>
              <Button type="submit" style={{ backgroundColor: "#059669", border: "none" }} className="px-4 text-white">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 🔔 التنبيهات الاحترافية (Toasts) */}
      <SuccessToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        title={toastMessage.title} 
        message={toastMessage.sub} 
      />

      <ErrorToast 
        show={showError} 
        onClose={() => setShowError(false)} 
        message={errorMessage.sub} 
      />

    </div>
  );
}