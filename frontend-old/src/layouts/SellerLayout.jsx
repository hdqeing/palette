import Footer from "../components/Footer";
import "./Layout.css"; // Import CSS
import { Outlet } from "react-router-dom";
import { Col, Container, Nav, Row, Navbar, NavLink, Image, Button, Dropdown, NavDropdown, ToastContainer,Modal, Tabs, Tab, Form, FloatingLabel, CloseButton, Alert, Toast } from "react-bootstrap";
import DashboardIcon from "../assets/dashboard.svg" 
import NotificationIcon from "../assets/notifications.svg" 
import NegotiateIcon from '../assets/negotiate.svg'
import OrderIcon from '../assets/order.svg'
import StatsIcon from '../assets/statistics.svg'
import MailIcon from '../assets/mail.svg'
import ProfileIcon from '../assets/profile.svg'
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { AccountBoxOutlined, AccountCircleOutlined, AnalyticsOutlined, DashboardOutlined, DescriptionOutlined, MailOutline, Notifications, NotificationsOutlined, RequestQuoteOutlined } from "@mui/icons-material";
import { useState } from "react";

export default function SellerLayout({ children }) {
  const { t, i18n } = useTranslation();

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showTokenAlert, setShowTokenAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);

  const [messageEmailAlert, setMessageEmailAlert] = useState('');
  const [currentKey, setCurrentKey] = useState('mailAngeben');

  const API_URL = import.meta.env.VITE_API_URL;

  // Separate state for signup and login forms
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showPasswordFailedAlert, setShowPasswordFailedAlert] = useState(false);
  const [showLoginSuccessToast, setShowLoginSuccessToast] = useState(false);
  const [showTokenVerificationToast, setshowTokenVerificationToast] = useState(false);

  const handleShowSignup = () => setShowSignupModal(true);
  const handleShowLogin = () => setShowLoginModal(true);
  const handleHideSignup = () => setShowSignupModal(false);
  const handleHideLogin = () => setShowLoginModal(false);

  const handleSubmitEmail = e => {
    e.preventDefault();

    fetch(`${API_URL}/auth/seller/email/verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: `${email}`})
    })
      .then(response => {
        if (!response.ok) {
          setMessageEmailAlert("E-Mail not effective!");
          setShowEmailAlert(true);
        }
        return response.json();
      })
      .then(data => {
        setCurrentKey("mailVerifizieren");
      })
      .catch(error => {
        console.log(error.message);
      })
  };

  const handleSubmitToken = e => {
    e.preventDefault();

    fetch(`${API_URL}/auth/seller/token/verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: `${email}`, token: `${token}`})
    })
      .then(response =>{
        if (response.status === 200){
          setshowTokenVerificationToast(true);
          setCurrentKey("datenPersonalisieren");
        } else {
          setShowTokenAlert(true);
        }
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  const handleSubmitPassword = e => {
    e.preventDefault();
    
    if (password != confirmPassword) {
      setShowPasswordAlert(true);
      return null;
    } else {
      fetch(`${API_URL}/auth/seller/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: `${email}`, password: `${password}`})
    })
      .then(response =>{
        if (response.status === 200){
          setShowSignupModal(false);
          setShowLoginSuccessToast(true);
        } else {
          setShowPasswordFailedAlert(true)
        }
      })
      .catch(error => {
        console.log(error.message);
      })
    }
  }

  // Login form handler
  const handleLogin = e => {
    e.preventDefault();
    
    fetch(`${API_URL}/auth/seller/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: loginEmail, password: loginPassword})
    })
      .then(response => {
        if (response.status === 200) {
          setAuthenticated(true);
          setShowLoginModal(false);
          // Handle successful login
        } else {
          // Handle login error
        }
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  return (
    <Container fluid>
      <Row className="min-vh-100" style={{ "padding-right": "24px" }}>

        <Col xs={2} className="rounded shadow p-4">

          <Container className="text-center shadow-sm p-3">
            <h3>Palette365</h3>
          </Container>

          <Nav className="flex-column">
            <Nav.Item className="d-flex">
              <DashboardOutlined></DashboardOutlined>
              <Nav.Link>{t('dashboard')}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="d-flex">
              <RequestQuoteOutlined></RequestQuoteOutlined>
              <Nav.Link href="/seller/query">{t('inquiry')}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="d-flex">
              <DescriptionOutlined></DescriptionOutlined>
              <Nav.Link>{t('order')}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="d-flex">
              <AnalyticsOutlined></AnalyticsOutlined>
              <Nav.Link href="/seller/stats">{t('statistics')}</Nav.Link>
            </Nav.Item>   
            <Nav.Item className="d-flex">
              <MailOutline></MailOutline>
              <Nav.Link>{t('mail')}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="d-flex">
              <AccountBoxOutlined></AccountBoxOutlined>
              <Nav.Link href="/seller/profile">{t('profile')}</Nav.Link>
            </Nav.Item>    
          </Nav>

        </Col>

        <Col>
        <Row>
        <Navbar>
            <Nav className="ms-auto gap-3 align-items-center">
              <NavDropdown title="Language">
                <NavDropdown.Item onClick={() => i18n.changeLanguage("de")}>
                  <ReactCountryFlag countryCode="DE" svg /> Deutsch
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => i18n.changeLanguage("en")}>
                  <ReactCountryFlag countryCode="GB" svg /> English
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => i18n.changeLanguage("ru")}>
                  <ReactCountryFlag countryCode="RU" svg /> Русский
                </NavDropdown.Item>
              </NavDropdown>
              <NotificationsOutlined></NotificationsOutlined>
              <Button variant="outline-success" onClick={handleShowSignup}>Register</Button>
              <Button variant="success" onClick={handleShowLogin}>Login</Button>
            </Nav>
        </Navbar>
        </Row>
        <Row>

        <Outlet />
        </Row>
        </Col>

      </Row>

      <Modal
        centered
        show={showSignupModal}
        onHide={handleHideSignup}
      >

        <Tab.Container activeKey={currentKey} onSelect={(k) => setCurrentKey(k)}>
          <Nav variant="tabs" justify>
            <Nav.Item>
              <Nav.Link eventKey="mailAngeben">E-Mail angeben</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mailVerifizieren">E-Mail verifizieren</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="datenPersonalisieren">Password </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content style={{ flexGrow: 1, overflow: "auto" }}>
              <Tab.Pane eventKey="mailAngeben" style={{ height: "40vh" }}>
                  <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" onSubmit={handleSubmitEmail}>
                      <div className="d-flex flex-column gap-4">
                          <Form.Text style={{ color: "saddlebrown" }}>
                              Gib unten deine E-Mail-Adresse ein: Wir senden dir einen 6-stelligen Code zu, um sie zu verifizieren und dein Konto zu sichern.
                          </Form.Text>
                          <FloatingLabel
                          label="Email address"
                          controlId="floatingInput"
                          >
                              <Form.Control type="email" placeholder="name@example.com" value={email} onChange={(e)=>{setEmail(e.target.value)}}></Form.Control>
                          </FloatingLabel>
                          <Alert variant="danger" show={showEmailAlert}>
                            {messageEmailAlert}
                          </Alert>
                          <Button variant="success" type="submit">
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
              <Tab.Pane eventKey="mailVerifizieren" style={{ height: "40vh" }}>
                  <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" onSubmit={handleSubmitToken}>
                      <div className="d-flex flex-column gap-4">
                          <Form.Text style={{ color: "saddlebrown" }}>
                              Bitte prüfe jetzt deine Mailbox! Gib den 6-stelligen Verifizierungs-Code ein, der an {email} gesendet wurde. Der Code läuft nach 60 Minuten ab.
                          </Form.Text>
                          <FloatingLabel
                          label="Verification Code"
                          controlId="floatingInput"
                          >
                              <Form.Control placeholder="000000" value={token} onChange={(e) => {setToken(e.target.value)}}></Form.Control>
                          </FloatingLabel>
                          <Alert variant="danger" show={showTokenAlert}>
                            Your Token is not correct!
                          </Alert>
                          <Button variant="success" type="submit">
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
              <Tab.Pane eventKey="datenPersonalisieren" style={{ height: "40vh" }}>
                  <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" onSubmit={handleSubmitPassword}>
                      <div className="d-flex flex-column gap-4">
                          <Form.Text style={{ color: "saddlebrown" }}>
                              Geben Sie ein Passwort ein. Sie brauchen Ihre Email Addresse und Passwort um einzuloggen.                        
                          </Form.Text>
                          <FloatingLabel
                          label="Passwort"
                          controlId="floatingInput"
                          >
                              <Form.Control type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                          </FloatingLabel>

                          <FloatingLabel
                          label="Passwort wiederholen"
                          controlId="floatingInput"
                          >
                              <Form.Control type="password" placeholder="******" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                          </FloatingLabel>

                          <Alert variant="danger" show={showPasswordAlert}>
                            Sorry, password and confirm password are not same.
                          </Alert>

                          <Alert variant="danger" show={showPasswordFailedAlert}>
                            Sorry, password set are not successful.
                          </Alert>


                          <Button variant="success" type="submit">
                              Registerieren
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
          </Tab.Content>
        </Tab.Container>

      </Modal>
      
      <Modal
        centered
        show={showLoginModal}
        onHide={handleHideLogin}
      >

        <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" onSubmit={handleLogin}>
                <div className="d-flex flex-column gap-4">
                    <Form.Text style={{ color: "saddlebrown" }}>
                      Nachdem Sie eingeloggt sind, können Sie auf Preisabfragen von Kunden antworten.
                    </Form.Text>
                    <FloatingLabel
                    label="Email address"
                    controlId="floatingInput"
                    >
                        <Form.Control 
                          type="email" 
                          placeholder="name@example.com" 
                          value={loginEmail} 
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </FloatingLabel>
                    
                    <FloatingLabel
                    label="Password"
                    controlId="floatingInput"
                    >
                        <Form.Control 
                          type="password" 
                          placeholder="******" 
                          value={loginPassword} 
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </FloatingLabel>

                    <Button variant="success" type="submit">
                        Weiter
                    </Button>
                </div>

                <div className="d-flex flex-column gap-4">
                    <Form.Text style={{ color: "saddlebrown" }}>
                        Du hast noch kein Konto? Registieren zum Starten
                    </Form.Text>
                    <Button variant="outline-success" onClick={() => {handleHideLogin(); handleShowSignup();}}>
                        Sign up
                    </Button>
                </div>
        </Form> 

      </Modal>

      <ToastContainer position="bottom-center" className="p-3">
        <Toast show={showTokenVerificationToast} onClose={() => setshowTokenVerificationToast(false)} delay={4000} autohide>
          <Toast.Body>
            Congratulations, your E-Mail has been verified.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <ToastContainer position="middle-center">
        <Toast show={showLoginSuccessToast} onClose={() => setShowLoginSuccessToast(false)} delay={4000} autohide>
          You have registered successfully, click login button to login.
        </Toast>
      </ToastContainer>


    </Container>
  );
}