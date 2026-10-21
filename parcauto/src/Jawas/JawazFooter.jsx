import { Container, Row, Col } from "react-bootstrap"
import {Link} from 'react-router-dom'
import {ArrowLeft} from 'lucide-react'

export default function JawazFooter() {
    return (
        <Container className="">
            <div>
                <Row>
                    <Col>
                        <div className="mt-4">
                            <Link to="/" className="btn btn-success d-inline-flex align-items-center gap-2 border px-4 py-2 rounded-3 text-white fw-semibold shadow-sm">
                                <ArrowLeft size={16} />
                                <span>Retour au Tableau de Bord</span>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}