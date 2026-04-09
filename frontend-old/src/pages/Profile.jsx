import { Accordion, FloatingLabel, Image, Row, Col, Form, Button } from "react-bootstrap";
import ProfileIcon from "../assets/profile.svg";
import BuildingIcon from "../assets/building.svg";
import ReactCountryFlag from "react-country-flag";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

export default function Profile() {
    const {authenticated, setAuthenticated} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('');
    const [formOfAddress, setFormOfAddress] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [vat,setVat] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [postalNumber, setPostalNumber] = useState('');
    const [city, setCity] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;


    const getProfile =  () => {
    try{
      fetch(`${apiUrl}/v1/auth/profile`, {
        method: 'GET',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        credentials: "include",
      }).then((res) => {return res.json()}).then((data) => {
        setEmail(data.email);
        setPreferredLanguage(data.preferredLanguage);
        setFirstname(data.firstName);
        setLastname(data.lastName);
        setCompanyName(data.company.title)
        setStreet(data.company.street)
        setHouseNumber(data.company.houseNumber)
        setPostalNumber(data.company.postalCode)
        setCity(data.company.city)


      })


    } catch (error) {
      console.log(error);
    }

    }
    useEffect(()=>{
        getProfile();
    },[authenticated])
    return (
        <div className="w-75 d-flex flex-column gap-3 p-3">
            <Accordion  alwaysOpen>
                <Accordion.Item>
                    <Accordion.Header>
                        <Image src={ProfileIcon} style={{ height: "24px" }}></Image>
                        <h3 className="m-0">&nbsp;Persoenliche Profil</h3>
                    </Accordion.Header>

                    <Accordion.Body className="d-flex flex-column gap-2">
                        <Row>
                            <Col>
                                <FloatingLabel label="Email">
                                    <Form.Control type="email" disabled value={email}></Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel label="Telefon">
                                    <Form.Control type="tel" value={number} onChange={(e) => {setNumber(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FloatingLabel label="Bevorzugte Sprache">
                                    <Form.Select value={preferredLanguage} onChange={(e) => {setPreferredLanguage(e.target.value)}}>
                                    <option value="DE"><ReactCountryFlag countryCode="DE"></ReactCountryFlag>&nbsp;DE</option>
                                    <option value="EN"><ReactCountryFlag countryCode="GB"></ReactCountryFlag>&nbsp;EN</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel label="Anrede">
                                    <Form.Select value={formOfAddress} onChange={(e) => {setFormOfAddress(e.target.value)}}>
                                    <option value="1">Herr</option>
                                    <option value="2">Frau</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel label="Vorname">
                                    <Form.Control value={firstname} onChange={(e) => {setFirstname(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel label="Nachname">
                                    <Form.Control value={lastname} onChange={(e) => {setLastname(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="justify-content-end">
                            <Col xxl="3">
                            <Button className="w-100" variant="success">
                                Speichern
                            </Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Accordion alwaysOpen>
                <Accordion.Item>
                    <Accordion.Header>
                        <Image src={BuildingIcon} style={{ height: "24px" }}></Image>
                        <h3 className="m-0">&nbsp;Meine Unternehmen</h3>
                    </Accordion.Header>
                    <Accordion.Body className="d-flex flex-column gap-2">
                        <Row>
                            <Col>
                                <FloatingLabel label="Name">
                                    <Form.Control value={companyName} onChange={(e) => {setCompanyName(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>

                            <Col>
                                <FloatingLabel label="VAT">
                                    <Form.Control value={vat} onChange={(e) => {setVat(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>

                        </Row>

                        <Row>
                            <Col xxl="4">
                                <FloatingLabel label="Strasse">
                                    <Form.Control value={street} onChange={(e) => {setStreet(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col xxl="2">
                                <FloatingLabel label="Nr.">
                                    <Form.Control value={houseNumber} onChange={(e) => {setHouseNumber(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col xxl="3">
                                <FloatingLabel label="Postleitzahl">
                                    <Form.Control value={postalNumber} onChange={(e) => {setPostalNumber(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                            <Col xxl="3">
                                <FloatingLabel label="Stadt">
                                    <Form.Control value={city} onChange={(e) => {setCity(e.target.value)}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row className="justify-content-end">

                            <Col xxl="3">
                            <Button className="w-100" variant="success">
                                Speichern
                            </Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}