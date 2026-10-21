import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Table, Button, Badge, Form } from "react-bootstrap";
import { Calendar, Download, Search, FileText, ArrowLeft, Truck, Tag, Gauge, Fuel, DollarSign, AlertTriangle, RefreshCw, Layers, RotateCcw  } from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;
function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || value === "") return "N/A";
  const number = Number(value);
  if (!Number.isFinite(number)) return "N/A";
  return number.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function TotalHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const currentDate = new Date();
    const defaultMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [currentPage, setCurrentPage] = useState(1);

    const handleResetTotal = () => {
        setSearchTerm('');
    };

    const fetchTransactionsHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/total/?periode=${selectedMonth}`);
            setTransactions(response.data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique:", error);
            toast.error("❌ Erreur lors du chargement de l'historique pour ce mois.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTransactionsHistory();
    }, [selectedMonth]);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return transactions;
        const term = searchTerm.toLowerCase();
        return transactions.filter((item) =>
            String(item.immatriculation || "").toLowerCase().includes(term) ||
            String(item.type_vehicule || "").toLowerCase().includes(term) ||
            String(item.nom_station || "").toLowerCase().includes(term)
        );
    }, [transactions, searchTerm]);

    const monthlyStats = useMemo(() => {
        const totalVol = filteredData.reduce((acc, item) => acc + (Number(item.volume) || 0), 0);
        const totalAmt = filteredData.reduce((acc, item) => acc + (Number(item.montant) || 0), 0);
        return {
            count: filteredData.length,
            volume: totalVol,
            montant: totalAmt
        };
    }, [filteredData]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    
    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredData.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredData, currentPage]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        const term = val.toLowerCase().trim();
        if (term !== "" && transactions.length > 0) {
            const found = transactions.some((item) =>
                String(item.immatriculation || "").toLowerCase().includes(term) ||
                String(item.type_vehicule || "").toLowerCase().includes(term) ||
                String(item.nom_station || "").toLowerCase().includes(term)
            );

            if (!found) {
                Swal.fire({
                    icon: "info",
                    title: "Aucun résultat",
                    text: `Aucune transaction ne correspond à "${val}".`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        }
    };

    const handleExportHistoryExcel = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.warning(`⚠️ Aucune donnée à exporter pour la période (${selectedMonth}).`);
            return;
        }

        const dataToExport = filteredData.map((item, index) => ({
            "N°": index + 1,
            "Date": formatDate(item.date_tran),
            "Immatriculation": item.immatriculation,
            "Type Véhicule": item.type_vehicule || "Non défini",
            "Km Précédent": item.kil_precedent,
            "Km Actuel": item.kil_actuelle,
            "Volume (L)": item.volume,
            "Montant (MAD)": item.montant,
            "Station": item.nom_station,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Historique_${selectedMonth}`);
        XLSX.writeFile(workbook, `Historique_Transactions_${selectedMonth}.xlsx`);
        toast.success(`📥 Exportation du mois (${selectedMonth}) réussie !`);
    };

    return (
        <Container fluid className="py-4 px-3" style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            <ToastContainer />
            
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm border">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                        <FileText size={28} />
                    </div>
                    <div>
                        <h4 className="fw-bold text-dark mb-1">Historique des Transactions (Total)</h4>
                        <p className="text-muted small mb-0">Consultez l'historique et la consommation du mois sélectionné</p>
                    </div>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-3 border shadow-sm">
                        <Calendar size={18} className="text-success" />
                        <label htmlFor="monthPicker" className="small fw-semibold text-secondary mb-0 me-1">
                            Mois :
                        </label>
                        <input 
                            id="monthPicker"
                            type="month" 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="form-control form-control-sm border fw-bold text-success shadow-none"
                            style={{ 
                                cursor: 'pointer', 
                                maxWidth: '160px',
                                backgroundColor: '#ffffff',
                                color: '#198754'
                            }}
                        />
                    </div>

                    <Button 
                        variant="outline-success" 
                        onClick={fetchTransactionsHistory}
                        className="d-flex align-items-center gap-2 fw-semibold px-3 py-2"
                        title="Rafraîchir"
                    >
                        <RefreshCw size={16} className={loading ? "spinner-border spinner-border-sm" : ""} />
                        <span>Actualiser</span>
                    </Button>

                    <Button 
                        variant="success" 
                        onClick={handleExportHistoryExcel}
                        className="d-flex align-items-center gap-2 fw-semibold px-3 py-2 text-white"
                    >
                        <Download size={17} />
                        <span>Exporter ({selectedMonth})</span>
                    </Button>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-success">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase">Total Lignes ({selectedMonth})</span>
                                <h3 className="fw-bold text-dark mt-1 mb-0">{monthlyStats.count}</h3>
                            </div>
                            <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                                <Layers size={24} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-primary">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase">Volume Total (Par Mois)</span>
                                <h3 className="fw-bold text-primary mt-1 mb-0">{formatNumber(monthlyStats.volume)} L</h3>
                            </div>
                            <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                                <Fuel size={24} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={12} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 bg-white border-start border-4 border-warning">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted small fw-semibold text-uppercase">Montant Total (Par Mois)</span>
                                <h3 className="fw-bold text-dark mt-1 mb-0">{formatNumber(monthlyStats.montant)} MAD</h3>
                            </div>
                            <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                                <DollarSign size={24} />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
                <Row className="align-items-center g-3">
                    <Col xs={12} md={6}>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <Search size={18} className="text-success" />
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher par immatriculation, type ou station..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="border-start-0 shadow-none ps-0"
                            />
                        </div>
                    </Col>
                    <Col xs={12} md={2}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 flex-shrink-0"
                            onClick={handleResetTotal}
                            title="Réinitialiser la recherche"
                        >
                            <RotateCcw size={17} className="text-success" />
                            <span className="d-none d-md-inline">Réinitialiser</span>
                        </button>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end">
                        <Badge bg="success" className="bg-opacity-15 px-3 py-2 rounded-pill fw-semibold fs-6">
                            Période : {selectedMonth} | Total : {filteredData.length} lignes
                        </Badge>
                    </Col>
                </Row>
            </Card>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                        <thead>
                            <tr style={{ backgroundColor: "#087f5b" }}>
                                {[
                                    ["Date", Calendar],
                                    ["Immatriculation", Truck],
                                    ["Type Véhicule", Tag],
                                    ["Km Précédent", Gauge],
                                    ["Km Actuel", Gauge],
                                    ["Volume (L)", Fuel],
                                    ["Montant (MAD)", DollarSign],
                                ].map(([label, Icon]) => (
                                    <th key={label} className="py-3 px-3 text-center text-white border-0" style={{ backgroundColor: "#087f5b", whiteSpace: "nowrap" }}>
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <Icon size={16} />
                                            <span>{label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">
                                        Chargement des données de <strong>{selectedMonth}</strong>...
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">
                                        Aucune transaction trouvée pour le mois <strong>{selectedMonth}</strong>.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, idx) => {
                                    const previousKm = item.kil_precedent !== null ? Number(item.kil_precedent) : null;
                                    const currentKm = item.kil_actuelle !== null ? Number(item.kil_actuelle) : null;
                                    const hasKmError = previousKm !== null && currentKm !== null && currentKm <= previousKm;

                                    return (
                                        <tr key={item.id || idx} className={hasKmError ? "table-danger" : ""}>
                                            <td className="py-3 px-3 text-center">{formatDate(item.date_tran)}</td>
                                            <td className="py-3 px-3 text-center fw-semibold">{item.immatriculation || "N/A"}</td>
                                            <td className="py-3 px-3 text-center">
                                                <span className="badge bg-secondary bg-opacity-10 text-dark px-2 py-1 rounded">
                                                    {item.type_vehicule || "Non défini"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-center">{previousKm !== null ? `${formatNumber(previousKm, 0)} km` : "N/A"}</td>
                                            <td className="py-3 px-3 text-center fw-semibold">
                                                {currentKm !== null ? `${formatNumber(currentKm, 0)} km` : "N/A"}
                                                {hasKmError && (
                                                    <div className="small text-danger mt-1">
                                                        <AlertTriangle size={13} className="me-1" /> Kilométrage incohérent
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-center fw-semibold text-success">
                                                {item.volume !== null ? `${formatNumber(item.volume)} L` : "N/A"}
                                            </td>
                                            <td className="py-3 px-3 text-center fw-bold text-dark">
                                                {item.montant !== null ? `${formatNumber(item.montant)} MAD` : "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 border-top bg-light">
                        <span className="text-muted small">
                            Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
                        </span>
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </Button>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className="mt-4">
                <Link to="/total" className="btn btn-success d-inline-flex align-items-center gap-2 border px-4 py-2 rounded-3 text-white fw-semibold shadow-sm">
                    <ArrowLeft size={16} />
                    <span>Retour au Tableau de Bord</span>
                </Link>
            </div>
        </Container>
    )
}