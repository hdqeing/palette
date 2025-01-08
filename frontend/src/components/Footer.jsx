import { Container, Row, Col } from "react-bootstrap"


export default function Footer() {
    return (
        <Container className='bg-wood m-0 p-0 mw-100 footer' >
        <Row>
          <Col >
          <h2>myPalette</h2>
          <p>Paletten bestellen von besten Lieferanden aus Europa.</p>
          </Col>
          <Col>
          <h2>Kontakt</h2>
          <p>Holzminden Palettenhandel GmbH</p>
          <p>Lang Strasse 20</p>
          <p>37152 Holzminden</p>
          <p>info@palettenhandel.de</p>
          <p>01234567</p>
          </Col>
          <Col>
          <h2>Impressium</h2>
          <h2>FAQ</h2>
          <h2>Datenschutz</h2>
          </Col>
        </Row>
      </Container>
    )
}