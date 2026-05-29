import { Navbar, Button, Offcanvas, Image, Col, Dropdown, DropdownButton, Modal, Form, FloatingLabel, Container, Alert, Toast, ToastContainer, Row, Tabs, Tab, InputGroup, Badge, Stack} from "react-bootstrap";
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import React, { useEffect, useState } from "react";
import { ListGroup } from 'react-bootstrap';
import { Outlet, useNavigate, useOutletContext } from 'react-router'; // If using React Router
import { CheckCircle, Email, Group, Login, Logout, LockReset, PersonAdd, RemoveCircle, VerifiedUser } from "@mui/icons-material";
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
  const [registeredEmployeeId, setRegisteredEmployeeId] = useState<number | null>(null);
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

  // "register" | "reset" — controls which flow the shared modal runs
  const [authMode, setAuthMode] = useState<"register" | "reset">("register");
  const [showAlertResetSuccess, setShowAlertResetSuccess] = useState(false);

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

  // ── helpers ──────────────────────────────────────────────────────────────

  /** Reset all register/reset modal state to a clean slate */
  const resetModalState = () => {
      setCurrentTab("email");
      setEmailRegister("");
      setVerificationCodeRegister("");
      setPasswordRegister("");
      setPasswordConfirmRegister("");
      setEmailValid(false);
      setShowAlertVerificationEmailSent(false);
      setShowAlertVerificationFailed(false);
      setShowAlertPasswordInconsistent(false);
      setShowAlertResetSuccess(false);
      setRegisteredEmployeeId(null);
      setNewEmployee({
          email: "", username: "", firstName: "", lastName: "",
          preferredLanguage: "", telephone: "", salutation: "", companyId: null
      });
  };

  const openRegisterModal = () => {
      resetModalState();
      setAuthMode("register");
      setShowLoginModal(false);
      setShowRegisterModal(true);
  };

  const openResetModal = () => {
      resetModalState();
      setAuthMode("reset");
      setShowLoginModal(false);
      setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
      setShowRegisterModal(false);
      resetModalState();
  };

  // ── handlers ─────────────────────────────────────────────────────────────

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

  const handleShowCart = () => setShowCart(true);
  const handleHideCart = () => setShowCart(false);
  const handleHideNotification = () => setShowNotification(false);

  const handleLogout = async () => {
      try {
          const response = await fetch(`${apiUrl}/v1/auth/logout`, {
              method: "POST",
              headers: { "Accept": "*/*", "Content-Type": "application/json" },
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
              headers: { "Accept": "*/*", "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email: emailLogin, password: passwordLogin })
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
  };

  const handleEmailVerification = async () => {
      try {
          const response = await fetch(`${apiUrl}/v1/employee`, {
              method: 'POST',
              headers: { "Accept": "*/*", "Content-Type": "application/json" },
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
  };

  /**
   * Sends a verification code to the email for password reset.
   * Uses a dedicated endpoint so it works even for existing accounts
   * without creating a new employee record.
   */
  const handleResetEmailVerification = async () => {
      try {
          const response = await fetch(`${apiUrl}/v1/auth/send-reset-code`, {
              method: 'POST',
              headers: { "Accept": "*/*", "Content-Type": "application/json" },
              body: JSON.stringify({ email: emailRegister }),
          });

          if (response.ok) {
              setShowAlertVerificationEmailSent(true);
          } else {
              setShowAlertVerificationFailed(true);
          }
      } catch (error) {
          console.log(error);
      }
  };

  const handleRegisterNextStep = async () => {
      // ── EMAIL TAB ────────────────────────────────────────────────────────
      if (currentTab === "email") {
          try {
              const response = await fetch(`${apiUrl}/v1/auth/verify`, {
                  method: 'POST',
                  headers: { "Accept": "*/*", "Content-Type": "application/json" },
                  body: JSON.stringify({
                      email: emailRegister,
                      verificationCode: verificationCodeRegister
                  }),
              });

              if (response.ok) {
                  setEmailValid(true);
                  setShowAlertVerificationFailed(false);
                  setCurrentTab("password");
              } else {
                  setShowAlertVerificationFailed(true);
              }
          } catch (error) {
              console.log(error);
          }

      // ── PASSWORD TAB ─────────────────────────────────────────────────────
      } else if (currentTab === "password") {
          if (passwordRegister !== passwordConfirmRegister) {
              setShowAlertPasswordInconsistent(true);
              return;
          }

          // ── RESET MODE ─────────────────────────────────────────────────
          if (authMode === "reset") {
              try {
                  const response = await fetch(`${apiUrl}/v1/auth/reset-password`, {
                      method: 'PATCH',
                      headers: { "Accept": "*/*", "Content-Type": "application/json" },
                      body: JSON.stringify({
                          email: emailRegister,
                          verificationCode: verificationCodeRegister,
                          newPassword: passwordRegister
                      }),
                  });

                  if (response.ok) {
                      closeRegisterModal();
                      setShowLoginModal(true); // send them straight to login
                  } else {
                      setShowAlertPasswordInconsistent(true);
                  }
              } catch (error) {
                  console.log(error);
              }
              return;
          }

          // ── REGISTER MODE ──────────────────────────────────────────────
          try {
              const response = await fetch(`${apiUrl}/v1/auth/register`, {
                  method: 'POST',
                  headers: { "Accept": "*/*", "Content-Type": "application/json" },
                  body: JSON.stringify({
                      email: emailRegister,
                      verificationCode: verificationCodeRegister,
                      password: passwordRegister
                  }),
              });

              if (response.ok) {
                  const employee = await response.json();
                  setRegisteredEmployeeId(employee.id);
                  setShowAlertPasswordInconsistent(false);
                  setCurrentTab("profile");
              } else {
                  setShowAlertPasswordInconsistent(true);
              }
          } catch (error) {
              console.log(error);
          }

      // ── PROFILE TAB (register only) ──────────────────────────────────────
      } else if (currentTab === "profile") {
          if (!registeredEmployeeId) return;

          try {
              const response = await fetch(`${apiUrl}/v1/employee/${registeredEmployeeId}`, {
                  method: 'PUT',
                  headers: { "Accept": "*/*", "Content-Type": "application/json" },
                  credentials: 'include',
                  body: JSON.stringify({
                      email: newEmployee.email,
                      username: newEmployee.username,
                      firstName: newEmployee.firstName,
                      lastName: newEmployee.lastName,
                      preferredLanguage: newEmployee.preferredLanguage,
                      telephone: newEmployee.telephone,
                      salutation: newEmployee.salutation,
                      companyId: null
                  }),
              });

              if (response.ok) {
                  closeRegisterModal();
              } else {
                  console.error("Failed to update profile:", await response.text());
              }
          } catch (error) {
              console.log(error);
          }
      }
  };

  const getProfile = async () => {
      try {
          const response = await fetch(`${apiUrl}/v1/auth/profile`, { credentials: 'include' });
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
        const response = await fetch(`${apiUrl}/v1/carts`, { credentials: 'include' });

        if (response.ok) {
            const data = await response.json();
            setPaletteInCart(data);
        }
    };

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
              headers: { "Content-Type": "application/json" },
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
      getProfile();
      getCart();
  }, []);

  useEffect(() => {
      if (paletteInCart.length === 0) return;
      const timeout = setTimeout(() => { updateCart(); }, 500);
      return () => clearTimeout(timeout);
  }, [paletteInCart]);

  // ── derived helpers for the modal ─────────────────────────────────────────
  const isReset = authMode === "reset";
  const modalTitle   = isReset ? t("reset_password") : t("sign_up");
  const nextBtnLabel = (currentTab === "password" && isReset) ? t("reset_password") : t("next");

  return (
    <div className="d-flex flex-column align-items-center">

      <Navbar style={{ height: "10vh", width: "100vw" }} className="justify-content-center bg-warning-subtle">
        <Row style={{width: "75%"}}>
          <Col className="p-0">
            <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
                <Image src="/iconPalette.svg" style={{ height: "64px", width: "auto" }}></Image>
                <h1 className="m-0 text-success">Palletly</h1>
            </Navbar.Brand> 
          </Col>

          <Col className="d-flex justify-content-end gap-3 align-items-center p-0">
            <DropdownButton title={selectedLanguage} variant="outline-success">
                {alternativeLanguages.map((alternativeLanguage: string) => (
                    <Dropdown.Item key={alternativeLanguage} onClick={() => handleLanguageChange(alternativeLanguage)}>{alternativeLanguage}</Dropdown.Item>
                ))}
            </DropdownButton>

            <Button onClick={() => setShowNotification(true)} variant="outline-success">
                <NotificationsIcon></NotificationsIcon>
            </Button>

            {authenticated ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-success" className="no-caret">
                    <PersonIcon></PersonIcon>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/order">{t("orders")}</Dropdown.Item>
                    <Dropdown.Item href="/query">{t("requests")}</Dropdown.Item>
                    <Dropdown.Item href="/profile">{t("profile")}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="outline-danger" onClick={() => setShowModalLogoutConfirm(true)}>{t("sign_out")}</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setShowLoginModal(true)} variant="success">{t("sign_in")}</Button>
                <Button onClick={openRegisterModal} variant="outline-success">{t("sign_up")}</Button>                  
              </>
            )}

            <Button onClick={handleShowCart} variant="outline-success">
                <ShoppingCartIcon></ShoppingCartIcon>
            </Button>
          </Col>
        </Row>
      </Navbar>

      <div style={{ minHeight: "80vh" }}>
          <Outlet context={[authenticated, setAuthenticated, paletteInCart, setPaletteInCart]}/>
      </div>

      <footer className="w-100 bg-warning-subtle" style={{ height: "10vh" }}>
          <ul className="nav justify-content-center border-bottom p-2">
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Impressum</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Datenschutz</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">ADSp</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Cookie-Einstellung</a></li>
              <li className="nav-item"><a href="#" className="nav-link px-2 text-body-secondary">Sicherheit</a></li>
          </ul>
          <div className="p-2">
              <p className="text-center text-body-secondary m-0">&copy; 2025 Palletly, Inc</p>
          </div>
      </footer>

      {/* ── Notification Offcanvas ───────────────────────────────────────── */}
      <Offcanvas show={showNotification} placement='start' onHide={handleHideNotification}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Messages</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>

      {/* ── Cart Offcanvas ───────────────────────────────────────────────── */}
      <Offcanvas show={showCart} placement='end' onHide={handleHideCart} style={{ width: "512px" }}>
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
              {paletteInCart.map((palette: CartEntity) => (
                  <ListGroup.Item>
                      <Row className="align-items-center">
                          <Col xs="5"><p className="m-0">{t(palette.pallet?.name)}</p></Col>
                          <Col xs="3"><Badge>{t(palette.pallet?.quality)}</Badge></Col>
                          <Col xs="2"><p className="m-0">{palette.quantity}</p></Col>
                            <Col xs="2">
                                <Button
                                    variant="link"
                                    onClick={async () => {
                                        await fetch(`${apiUrl}/v1/carts/${palette.pallet?.id}`, {
                                            method: 'DELETE',
                                            credentials: 'include',
                                        });
                                        setPaletteInCart(prev => prev.filter(p => p.pallet?.id !== palette.pallet?.id));
                                    }}
                                >
                                    <RemoveCircle color="error" />
                                </Button>
                            </Col>
                      </Row>
                  </ListGroup.Item>
              ))}
          </ListGroup>
          <Button className="d-flex justify-content-center align-items-center gap-1 p-2" variant="outline-success" href="/seller">
              <Group></Group><p className="m-0">{t("find_suppliers")}</p>
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* ── Login Modal ──────────────────────────────────────────────────── */}
      <Modal show={showLoginModal} centered>
        <Modal.Header className="justify-content-center gap-1">
            <Login></Login>
            <Modal.Title>{t("sign_in")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form className="d-flex flex-column gap-3">
                <Form.Group>
                    <FloatingLabel label={t("email")} controlId="floatingEmail">
                        <Form.Control type="email" placeholder="email" onChange={(e) => setEmailLogin(e.target.value)}></Form.Control>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group>
                    <FloatingLabel label={t("password")} controlId="floatingPassword">
                        <Form.Control type="password" placeholder="password" onChange={(e) => setPasswordLogin(e.target.value)}></Form.Control>
                    </FloatingLabel>
                </Form.Group>

                <Button variant="link" className="p-0 text-end" onClick={openRegisterModal}>{t("msg_sign_up")}</Button>

                <Alert className="m-0" variant="danger" show={showAlertPasswordIncorrect}>
                    Sorry, Ihre Password ist nicht korrekt, bitte erneuert versuchen.
                </Alert>

                {/* "Forgot password" now opens the modal in reset mode */}
                <Button variant="link" className="p-0 text-end" onClick={openResetModal}>{t("msg_forget_password")}</Button>
            </Form>
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
            <Stack direction="horizontal" className="w-100" gap={2}>
                <Col>
                    <Button className="w-100" variant="outline-danger" onClick={handleHideModalLogin}>{t("cancel")}</Button>
                </Col>

                <Col>
                    <Button className="w-100" variant="success" onClick={handleLogin}>{t("sign_in")}</Button>
                </Col>
            </Stack>
        </Modal.Footer>
      </Modal>

      {/* ── Register / Reset Password Modal (shared) ─────────────────────── */}
      <Modal show={showRegisterModal} centered>
        <Modal.Header className="justify-content-center gap-2">
            {isReset
                ? <LockReset color="warning" />
                : <PersonAdd color="success" />
            }
            <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Tab.Container activeKey={currentTab}>
                <Tab.Content>

                    {/* ── Email / Verify tab ────────────────────────────── */}
                    <Tab.Pane eventKey="email">
                        <Form className="d-flex flex-column gap-2">
                            <InputGroup>
                                <FloatingLabel label={t("email")}>
                                    <Form.Control
                                        type="email"
                                        placeholder="email"
                                        onChange={(e) => {
                                            setEmailRegister(e.target.value);
                                            if (!isReset) {
                                                setNewEmployee((prev: CreateEmployeeForm) => ({ ...prev, email: e.target.value }));
                                            }
                                        }}
                                    />
                                </FloatingLabel>

                                <Button
                                    variant="outline-success"
                                    className="d-flex align-items-center gap-2"
                                    onClick={isReset ? handleResetEmailVerification : handleEmailVerification}
                                >
                                    <Email></Email>
                                    <p className="m-0">{t("send_verification_code")}</p>
                                </Button>
                            </InputGroup>

                            <Alert variant="success m-0" show={showAlertVerificationEmailSent}>
                                <CheckIcon color="success" className="me-2"></CheckIcon>{t("msg_code_sent")}
                            </Alert>

                            <FloatingLabel label={t("verification_code")}>
                                <Form.Control
                                    disabled={!showAlertVerificationEmailSent}
                                    placeholder="******"
                                    onChange={(e) => setVerificationCodeRegister(e.target.value)}
                                />
                            </FloatingLabel>

                            <Alert variant="danger m-0" show={showAlertVerificationFailed}>
                                <WarningIcon color="error" className="me-2"></WarningIcon>{t("msg_code_incorrect")}
                            </Alert>

                            {!isReset && (
                                <Button
                                    variant="link"
                                    className="text-end p-0"
                                    onClick={() => { closeRegisterModal(); setShowLoginModal(true); }}
                                >
                                    {t("msg_has_account")}
                                </Button>
                            )}
                        </Form>
                    </Tab.Pane>

                    {/* ── Password tab ──────────────────────────────────── */}
                    <Tab.Pane eventKey="password">
                        <Form className="d-flex flex-column gap-2">
                            <FloatingLabel label={isReset ? t("new_password") : t("password")}>
                                <Form.Control
                                    type="password"
                                    disabled={!emailValid}
                                    value={passwordRegister}
                                    onChange={(e) => setPasswordRegister(e.target.value)}
                                />
                            </FloatingLabel>

                            <FloatingLabel label={t("confirm_password")}>
                                <Form.Control
                                    type="password"
                                    disabled={!emailValid}
                                    value={passwordConfirmRegister}
                                    onChange={(e) => setPasswordConfirmRegister(e.target.value)}
                                />
                            </FloatingLabel>

                            <Alert variant="danger m-0" show={showAlertPasswordInconsistent}>
                                <WarningIcon color="error" className="me-2"></WarningIcon>{t("msg_password_not_identical")}
                            </Alert>
                        </Form>
                    </Tab.Pane>

                    {/* ── Profile tab (register only) ───────────────────── */}
                    {!isReset && (
                        <Tab.Pane eventKey="profile">
                            <Form className="d-flex flex-column gap-3">
                                <Form.Text>{t("msg_update_profile")}</Form.Text>
                                <FloatingLabel label={t("salutation")}>
                                    <Form.Select onChange={(e) => setNewEmployee((prev: CreateEmployeeForm) => ({ ...prev, salutation: e.target.value }))}>
                                        <option value="mr">{t("mr")}</option>
                                        <option value="ms">{t("ms")}</option>
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel label={t("firstname")}>
                                    <Form.Control onChange={(e) => setNewEmployee((prev: CreateEmployeeForm) => ({ ...prev, firstName: e.target.value }))} />
                                </FloatingLabel>
                                <FloatingLabel label={t("lastname")}>
                                    <Form.Control onChange={(e) => setNewEmployee((prev: CreateEmployeeForm) => ({ ...prev, lastName: e.target.value }))} />
                                </FloatingLabel>
                                <FloatingLabel label={t("language")}>
                                    <Form.Select onChange={(e) => setNewEmployee((prev: CreateEmployeeForm) => ({ ...prev, preferredLanguage: e.target.value }))}>
                                        <option value="GB">{t("english")}</option>
                                        <option value="DE">{t("german")}</option>
                                        <option value="RU">{t("russian")}</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Form>
                        </Tab.Pane>
                    )}

                </Tab.Content>
            </Tab.Container>
        </Modal.Body>

        <Modal.Footer className="justify-content-between">
            <Stack direction="horizontal" className="w-100" gap={2}>
                <Col>
                    <Button className="w-100" variant="outline-danger" onClick={closeRegisterModal}>{t("cancel")}</Button>
                </Col>

                <Col>
                    <Button className="w-100" variant={isReset ? "warning" : "success"} onClick={handleRegisterNextStep}>
                        {nextBtnLabel}
                    </Button>                
                </Col>
            </Stack>
        </Modal.Footer>
      </Modal>

      {/* ── Register success modal ───────────────────────────────────────── */}
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

      {/* ── Logout confirm modal ─────────────────────────────────────────── */}
      <Modal show={showModalLogoutConfirm} centered>
        <Modal.Header className="justify-content-center p-4">
            <WarningIcon color="error" className="me-1"></WarningIcon>
          <h5 className="m-0 text-danger">{t("sign_out")}</h5>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center p-5">{t("msg_sign_out")}</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button className="w-25" variant="outline-success" onClick={() => setShowModalLogoutConfirm(false)}>{t("cancel")}</Button>
          <Button className="w-25" variant="danger" onClick={() => handleLogout()}>{t("sign_out")}</Button>
        </Modal.Footer>
      </Modal>

      {/* ── Toasts ───────────────────────────────────────────────────────── */}
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
            <h6 className="p-3">Sie sind abgemeldet.</h6>
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}