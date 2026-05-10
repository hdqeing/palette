import { useEffect, useState, useCallback } from "react";
import {
    Col, Container, Row, Button, Form,
    FloatingLabel, Spinner, Toast, ToastContainer,
    Modal, Table, Badge
} from "react-bootstrap";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "~/authConfig";
import type { Company } from "~/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Inventory Management – Palette365 Admin" },
        { name: "description", content: "Manage stock inventories" },
    ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PalletSort = {
    id: number;
    name: string;
};

type Pallet = {
    id: number;
    name: string;
    quality: string;
    palletSort: PalletSort;
};

type Stock = {
    id: number;
    quantity: number;
    price: number;
    company: Company;
    pallet: Pallet;
};

type StockForm = {
    companyId: number;
    palletId: number;
    quantity: number;
    price: number;
};

const EMPTY_FORM: StockForm = {
    companyId: 0,
    palletId: 0,
    quantity: 0,
    price: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getBadgeProps = (quality: string): { bg: string; text?: string } => {
    switch (quality) {
        case "NEW":     return { bg: "success" };
        case "CLASS A": return { bg: "primary" };
        case "CLASS B": return { bg: "warning", text: "dark" };
        case "CLASS C": return { bg: "secondary" };
        default:        return { bg: "dark" };
    }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function InventoryPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { instance, accounts } = useMsal();

    // Data state
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [pallets, setPallets] = useState<Pallet[]>([]);

    // Filter state
    const [selectedCompanyId, setSelectedCompanyId] = useState<number>(0);
    const [selectedPalletId, setSelectedPalletId] = useState<number>(0);

    // UI state
    const [loading, setLoading] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAlertFail, setShowAlertFail] = useState(false);
    const [showToastCreateSuccess, setShowToastCreateSuccess] = useState(false);
    const [showToastEditSuccess, setShowToastEditSuccess] = useState(false);
    const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
    const [showToastDeleteFail, setShowToastDeleteFail] = useState(false);

    // Form state
    const [form, setForm] = useState<StockForm>(EMPTY_FORM);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

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

    const fetchStocks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/inventory`);
            if (response.ok) setStocks(await response.json());
        } catch (error) {
            console.error("Failed to load stocks:", error);
        } finally {
            setLoading(false);
        }
    }, [authFetch, apiUrl]);

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies`);
            if (response.ok) setCompanies(await response.json());
        } catch (error) {
            console.error("Failed to load companies:", error);
        }
    }, [authFetch, apiUrl]);

    const fetchPallets = useCallback(async () => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/pallet`);
            if (response.ok) setPallets(await response.json());
        } catch (error) {
            console.error("Failed to load pallets:", error);
        }
    }, [authFetch, apiUrl]);

    useEffect(() => {
        if (accounts.length > 0) {
            fetchStocks();
            fetchCompanies();
            fetchPallets();
        }
    }, [accounts, fetchStocks, fetchCompanies, fetchPallets]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleCreate = async () => {
        setShowAlertFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                setShowNewModal(false);
                setForm(EMPTY_FORM);
                setShowToastCreateSuccess(true);
                fetchStocks();
            } else {
                setShowAlertFail(true);
            }
        } catch {
            setShowAlertFail(true);
        }
    };

    const handleOpenEdit = (stock: Stock) => {
        setSelectedStock(stock);
        setForm({
            companyId: stock.company?.id ?? 0,
            palletId: stock.pallet?.id ?? 0,
            quantity: stock.quantity,
            price: stock.price,
        });
        setShowAlertFail(false);
        setShowEditModal(true);
    };

    const handleEdit = async () => {
        if (!selectedStock) return;
        setShowAlertFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/inventory/${selectedStock.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                setShowEditModal(false);
                setSelectedStock(null);
                setForm(EMPTY_FORM);
                setShowToastEditSuccess(true);
                fetchStocks();
            } else {
                setShowAlertFail(true);
            }
        } catch {
            setShowAlertFail(true);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/inventory/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setShowToastDeleteSuccess(true);
                fetchStocks();
            } else {
                setShowToastDeleteFail(true);
            }
        } catch {
            setShowToastDeleteFail(true);
        }
    };

    const handleCloseNewModal = () => {
        setShowNewModal(false);
        setShowAlertFail(false);
        setForm(EMPTY_FORM);
    };

    // ─── Derived state ────────────────────────────────────────────────────────

    const filteredStocks = stocks.filter((s) => {
        const matchesCompany = selectedCompanyId === 0 || s.company?.id === selectedCompanyId;
        const matchesPallet  = selectedPalletId  === 0 || s.pallet?.id  === selectedPalletId;
        return matchesCompany && matchesPallet;
    });

    // ─── Shared modal body ────────────────────────────────────────────────────

    const renderForm = () => (
        <div className="d-flex flex-column gap-3 p-2">
            <Row>
                <Col>
                    <FloatingLabel label="Company *">
                        <Form.Select
                            value={form.companyId}
                            onChange={(e) => setForm((p) => ({ ...p, companyId: Number(e.target.value) }))}
                        >
                            <option value={0}>— Select company —</option>
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label="Pallet *">
                        <Form.Select
                            value={form.palletId}
                            onChange={(e) => setForm((p) => ({ ...p, palletId: Number(e.target.value) }))}
                        >
                            <option value={0}>— Select pallet —</option>
                            {pallets.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.palletSort?.name} – {p.name} ({p.quality})
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel label="Quantity">
                        <Form.Control
                            type="number"
                            min={0}
                            value={form.quantity}
                            onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel label="Price (€)">
                        <Form.Control
                            type="number"
                            min={0}
                            step="0.01"
                            value={form.price}
                            onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            {showAlertFail && (
                <p className="text-danger mb-0">Something went wrong. Please try again.</p>
            )}
        </div>
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <AuthenticatedTemplate>
                <Container className="d-flex flex-column gap-2 py-3">

                    {/* Filters + Add */}
                    <Row className="mb-2">
                        <Col xxl={5}>
                            <Form.Select
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
                            >
                                <option value={0}>All companies</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xxl={5}>
                            <Form.Select
                                value={selectedPalletId}
                                onChange={(e) => setSelectedPalletId(Number(e.target.value))}
                            >
                                <option value={0}>All pallets</option>
                                {pallets.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.palletSort?.name} – {p.name} ({p.quality})
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xxl={2}>
                            <Button
                                className="w-100 d-flex justify-content-center align-items-center gap-1"
                                variant="outline-primary"
                                onClick={() => setShowNewModal(true)}
                            >
                                <AddIcon fontSize="small" />
                                Add stock
                            </Button>
                        </Col>
                    </Row>

                    {/* Stock table */}
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Sort</th>
                                    <th>Pallet</th>
                                    <th>Quality</th>
                                    <th>Quantity</th>
                                    <th>Price (€)</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center text-muted py-4">
                                            No stock entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStocks.map((stock) => {
                                        const { bg, text } = getBadgeProps(stock.pallet?.quality);
                                        return (
                                            <tr key={stock.id}>
                                                <td>{stock.company?.title || "—"}</td>
                                                <td>{stock.pallet?.palletSort?.name || "—"}</td>
                                                <td>{stock.pallet?.name || "—"}</td>
                                                <td>
                                                    <Badge pill bg={bg} text={text}>
                                                        {stock.pallet?.quality || "—"}
                                                    </Badge>
                                                </td>
                                                <td>{stock.quantity}</td>
                                                <td>{stock.price.toFixed(2)}</td>
                                                <td>
                                                    <Button variant="outline-success" size="sm" onClick={() => handleOpenEdit(stock)}>
                                                        <EditOutlinedIcon fontSize="small" />
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(stock.id)}>
                                                        <DeleteOutlineOutlinedIcon fontSize="small" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </Table>
                    )}
                </Container>

                {/* ── New Stock Modal ── */}
                <Modal centered show={showNewModal} size="lg" onHide={handleCloseNewModal}>
                    <Modal.Header className="justify-content-center">
                        <Modal.Title>Add stock entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{renderForm()}</Modal.Body>
                    <Modal.Footer>
                        <Row className="w-100">
                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={handleCloseNewModal}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="success" className="w-100" onClick={handleCreate}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Edit Stock Modal ── */}
                <Modal centered show={showEditModal} size="lg" onHide={() => setShowEditModal(false)}>
                    <Modal.Header className="justify-content-center">
                        <Modal.Title>Edit stock entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{renderForm()}</Modal.Body>
                    <Modal.Footer>
                        <Row className="w-100">
                            <Col>
                                <Button variant="outline-danger" className="w-100" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="success" className="w-100" onClick={handleEdit}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Toasts ── */}
                <ToastContainer position="middle-center">
                    <Toast bg="success" show={showToastCreateSuccess} autohide delay={3000} onClose={() => setShowToastCreateSuccess(false)}>
                        <Toast.Body className="text-white">Stock entry created successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastEditSuccess} autohide delay={3000} onClose={() => setShowToastEditSuccess(false)}>
                        <Toast.Body className="text-white">Stock entry updated successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => setShowToastDeleteSuccess(false)}>
                        <Toast.Body className="text-white">Stock entry deleted successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="danger" show={showToastDeleteFail} autohide delay={3000} onClose={() => setShowToastDeleteFail(false)}>
                        <Toast.Body className="text-white">Failed to delete stock entry.</Toast.Body>
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