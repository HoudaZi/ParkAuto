import FiltresAvances from '../composents/FiltresAvances';
import ListeVehicules from '../composents/ListeVehicules';
import FleetHeader from '../composents/ajouter';
import './page.css'

export default function Accueil({vehicules = [], filteredVehicules = [], searchTerm, setSearchTerm,
    type,
    setType,
    ville,
    setVille,
    chauffeur,
    setChauffeur,
    handleReset,
    setVehicules,
    fetchVehicules
}) {
    return (
        <div>
            <FleetHeader vehiculesT={vehicules.length} />
            <FiltresAvances
                vehicules={vehicules}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                type={type}
                setType={setType}
                ville={ville}
                setVille={setVille}
                chauffeur={chauffeur}
                setChauffeur={setChauffeur}
                handleReset={handleReset}
            />
            <ListeVehicules 
                vehicules={filteredVehicules} 
                setVehicules={setVehicules} 
                refreshVehicules={fetchVehicules} 
            />
        </div>
    )
}