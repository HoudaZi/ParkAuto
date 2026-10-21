import React, { useMemo, useState, useEffect } from "react";
import {
  Truck,
  Gauge,
  Fuel,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  Tag,
  History,
} from "lucide-react";
import { Table, Button, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return number.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("fr-FR");
}

export default function CardsTable({ transactions = [] }) {
  const dataList = Array.isArray(transactions) ? transactions : [];

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(dataList.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return dataList.slice(start, start + ITEMS_PER_PAGE);
  }, [dataList, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="p-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
            <FileText size={22} />
          </div>

          <div>
            <h5 className="mb-1 fw-bold text-dark">
              Rapport Global des Transactions
            </h5>

            <p className="mb-0 text-muted small">
              Liste de toutes les transactions enregistrées et filtrées
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link
            to="/total/historique"
            className="btn btn-outline-success d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold shadow-sm"
            style={{ fontSize: "14px" }}
          >
            <History size={17} />
            <span>Historique</span>
          </Link>

          <Badge
            bg="success"
            className="bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold"
          >
            Total : {dataList.length} lignes
          </Badge>
        </div>
      </div>

      <div className="table-responsive">
        <Table hover className="align-middle mb-0">
          <thead>
            <tr style={{ backgroundColor: "#026523" }}>
              {[
                ["Date", Calendar],
                ["Immatriculation", Truck],
                ["Type Véhicule", Tag],
                ["Km Précédent", Gauge],
                ["Km Actuel", Gauge],
                ["Volume (L)", Fuel],
                ["Montant (MAD)", DollarSign],
              ].map(([label, Icon]) => (
                <th
                  key={label}
                  className="py-3 px-3 text-center text-white border-0"
                  style={{ backgroundColor: "#026523", whiteSpace: "nowrap", borderRadius: '15px' }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Icon size={16} />
                    <span>{label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5 text-muted">
                  Aucune transaction trouvée. Veuillez importer un fichier Excel.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const previousKm =
                  item.kil_precedent === null ||
                  item.kil_precedent === undefined ||
                  item.kil_precedent === ""
                    ? null
                    : Number(item.kil_precedent);

                const currentKm =
                  item.kil_actuelle === null ||
                  item.kil_actuelle === undefined ||
                  item.kil_actuelle === ""
                    ? null
                    : Number(item.kil_actuelle);

                const hasKmError =
                  previousKm !== null &&
                  currentKm !== null &&
                  (
                    !Number.isFinite(previousKm) ||
                    !Number.isFinite(currentKm) ||
                    currentKm <= previousKm
                  );

                const rowKey =
                  item.id ??
                  `${item.num_ticket ?? "ticket"}-${item.immatriculation ?? "vehicle"}-${item.date_tran ?? "date"}`;

                return (
                  <tr
                    key={rowKey}
                    className={hasKmError ? "table-danger" : ""}
                  >
                    <td className="py-3 px-3 text-center">
                      {formatDate(item.date_tran)}
                    </td>

                    <td className="py-3 px-3 text-center fw-semibold">
                      {item.immatriculation || "N/A"}
                    </td>


                    <td className="py-3 px-3 text-center">
                      <span className="badge bg-secondary bg-opacity-10 text-dark px-2 py-1 rounded">
                        {item.type_vehicule || "Non défini"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {previousKm !== null
                        ? `${formatNumber(previousKm, 0)} km`
                        : "N/A"}
                    </td>

                    <td className="py-3 px-3 text-center fw-semibold">
                      {currentKm !== null
                        ? `${formatNumber(currentKm, 0)} km`
                        : "N/A"}

                      {hasKmError && (
                        <div className="small text-danger mt-1">
                          <AlertTriangle size={13} className="me-1" />
                          Kilométrage incohérent
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center fw-semibold text-success">
                      {item.volume !== null && item.volume !== undefined
                        ? `${formatNumber(item.volume)} L`
                        : "N/A"}
                    </td>

                    <td className="py-3 px-3 text-center fw-bold text-dark">
                      {item.montant !== null && item.montant !== undefined
                        ? `${formatNumber(item.montant)} MAD`
                        : "N/A"}
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
            Page <strong>{currentPage}</strong> sur{" "}
            <strong>{totalPages}</strong>
          </span>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="d-flex align-items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </Button>

            <Button
              variant="outline-success"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="d-flex align-items-center gap-1"
            >
              <span>Suivant</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}