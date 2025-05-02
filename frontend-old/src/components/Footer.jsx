import { Container, Row, Col } from "react-bootstrap"


export default function Footer() {
    return (
        <div  style={{height: "5vh"}}>
        <Row style={{ width: "75%", margin: "0 auto"}}>
          <Col className="d-flex justify-content-center">
          <p>Impressum</p>
          </Col>
          <Col className="d-flex justify-content-center">
          <p>Datenschutzerklärung</p>
          </Col>
          <Col className="d-flex justify-content-center">
          <p>AGB</p>
          </Col>
        </Row>
      </div>
    )
}