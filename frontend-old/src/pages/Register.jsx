import { Form, Row, Col, Button, FloatingLabel, Container, Navbar, Tabs, Tab, Image } from "react-bootstrap";
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


            <div style={{ backgroundColor: "rgba(255, 228, 196, 0.75)", width: "50vw"}}>
            <Tabs    style={{ width: "50vw" }}   id="controlled-tab-example" 
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            <Tab eventKey="mailAngeben" title="E-Mail angeben" >
            <Form className="p-4 rounded shadow-lg" style={{ width: "50vw"}} onSubmit={handleSubmit}>

            <p style={{ color: "saddlebrown" }}>Gib unten deine E-Mail-Adresse ein: Wir senden dir einen 6-stelligen Code zu, um sie zu verifizieren und dein Konto zu sichern.</p>


            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>

            </Form> 
            </Tab>
            <Tab eventKey="mailVerifizieren" title="E-Mail verifizieren">
            <Form className="p-4 rounded shadow-lg" style={{ backgroundColor: "rgba(255, 228, 196, 0.75)"}} onSubmit={handleSubmit}>

            <h1 style={{ color: "saddlebrown" }}>Paletten bestellen wie Sie Wünschen.</h1>

            <FloatingLabel
            controlId="inputUsername"
            label="Username"
            >
            <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            </FloatingLabel>

            <FloatingLabel
            controlId="inputPassword"
            label="Password"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>


            <FloatingLabel
            controlId="inputPassword"
            label="Repeat Password"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            <FloatingLabel
            controlId="inputPassword"
            label="Company"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            <Row>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="Street"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="Number"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            </Row>
            <Row>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="ZIP"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="City"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            </Row>
            <Form.Select aria-label="Default select example" className="mb-3">
            <option>Country</option>
            <option value="1">Germany</option>
            <option value="2">Austria</option>
            <option value="3">Switzerland</option>
            </Form.Select>





            <p className="text-end">If you already have an account, click here to <Link to={'/login'}>login</Link>.</p>

            <Button className="w-100" type="submit" variant="success">
            Register
            </Button>

            </Form> 
            </Tab>
            <Tab eventKey="datenPersonalisieren" title="Daten personalisieren">
            <Form className="p-4 rounded shadow-lg" style={{ backgroundColor: "rgba(255, 228, 196, 0.75)"}} onSubmit={handleSubmit}>

            <h1 style={{ color: "saddlebrown" }}>Paletten bestellen wie Sie Wünschen.</h1>

            <FloatingLabel
            controlId="inputUsername"
            label="Username"
            className="mb-3"
            >
            <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            </FloatingLabel>

            <FloatingLabel
            controlId="inputPassword"
            label="Password"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>


            <FloatingLabel
            controlId="inputPassword"
            label="Repeat Password"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            <FloatingLabel
            controlId="inputPassword"
            label="Company"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            <Row>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="Street"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="Number"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            </Row>
            <Row>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="ZIP"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            <Col>
            <FloatingLabel
            controlId="inputPassword"
            label="City"
            className="mb-3"
            >
            <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            </FloatingLabel>
            </Col>
            </Row>
            <Form.Select aria-label="Default select example" className="mb-3">
            <option>Country</option>
            <option value="1">Germany</option>
            <option value="2">Austria</option>
            <option value="3">Switzerland</option>
            </Form.Select>





            <p className="text-end">If you already have an account, click here to <Link to={'/login'}>login</Link>.</p>

            <Button className="w-100" type="submit" variant="success">
            Register
            </Button>

            </Form> 
            </Tab>
            </Tabs>
            </div>


            <div style={{backgroundColor: "rgba(255, 228, 196, 0.75)", width: "100vw" }} className="d-flex justify-content-center">
                <footer style={{ width: "75vw" }} className="d-flex flex-row justify-content-between">
                <Col>
                    <p>AGB</p>
                    </Col>
                    <Col>
                    <p>Impressum</p>                    
                    </Col>
                    <Col>
                    <p>Datenschutz</p>
                    </Col>
                </footer>

            </div>





        </Container>
        </>

    )
}