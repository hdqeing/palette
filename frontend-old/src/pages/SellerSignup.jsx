import { Col, Image, Row, Container, Form, Button } from "react-bootstrap";
import bgAuth from "../assets/bg-auth.jpg"

export default function SellerSignup() {
    return (
        <Row>
        <Col className="d-flex flex-column align-items-center pt-5" style={{ minHeight: "100vh" }}>
        <h1>Holzpalette</h1>
        <h2>Create an account to start</h2>
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
                Already have an account? <a href="/seller/signup">Login</a>
            </Form.Text>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
            Register
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