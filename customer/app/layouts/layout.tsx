import { Navbar, Button, Offcanvas, Image, Col, Dropdown, DropdownButton, Modal, Form, FloatingLabel, Container, Alert, Toast, ToastContainer, Row, Tabs, Tab, InputGroup, Badge} from "react-bootstrap";
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import React, { useEffect, useState } from "react";
import { ListGroup } from 'react-bootstrap';
import { Outlet, useNavigate, useOutletContext } from 'react-router'; // If using React Router
import { CheckCircle, Email, Group, Login, Logout, PersonAdd, RemoveCircle, VerifiedUser } from "@mui/icons-material";
import type {CartEntity, CreateEmployeeForm, Employee} from "~/types";
import { useTranslation } from "react-i18next";

type AppContextType = [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    CartEntity[],
    React.Dispatch<React.SetStateAction<CartEntity[]>>
];

export function useAppContext() {
    return useOutletContext<AppContextType>()
}

export default function Layout() {

  const apiUrl=import.meta.env.VITE_API_URL;
  const { t, i18n } = useTranslation();

  const [paletteInCart, setPaletteInCart] = useState<CartEntity[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showAlertVerificationEmailSent, setShowAlertVerificationEmailSent] = useState(false);
  const [showAlertVerificationFailed, setShowAlertVerificationFailed] = useState(false);
  const [showAlertPasswordInconsistent, setShowAlertPasswordInconsistent] = useState(false);
  const [currentTab, setCurrentTab] = useState("email");
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [alternativeLanguages, setAlternativeLanguages] = useState(['Русский', 'Deutsch']);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailRegister, setEmailRegister] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeForm>({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      preferredLanguage: "",
      telephone: "",
      salutation: "",
      companyId: null
  });



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
  const [myProfile, setMyProfile] = useState<Employee>();




    const handleLanguageChange = (language: string) => {
        setAlternativeLanguages((prev) => [
            selectedLanguage,
            ...prev.filter((l) => l !== language)
        ]);

        setSelectedLanguage(language);
        switch (language) {
          case "Deutsch":
            i18n.changeLanguage("de");
            break;
          case "Русский":
            i18n.changeLanguage("ru");
            break;
          default:
            i18n.changeLanguage("en")
            break;
        }
    };

  const handleShowCart = () => {
    setShowCart(true);
  }

  const handleHideCart = () => {
    setShowCart(false);
  }




  const handleHideNotification = () => {
    setShowNotification(false);
  }



    const handleLogout = async () => {

        try {
            const response = await fetch(`${apiUrl}/v1/auth/logout`, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

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
            const response = await fetch(`${apiUrl}/v1/auth/login`, {
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
            });

            if (response.status === 200){
                setShowLoginModal(false)
                setShowToastLoginSuccess(true)
                setAuthenticated(true)
            } else {
                setShowAlertPasswordIncorrect(true);
            };

        } catch (error) {
            console.log(error);
        }

    };

  const handleHideModalLogin = () => {
    setEmailLogin("");
    setPasswordLogin("");
    setShowLoginModal(false);
  }






  const handleEmailVerification = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/employee`, {
        method: 'POST',
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.status === 201) {
        setShowAlertVerificationEmailSent(true);
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

    const handleRegisterNextStep = async () => {
        if (currentTab === "email") {
            try {
                const response = await fetch(`${apiUrl}/v1/auth/verify`, {
                    method: 'POST',
                    headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: emailRegister,
                        verificationCode: verificationCodeRegister
                    }),
                });

                if (response.ok) {
                    setEmailValid(true);
                    setCurrentTab("password");

                } else {
                    setShowAlertVerificationFailed(true)
                }


            } catch (error) {
                console.log(error);
            }

        } else if (currentTab === "password") {
            if (passwordRegister !== passwordConfirmRegister){
                setShowAlertPasswordInconsistent(true);
            } else {
                try {
                const response = await fetch(`${apiUrl}/v1/auth/register`, {
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
                });

                if (response.ok) {
                    setCurrentTab("profile");

                } else {
                    setShowAlertPasswordInconsistent(true)
                }

                } catch (error) {
                    console.log(error)
                }
            }

        } else {

        }
    }

    const getProfile = async () => {
        try {
        const response = await fetch(`${apiUrl}/v1/auth/profile`, {
        credentials: 'include'
        });

        if (response.ok) {
        const data = await response.json();
            setAuthenticated(true);
            setMyProfile(data);
        }

        } catch (error) {
            console.log(error)

        }

    };

    const getCart = async () => {
        const response = await fetch(`${apiUrl}/v1/carts`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            setPaletteInCart(data);
        }

    };


    useEffect(()=>{
        getProfile();
        getCart();
    }, [])

const updateCart = async () => {
    const payload = {
  items: paletteInCart.map(item => ({
    palletId: item.pallet?.id,
    quantity: item.quantity
  }))
};
  try {
    const response = await fetch(`${apiUrl}/v1/carts`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("Cart updated:", data);

  } catch (error) {
    console.error("Error updating cart:", error);
  }
};

useEffect(() => {
  if (paletteInCart.length === 0) return;

  const timeout = setTimeout(() => {
    updateCart();
  }, 500);

  return () => clearTimeout(timeout);
}, [paletteInCart]);

  return (
    <div className="d-flex flex-column align-items-center">

      <Navbar style={{ height: "10vh", width: "100vw" }} className="justify-content-center bg-warning-subtle">
        <Row style={{width: "75%"}}>
          <Col className="p-0">
            <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
                <Image src="/iconPalette.svg" style={{ height: "64px", width: "auto" }}></Image>
                <h1 className="m-0 text-success">Palette365</h1>
            </Navbar.Brand> 
          </Col>

          <Col className="d-flex justify-content-end gap-3 align-items-center p-0">

            <DropdownButton title={selectedLanguage} variant="outline-success">
                {alternativeLanguages.map((alternativeLanguage: string) => (
                    <Dropdown.Item key={alternativeLanguage} onClick={() => handleLanguageChange(alternativeLanguage)}>{alternativeLanguage}</Dropdown.Item>
                ))}
            </DropdownButton>


            <Button onClick={() => setShowNotification(true)}  variant="outline-success">
                <NotificationsIcon></NotificationsIcon>
            </Button>



                {
                authenticated ? (
                  <>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-success" className="no-caret">
                      <PersonIcon></PersonIcon>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="/query">{t("requests")}</Dropdown.Item>
                        <Dropdown.Item href="/profile">{t("profile")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowModalLogoutConfirm(true)}>{t("settings")}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="outline-danger" onClick={() => setShowModalLogoutConfirm(true)}><Logout></Logout>{t("sign_out")}</Button>
                  </>

                ) : (
                  <>
                    <Button onClick={() => setShowLoginModal(true)} variant="success"><Login></Login>{t("sign_in")}</Button>
                    <Button onClick={() => setShowRegisterModal(true)} variant="outline-success"><PersonAdd></PersonAdd>{t("sign_up")}</Button>                  
                  </>
                )
                }


            <Button onClick={handleShowCart}  variant="outline-success">
                <ShoppingCartIcon></ShoppingCartIcon>
            </Button>


          </Col>
        </Row>
      </Navbar>

      <div style={{ minHeight: "80vh" }} >
          <Outlet context={[authenticated, setAuthenticated, paletteInCart, setPaletteInCart]}/>
      </div>

      <footer className="w-100 bg-warning-subtle" style={{ height: "10vh" }}>
          <ul className="nav justify-content-center border-bottom p-2">
              <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">Impressum</a>
              </li>

              <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">Datenschutz</a>
              </li>

              <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">ADSp</a>
              </li>

              <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">Cookie-Einstellung</a>
              </li>

              <li className="nav-item">
                  <a href="#" className="nav-link px-2 text-body-secondary">Sicherheit</a>
              </li>
          </ul>

          <div className="p-2">
              <p className="text-center text-body-secondary m-0">&copy; 2025 Palletly, Inc</p>
          </div>
      </footer>


      <Offcanvas show={showNotification} placement='start' onHide={handleHideNotification}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Messages</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showCart} placement='end' onHide={handleHideCart}   style={{ width: "512px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("shopping_cart")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <ListGroup>
                <ListGroup.Item>
                    <Row>
                        <Col xs="5"><p className="m-0">{t("pallet")}</p></Col>
                        <Col xs="3"><p className="m-0">{t("quality")}</p></Col>
                        <Col xs="2"><p className="m-0">{t("quantity")}</p></Col>
                        <Col xs="2"><p className="m-0">{t("remove")}</p></Col>
                    </Row>
                </ListGroup.Item>

            {paletteInCart.map((palette: CartEntity)=>(
                <ListGroup.Item>
                    <Row className="align-items-center">
                        <Col xs="5"><p className="m-0">{t(palette.pallet?.name)} </p></Col>
                        <Col xs="3"><Badge>{t(palette.pallet?.quality)}</Badge></Col>
                        <Col xs="2"><p className="m-0">{palette.quantity}</p></Col>
                        <Col xs="2"><Button variant="link"><RemoveCircle color="error"></RemoveCircle></Button></Col>
                    </Row>
                </ListGroup.Item>
            ))}
          </ListGroup>
          <Button className="d-flex justify-content-center align-items-center gap-1 p-2" variant="outline-success" href="/seller"><Group></Group><p className="m-0">{t("find_suppliers")}</p></Button>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showLoginModal} centered>
        <Modal.Header className="justify-content-center gap-1">
            <Login></Login>
            <Modal.Title>{t("sign_in")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form className="d-flex flex-column gap-3">

            <Form.Group>
              <FloatingLabel label={t("email")} controlId="floatingEmail">
                <Form.Control type="email" placeholder="email" onChange={(e) => {setEmailLogin(e.target.value)}}></Form.Control>
              </FloatingLabel>
            </Form.Group>

            <Form.Group>
              <FloatingLabel label={t("password")} controlId="floatingPassword">
                <Form.Control type="password" placeholder="password" onChange={(e) => {setPasswordLogin(e.target.value)}}></Form.Control>
              </FloatingLabel>
            </Form.Group>

            <Container className="d-flex justify-content-end">
              <p className="m-0">{t("msg_sign_up")}&nbsp;</p>
              <Button variant="link" className="p-0 border-0" onClick={() => {setShowLoginModal(false); setShowRegisterModal(true);}}>{t("sign_up")}</Button>
            </Container>

          <Alert className="m-0" variant="danger" show={showAlertPasswordIncorrect}>
            Sorry, Ihre Password ist nicht korrekt, bitte erneuert versuchen.
          </Alert>
          </Form>
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-danger" onClick={handleHideModalLogin}>{t("cancel")}</Button>
          <Button className="w-25" variant="success" onClick={handleLogin}>{t("sign_in")}</Button>
        </Modal.Footer>

      </Modal>

      <Modal show={showRegisterModal} centered size="lg">
        <Modal.Header className="justify-content-center gap-2">
            <PersonAdd color="success"></PersonAdd>
          <Modal.Title>Registrieren</Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex flex-column">
            <Tabs defaultActiveKey="email" fill activeKey={currentTab}>
                <Tab title="Email verifizieren" eventKey="email" style={{ height: "30vh" }}>
                    <Form className="d-flex flex-column justify-content-evenly h-100">
                        <InputGroup>
                            <FloatingLabel label="Email">
                                <Form.Control type="email" onChange={(e) => {setEmailRegister(e.target.value);setNewEmployee((prev: CreateEmployeeForm) =>({...prev, email: e.target.value}))}}></Form.Control>
                            </FloatingLabel>

                            <Button variant="outline-success" className="d-flex align-items-center gap-2" onClick={handleEmailVerification}>
                                <Email></Email>
                                <p className="m-0">Send Verification Code</p>
                            </Button>
                        </InputGroup>

                        <Alert variant="success m-0" show={showAlertVerificationEmailSent}><CheckIcon color="success" className="me-2"></CheckIcon>An Email with verification code has been sent to you. Please enter received code in following field.</Alert>

                        <FloatingLabel label="Verification Code">
                            <Form.Control disabled={!showAlertVerificationEmailSent}  onChange={(e) => setVerificationCodeRegister(e.target.value)}></Form.Control>
                        </FloatingLabel>

                        <Alert variant="danger m-0" show={showAlertVerificationFailed}><WarningIcon color="error" className="me-2"></WarningIcon>Sorry, your verification code is not correct. Please try again!</Alert>
                    </Form>                
                </Tab>

                <Tab title="Passwort eingeben" eventKey="password" style={{ height: "30vh" }} disabled={!emailValid}>
                    <Form className="d-flex flex-column justify-content-around h-100">
                        <FloatingLabel label="Password">
                            <Form.Control type="password" disabled={!emailValid} value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)}></Form.Control>
                        </FloatingLabel>

                        <FloatingLabel label="Password wiederholen">
                            <Form.Control type="password" disabled={!emailValid} value={passwordConfirmRegister} onChange={(e) => setPasswordConfirmRegister(e.target.value)}></Form.Control>
                        </FloatingLabel>

                        <Alert variant="danger m-0" show={showAlertPasswordInconsistent}><WarningIcon color="error" className="me-2"></WarningIcon>Sorry, your passwords are not identical. Please try again!</Alert>

                    </Form>                
                </Tab>

                <Tab title="Profil ergänzen" eventKey="profile" style={{ height: "30vh" }}>
                    <Form className="d-flex flex-column gap-3">
                        <Form.Text>You can update your profiles now. Otherwise, you can always update it later.</Form.Text>
                        <Row>
                            <Col>
                                <FloatingLabel label="Salutation">
                                    <Form.Select onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, salutation: e.target.value}))}}>
                                        <option value="mr">Mr.</option>
                                        <option value="ms">Ms.</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>

                            <Col>
                                <FloatingLabel label="Firstname">
                                    <Form.Control onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, firstName: e.target.value}))}}></Form.Control>
                                </FloatingLabel>
                            </Col>

                            <Col>
                                <FloatingLabel label="Lastname">
                                    <Form.Control onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, lastName: e.target.value}))}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FloatingLabel label="Language">
                                    <Form.Select onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, preferredLanguage: e.target.value}))}}>
                                        <option value="GB">English</option>
                                        <option value="DE">Deutsch</option>
                                        <option value="RU">Русский</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>

                            <Col>
                                <FloatingLabel label="Username">
                                    <Form.Control onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, username: e.target.value}))}}></Form.Control>
                                </FloatingLabel>
                            </Col>

                            <Col>
                                <FloatingLabel label="Telephone">
                                    <Form.Control onChange={(e) => {setNewEmployee((prev: CreateEmployeeForm) => ({...prev, telephone: e.target.value}))}}></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>

                    </Form>
                </Tab>
            </Tabs>
        </Modal.Body>


        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-danger">Abbrechen</Button>
          <Button className="w-25" variant="success" onClick={handleRegisterNextStep}>Weiter</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalRegisterSuccess} centered size="sm">
        <Modal.Header className="justify-content-center">
          <CheckCircle></CheckCircle>
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
            <WarningIcon color="error" className="me-1"></WarningIcon>
          <h5 className="m-0 text-danger">{t("sign_out")}</h5>
        </Modal.Header>

        <Modal.Body className="d-flex justify-content-center p-5">{t("msg_sign_out")}</Modal.Body>

        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-success" onClick={() => {setShowModalLogoutConfirm(false)}}>{t("cancel")}</Button>
          <Button className="w-25" variant="danger" onClick={() => handleLogout()}>{t("sign_out")}</Button>
        </Modal.Footer>

      </Modal>

      <ToastContainer position="middle-center">
        <Toast delay={3000} autohide bg="success" show={showToastLoginSuccess} onClose={() => setShowToastLoginSuccess(false)}>
          <Toast.Header closeButton={false} className="justify-content-center p-2">
            <VerifiedUser></VerifiedUser>
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
            <CheckIcon></CheckIcon>
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