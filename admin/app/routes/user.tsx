import { useEffect, useState, useCallback } from "react";
import {
    Col, Container, Row, Button, InputGroup, Form,
    FloatingLabel, Alert, Toast, ToastContainer,
    Tooltip, type TooltipProps, OverlayTrigger, Modal, Spinner, Table
} from "react-bootstrap";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "~/authConfig";
import type { Company, CreateEmployeeForm, Employee, UpdateEmployeeForm } from "~/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "User Management – Palette365 Admin" },
        { name: "description", content: "Manage employees" },
    ];
}

const EMPTY_NEW_EMPLOYEE: CreateEmployeeForm = {
    email: "",
    firstName: "",
    lastName: "",
    preferredLanguage: "GB",
    telephone: "",
    username: "",
    salutation: "Mr",
    companyId: 0,
};

const EMPTY_EDIT_EMPLOYEE: UpdateEmployeeForm = {
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    telephone: "",
    preferredLanguage: "GB",
    companyId: null,
    salutation: "Mr",
};

export default function User() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { instance, accounts } = useMsal();

    // Data state
    const [users, setUsers] = useState<Employee[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
    const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
    const [showAlertNewEmployeeSuccess, setShowAlertNewEmployeeSuccess] = useState(false);
    const [showAlertNewEmployeeFail, setShowAlertNewEmployeeFail] = useState(false);
    const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
    const [showToastDeleteFail, setShowToastDeleteFail] = useState(false);
    const [showToastEditSuccess, setShowToastEditSuccess] = useState(false);

    // Form state
    const [newEmployee, setNewEmployee] = useState<CreateEmployeeForm>(EMPTY_NEW_EMPLOYEE);
    const [editEmployee, setEditEmployee] = useState<UpdateEmployeeForm>(EMPTY_EDIT_EMPLOYEE);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // ─── Auth fetch ───────────────────────────────────────────────────────────

    const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
        try {
            const tokenResponse = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${tokenResponse.accessToken}`,
                },
            });
        } catch {
            // Silent acquisition failed — redirect to login
            await instance.acquireTokenRedirect(loginRequest);
            return Promise.reject("Redirecting to login");
        }
    }, [instance, accounts]);

    // ─── Data fetching ────────────────────────────────────────────────────────

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/employee`);
            if (response.ok) {
                setUsers(await response.json());
            } else {
                console.error("Failed to fetch users:", response.status);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [authFetch, apiUrl]);

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/companies`);
            if (response.ok) {
                setCompanies(await response.json());
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }, [apiUrl]);

    useEffect(() => {
        if (accounts.length > 0) fetchUsers();
    }, [accounts, fetchUsers]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleNewUser = async () => {
        setShowAlertNewEmployeeSuccess(false);
        setShowAlertNewEmployeeFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/employee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee),
            });
            if (response.ok) {
                setShowNewEmployeeModal(false);
                setNewEmployee(EMPTY_NEW_EMPLOYEE);
                fetchUsers();
            } else {
                setShowAlertNewEmployeeFail(true);
            }
        } catch (error) {
            setShowAlertNewEmployeeFail(true);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/employee/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setShowToastDeleteSuccess(true);
                fetchUsers();
            } else {
                setShowToastDeleteFail(true);
            }
        } catch (error) {
            setShowToastDeleteFail(true);
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
            salutation: user.salutation ?? "Mr",
        });
        setShowEditEmployeeModal(true);
    };

    const handleSaveEmployee = async () => {
        if (!selectedEmployee) return;
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/employee/${selectedEmployee.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editEmployee),
            });
            if (response.ok) {
                setShowEditEmployeeModal(false);
                setSelectedEmployee(null);
                setShowToastEditSuccess(true);
                fetchUsers();
            } else {
                console.error("Failed to update employee:", await response.text());
            }
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };

    const handleCloseNewModal = () => {
        setShowNewEmployeeModal(false);
        setShowAlertNewEmployeeSuccess(false);
        setShowAlertNewEmployeeFail(false);
        setNewEmployee(EMPTY_NEW_EMPLOYEE);
    };

    // ─── Derived state ────────────────────────────────────────────────────────

    const filteredUsers = users.filter((user) => {
        const q = searchQuery.toLowerCase();
        return (
            user.email?.toLowerCase().includes(q) ||
            user.firstName?.toLowerCase().includes(q) ||
            user.lastName?.toLowerCase().includes(q)
        );
    });

    // ─── Tooltip ──────────────────────────────────────────────────────────────

    const renderTooltip = (props: TooltipProps) => (
        <Tooltip id="email-tooltip" {...props}>
            Email cannot be changed.
        </Tooltip>
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <AuthenticatedTemplate>
                <Container className="d-flex flex-column gap-2 py-3">

                    {/* Search + Add */}
                    <Row className="mb-2">
                        <Col xxl={10}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Search by name or email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button variant="outline-secondary" className="d-flex align-items-center gap-1">
                                    <SearchIcon fontSize="small" />
                                    Search
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col xxl={2}>
                            <Button
                                className="w-100 d-flex justify-content-center align-items-center gap-1"
                                variant="outline-primary"
                                onClick={() => setShowNewEmployeeModal(true)}
                            >
                                <AddIcon fontSize="small" />
                                Add employee
                            </Button>
                        </Col>
                    </Row>

                    {/* User list */}
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Company</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user: Employee) => (
                                        <tr key={user.id}>
                                            <td>{user.email || "—"}</td>
                                            <td>{user.firstName || "—"}</td>
                                            <td>{user.lastName || "—"}</td>
                                            <td>{user.company?.title || "—"}</td>
                                            <td>
                                                <Button variant="outline-success" size="sm" onClick={() => handleOpenEditModal(user)}>
                                                    <EditOutlinedIcon fontSize="small" />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                                    <DeleteOutlineOutlinedIcon fontSize="small" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Container>

                {/* ── New Employee Modal ── */}
                <Modal centered show={showNewEmployeeModal} size="lg" onHide={handleCloseNewModal}>
                    <Modal.Header className="justify-content-center gap-2">
                        <PersonAddIcon />
                        <Modal.Title>Add new employee</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel label="Email *">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={newEmployee.email}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, email: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Telephone">
                                        <Form.Control
                                            type="tel"
                                            placeholder="Telephone"
                                            value={newEmployee.telephone}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, telephone: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="First name">
                                        <Form.Control
                                            placeholder="First name"
                                            value={newEmployee.firstName}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, firstName: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Last name">
                                        <Form.Control
                                            placeholder="Last name"
                                            value={newEmployee.lastName}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, lastName: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Salutation">
                                        <Form.Select
                                            value={newEmployee.salutation}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, salutation: e.target.value }))}
                                        >
                                            <option value="Mr">Mr.</option>
                                            <option value="Ms">Ms.</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Username">
                                        <Form.Control
                                            placeholder="Username"
                                            value={newEmployee.username}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, username: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Language">
                                        <Form.Select
                                            value={newEmployee.preferredLanguage}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, preferredLanguage: e.target.value }))}
                                        >
                                            <option value="GB">English</option>
                                            <option value="DE">Deutsch</option>
                                            <option value="RU">Русский</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Company">
                                        <Form.Select
                                            value={newEmployee.companyId}
                                            onChange={(e) => setNewEmployee((p) => ({ ...p, companyId: Number(e.target.value) }))}
                                        >
                                            <option value={0}>— Select company —</option>
                                            {companies.map((company: Company) => (
                                                <option key={company.id} value={company.id}>{company.title}</option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Alert variant="success" show={showAlertNewEmployeeSuccess} className="mb-0">
                                Employee created. A verification email has been sent to <strong>{newEmployee.email}</strong>.
                            </Alert>
                            <Alert variant="danger" show={showAlertNewEmployeeFail} className="mb-0">
                                Something went wrong. Please check the details and try again.
                            </Alert>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">
                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={handleCloseNewModal}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="success" className="w-100" onClick={handleNewUser}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Edit Employee Modal ── */}
                <Modal centered show={showEditEmployeeModal} size="lg" onHide={() => setShowEditEmployeeModal(false)}>
                    <Modal.Header className="justify-content-center gap-2">
                        <ManageAccountsIcon />
                        <Modal.Title>Edit Employee</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">
                            <Row>
                                <Col>
                                    <OverlayTrigger placement="bottom" overlay={renderTooltip}>
                                        <FloatingLabel label="Email">
                                            <Form.Control type="email" value={editEmployee.email} readOnly />
                                        </FloatingLabel>
                                    </OverlayTrigger>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Telephone">
                                        <Form.Control
                                            type="tel"
                                            value={editEmployee.telephone}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, telephone: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="First name">
                                        <Form.Control
                                            value={editEmployee.firstName}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, firstName: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Last name">
                                        <Form.Control
                                            value={editEmployee.lastName}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, lastName: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Salutation">
                                        <Form.Select
                                            value={editEmployee.salutation}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, salutation: e.target.value }))}
                                        >
                                            <option value="Mr">Mr.</option>
                                            <option value="Ms">Ms.</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Username">
                                        <Form.Control
                                            value={editEmployee.username}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, username: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Language">
                                        <Form.Select
                                            value={editEmployee.preferredLanguage}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, preferredLanguage: e.target.value }))}
                                        >
                                            <option value="GB">English</option>
                                            <option value="DE">Deutsch</option>
                                            <option value="RU">Русский</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Company">
                                        <Form.Select
                                            value={String(editEmployee.companyId ?? "")}
                                            onChange={(e) => setEditEmployee((p) => ({ ...p, companyId: Number(e.target.value) }))}
                                        >
                                            <option value="">— Select company —</option>
                                            {companies.map((company: Company) => (
                                                <option key={company.id} value={company.id}>{company.title}</option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">
                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={() => setShowEditEmployeeModal(false)}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="success" className="w-100" onClick={handleSaveEmployee}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Toasts ── */}
                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => setShowToastDeleteSuccess(false)}>
                        <Toast.Body className="text-white">Employee deleted successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="danger" show={showToastDeleteFail} autohide delay={3000} onClose={() => setShowToastDeleteFail(false)}>
                        <Toast.Body className="text-white">Failed to delete employee.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastEditSuccess} autohide delay={3000} onClose={() => setShowToastEditSuccess(false)}>
                        <Toast.Body className="text-white">Employee updated successfully.</Toast.Body>
                    </Toast>
                </ToastContainer>
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <p className="text-muted">You must be signed in to view this page.</p>
                </Container>
            </UnauthenticatedTemplate>
        </>
    );
}