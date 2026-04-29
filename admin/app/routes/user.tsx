import { useOutletContext } from "react-router";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, InputGroup, Form, Modal, Tab, Nav, FloatingLabel, Alert, Toast, ToastContainer, Tooltip, type TooltipProps, OverlayTrigger } from "react-bootstrap";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import type { Company, CreateEmployeeForm, Employee, UpdateEmployeeForm } from "~/types";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function User() {

    const authenticated = useOutletContext();
    const apiUrl=import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
    const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
    const [showAlertNewEmployeeSuccess, setShowAlertNewEmployeeSuccess] = useState(false);
    const [showAlertNewEmployeeFail, setShowAlertNewEmployeeFail] = useState(false);
    const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editEmployee, setEditEmployee] = useState<UpdateEmployeeForm>({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        telephone: "",
        preferredLanguage: "GB",
        companyId: null,
        salutation: "",
    });

    const [newEmployee, setNewEmployee] = useState<CreateEmployeeForm>({
        email: "",
        firstName: "",
        lastName: "",
        preferredLanguage: "",
        telephone: "",
        username: "",
        salutation: "",
        companyId: 0,
    });

    const handleNewUser = async () => {
        const response = await fetch(`${apiUrl}/v1/employee`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(newEmployee),
            credentials: 'include'
        });

        if (response.ok) {
            setShowAlertNewEmployeeSuccess(true);
        } else {
            setShowAlertNewEmployeeFail(true);
        }

    };

    const handleDeleteUser = async (id : number) => {
        const response = await fetch(`${apiUrl}/v1/employee/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (response.ok) {
            setShowToastDeleteSuccess(true);
        } else {
        }

    };

    const handleSaveEmployee = async () => {
        if (!selectedEmployee) return;

        const response = await fetch(`${apiUrl}/v1/employee/${selectedEmployee.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(editEmployee),
        });

        if (response.ok) {
            setShowEditEmployeeModal(false);
            setSelectedEmployee(null);
        } else {
            const errorText = await response.text();
            console.error("Failed to update employee:", errorText);
        }
    };

    const handleOpenEditModal = (user: Employee) => {
        setSelectedEmployee(user);
        setEditEmployee({
            email: user.email ?? "",
            username: user.username ?? "",
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            telephone: user.telephone ?? "",
            preferredLanguage: user.preferredLanguage ?? "GB",
            companyId: user.company?.id ?? null,
            salutation: user.salutation ?? "",
        });
        setShowEditEmployeeModal(true);
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


    useEffect(()=>{
        getUser();
        getCompany();
    }, [])
  

    return (

        !authenticated ? (<p>You are not authenticated! Please login to see more!</p>) : (

            <>
                <Container className="d-flex flex-column gap-2">
                <Row>
                    <Col xxl={10}>
                        <InputGroup className="mb-3">
                    <Form.Control
                    placeholder="Search for users"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2" className="d-flex justify-content-center align-items-center">
                    <SearchIcon></SearchIcon>
                    <p className="m-0">Search</p>
                    </Button>
                </InputGroup>
                    </Col>
                    <Col xxl={2}>
                    <Button className="w-100 d-flex justify-content-center align-items-center" variant="outline-primary" onClick={() => setShowNewEmployeeModal(true)}>
                        <AddIcon></AddIcon>
                        <p className="m-0">Add new employee</p>
                    </Button>

                    </Col>
                </Row>
                {users.map((user : Employee) => (
                    <Row >
                    <Col xxl={2}>
                        {user.email || "No Email"}
                    </Col>
                    <Col xxl={2}>
                        {user.firstName || "No Firstname"}
                    </Col>
                    <Col xxl={2}>
                        {user.lastName || "No Lastname"}
                    </Col>
                    <Col xxl={4}>
                    {user.company ? (user.company.title || "No Company") : ("No Company")}
                    </Col>

                    <Col xxl={1} className="d-flex justify-content-start">
                        <Button variant="outline-success" onClick={()=>{handleOpenEditModal(user)}}>
                            <EditOutlinedIcon></EditOutlinedIcon>
                        </Button>
                    </Col>

                    <Col xxl={1} className="d-flex justify-content-end">
                        <Button variant="outline-danger" onClick={() => handleDeleteUser(user.id)}>
                            <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                        </Button>
                    </Col>

                    </Row>
                ))}

                </Container>

                <Modal centered show={showNewEmployeeModal} size="lg">

                    <Modal.Header className="justify-content-center gap-2">
                        <PersonAddIcon/>
                        <Modal.Title>Add new employee</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form className="d-flex flex-column gap-2 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel
                                        controlId="newEmail"
                                        label="Email*"
                                    >
                                        <Form.Control type="email" placeholder="Email" onChange={(e) => {setNewEmployee((prev) => ({...prev, email: e.target.value}))}}/>
                                    </FloatingLabel>

                                    <Form.Text className="text-danger" hidden>Email cannot be empty</Form.Text>
                                </Col>

                                <Col>
                                <FloatingLabel
                                    controlId="newTel"
                                    label="Telephone"
                                >
                                    <Form.Control type="email" placeholder="Telephone" onChange={(e) => {setNewEmployee((prev) => ({...prev, telephone: e.target.value}))}}/>
                                </FloatingLabel>

                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <FloatingLabel
                                    controlId="newFirstname"
                                    label="Firstname"
                                >
                                    <Form.Control placeholder="Max" onChange={(e) => {setNewEmployee((prev) => ({...prev, firstName: e.target.value}))}}/>
                                </FloatingLabel>

                                </Col>
                                <Col>
                                <FloatingLabel
                                    controlId="newLastname"
                                    label="Lastname"
                                >
                                    <Form.Control placeholder="Mustermann" onChange={(e) => {setNewEmployee((prev) => ({...prev, lastName: e.target.value}))}}/>
                                </FloatingLabel>
                                
                                </Col>

                            </Row>

                            <Row>
                                <Col>
                                <FloatingLabel
                                    controlId="newSalutation"
                                    label="Salutation"
                                >
                                    <Form.Select onChange={(e) => {setNewEmployee((prev) => ({...prev, salutation: e.target.value}))}}>
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                    </Form.Select>        
                                </FloatingLabel>

                                </Col>


                                <Col>
                                <FloatingLabel
                                    controlId="newUsername"
                                    label="Username"
                                >
                                    <Form.Control placeholder="Username" onChange={(e) => {setNewEmployee((prev) => ({...prev, username: e.target.value}))}}/>
                                </FloatingLabel>
                                
                                </Col>



                            </Row>

                            <Row>

                                <Col>
                                    <FloatingLabel
                                        controlId="newLanguage"
                                        label="Language"
                                    >
                                        <Form.Select onChange={(e) => {setNewEmployee((prev) => ({...prev, preferredLanguage: e.target.value}))}}>
                                            <option value="GB">English</option>
                                            <option value="DE">Deutsch</option>
                                            <option value="RU">Русский</option>
                                        </Form.Select>        
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="newCompany"
                                        label="Company"
                                    >
                                        <Form.Select onChange={(e) => {setNewEmployee((prev) => ({...prev, companyId: Number(e.target.value)}))}}>
                                            {companies.map((company : Company) => (
                                                <option value={company.id}>{company.title}</option>
                                            ))}
                                        </Form.Select>        
                                    </FloatingLabel>                                
                                </Col>

                            </Row>

                        <Row>
                            <Col>
                                <Alert variant="success" className="m-0" show={showAlertNewEmployeeSuccess}>A new employee has been created. An Email is sent to {newEmployee.email}. The employee should check Email and finish registration.</Alert>
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
                                <Button variant="outline-danger" className="w-100" onClick={()=>{setShowNewEmployeeModal(false)}}>Cancel</Button>
                            </Col>

                            <Col>
                                <Button variant="success" className="w-100" onClick={() => {setShowAlertNewEmployeeFail(false), setShowAlertNewEmployeeSuccess(false), handleNewUser()}}>Save</Button>
                            </Col>

                        </Row>
                    </Modal.Footer>
                
                </Modal>

                <Modal centered show={showEditEmployeeModal} size="lg">

                    <Modal.Header className="justify-content-center gap-2">
                        <ManageAccountsIcon/>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form className="d-flex flex-column gap-4 p-2">
                            <Row>

                                <Col>
                                    <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                    >
                                        <FloatingLabel
                                            controlId="editEmail"
                                            label="Email"
                                        >
                                            <Form.Control type="email" value={editEmployee.email} readOnly/>
                                        </FloatingLabel>
                                    </OverlayTrigger>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="editTel"
                                        label="Telephone"
                                    >
                                        <Form.Control type="tel" value={editEmployee.telephone} onChange={(e) => {setEditEmployee((prev) => ({...prev, telephone: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                            </Row>

                            <Row>

                                <Col>
                                    <FloatingLabel
                                        controlId="editFirstname"
                                        label="Firstname"
                                    >
                                        <Form.Control value={editEmployee.firstName} onChange={(e) => {setEditEmployee((prev) => ({...prev, firstName: e.target.value}))}}/>
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="editLastname"
                                        label="Lastname"
                                    >
                                        <Form.Control value={editEmployee.lastName} onChange={(e) => {setEditEmployee((prev) => ({...prev, lastName: e.target.value}))}}/>
                                    </FloatingLabel>                            
                                </Col>

                            </Row>

                            <Row>

                                <Col>
                                    <FloatingLabel
                                        controlId="editSalutation"
                                        label="Salutation"
                                    >
                                        <Form.Select value={editEmployee.salutation} onChange={(e) => {setEditEmployee((prev) => ({...prev, salutation: e.target.value}))}}>
                                            <option value="Mr">Mr.</option>
                                            <option value="Ms">Ms.</option>
                                        </Form.Select>        
                                    </FloatingLabel>
                                </Col>

                                <Col>
                                    <FloatingLabel
                                        controlId="editUsername"
                                        label="Username"
                                    >
                                        <Form.Control placeholder="Username" value={editEmployee.username} onChange={(e) => {setEditEmployee((prev) => ({...prev, username: e.target.value}))}}/>
                                    </FloatingLabel>                            
                                </Col>

                            </Row>

                            <Row>

                                <Col>
                                    <FloatingLabel
                                        controlId="editLanguage"
                                        label="Language"
                                    >
                                        <Form.Select value={editEmployee.preferredLanguage} onChange={(e) => {setEditEmployee((prev) => ({...prev, preferredLanguage: e.target.value}))}}>
                                            <option value="GB">English</option>
                                            <option value="DE">Deutsch</option>
                                            <option value="RU">Русский</option>
                                        </Form.Select>        
                                    </FloatingLabel>
                                </Col>




                                <Col>
                                <FloatingLabel
                                    controlId="editCompany"
                                    label="Company"
                                >
                                    <Form.Select value={String(editEmployee.companyId)} onChange={(e) => {setEditEmployee((prev) => ({...prev, companyId: Number(e.target.value)}))}}>
                                        {companies.map((company : Company) => (
                                            <option value={company.id}>{company.title}</option>
                                        ))}
                                    </Form.Select>        
                                </FloatingLabel>

                                
                                </Col>

                            </Row>

                        </Form>
                        
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">

                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={()=>setShowEditEmployeeModal(false)}>Cancel</Button>
                            </Col>

                            <Col>
                                <Button variant="success" className="w-100" onClick={() => handleSaveEmployee()}>Save</Button>
                            </Col>

                        </Row>
                    </Modal.Footer>
                
                </Modal>

                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => {setShowToastDeleteSuccess(false)}}>
                        <Toast.Body>
                            Employee has been deleted successfully!
                        </Toast.Body>
                    </Toast>
                </ToastContainer>


            </>

        )

    );

}
