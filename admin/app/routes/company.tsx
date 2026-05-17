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
import VerifiedIcon from '@mui/icons-material/Verified';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "~/authConfig";
import type { Company, CreateCompanyForm, UpdateCompanyForm } from "~/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Company Management – Palette365 Admin" },
        { name: "description", content: "Manage companies" },
    ];
}

const EMPTY_NEW_COMPANY: CreateCompanyForm = {
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
    germanyDeliver: false,
};

const EMPTY_EDIT_COMPANY: UpdateCompanyForm = {
    title: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    homepage: "",
    vat: "",
    seller: false,
    shipping: false,
    germanyPickUp: false,
    germanyDeliver: false,
    euPickUp: false,
    euDeliver: false,
};

export default function CompanyPage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { instance, accounts } = useMsal();

    // Data state
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
    const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
    const [showTransportationDetail, setShowTransportationDetail] = useState(false);
    const [showEditTransportationDetail, setShowEditTransportationDetail] = useState(false);
    const [showAlertNewCompanyFail, setShowAlertNewCompanyFail] = useState(false);
    const [showAlertEditCompanyFail, setShowAlertEditCompanyFail] = useState(false);
    const [showToastCreateSuccess, setShowToastCreateSuccess] = useState(false);
    const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
    const [showToastDeleteFail, setShowToastDeleteFail] = useState(false);
    const [showToastEditSuccess, setShowToastEditSuccess] = useState(false);

    // Form state
    const [newCompany, setNewCompany] = useState<CreateCompanyForm>(EMPTY_NEW_COMPANY);
    const [editCompany, setEditCompany] = useState<UpdateCompanyForm>(EMPTY_EDIT_COMPANY);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [companyVerified, setCompanyVerified] = useState(false);

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
            await instance.acquireTokenRedirect(loginRequest);
            return Promise.reject("Redirecting to login");
        }
    }, [instance, accounts]);

    // ─── Data fetching ────────────────────────────────────────────────────────

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies`);
            if (response.ok) {
                setCompanies(await response.json());
            } else {
                console.error("Failed to fetch companies:", response.status);
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        } finally {
            setLoading(false);
        }
    }, [authFetch, apiUrl]);

    useEffect(() => {
        if (accounts.length > 0) fetchCompanies();
    }, [accounts, fetchCompanies]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleNewCompany = async () => {
        setShowAlertNewCompanyFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCompany),
            });
            if (response.ok) {
                setShowNewCompanyModal(false);
                setNewCompany(EMPTY_NEW_COMPANY);
                setShowTransportationDetail(false);
                setShowToastCreateSuccess(true);
                fetchCompanies();
            } else {
                setShowAlertNewCompanyFail(true);
            }
        } catch (error) {
            setShowAlertNewCompanyFail(true);
        }
    };

    const handleDeleteCompany = async (id: number) => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setShowToastDeleteSuccess(true);
                fetchCompanies();
            } else {
                setShowToastDeleteFail(true);
            }
        } catch (error) {
            setShowToastDeleteFail(true);
        }
    };

    const handleSaveCompany = async () => {
        if (!selectedCompany) return;
        setShowAlertEditCompanyFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies/${selectedCompany.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editCompany),
            });
            if (response.ok) {
                setShowEditCompanyModal(false);
                setSelectedCompany(null);
                setShowToastEditSuccess(true);
                fetchCompanies();
            } else {
                setShowAlertEditCompanyFail(true);
                console.error("Failed to update company:", await response.text());
            }
        } catch (error) {
            setShowAlertEditCompanyFail(true);
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
            shipping: company.shipping,
            germanyPickUp: company.germanyPickUp,
            germanyDeliver: company.germanyDeliver,
            euPickUp: company.euPickUp,
            euDeliver: company.euDeliver,
        });
        setShowEditTransportationDetail(company.shipping);
        setShowAlertEditCompanyFail(false);
        setShowEditCompanyModal(true);
    };

    const handleCloseNewModal = () => {
        setShowNewCompanyModal(false);
        setShowAlertNewCompanyFail(false);
        setShowTransportationDetail(false);
        setNewCompany(EMPTY_NEW_COMPANY);
    };

const handleToggleVerify = async () => {
    if (!selectedCompany) return;
    try {
        const response = await authFetch(`${apiUrl}/v1/admin/companies/${selectedCompany.id}/verify`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verified: !companyVerified }),
        });
        if (response.ok) {
            setCompanyVerified((prev) => !prev);
            fetchCompanies(); // keep table in sync
        } else {
            setShowAlertEditCompanyFail(true);
        }
    } catch {
        setShowAlertEditCompanyFail(true);
    }
};

    // ─── Company type helpers ─────────────────────────────────────────────────

    const getCompanyType = (isSeller: boolean, isShipping: boolean) => {
        if (isSeller) return "seller";
        if (isShipping) return "transportation";
        return "customer";
    };

    const getRange = (deEnabled: boolean, euEnabled: boolean) => {
        if (euEnabled) return "eu";
        if (deEnabled) return "de";
        return "de";
    };

    const handleNewCompanyTypeChange = (companyType: string) => {
        if (companyType === "transportation") {
            setNewCompany((prev) => ({ ...prev, shipping: true, seller: false }));
            setShowTransportationDetail(true);
        } else if (companyType === "seller") {
            setNewCompany((prev) => ({ ...prev, seller: true, shipping: false }));
            setShowTransportationDetail(false);
        } else {
            setNewCompany((prev) => ({ ...prev, seller: false, shipping: false }));
            setShowTransportationDetail(false);
        }
    };

    const handleEditCompanyTypeChange = (companyType: string) => {
        if (companyType === "transportation") {
            setEditCompany((prev) => ({ ...prev, shipping: true, seller: false }));
            setShowEditTransportationDetail(true);
        } else if (companyType === "seller") {
            setEditCompany((prev) => ({ ...prev, seller: true, shipping: false }));
            setShowEditTransportationDetail(false);
        } else {
            setEditCompany((prev) => ({ ...prev, seller: false, shipping: false }));
            setShowEditTransportationDetail(false);
        }
    };

    const handleNewCompanyDeparture = (departure: string) => {
        if (departure === "de") {
            setNewCompany((prev) => ({ ...prev, germanyPickUp: true, euPickUp: false }));
        } else {
            setNewCompany((prev) => ({ ...prev, germanyPickUp: true, euPickUp: true }));
        }
    };

    const handleNewCompanyDestination = (destination: string) => {
        if (destination === "de") {
            setNewCompany((prev) => ({ ...prev, germanyDeliver: true, euDeliver: false }));
        } else {
            setNewCompany((prev) => ({ ...prev, germanyDeliver: true, euDeliver: true }));
        }
    };

    const handleEditCompanyDeparture = (departure: string) => {
        if (departure === "de") {
            setEditCompany((prev) => ({ ...prev, germanyPickUp: true, euPickUp: false }));
        } else {
            setEditCompany((prev) => ({ ...prev, germanyPickUp: true, euPickUp: true }));
        }
    };

    const handleEditCompanyDestination = (destination: string) => {
        if (destination === "de") {
            setEditCompany((prev) => ({ ...prev, germanyDeliver: true, euDeliver: false }));
        } else {
            setEditCompany((prev) => ({ ...prev, germanyDeliver: true, euDeliver: true }));
        }
    };

    // ─── Derived state ────────────────────────────────────────────────────────

    const filteredCompanies = companies.filter((company) => {
        const q = searchQuery.toLowerCase();
        return (
            company.title?.toLowerCase().includes(q) ||
            company.vat?.toLowerCase().includes(q) ||
            company.city?.toLowerCase().includes(q)
        );
    });

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
                                    placeholder="Search by name, VAT or city"
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
                                onClick={() => setShowNewCompanyModal(true)}
                            >
                                <AddIcon fontSize="small" />
                                Add company
                            </Button>
                        </Col>
                    </Row>

                    {/* Company table */}
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>VAT</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Type</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted py-4">
                                            No companies found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCompanies.map((company: Company) => (
                                        <tr key={company.id}>
                                            <td>{company.vat || "—"}</td>
                                            <td className="align-middle">
                                                <VerifiedIcon
                                                    color={company.verified ? "success" : "disabled"}
                                                    className="me-1"
                                                />
                                                {company.title}
                                            </td>
                                            <td>
                                                {company.street} {company.houseNumber},{" "}
                                                {company.postalCode} {company.city}
                                            </td>
                                            <td>{getCompanyType(company.seller, company.shipping)}</td>
                                            <td>
                                                <Button variant="outline-success" size="sm" onClick={() => handleOpenEditModal(company)}>
                                                    <EditOutlinedIcon fontSize="small" />
                                                </Button>
                                            </td>
                                            <td>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCompany(company.id)}>
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

                {/* ── New Company Modal ── */}
                <Modal centered show={showNewCompanyModal} size="lg" onHide={handleCloseNewModal}>
                    <Modal.Header className="justify-content-center gap-2">
                        <DomainAddIcon />
                        <Modal.Title>Add Company</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel label="Title *">
                                        <Form.Control
                                            placeholder="Title"
                                            value={newCompany.title}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, title: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="VAT">
                                        <Form.Control
                                            placeholder="VAT"
                                            value={newCompany.vat}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, vat: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Street">
                                        <Form.Control
                                            placeholder="Street"
                                            value={newCompany.street}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, street: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="House Number">
                                        <Form.Control
                                            placeholder="10"
                                            value={newCompany.houseNumber}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, houseNumber: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Postal Code">
                                        <Form.Control
                                            placeholder="10115"
                                            value={newCompany.postalCode}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, postalCode: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="City">
                                        <Form.Control
                                            placeholder="Berlin"
                                            value={newCompany.city}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, city: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Homepage">
                                        <Form.Control
                                            type="url"
                                            placeholder="https://example.com"
                                            value={newCompany.homepage}
                                            onChange={(e) => setNewCompany((prev) => ({ ...prev, homepage: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Company Type">
                                        <Form.Select onChange={(e) => handleNewCompanyTypeChange(e.target.value)}>
                                            <option value="customer">Customer</option>
                                            <option value="seller">Seller</option>
                                            <option value="transportation">Transportation</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            {showTransportationDetail && (
                                <Row>
                                    <Col>
                                        <FloatingLabel label="Departure">
                                            <Form.Select onChange={(e) => handleNewCompanyDeparture(e.target.value)}>
                                                <option value="de">Nur Deutschland</option>
                                                <option value="eu">EU-Weit</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel label="Destination">
                                            <Form.Select onChange={(e) => handleNewCompanyDestination(e.target.value)}>
                                                <option value="de">Nur Deutschland</option>
                                                <option value="eu">EU-Weit</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            )}

                            <Alert variant="danger" show={showAlertNewCompanyFail} className="mb-0">
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
                                <Button variant="success" className="w-100" onClick={handleNewCompany}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Edit Company Modal ── */}
                <Modal centered show={showEditCompanyModal} size="lg" onHide={() => setShowEditCompanyModal(false)}>
                    <Modal.Header className="justify-content-center gap-2">
                        <EditOutlinedIcon />
                        <Modal.Title>Edit Company</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">
                            <Row>
                                <Col>
                                    <FloatingLabel label="Title *">
                                        <Form.Control
                                            value={editCompany.title}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, title: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <FloatingLabel label="VAT">
                                            <Form.Control
                                                value={editCompany.vat}
                                                onChange={(e) => setEditCompany((prev) => ({ ...prev, vat: e.target.value }))}
                                            />
                                        </FloatingLabel>
                                        <Button
                                            variant="outline-secondary"
                                            title={companyVerified ? "Verified" : "Not verified"}
                                            onClick={handleToggleVerify}
                                        >
                                            <VerifiedIcon fontSize="small" color={companyVerified ? "success" : "disabled"} />
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Street">
                                        <Form.Control
                                            value={editCompany.street}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, street: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="House Number">
                                        <Form.Control
                                            value={editCompany.houseNumber}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, houseNumber: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Postal Code">
                                        <Form.Control
                                            value={editCompany.postalCode}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, postalCode: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="City">
                                        <Form.Control
                                            value={editCompany.city}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, city: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Homepage">
                                        <Form.Control
                                            type="url"
                                            value={editCompany.homepage}
                                            onChange={(e) => setEditCompany((prev) => ({ ...prev, homepage: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FloatingLabel label="Company Type">
                                        <Form.Select
                                            value={getCompanyType(editCompany.seller, editCompany.shipping)}
                                            onChange={(e) => handleEditCompanyTypeChange(e.target.value)}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="seller">Seller</option>
                                            <option value="transportation">Transportation</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            {showEditTransportationDetail && (
                                <Row>
                                    <Col>
                                        <FloatingLabel label="Departure">
                                            <Form.Select
                                                value={getRange(editCompany.germanyPickUp, editCompany.euPickUp)}
                                                onChange={(e) => handleEditCompanyDeparture(e.target.value)}
                                            >
                                                <option value="de">Nur Deutschland</option>
                                                <option value="eu">EU-Weit</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel label="Destination">
                                            <Form.Select
                                                value={getRange(editCompany.germanyDeliver, editCompany.euDeliver)}
                                                onChange={(e) => handleEditCompanyDestination(e.target.value)}
                                            >
                                                <option value="de">Nur Deutschland</option>
                                                <option value="eu">EU-Weit</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            )}

                            <Alert variant="danger" show={showAlertEditCompanyFail} className="mb-0">
                                Something went wrong. Please check the details and try again.
                            </Alert>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Row className="w-100">
                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={() => setShowEditCompanyModal(false)}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="success" className="w-100" onClick={handleSaveCompany}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Toasts ── */}
                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastCreateSuccess} autohide delay={3000} onClose={() => setShowToastCreateSuccess(false)}>
                        <Toast.Body className="text-white">Company created successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => setShowToastDeleteSuccess(false)}>
                        <Toast.Body className="text-white">Company deleted successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="danger" show={showToastDeleteFail} autohide delay={3000} onClose={() => setShowToastDeleteFail(false)}>
                        <Toast.Body className="text-white">Failed to delete company.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastEditSuccess} autohide delay={3000} onClose={() => setShowToastEditSuccess(false)}>
                        <Toast.Body className="text-white">Company updated successfully.</Toast.Body>
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