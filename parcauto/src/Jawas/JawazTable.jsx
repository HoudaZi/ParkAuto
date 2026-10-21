import React from "react";
import { Card, Table, Button } from "react-bootstrap";
import { 
  Truck, 
  CreditCard, 
  MapPin, 
  ArrowRight
} from "lucide-react";
import "./JawazTable.css";

export default function JawazTable({
  transactions = [],
  loading = false,
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) {
  const COLUMN_COUNT = 3;
  const maxPagesToShow = Math.min(totalPages, 10);
  const pagesArray = Array.from({ length: maxPagesToShow }, (_, index) => index + 1);

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 jawaz-data-table">
          <thead>
            <tr>
              <th className="py-3 px-3 border-0">
                <Truck size={16} className="me-2 text-green-header" />
                Immatriculation
              </th>
              <th className="py-3 px-3 border-0">
                <CreditCard size={16} className="me-2 text-green-header" />
                Type Véhicule
              </th>
              <th className="py-3 px-3 border-0">
                <MapPin size={16} className="me-2 text-green-header" />
                Ville
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="text-center py-5 text-muted">
                  Chargement des données Jawaz...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="text-center py-5 text-muted">
                  Aucune donnée trouvée.
                </td>
              </tr>
            ) : (
              transactions.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3 px-3 fw-bold text-dark">
                    {item.immatriculation || "N/A"}
                  </td>
                  <td className="py-3 px-3 text-dark">
                    {item.vehicule_details?.type_vehicule || item.type_vehicule || "Non défini"}
                  </td>
                  <td className="py-3 px-3 text-dark">
                    {item.vehicule_details?.ville || item.ville || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 border-top bg-white">
        <span className="text-muted small">
          Affichage des résultats (Page {currentPage} sur {totalPages})
        </span>
        
        <div className="d-flex align-items-center gap-1 flex-wrap">
          <Button
            variant="light"
            size="sm"
            className="border text-secondary px-3 py-1 rounded-3"
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>

          {pagesArray.map((page) => (
            <Button
              key={page}
              size="sm"
              className={`px-3 py-1 rounded-3 fw-semibold border-0 ${
                currentPage === page 
                  ? "bg-emerald text-white" 
                  : "bg-light text-dark border"
              }`}
              onClick={() => onPageChange && onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="light"
            size="sm"
            className="border text-emerald fw-semibold px-3 py-1 rounded-3 d-flex align-items-center gap-1"
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span>Suivant</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}