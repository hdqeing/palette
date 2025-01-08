import { Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function Supplier(){
    return (
        <>
            <Row>
                <Col>
                    Lieferant 1
                </Col>
                <Col>
                    <Button>
                        Preisabfrage schicken
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    Lieferant 2
                </Col>
                <Col>
                    <Button>
                        Preisabfrage schicken
                    </Button>
                </Col>
            </Row> 
            <p>Ihre Preisabfrage wurde geschickt, bei 
                <Link to={'/order'}>
                    Bestellung
                </Link>
                bekommen die Neuigkeit von Ihrer Preisabfragen</p>      
        </>
    )
}