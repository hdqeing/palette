import { useOutletContext } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, InputGroup, Form, Modal, Tab, Nav, FloatingLabel, Alert, Toast, ToastContainer, Tooltip, type TooltipProps, OverlayTrigger } from "react-bootstrap";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import type { Company, CreateCompanyForm, CreateEmployeeForm, Employee, UpdateCompanyForm, UpdateEmployeeForm } from "~/types";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import VerifiedIcon from '@mui/icons-material/Verified';
import DomainAddIcon from '@mui/icons-material/DomainAdd';



export default function CompanyPage() {

    const authenticated = useOutletContext();
    const apiUrl=import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [showTransportationDetail,setShowTransportationDetail] = useState(false);
    const [showEditTransportationDetail,setShowEditTransportationDetail] = useState(false);
    const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [showAlertNewEmployeeSuccess, setShowAlertNewEmployeeSuccess] = useState(false);
    const [showAlertNewEmployeeFail, setShowAlertNewEmployeeFail] = useState(false);
    const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
    const [showToastCreateSuccess, setShowToastCreateSuccess] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [companyVerified, setCompanyVerified] = useState(false); 
    const [editCompany, setEditCompany] = useState<UpdateCompanyForm>({
        title: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
        homepage: "",
        vat: "",
        seller: false,
        shipping:false,
        germanyPickUp: false,
        germanyDeliver: false,
        euPickUp: false,
        euDeliver: false
    });

    const [newCompany, setNewCompany] = useState<CreateCompanyForm>({
        title: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
        homepage: "",
        vat: "",
        shipping: false,
        seller: false,
        euDeliver: false,
        germanyPickUp: false,
        euPickUp: false,
        germanyDeliver: false
    });

    const handleNewCompany = async () => {
        const response = await fetch(`${apiUrl}/v1/companies`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(newCompany),
            credentials: 'include'
        });

        if (response.ok) {
            setShowNewCompanyModal(false); 
            setShowToastCreateSuccess(true);
        } else {
            setShowAlertNewEmployeeFail(true);
        }

    };

    const handleDeleteCompany = async (id : number) => {
        const response = await fetch(`${apiUrl}/v1/companies/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (response.ok) {
            setShowToastDeleteSuccess(true);
        } else {
        }

    };

    const handleSaveCompany = async () => {
        if (!selectedCompany) return;

        const response = await fetch(`${apiUrl}/v1/companies/${selectedCompany.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(editCompany),
        });

        if (response.ok) {
            setShowEditCompanyModal(false);
            setSelectedCompany(null);
        } else {
            const errorText = await response.text();
            console.error("Failed to update employee:", errorText);
        }
    };

    const handleOpenEditModal = (company: Company) => {
        setSelectedCompany(company);
        setCompanyVerified(company.verified);
        setEditCompany({
            title: company.title,
            street: company.street,
            houseNumber: company.houseNumber,
            postalCode: company.postalCode,
            city: company.city,
            homepage: company.homepage,
            vat: company.vat,
            seller: company.seller,
            shipping:company.shipping,
            germanyPickUp: company.germanyPickUp,
            germanyDeliver: company.germanyDeliver,
            euPickUp: company.euPickUp,
            euDeliver: company.euDeliver
        });
        setShowEditTransportationDetail(company.shipping);
        setShowEditCompanyModal(true);
    };

    const getUser = async () => {
        const response = await fetch(`${apiUrl}/v1/employee`, {
        credentials: 'include'
        });

        if (response.ok) {
        const data = await response.json();
        setUsers(data);
        }

    };

    const getCompany = async () => {
        const response = await fetch(`${apiUrl}/v1/companies`, {
        credentials: 'include'
        });

        if (response.ok) {
        const data = await response.json();
        setCompanies(data);
        }

    };

    const renderTooltip = (props : TooltipProps) => (
        <Tooltip id="button-tooltip" {...props}>
            Email cannot be changed.
        </Tooltip>
    );

    const getCompanyType = (isSeller: boolean, isShipping: boolean) => {
        if (isSeller) return "seller";
        if (isShipping) return "transportation";
        return "customer";
    };

    const getRange = (deEnabled: boolean, euEnabled: boolean) => {
        if (euEnabled) return "eu";
        if (!euEnabled && deEnabled) return "de";
    };


    const handleNewCompanyTypeChange = (companyType: string) => {
        if (companyType === "transportation") {
            setNewCompany((prev) => ({...prev, shipping: true}))
            setShowTransportationDetail(true)
        } else if (companyType === "seller") {
            setNewCompany((prev) => ({...prev, seller: true}))
            setShowTransportationDetail(false)
        } else {
            setShowTransportationDetail(false);
        }
    };

    const handleEditCompanyTypeChange = (companyType: string) => {
        if (companyType === "transportation") {
            setEditCompany((prev) => ({...prev, shipping: true}))
            setEditCompany((prev) => ({...prev, seller: false}))
            setShowEditTransportationDetail(true)
        } else if (companyType === "seller") {
            setEditCompany((prev) => ({...prev, seller: true}))
            setEditCompany((prev) => ({...prev, shipping: false}))
            setShowEditTransportationDetail(false)
        } else {
            setEditCompany((prev) => ({...prev, seller: false}))
            setEditCompany((prev) => ({...prev, shipping: false}))
            setShowEditTransportationDetail(false);
        }
    };

    const handleNewCompanyDeparture = (departure: string) => {
        if (departure === "de") {
            setNewCompany((prev) => ({...prev, germanyPickUp: true}))
        } else {
            setNewCompany((prev) => ({...prev, germanyPickUp: true}));
            setNewCompany((prev) => ({...prev, euPickUp: true}));
        }

    }

    const handleNewCompanyDestination = (destination: string) => {
        if (destination === "de") {
            setNewCompany((prev) => ({...prev, germanyDeliver: true}))
        } else {
            setNewCompany((prev) => ({...prev, germanyDeliver: true}));
            setNewCompany((prev) => ({...prev, euDeliver: true}));
        }

    }

    const handleEditCompanyDeparture = (departure: string) => {
        if (departure === "de") {
            setEditCompany((prev) => ({...prev, germanyPickUp: true}))
            setEditCompany((prev) => ({...prev, euPickUp: false}))
        } else {
            setEditCompany((prev) => ({...prev, germanyPickUp: true}));
            setEditCompany((prev) => ({...prev, euPickUp: true}));
        }

    }

    const handleEditCompanyDestination = (destination: string) => {
        if (destination === "de") {
            setEditCompany((prev) => ({...prev, germanyDeliver: true}))
            setEditCompany((prev) => ({...prev, euDeliver: false}))
        } else {
            setEditCompany((prev) => ({...prev, germanyDeliver: true}));
            setEditCompany((prev) => ({...prev, euDeliver: true}));
        }

    }


    useEffect(()=>{
        getUser();
        getCompany();
    }, [])
  

    return (

        !authenticated ? (<p>You are not authenticated! Please login to see more!</p>) : (

            <>
                <Container className="d-flex flex-column gap-4">
                    <Row>
                        <Col xxl={10}>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Search for companies" />
                                <Button variant="outline-secondary" id="button-addon2" className="d-flex justify-content-center align-items-center">
                                    <SearchIcon></SearchIcon>
                                    <p className="m-0">Search</p>
                                </Button>
                            </InputGroup>
                        </Col>

                        <Col xxl={2}>
                            <Button className="w-100 d-flex justify-content-center align-items-center" variant="outline-primary" onClick={() => setShowNewCompanyModal(true)}>
                                <AddIcon></AddIcon>
                                <p className="m-0">Add new company</p>
                            </Button>
                        </Col>
                    </Row>

                {companies.map((company : Company) => (
                    <Row key={company.id} className="shadow p-2 bg-body-tertiary rounded">

                        <Col xxl={2}>
                            <p>{company.vat}</p>
                        </Col>

                        <Col xxl={3} className="d-flex gap-1">
                            <VerifiedIcon color={company.verified? "success" : "disabled"}></VerifiedIcon><p>{company.title}</p>
                        </Col>

                        <Col xxl={3}>
                            <p>{company.street}  {company.houseNumber}<br />{company.postalCode}  {company.city}</p>
                        </Col>

                        <Col xxl={2}>
                            <p>{getCompanyType(company.seller, company.shipping)}</p>
                        </Col>

                        <Col xxl={1} className="d-flex justify-content-start">
                            <Button variant="outline-success" onClick={() => handleOpenEditModal(company)}>
                                <EditOutlinedIcon></EditOutlinedIcon>
                            </Button>
                        </Col>

                        <Col xxl={1} className="d-flex justify-content-end">
                            <Button variant="outline-danger" onClick={() => handleDeleteCompany(company.id)}>
                                <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                            </Button>
                        </Col>

                    </Row>
                ))}

                </Container>

                <Modal centered show={showNewCompanyModal} size="lg">

                    <Modal.Header className="justify-content-center gap-2">
                        <DomainAddIcon/>
                        <Modal.Title>Add Company</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form className="d-flex flex-column gap-2 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newTitle"
                                        label="Title*"
                                    >
                                        <Form.Control placeholder="Telephone" onChange={(e) => {setNewCompany((prev) => ({...prev, title: e.target.value}))}}/>
                                    </FloatingLabel>

                                    <Form.Text className="text-danger" hidden>Company title cannot be empty</Form.Text>
                                </Col>

                                <Col>
                                <FloatingLabel
                                    controlId="newVat"
                                    label="VAT"
                                >
                                    <Form.Control placeholder="Telephone" onChange={(e) => {setNewCompany((prev) => ({...prev, vat: e.target.value}))}}/>
                                </FloatingLabel>

                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newStreet"
                                        label="Street"
                                    >
                                        <Form.Control placeholder="Max" onChange={(e) => {setNewCompany((prev) => ({...prev, street: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="newHouseNumber"
                                        label="House Number"
                                    >
                                        <Form.Control placeholder="10" onChange={(e) => {setNewCompany((prev) => ({...prev, houseNumber: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newPostalCode"
                                        label="Postal Code"
                                    >
                                        <Form.Control placeholder="10" onChange={(e) => {setNewCompany((prev) => ({...prev, postalCode: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="newCity"
                                        label="City"
                                    >
                                        <Form.Control placeholder="Username" onChange={(e) => {setNewCompany((prev) => ({...prev, city: e.target.value}))}}/>
                                    </FloatingLabel>                                
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newWebsite"
                                        label="Homepage"
                                    >
                                        <Form.Control placeholder="10" onChange={(e) => {setNewCompany((prev) => ({...prev, homepage: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyType"
                                        label="Company Type"
                                    >
                                        <Form.Select onChange={(e) => handleNewCompanyTypeChange(e.target.value)}>
                                            <option value="customer">Customer</option>
                                            <option value="seller">Seller</option>
                                            <option value="transportation">Transportation</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row hidden={!showTransportationDetail}>
                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyFrom"
                                        label="Departure"
                                    >
                                        <Form.Select onChange={(e) => handleNewCompanyDeparture(e.target.value)}>
                                            <option value="de">Nur Deutschland</option>
                                            <option value="eu">EU-Weit</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyTo"
                                        label="Destination"
                                    >
                                        <Form.Select onChange={(e) => handleNewCompanyDestination(e.target.value)}>
                                            <option value="de">Nur Deutschland</option>
                                            <option value="eu">EU-Weit</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                            </Row>


                            <Row>
                                <Col>
                                    <Alert variant="success" className="m-0" show={showAlertNewEmployeeSuccess}>A new employee has been created. An Email is sent to {}. The employee should check Email and finish registration.</Alert>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Alert variant="danger" className="m-0" show={showAlertNewEmployeeFail}>A problem has been detected. Please check again and try later.</Alert>                            
                                </Col>
                            </Row>
                        </Form>
                        
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">

                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={()=>{setShowNewCompanyModal(false)}}>Cancel</Button>
                            </Col>

                            <Col>
                                <Button variant="success" className="w-100" onClick={() => {handleNewCompany()}}>Save</Button>
                            </Col>

                        </Row>
                    </Modal.Footer>
                
                </Modal>

                <Modal centered show={showEditCompanyModal} size="lg">

                    <Modal.Header className="justify-content-center gap-2">
                        <EditOutlinedIcon/>
                        <Modal.Title>Edit Company</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form className="d-flex flex-column gap-2 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="editTitle"
                                        label="Title*"
                                    >
                                        <Form.Control value={editCompany.title} onChange={(e) => {setEditCompany((prev) => ({...prev, title: e.target.value}))}}/>
                                    </FloatingLabel>

                                    <Form.Text className="text-danger" hidden>Company title cannot be empty</Form.Text>
                                </Col>

                                <Col>
                                    <InputGroup>
                                        <FloatingLabel
                                        controlId="editVat"
                                        label="VAT"
                                        >
                                            <Form.Control value={editCompany.vat} onChange={(e) => {setEditCompany((prev) => ({...prev, vat: e.target.value}))}}/>
                                        </FloatingLabel>

                                        <Button variant="outline-secondary">
                                            <VerifiedIcon color={companyVerified? "success" : "disabled"}></VerifiedIcon>
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="editStreet"
                                        label="Street"
                                    >
                                        <Form.Control value={editCompany.street} onChange={(e) => {setEditCompany((prev) => ({...prev, street: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="editHouseNumber"
                                        label="House Number"
                                    >
                                        <Form.Control value={editCompany.houseNumber} onChange={(e) => {setEditCompany((prev) => ({...prev, houseNumber: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="editPostalCode"
                                        label="Postal Code"
                                    >
                                        <Form.Control value={editCompany.postalCode} onChange={(e) => {setEditCompany((prev) => ({...prev, postalCode: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="editCity"
                                        label="City"
                                    >
                                        <Form.Control value={editCompany.city} onChange={(e) => {setEditCompany((prev) => ({...prev, city: e.target.value}))}}/>
                                    </FloatingLabel>                                
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="editWebsite"
                                        label="Homepage"
                                    >
                                        <Form.Control type="url" value={editCompany.homepage} onChange={(e) => {setNewCompany((prev) => ({...prev, homepage: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyType"
                                        label="Company Type"
                                    >
                                        <Form.Select value={getCompanyType(editCompany.seller, editCompany.shipping)} onChange={(e) => handleEditCompanyTypeChange(e.target.value)}>
                                            <option value="customer">Customer</option>
                                            <option value="seller">Seller</option>
                                            <option value="transportation">Transportation</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row hidden={!showEditTransportationDetail}>
                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyFrom"
                                        label="Departure"
                                    >
                                        <Form.Select value={getRange(editCompany.germanyPickUp, editCompany.euPickUp)} onChange={(e) => handleEditCompanyDeparture(e.target.value)}>
                                            <option value="de">Nur Deutschland</option>
                                            <option value="eu">EU-Weit</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="newCompanyTo"
                                        label="Destination"
                                    >
                                        <Form.Select value={getRange(editCompany.germanyDeliver, editCompany.euDeliver)} onChange={(e) => handleEditCompanyDestination(e.target.value)}>
                                            <option value="de">Nur Deutschland</option>
                                            <option value="eu">EU-Weit</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                            </Row>


                            <Row>
                                <Col>
                                    <Alert variant="success" className="m-0" show={showAlertNewEmployeeSuccess}>A new employee has been created. An Email is sent to {}. The employee should check Email and finish registration.</Alert>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Alert variant="danger" className="m-0" show={showAlertNewEmployeeFail}>A problem has been detected. Please check again and try later.</Alert>                            
                                </Col>
                            </Row>
                        </Form>
                        
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">

                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={()=>setShowEditCompanyModal(false)}>Cancel</Button>
                            </Col>

                            <Col>
                                <Button variant="success" className="w-100" onClick={() => handleSaveCompany()}>Save</Button>
                            </Col>

                        </Row>
                    </Modal.Footer>
                
                </Modal>

                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastCreateSuccess} autohide delay={3000} onClose={() => {setShowToastCreateSuccess(false)}}>
                        <Toast.Body>
                            Company has been created successfully!
                        </Toast.Body>
                    </Toast>
                </ToastContainer>


                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => {setShowToastDeleteSuccess(false)}}>
                        <Toast.Body>
                            Company has been deleted successfully!
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </>

        )

    );

}
