import { Col, Image, Row, Container, Form, Button } from "react-bootstrap";
import bgAuth from "../assets/bg-auth.jpg"

export default function SellerLogin() {
    return (
        <Row>
            <Col className="d-flex flex-column align-items-center pt-5" style={{ minHeight: "100vh" }}>
            <h1>Holzpalette</h1>
            <Form className="w-50">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" className="border border-success-subtle" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" className="border border-success-subtle" />
                </Form.Group>
                <Form.Group className="mb-3 text-end" >
                <Form.Text >
                    Don't have an account? <a href="/seller/signup">Register</a>
                </Form.Text>
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                Login
                </Button>
            </Form>

            </Col>
            <Col>
            <Container>
                <Image src={bgAuth} />
            </Container>
            </Col>
        </Row>
    )
}