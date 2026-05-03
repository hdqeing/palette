import { Outlet } from "react-router";
import { Col, Container, Nav, Row, Navbar, Button, ToastContainer,Modal, Tab, Form, FloatingLabel, Alert, Toast, Image, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from "react-bootstrap";
import { ReactCountryFlag } from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Logout } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from 'react';
import  PalletIcon  from "@mui/icons-material/Pallet";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

export default function SellerLayout({}) {

  const API_URL = import.meta.env.VITE_API_URL;

  const { t, i18n } = useTranslation();

  const [authenticated, setAuthenticated] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showTokenAlert, setShowTokenAlert] = useState(false);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [firstname, setFirstname] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('de');
  const availableLanguages = ["de", "ru", "en"]
  const [defaultLanguage, setDefaultLanguage] = useState("en")

  const [messageEmailAlert, setMessageEmailAlert] = useState('');
  const [currentKey, setCurrentKey] = useState('mailAngeben');


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

  const handleSubmitEmail = (e: { preventDefault: () => void; }) => {
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

  const handleSubmitToken = (e: { preventDefault: () => void; }) => {
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

  const handleSubmitPassword = (e: { preventDefault: () => void; }) => {
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

  const handleLogin = async () => {

    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({email: loginEmail, password: loginPassword})
      });

      if (!response.ok){
        console.error("Login failed!")
      } else {
        setAuthenticated(true);
        setShowLoginModal(false);
        // Handle successful login
        console.log('Login successful - JWT cookie set');
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = async () => {

      try {
          const response = await fetch(`${API_URL}/v1/auth/logout`, {
              method: "POST",
              headers: {
                  "Accept": "*/*",
                  "Content-Type": "application/json"
              },
              credentials: "include",
          });

          if (response.status === 200){
              setShowLogoutModal(false);
              setAuthenticated(false);
          } else {
              console.log(response.json)
          }

      } catch (error) {
          console.log(error)
      }
      
  };


  const getLanguageDisplay = (language:String) => {
    switch (language) {
      case 'en':
        return (
          <><ReactCountryFlag countryCode="GB" svg /> EN</>
        );
      case 'ru':
        return (
          <><ReactCountryFlag countryCode="RU" svg /> RU</>
        );
      default:
        return (
          <><ReactCountryFlag countryCode="DE" svg /> DE</>
        );
    }
  };

  const getUser = async () => {
    const response = await fetch(`${API_URL}/v1/auth/profile`, {
      credentials: 'include'
    });

    if (response.ok) {
      setAuthenticated(true);
      const data = await response.json();
      setFirstname(data.firstName);
    }

  }

  useEffect(()=>{
    getUser()
  }, [])


  return (
    <Container fluid className="p-0">
      <div className="min-vh-100 d-flex" >

        <Col xxl="2" className="rounded shadow p-4 d-flex flex-column justify-content-between bg-warning-subtle">
          <Row >
            <div className="shadow p-3 mb-5 bg-body-tertiary rounded d-flex justify-content-center align-items-center">
              <Image src="/iconPalette.svg" style={{ height: "64px", width: "auto" }}></Image>
              <h3 className="my-0 ms-2">Palette365</h3>
            </div>

            <Nav className="flex-column">
              <Nav.Item className="d-flex align-items-center">
                <DashboardIcon></DashboardIcon>
                <Nav.Link href="/">{t('dashboard')}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <PalletIcon></PalletIcon>
                <Nav.Link href="/product">{t('inventory')}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <RequestQuoteIcon></RequestQuoteIcon>
                <Nav.Link href="/query">{t('request_for_quote')}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <ReceiptLongIcon></ReceiptLongIcon>
                <Nav.Link href="/order">{t('order')}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="d-flex align-items-center">
                <AnalyticsIcon></AnalyticsIcon>
                <Nav.Link href="/analysis">{t('statistics')}</Nav.Link>
              </Nav.Item>   
              <Nav.Item className="d-flex align-items-center">
                <PersonIcon></PersonIcon>
                <Nav.Link href="/profile">{t('profile')}</Nav.Link>
              </Nav.Item>   
            </Nav>
          </Row>

          <Row>
            <Col>
            <span>Datenschutz</span>
            </Col>
            <Col>
            <span>Impressum</span>
            </Col>
          </Row>
        </Col>

        <Col xxl="10" className="p-0">

          <div>
            <Navbar className="p-4">
                <Nav className="ms-auto gap-3 align-items-center">

                  {
                    authenticated? (
                      <p className="m-0">Hi, <b>{firstname}</b></p>
                    ) : (
                      <></>
                    )
                  }


                  <Dropdown>
                    <DropdownToggle variant="outline-success">
                      {getLanguageDisplay(defaultLanguage)}
                    </DropdownToggle>
                    <DropdownMenu>
                    {
                      availableLanguages.filter(language => language !== defaultLanguage).map(availableLanguage => (
                        <DropdownItem
                          onClick={
                            () => {
                              i18n.changeLanguage(availableLanguage);
                              setDefaultLanguage(availableLanguage);
                            }
                          }
                        >
                          <ReactCountryFlag countryCode={availableLanguage === "en"? "GB" : availableLanguage} svg /> {availableLanguage.toLocaleUpperCase() === "GB" ? "EN" : availableLanguage.toLocaleUpperCase()}
                        </DropdownItem>
                      ))
                    }
                    </DropdownMenu>
                  </Dropdown>

                  <Button variant="outline-success">
                    <NotificationsIcon color="success"/>
                  </Button>

                  <Button variant="outline-success" href="/setting">
                    <SettingsIcon />
                  </Button>

                  {
                    authenticated? (
                      <>
                        <Button variant="danger" onClick={() => setShowLogoutModal(true)}><Logout></Logout>{t("sign_out")}</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline-success" onClick={() => setShowSignupModal(true)}>{t("sign_up")}</Button>
                        <Button variant="success" onClick={() => setShowLoginModal(true)}>{t("sign_in")}</Button>
                      </>
                    )
                  }

                </Nav>
            </Navbar>
          </div>

          <div>
            <Outlet context={authenticated}/>
          </div>
          
        </Col>

      </div>

      <Modal
        centered
        show={showSignupModal}
        onHide={handleHideSignup}
      >

        <Tab.Container activeKey={currentKey} onSelect={(k) => setCurrentKey(String(k))}>
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

        <Form style={{ height: "100%" }} className="p-4 gap-4 d-flex flex-column justify-content-around" >
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

                    <Button variant="success" onClick={handleLogin}>
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

      <Modal show={showLogoutModal} centered>
        <Modal.Header className="justify-content-center"><Modal.Title>{t("msg_sign_out")}</Modal.Title></Modal.Header>
        
        <Modal.Footer className="w-100">
          <Col><Button variant="outline-success" className="w-100" onClick={() => setShowLogoutModal(false)}>{t("cancel")}</Button></Col>
          <Col><Button variant="danger" className="w-100" onClick={handleLogout}>{t("sign_out")}</Button></Col>
        </Modal.Footer>
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