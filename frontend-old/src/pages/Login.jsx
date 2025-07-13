import { Form, Row, Col, Button, Nav, FloatingLabel, Container, Navbar, Tabs, Tab, Image, Modal } from "react-bootstrap";
import { useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom"

import PaletteIcon from "../assets/iconPalette.svg";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [key, setKey] = useState('mailAngeben');
    const [index, setIndex] = useState(0);
    const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Clear previous errors
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            });

        if (response.ok) {
            // Login successful - response body contains the JWT token
            const token = await response.text();
            setShowLoginSuccessModal(true);
            setTimeout(() => {
                login(token, email);
            }, 3000);            
        } else {
            // Login failed - get error message from response
            const errorMessage = await response.text();
            setError(errorMessage || 'Login failed. Please try again.');
        }
        } catch (error) {
        // Network or other errors
        console.error('Login error:', error);
        setError('Network error. Please check your connection and try again.');
        } finally {
        setIsLoading(false);
        }
    };


    return (
        <>
            <header style={{backgroundColor: "bisque", height: "10vh"}}>
                <Navbar style={{width: "75%", margin: "0 auto"}}>
                    <Navbar.Brand href="/">
                        <Image src={PaletteIcon} style={{height: "100px"}}></Image>
                    </Navbar.Brand> 
                </Navbar>
            </header>

            <Container fluid style={{ height: "90vh", width: "100vw" }} className="d-flex align-items-center justify-content-between flex-column background-palette">
                <div
                    style={{
                        backgroundColor: "rgba(255, 228, 196, 0.75)",
                        width: "30vw",
                        height: "50vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Form className="d-flex flex-column p-4 justify-content-around h-100">
                        <Form.Text>Login with your Email and Password</Form.Text>
                        <FloatingLabel label="Email address">
                            <Form.Control type="email" placeholder="test@email.com" value={email} onChange={(e) => { setEmail(e.target.value )}}></Form.Control>
                        </FloatingLabel>
                        <FloatingLabel label="Password">
                            <Form.Control type="password" placeholder="******" value={password} onChange={(e) => { setPassword(e.target.value )}}></Form.Control>
                        </FloatingLabel>
                        <Button variant="success" onClick={handleLogin} disabled={isLoading}>Login</Button>
                        <Form.Text>Do not have an account, sign up to get started.</Form.Text>
                        <Button variant="outline-success">Sign up</Button>
                    </Form>

                </div>




                <div style={{backgroundColor: "rgba(255, 228, 196, 0.75)", width: "100vw" }} className="d-flex justify-content-center">
                    <footer style={{ width: "75vw" }} className="d-flex flex-row justify-content-between">
                        <Col>
                            <p style={{ "text-align": "center" }}>AGB</p>
                        </Col>
                        <Col>
                            <p style={{ "text-align": "center" }}>Impressum</p>                    
                        </Col>
                        <Col>
                            <p style={{ "text-align": "center" }}>Datenschutz</p>
                        </Col>
                    </footer>

                </div>
            </Container>

            <Modal show={showLoginSuccessModal}>
                <Modal.Header>
                    <Modal.Title>Login succeeded!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Congratulations, your login succeeded. You will be redirected to homepage.
                </Modal.Body>

            </Modal>
        </>
    )
}