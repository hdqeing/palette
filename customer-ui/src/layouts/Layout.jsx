import { Navbar, Button, Offcanvas, Image, Col, Dropdown, DropdownButton, Modal, Form, FloatingLabel, Container, InputGroup, Alert, Toast, ToastContainer, Row} from "react-bootstrap";
import "./Layout.css";
import PaletteIcon from "../assets/iconPalette.svg";
import ProfileIcon from "../assets/profile.svg";
import NotificationIcon from "../assets/notifications.svg";
import CheckIcon from "../assets/check.svg";
import CartIcon from "../assets/cart.svg";
import WarningIcon from "../assets/warning.svg"
import { useEffect, useState } from "react";
import { ListGroup, Spinner } from 'react-bootstrap';
import { useCart } from "../contexts/CartContext.jsx";
import ShoppingCartItem from "../components/ShoppingCartItem"; // Make sure to import this
import { Outlet, useNavigate } from 'react-router-dom'; // If using React Router
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import Nav from 'react-bootstrap/Nav';
import { useContext } from "react";
import { AuthContext } from "../App.jsx";

export default function Layout({ children }) {
  const [showCart, setShowCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('DE');
  const [alternativeLanguage, setAlternativeLanguage] = useState('GB');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailRegister, setEmailRegister] = useState('');
    const {authenticated, setAuthenticated} = useContext(AuthContext);


  //States for Login
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [showAlertPasswordIncorrect, setShowAlertPasswordIncorrect] = useState(false);
  const [showToastLoginSuccess, setShowToastLoginSuccess] = useState(false);

  const [emailValid, setEmailValid] = useState(false)
  const [isEmailRegistered, setIsEmailRegistered] = useState(false)
  const [showAlertPasswordConfirm, setShowAlertPasswordConfirm] = useState(false);
  const [showAlertCodeIncorrect, setShowAlertCodeIncorrect] = useState(false);
  const [verificationCodeRegister, setVerificationCodeRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [passwordConfirmRegister, setPasswordConfirmRegister] = useState('');
  const [showModalRegisterSuccess, setShowModalRegisterSuccess] = useState(false);
  const [showModalLogoutConfirm, setShowModalLogoutConfirm] = useState(false);
  const [showToastLogoutConfirm, setShowToastLogoutConfirm] = useState(false);


  const { cart } = useCart(); // Use the custom hook
  const navigate = useNavigate(); // If using React Router

  const handleShowCart = () => {
    setShowCart(true);
  }

  const handleHideCart = () => {
    setShowCart(false);
  }

  const handleShowProfile = () => {
    setShowProfile(true);
  }

  const handleHideProfile = () => {
    setShowProfile(false);
  }

  const handleShowNotification = () => {
    setShowNotification(true);
  }

  const handleHideNotification = () => {
    setShowNotification(false);
  }


  const handleNextStep = () => {
    handleHideCart();
    navigate('/seller'); // Or wherever you want to navigate
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/v1/auth/logout", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        credentials: "include",
      })

      if (response.status === 200){
        setShowModalLogoutConfirm(false);
        setShowToastLogoutConfirm(true);
        setAuthenticated(false);
      } else {
        console.log(response.json)
      }

    } catch (error) {
      console.log(error)
    }
    
  };

  const handleLogin = async () => {
    
    try{
      const response = await fetch("http://localhost:8080/v1/auth/login", {
        method: 'POST',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: emailLogin,
          password: passwordLogin
        })
      })

      if (response.status === 200){
        setShowLoginModal(false)
        setShowToastLoginSuccess(true)
        setAuthenticated(true)
      } else {
        setShowAlertPasswordIncorrect(true);
      }
    } catch (error) {
      console.log(error);
    }




  };

  const handleHideModalLogin = () => {
    setEmailLogin("");
    setPasswordLogin("");
    setShowLoginModal(false);
  }

  const handleSignUp = () => {
    // Navigate to sign up page or show sign up modal
    handleHideProfile();
  };

  const handleRegisterEmailChange = (e) => {
    setEmailRegister(e.target.value);
  };

  const handleRegisterCodeChange = (e) => {
    setVerificationCodeRegister(e.target.value);
  };

  const handleRegisterPasswordChange = (e) => {
    setPasswordRegister(e.target.value);
  };

  const handleRegisterPasswordConfirmChange = (e) => {
    setPasswordConfirmRegister(e.target.value);
  };

  const handleEmailVerification = async () => {
    try {
      const response = await fetch("http://localhost:8080/v1/auth/email", {
        method: 'POST',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRegister
        }),
      });

      if (response.status === 200) {
        setIsEmailRegistered(false);
        setEmailValid(true);
      } else if (response.status === 409) {
        setEmailValid(false);
        setIsEmailRegistered(true);
      } else {
        console.log(response.json())
      }

    } catch (error) {
      console.log(error);
    } 
  }

  const handleRegister = async () => {
    if (passwordRegister !== passwordConfirmRegister){
      setShowAlertPasswordConfirm(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/v1/auth/register", {
        method: 'POST',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRegister,
          verificationCode: verificationCodeRegister,
          password: passwordRegister
        }),
      })

      if (response.status === 200) {
        setShowRegisterModal(false);
        setShowModalRegisterSuccess(true);
      } else if (response.status === 400) {
        setShowAlertCodeIncorrect(true);
      } else {
        console.log(response.json());
      }
    } catch (error) {
      console.log(error)
    }
  }

    const verifyCookie = async () => {
    
    try{
      const response = await fetch("http://localhost:8080/v1/auth/profile", {
        method: 'GET',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json"
        },
        credentials: "include",
      })

      if (response.status === 200){
        setShowLoginModal(false)
        setAuthenticated(true)
        const data = await response.json()
        console.log(data)
      } else {
        setShowAlertPasswordIncorrect(true);
      }
    } catch (error) {
      console.log(error);
    }




  };

  useEffect(() => {
    verifyCookie();
  }, []);

  return (
    <div>

      <header className="d-flex flex-column">
        <Navbar style={{backgroundColor: "bisque"}} className="justify-content-center">
          <Row style={{width: "75%"}}>
          <Col>
            <Navbar.Brand href="#home" className="d-flex align-items-center">
              <Image src={PaletteIcon} style={{height: "100px"}}></Image>
              <h1 className="mb-0 ms-2">Palletly</h1>
            </Navbar.Brand> 
          </Col>

          <Col className="d-flex justify-content-end gap-3 align-items-center">

            <Dropdown>
              <DropdownButton title={<><ReactCountryFlag countryCode={preferredLanguage}></ReactCountryFlag>&nbsp;{preferredLanguage}</>} variant="outline-success">
                <Dropdown.Item><ReactCountryFlag countryCode={alternativeLanguage}></ReactCountryFlag>&nbsp;{alternativeLanguage}</Dropdown.Item>
              </DropdownButton>
            </Dropdown>

            <Button onClick={() => setShowNotification(true)}  variant="outline-success">
              <Image src={NotificationIcon} style={{height: "16px"}} ></Image>
            </Button>


            <Dropdown>
              <Dropdown.Toggle variant="outline-success" className="no-caret">
                <Image src={ProfileIcon}></Image>
              </Dropdown.Toggle>

              {
                authenticated ? (
                  <Dropdown.Menu>
                    <Dropdown.Item href="http://localhost:3000/profile">
                      Profil
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => setShowModalLogoutConfirm(true)}>
                      Einstellungen
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => setShowModalLogoutConfirm(true)}>
                      Abmelden
                    </Dropdown.Item>

                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setShowLoginModal(true)}>
                      Anmelden
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => setShowRegisterModal(true)}>
                      Registrieren
                    </Dropdown.Item>
                  </Dropdown.Menu>
                )
              }

            </Dropdown>

            <Button onClick={handleShowCart}  variant="outline-success">
              <Image src={CartIcon} style={{height: "16px"}} ></Image>
            </Button>


          </Col>
          </Row>
        </Navbar>
        <Nav style={{backgroundColor: "burlywood"}} className="justify-content-center">
          <Row style={{width: "75%"}}>
          <Nav.Item>
            <Nav.Link>Paletten</Nav.Link>
          </Nav.Item>

          </Row>
        </Nav>
      </header>

      <main className="d-flex flex-column justify-content-between align-items-center" style={{minHeight: "85vh"}}>
        <Outlet />
      <footer className="w-100 mt-4" style={{backgroundColor: "bisque"}}>
        <ul class="nav justify-content-center border-bottom py-3 mb-3">
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Impressum</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Datenschutz</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">ADSp</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Cookie-Einstellung</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Sicherheit</a>
          </li>
        </ul>
        <p class="text-center text-body-secondary">&copy; 2025 Palletly, Inc</p>
      </footer>

      </main>

      <Offcanvas show={showNotification} placement='start' onHide={handleHideNotification}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Messages</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showCart} placement='end' onHide={handleHideCart}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {cart.length === 0 ? (
              <ListGroup.Item className="text-muted">Cart is empty</ListGroup.Item>
            ) : (
              cart.map((item, index) => (
                <ShoppingCartItem
                  key={item.pallet.id || index}
                  url={item.pallet.url}
                  name={item.pallet.sort.name}
                  quality={item.pallet.quality}
                  quantity={item.quantity}
                />
              ))
            )}
          </ListGroup>
          {cart.length > 0 && (
            <Button
              variant="success"
              className="w-100 mt-3"
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showLoginModal} centered>
        <Modal.Header className="justify-content-center">
          <Modal.Title>Anmelden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-3">

            <Form.Group>
              <FloatingLabel label="Email">
                <Form.Control type="email" value={emailLogin} onChange={(e) => {setEmailLogin(e.target.value)}}></Form.Control>
              </FloatingLabel>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label="Password">
                <Form.Control type="password" value={passwordLogin} onChange={(e) => {setPasswordLogin(e.target.value)}}></Form.Control>
              </FloatingLabel>
            </Form.Group>

            <Container className="d-flex justify-content-end">
              <p className="m-0">Neu bei Palletly? Hier&nbsp;</p>
              <Button variant="link" className="p-0 border-0" onClick={() => {setShowLoginModal(false); setShowRegisterModal(true);}}>registrieren</Button>
            </Container>

          <Alert className="m-0" variant="danger" show={showAlertPasswordIncorrect}>
            Sorry, Ihre Password ist nicht korrekt, bitte erneuert versuchen.
          </Alert>
          </Form>

        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-danger" onClick={handleHideModalLogin}>Zurück</Button>
          <Button className="w-25" variant="success" onClick={handleLogin}>Anmelden</Button>
        </Modal.Footer>

      </Modal>

      <Modal show={showRegisterModal} centered>
        <Modal.Header className="justify-content-center">
          <Modal.Title>Registrieren</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="d-flex flex-column gap-3">

            <FloatingLabel label="Email">
              <Form.Control type="email" placeholder="Enter Email" value={emailRegister} onChange={handleRegisterEmailChange}></Form.Control>
            </FloatingLabel>

            <Button variant="outline-success" onClick={handleEmailVerification}>Email verifizieren</Button>

            <Alert variant="success" show={emailValid} className="m-0">
              Das Verifizierungscode wurde zu Ihre Email Adress geschickt, bitte geben Sie hier ein.
            </Alert>
            
            <Alert variant="danger" show={isEmailRegistered} className="m-0">
              Das Email wurde schon registriert. Bitte versuchen Sie mit einem anderen. 
            </Alert>

            <Alert variant="danger" show={showAlertCodeIncorrect} className="m-0">
              Sorry, Ihre Verifizierungscode ist nicht korrekt. 
            </Alert>
            
            <FloatingLabel label="Verifizierungscode">
              <Form.Control disabled={!emailValid} value={verificationCodeRegister} onChange={handleRegisterCodeChange}></Form.Control>
            </FloatingLabel>

            <FloatingLabel label="Password">
              <Form.Control type="password" disabled={!emailValid} value={passwordRegister} onChange={handleRegisterPasswordChange}></Form.Control>
            </FloatingLabel>

            <FloatingLabel label="Password wiederholen">
              <Form.Control type="password" disabled={!emailValid} value={passwordConfirmRegister} onChange={handleRegisterPasswordConfirmChange}></Form.Control>
            </FloatingLabel>

            <Container className="d-flex justify-content-end">
              <p className="m-0">Schon bei Palletly? Hier&nbsp;</p>
              <Button variant="link" className="p-0 border-0" onClick={() => {setShowRegisterModal(false);setShowLoginModal(true);}}>anmelden</Button>
            </Container>

            <Alert variant="danger" show={showAlertPasswordConfirm} className="m-0">
              Passwort stimmt nicht ueberein, bitte nochmal pruefen.
            </Alert>

          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-danger">Zurück</Button>
          <Button className="w-25" variant="success" onClick={handleRegister}>Registrieren</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalRegisterSuccess} centered size="sm">
        <Modal.Header className="justify-content-center">
          <Image src={CheckIcon}></Image>
          <h5 className="m-0">&nbsp;Gratuliere.</h5>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <h6>Sie haben erfolgreich registriert. <br />Jetzt koennen Sie anmelden.</h6>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="outline-danger">Spaeter</Button>
          <Button variant="success">Anmelden</Button>
        </Modal.Footer>

      </Modal>

      <Modal show={showModalLogoutConfirm} centered>
        <Modal.Header className="justify-content-center p-4">
          <Image src={WarningIcon}></Image>
          <h5 className="m-0">&nbsp;Achtung</h5>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center p-5">
          <h6>Wollen Sie wirklich abmelden?</h6>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="outline-success" onClick={() => {setShowModalLogoutConfirm(false)}}>Angemeldet bleiben</Button>
          <Button variant="danger" onClick={() => handleLogout()}>Abmelden</Button>
        </Modal.Footer>

      </Modal>

      <ToastContainer position="middle-center">
        <Toast delay={3000} autohide bg="success" show={showToastLoginSuccess} onClose={() => setShowToastLoginSuccess(false)}>
          <Toast.Header closeButton={false} className="justify-content-center p-2">
            <Image src={CheckIcon}></Image>
            <h5 className="m-0">&nbsp;Gratuliere.</h5>

          </Toast.Header>
          <Toast.Body className="d-flex justify-content-center">
            <h6 className="text-light p-3">Sie sind angemeldet.</h6>
          </Toast.Body>
        </Toast>

      </ToastContainer>

      <ToastContainer position="middle-center">
        <Toast delay={3000} autohide bg="warning" show={showToastLogoutConfirm} onClose={() => setShowToastLogoutConfirm(false)}>
          <Toast.Header closeButton={false} className="justify-content-center p-2">
            <Image src={CheckIcon}></Image>
            <h5 className="m-0">&nbsp;Vielen Dank.</h5>

          </Toast.Header>
          <Toast.Body className="d-flex justify-content-center">
            <h6 className=" p-3">Sie sind abgemeldet.</h6>
          </Toast.Body>
        </Toast>

      </ToastContainer>

    </div>
  );
}