import { Form, Row, Col, Button, Nav, FloatingLabel, Container, Navbar, Tabs, Tab, Image } from "react-bootstrap";
import { useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom"

import PaletteIcon from "../assets/iconPalette.svg";

export default function Register() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
/*     const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [vat, setVat] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
 */

    const registerUser = async (username, password) => {
        await fetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(username, password)
    };
    const [key, setKey] = useState('mailAngeben');
    return (
        <>
        <header style={{backgroundColor: "bisque", height: "10vh"}}>
            <Navbar style={{width: "75%", margin: "0 auto"}}>
                <Navbar.Brand href="#home">
                <Image src={PaletteIcon} style={{height: "100px"}}></Image>
                </Navbar.Brand> 
            </Navbar>
        </header>
        <Container fluid style={{ height: "90vh", width: "100vw" }} className="d-flex align-items-center justify-content-between flex-column background-palette">
            <div style={{width: "75%"}}>
                <Button variant="link" href="#home">
                    Zurück
                </Button>
            </div>

            <div
  style={{
    backgroundColor: "rgba(255, 228, 196, 0.75)",
    width: "30vw",
    height: "50vh",
    display: "flex",
    flexDirection: "column",
  }}
>
  <Tab.Container defaultActiveKey="mailAngeben">
    <Nav variant="tabs" fill>
      <Nav.Item>
        <Nav.Link eventKey="mailAngeben">E-Mail angeben</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="mailVerifizieren">E-Mail verifizieren</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="datenPersonalisieren">Daten personalisieren</Nav.Link>
      </Nav.Item>
    </Nav>

    <Tab.Content style={{ flexGrow: 1, overflow: "auto" }}>
        <Tab.Pane eventKey="mailAngeben" style={{ height: "100%" }}>
            <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-4">
                    <Form.Text style={{ color: "saddlebrown" }}>
                        Gib unten deine E-Mail-Adresse ein: Wir senden dir einen 6-stelligen Code zu, um sie zu verifizieren und dein Konto zu sichern.
                    </Form.Text>
                    <FloatingLabel
                    label="Email address"
                    controlId="floatingInput"
                    >
                        <Form.Control type="email" placeholder="name@example.com"></Form.Control>
                    </FloatingLabel>
                    <Button variant="success">
                        Weiter
                    </Button>
                </div>

                <div className="d-flex flex-column gap-4">
                    <Form.Text style={{ color: "saddlebrown" }}>
                        Du hast bereits ein Konto?
                    </Form.Text>
                    <Button variant="outline-success">
                        Login
                    </Button>
                </div>
            </Form> 
        </Tab.Pane>
        <Tab.Pane eventKey="second" style={{ height: "100%" }}>
        Second tab content
      </Tab.Pane>
    </Tab.Content>
  </Tab.Container>
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
        </>

    )
}