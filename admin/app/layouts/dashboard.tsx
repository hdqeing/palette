import { Outlet } from "react-router";
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import PalletIcon from '@mui/icons-material/Pallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { FormGroup, Modal, Form, Button, Col, Row, Nav, FloatingLabel, Alert, Tabs, Tab, Image } from "react-bootstrap";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context";
import type { Route } from "../+types/root";


export default function DashboardLayout() {

    const apiUrl=import.meta.env.VITE_API_URL;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlertPasswordIncorrect, setShowAlertPasswordIncorrect] = useState(false);
    const [activeKey, setActiveKey] = useState('form');
    const [authenticated, setAuthenticated] = useState(false);


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
                    email: email,
                    password: password
                })
            })

            if (response.status === 200){
                setActiveKey('login-success');
                setAuthenticated(true);
            } else {
                setShowAlertPasswordIncorrect(true);
            }
        } catch (error) {
            console.log(error);
        }

    };

    const handleLogout = async () => {
        try {
        const response = await fetch(`${apiUrl}/v1/auth/logout`, {
            method: "POST",
            headers: {
            "Accept": "*/*",
            "Content-Type": "application/json"
            },
            credentials: "include",
        })

        if (response.status === 200){
            setAuthenticated(false);
        } else {
            console.log(response.json)
        }

        } catch (error) {
        console.log(error)
        }
        
    };

    const getUser = async () => {
        const response = await fetch(`${apiUrl}/v1/auth/profile`, {
        credentials: 'include'
        });

        if (response.ok) {
        setAuthenticated(true);
        }

    }

    useEffect(()=>{
        getUser()
    }, [])



    return (
        <>
            <Row className="vh-100">
                <Col className="bg-warning bg-gradient" xxl={2}>
                    <Row className="p-4">
                        <Col>
                            <Image src="/iconPalette.svg" className="w-100"></Image>
                        </Col>

                        <Col className="d-flex align-items-center">
                            <h2 className="m-0">Palette365</h2>
                        </Col>
                    </Row>
                    <Nav className="d-flex flex-column align-items-center">
                        <Nav.Link className="w-50" href="/user">
                            <div className="d-flex">
                                <GroupIcon/>
                                <p className="ms-2">User</p>
                            </div>
                        </Nav.Link>
                        
                        <Nav.Link className="w-50" href="/company">
                            <div className="d-flex">
                                <BusinessIcon/>
                                <p className="ms-2">Company</p>
                            </div>
                        </Nav.Link>

                        <Nav.Link className="w-50" href="/pallet">
                            <div className="d-flex">
                                <PalletIcon/>
                                <p className="ms-2">Pallet</p>
                            </div>
                        </Nav.Link>

                        <Nav.Link className="w-50">
                            <div className="d-flex">
                                <InventoryIcon/>
                                <p className="ms-2">Inventory</p>
                            </div>
                        </Nav.Link>

                        <Nav.Link className="w-50">
                            <div className="d-flex">
                                <ListAltIcon/>
                                <p className="ms-2">Order</p>
                            </div>
                        </Nav.Link>

                    </Nav>
                </Col>

                <Col xxl={10}>

                    <Row className="p-4">
                        <Col>
                            <MenuIcon/>
                        </Col>
                        <Col className="d-flex justify-content-end gap-2 align-items-center">
                            {!authenticated ? (
                                <Button variant="outline-success" onClick={() => {setShowLoginModal(true)}}>Login</Button>
                            ) : (
                                <>
                                    <p className="m-0">Hello, Admin!</p>
                                    <Button variant="danger" onClick={() => handleLogout()}>Logout</Button>
                                </>
                            )}
                            
                        </Col>
                    </Row>

                    <Row className="p-4">
                        <Outlet context={authenticated}/>
                    </Row>

                </Col>
            </Row>

            <Modal centered show={showLoginModal}>

                <Modal.Body>

                    <Tab.Container defaultActiveKey='form' activeKey={activeKey}>
                        <Nav hidden>
                            <Nav.Item>
                                <Nav.Link eventKey='form'></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='login-success'></Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey='form'>
                                <Form className="d-flex flex-column gap-2 p-2">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Email"
                                    >
                                        <Form.Control type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
                                    </FloatingLabel>

                                    <FloatingLabel controlId="floatingPassword" label="Password">
                                        <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                    </FloatingLabel>

                                    <Alert variant="danger" show={showAlertPasswordIncorrect}>Sorry, your password is not correct! Please try again!</Alert>

                                    <Button variant="success" onClick={() => handleLogin()}>Login</Button>
                                    <Button variant="outline-danger" onClick={() => setShowLoginModal(false)}>Cancel</Button>

                                </Form>
                            </Tab.Pane>

                            <Tab.Pane eventKey='login-success' className="p-2">
                                <div className="d-flex gap-2">
                                    <CheckCircleOutlinedIcon color="success"/>
                                    <p>Congratulations, you have logged in successfully!</p>
                                </div>

                                <div>
                                    <Button variant="outline-success" className="w-100" onClick={() => setShowLoginModal(false)}>Continue</Button>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    
                </Modal.Body>
            
            </Modal>
        </>
    );
}