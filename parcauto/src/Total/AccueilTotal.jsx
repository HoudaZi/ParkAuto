import "./HeaderBanner.css";
import img from "../assets/image.png";

import { Container, Row, Col, Card } from "react-bootstrap";
import {
  CreditCard,
  ReceiptText,
  CalendarDays,
  Users,
  TrendingUp,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  Fuel,
  Droplets,
} from "lucide-react";

export default function HeaderBanner({
  total = 0,
  montant = 0,
  volume = 0,
  derniere_importation = "N/A",
  date_aujourdhui = new Date(),
}) {
  const formatMontant = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    })} MAD`;

  const formatVolume = (value) =>
    `${Number(value || 0).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    })} L`;

  const formatDate = (date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date; // Si c'est déjà une chaîne formatée dd/mm/yyyy

    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const kpis = [
    {
      title: "Total des Cartes Actives",
      value: total,
      description: "Cartes TotalEnergies en service",
      Icon: CreditCard,
      SideIcon: Users,
    },
    {
      title: "Montant Total par Mois",
      value: formatMontant(montant),
      description: "Montant total des transactions du mois",
      Icon: ReceiptText,
      SideIcon: ChartNoAxesColumnIncreasing,
      trend: true,
    },
    {
      title: "Volume Total par Mois",
      value: formatVolume(volume),
      description: "Volume total consommé ce mois-ci",
      Icon: Fuel,
      SideIcon: Droplets,
    },
    {
      title: "Date du Jour",
      value: formatDate(date_aujourdhui),
      description: "Date actuelle",
      Icon: CalendarDays,
      SideIcon: CircleCheck,
      success: true,
    },
  ];

  return (
    <div>
      <Container fluid className="header-banner">
        <Row className="align-items-center g-0">
          <Col xs={2} md={1}>
            <div className="banner-icon">
              <Fuel size={60} strokeWidth={2.2} />
            </div>
          </Col>

          <Col xs={10} md={7}>
            <div className="banner-text">
              <h1>Gestion des Cartes Total &amp; Transactions</h1>
              <p>
                Importation des rapports de transactions TotalEnergies
                et suivi de la consommation de la flotte.
              </p>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="banner-visual">
              <img
                src={img}
                alt="Pompe à carburant"
                className="fuel-image"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid className="kpi-container">
        <Row className="g-3">
          {kpis.map((kpi) => {
            const Icon = kpi.Icon;
            const SideIcon = kpi.SideIcon;

            return (
              <Col xs={12} sm={6} xl={3} key={kpi.title}>
                <Card className="kpi-card h-100">
                  <Card.Body>
                    <div className="kpi-icon">
                      <Icon size={27} strokeWidth={2.2} />
                    </div>

                    <div className="kpi-info">
                      <h6>{kpi.title}</h6>
                      <h3>{kpi.value}</h3>

                      <p className={kpi.trend ? "kpi-trend" : ""}>
                        {kpi.trend && (
                          <TrendingUp size={14} strokeWidth={2.5} />
                        )}

                        {kpi.success && (
                          <CircleCheck size={13} fill="currentColor" />
                        )}

                        <span>{kpi.description}</span>
                      </p>
                    </div>

                    <div
                      className={`kpi-side-icon ${
                        kpi.success ? "kpi-success" : ""
                      }`}
                    >
                      <SideIcon size={21} strokeWidth={2.7} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}