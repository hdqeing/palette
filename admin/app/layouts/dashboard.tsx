import { Outlet } from "react-router";
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import PalletIcon from '@mui/icons-material/Pallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { FormGroup, Modal, Form, Button, Col, Row, Nav, FloatingLabel, Alert, Tabs, Tab, Image, Stack } from "react-bootstrap";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "~/context";
import type { Route } from "../+types/root";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "~/authConfig";
import { RequestQuote } from "@mui/icons-material";


export default function DashboardLayout() {
    const { instance } = useMsal();

    const apiUrl=import.meta.env.VITE_API_URL;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlertPasswordIncorrect, setShowAlertPasswordIncorrect] = useState(false);
    const [activeKey, setActiveKey] = useState('form');
    const [authenticated, setAuthenticated] = useState(false);


    const handleLogin = async () => {
        instance.loginRedirect(loginRequest).catch(console.error);
    };

    const handleLogout = async () => {
        instance.logoutRedirect().catch(console.error);
        
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
                <Col className="bg-warning p-4 d-flex flex-column align-items-center" xxl={2}>
                    <Row className="shadow bg-body-tertiary rounded w-75 px-2 py-4 mb-4">
                        <Col xs='4'>
                            <Image src="/iconPalette.svg" className="w-100"></Image>
                        </Col>

                        <Col className="d-flex align-items-center" xs='8'>
                            <h2 className="m-0">Palletly</h2>
                        </Col>
                    </Row>
                    <Nav className="d-flex flex-column">
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

                        <Nav.Link className="w-50" href="/inventory">
                            <div className="d-flex">
                                <InventoryIcon/>
                                <p className="ms-2">Inventory</p>
                            </div>
                        </Nav.Link>

                        <Nav.Link className="w-50" href="/request">
                            <div className="d-flex">
                                <RequestQuote/>
                                <p className="ms-2">Request</p>
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
                        <AuthenticatedTemplate>
                            <Stack direction="horizontal" className="justify-content-end" gap={4}>
                                <h3>Hello, Admin!</h3>
                                <Button variant="danger" onClick={() => handleLogout()}>Logout</Button>
                            </Stack>
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                            <Button variant="outline-success" onClick={() => handleLogin()}>Login</Button>
                        </UnauthenticatedTemplate>
                    </Row>

                    <Row className="p-4">
                        <Outlet context={authenticated}/>
                    </Row>

                </Col>
            </Row>

        </>
    );
}