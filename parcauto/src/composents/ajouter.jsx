import React from 'react'
import { Container } from 'react-bootstrap'
import { FileSpreadsheet, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import './FleetHeader.css'

export default function FleetHeader() {
  return (
    <div >
      <Container fluid className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-0">
        <div>
          <div className="fleet-breadcrumb mb-1">
            <span>Flotte</span>
            <span className="text-muted mx-2">/</span>
            <span className="active">Véhicules</span>
          </div>
          <h1 className="fleet-title mb-1">
            Suivi des Assurances de la Flotte
          </h1>
          <p className="fleet-subtitle mb-0">
            Liste et gestion des véhicules de la flotte
          </p>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Link to="/assurance/import_excel" className="btn-fleet-outline">
            <FileSpreadsheet size={16} />
            <span>Importer / Exporter Excel</span>
          </Link>
          <Link to="/assurance/Ajouter" className="btn-fleet-primary">
            <Plus size={18} />
            <span>Ajouter un Véhicule</span>
          </Link>
        </div>
      </Container>
    </div>
  )
}