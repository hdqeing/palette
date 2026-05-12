import { useEffect, useState, useCallback } from "react";
import {
    Col, Container, Row, Button, Form,
    FloatingLabel, Spinner, Toast, ToastContainer,
    Modal, Table, Badge, Accordion, Card
} from "react-bootstrap";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "~/authConfig";
import type { Company } from "~/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Request Management – Palette365 Admin" },
        { name: "description", content: "Manage buyer requests" },
    ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PalletSort = { id: number; name: string };
type Pallet = { id: number; name: string; quality: string; palletSort: PalletSort };

type QuoteDetail = {
    quoteId: number;
    sellerId: number;
    sellerName: string;
    price: number;
};

type QueryPalletDetail = {
    queryPalletId: number;
    palletId: number;
    palletName: string;
    quality: string;
    palletSortName: string;
    quantity: number;
    quotes: QuoteDetail[];
};

type SellerDetail = {
    querySellerEntryId: number;
    sellerId: number;
    sellerName: string;
    sum: number;
    isAccepted: boolean;
    isRejected: boolean;
};

type QueryDetail = {
    id: number;
    deadline: string;
    isDeliveryRequest: boolean;
    isClosed: boolean;
    buyerId: number;
    buyerName: string;
    pallets: QueryPalletDetail[];
    sellers: SellerDetail[];
};

type CreateRequestForm = {
    buyerId: number;
    deadline: string;
    isDeliveryRequest: boolean;
    pallets: { palletId: number; quantity: number }[];
    sellerIds: number[];
};

const EMPTY_FORM: CreateRequestForm = {
    buyerId: 0,
    deadline: "",
    isDeliveryRequest: false,
    pallets: [],
    sellerIds: [],
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

const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString("de-DE") : "—";

// ─── Quote matrix component ───────────────────────────────────────────────────
// Rows = sellers, columns = pallets, cells = price from that seller for that pallet

function QuoteMatrix({ pallets, sellers }: { pallets: QueryPalletDetail[]; sellers: SellerDetail[] }) {
    if (pallets.length === 0 || sellers.length === 0) {
        return <p className="text-muted small mb-0">No pallets or sellers yet.</p>;
    }

    // Build lookup: sellerName -> palletId -> price
    const priceMap: Record<string, Record<number, number | null>> = {};
    sellers.forEach((s) => {
        priceMap[s.sellerName] = {};
        pallets.forEach((p) => { priceMap[s.sellerName][p.palletId] = null; });
    });
    pallets.forEach((p) => {
        p.quotes.forEach((q) => {
            if (priceMap[q.sellerName]) {
                priceMap[q.sellerName][p.palletId] = q.price;
            }
        });
    });

    return (
        <Table bordered size="sm" className="mb-0">
            <thead className="table-light">
                <tr>
                    <th>Seller</th>
                    {pallets.map((p) => (
                        <th key={p.queryPalletId}>
                            <div>{p.palletSortName} – {p.palletName}</div>
                            <div className="d-flex align-items-center gap-1 mt-1">
                                <Badge pill {...getBadgeProps(p.quality)}>{p.quality}</Badge>
                                <span className="text-muted small">×{p.quantity}</span>
                            </div>
                        </th>
                    ))}
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {sellers.map((seller) => {
                    const prices = pallets.map((p) => priceMap[seller.sellerName]?.[p.palletId]);
                    const total = seller.sum > 0
                        ? seller.sum
                        : prices.reduce<number>((acc, price) => acc + (price ?? 0), 0);

                    const statusBadge = seller.isAccepted
                        ? <Badge bg="success">Accepted</Badge>
                        : seller.isRejected
                        ? <Badge bg="danger">Rejected</Badge>
                        : <Badge bg="secondary">Pending</Badge>;

                    return (
                        <tr key={seller.querySellerEntryId}>
                            <td className="fw-semibold">{seller.sellerName}</td>
                            {pallets.map((p) => {
                                const price = priceMap[seller.sellerName]?.[p.palletId];
                                return (
                                    <td key={p.queryPalletId} className="text-end">
                                        {price != null ? `€${price.toFixed(2)}` : <span className="text-muted">—</span>}
                                    </td>
                                );
                            })}
                            <td className="text-end fw-semibold">
                                {total > 0 ? `€${total.toFixed(2)}` : <span className="text-muted">—</span>}
                            </td>
                            <td>{statusBadge}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RequestPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { instance, accounts } = useMsal();

    // Data state
    const [requests, setRequests] = useState<QueryDetail[]>([]);
    const [buyers, setBuyers] = useState<Company[]>([]);
    const [sellers, setSellers] = useState<Company[]>([]);
    const [pallets, setPallets] = useState<Pallet[]>([]);

    // Filter state
    const [selectedBuyerId, setSelectedBuyerId] = useState<number>(0);
    const [showClosed, setShowClosed] = useState<boolean | null>(null);

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
    const [form, setForm] = useState<CreateRequestForm>(EMPTY_FORM);
    const [selectedRequest, setSelectedRequest] = useState<QueryDetail | null>(null);

    // Edit sub-fields
    const [editDeadline, setEditDeadline] = useState("");
    const [editIsDelivery, setEditIsDelivery] = useState(false);
    const [editIsClosed, setEditIsClosed] = useState(false);

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

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/requests`);
            if (response.ok) setRequests(await response.json());
        } catch (e) {
            console.error("Failed to load requests", e);
        } finally {
            setLoading(false);
        }
    }, [authFetch, apiUrl]);

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/companies`);
            if (response.ok) {
                const all: Company[] = await response.json();
                setBuyers(all);
                setSellers(all.filter((c: any) => c.seller));
            }
        } catch (e) {
            console.error("Failed to load companies", e);
        }
    }, [authFetch, apiUrl]);

    const fetchPallets = useCallback(async () => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/pallet`);
            if (response.ok) setPallets(await response.json());
        } catch (e) {
            console.error("Failed to load pallets", e);
        }
    }, [authFetch, apiUrl]);

    useEffect(() => {
        if (accounts.length > 0) {
            fetchRequests();
            fetchCompanies();
            fetchPallets();
        }
    }, [accounts, fetchRequests, fetchCompanies, fetchPallets]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleCreate = async () => {
        setShowAlertFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/requests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                setShowNewModal(false);
                setForm(EMPTY_FORM);
                setShowToastCreateSuccess(true);
                fetchRequests();
            } else {
                setShowAlertFail(true);
            }
        } catch {
            setShowAlertFail(true);
        }
    };

    const handleOpenEdit = (req: QueryDetail) => {
        setSelectedRequest(req);
        setEditDeadline(req.deadline?.slice(0, 16) ?? "");
        setEditIsDelivery(req.isDeliveryRequest);
        setEditIsClosed(req.isClosed);
        setShowAlertFail(false);
        setShowEditModal(true);
    };

    const handleEdit = async () => {
        if (!selectedRequest) return;
        setShowAlertFail(false);
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/requests/${selectedRequest.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    deadline: editDeadline,
                    isDeliveryRequest: editIsDelivery,
                    isClosed: editIsClosed,
                }),
            });
            if (response.ok) {
                setShowEditModal(false);
                setSelectedRequest(null);
                setShowToastEditSuccess(true);
                fetchRequests();
            } else {
                setShowAlertFail(true);
            }
        } catch {
            setShowAlertFail(true);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await authFetch(`${apiUrl}/v1/admin/requests/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setShowToastDeleteSuccess(true);
                fetchRequests();
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

    // Pallet entries in create form
    const addPalletEntry = () =>
        setForm((p) => ({ ...p, pallets: [...p.pallets, { palletId: 0, quantity: 1 }] }));

    const updatePalletEntry = (index: number, field: "palletId" | "quantity", value: number) =>
        setForm((p) => {
            const pallets = [...p.pallets];
            pallets[index] = { ...pallets[index], [field]: value };
            return { ...p, pallets };
        });

    const removePalletEntry = (index: number) =>
        setForm((p) => ({ ...p, pallets: p.pallets.filter((_, i) => i !== index) }));

    const toggleSeller = (sellerId: number) =>
        setForm((p) => ({
            ...p,
            sellerIds: p.sellerIds.includes(sellerId)
                ? p.sellerIds.filter((id) => id !== sellerId)
                : [...p.sellerIds, sellerId],
        }));

    // ─── Derived state ────────────────────────────────────────────────────────

    const filteredRequests = requests.filter((r) => {
        const matchesBuyer = selectedBuyerId === 0 || r.buyerId === selectedBuyerId;
        const matchesClosed = showClosed === null || r.isClosed === showClosed;
        return matchesBuyer && matchesClosed;
    });

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            <AuthenticatedTemplate>
                <Container className="d-flex flex-column gap-3 py-3">

                    {/* Filters + Add */}
                    <Row className="mb-2 align-items-center">
                        <Col xxl={4}>
                            <Form.Select
                                value={selectedBuyerId}
                                onChange={(e) => setSelectedBuyerId(Number(e.target.value))}
                            >
                                <option value={0}>All buyers</option>
                                {buyers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xxl={4}>
                            <Form.Select
                                value={showClosed === null ? "" : showClosed ? "closed" : "open"}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setShowClosed(v === "" ? null : v === "closed");
                                }}
                            >
                                <option value="">All statuses</option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </Form.Select>
                        </Col>
                        <Col xxl={4}>
                            <Button
                                className="w-100 d-flex justify-content-center align-items-center gap-1"
                                variant="outline-primary"
                                onClick={() => setShowNewModal(true)}
                            >
                                <AddIcon fontSize="small" />
                                New request
                            </Button>
                        </Col>
                    </Row>

                    {/* Request list */}
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <p className="text-muted text-center py-4">No requests found.</p>
                    ) : (
                        <Accordion>
                            {filteredRequests.map((req) => (
                                <Accordion.Item key={req.id} eventKey={String(req.id)}>
                                    <Accordion.Header>
                                        <div className="d-flex align-items-center gap-3 w-100 me-3">
                                            <span className="fw-semibold">{req.buyerName}</span>
                                            <Badge bg={req.isClosed ? "secondary" : "success"}>
                                                {req.isClosed ? "Closed" : "Open"}
                                            </Badge>
                                            {req.isDeliveryRequest && (
                                                <Badge bg="info" text="dark">Delivery</Badge>
                                            )}
                                            <span className="text-muted small ms-auto">
                                                Deadline: {formatDate(req.deadline)}
                                            </span>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(req); }}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </Button>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <QuoteMatrix pallets={req.pallets} sellers={req.sellers} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                </Container>

                {/* ── New Request Modal ── */}
                <Modal centered show={showNewModal} size="lg" onHide={handleCloseNewModal}>
                    <Modal.Header className="justify-content-center">
                        <Modal.Title>New request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">

                            {/* Buyer + deadline */}
                            <Row>
                                <Col>
                                    <FloatingLabel label="Buyer *">
                                        <Form.Select
                                            value={form.buyerId}
                                            onChange={(e) => setForm((p) => ({ ...p, buyerId: Number(e.target.value) }))}
                                        >
                                            <option value={0}>— Select buyer —</option>
                                            {buyers.map((c) => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col>
                                    <FloatingLabel label="Deadline">
                                        <Form.Control
                                            type="datetime-local"
                                            value={form.deadline}
                                            onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            {/* Delivery toggle */}
                            <Form.Check
                                type="switch"
                                label="Delivery request"
                                checked={form.isDeliveryRequest}
                                onChange={(e) => setForm((p) => ({ ...p, isDeliveryRequest: e.target.checked }))}
                            />

                            {/* Pallets */}
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-semibold">Pallets</span>
                                    <Button variant="outline-primary" size="sm" onClick={addPalletEntry}>
                                        <AddIcon fontSize="small" /> Add pallet
                                    </Button>
                                </div>
                                {form.pallets.map((entry, index) => (
                                    <Row key={index} className="mb-2 align-items-center">
                                        <Col xxl={7}>
                                            <Form.Select
                                                value={entry.palletId}
                                                onChange={(e) => updatePalletEntry(index, "palletId", Number(e.target.value))}
                                            >
                                                <option value={0}>— Select pallet —</option>
                                                {pallets.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.palletSort?.name} – {p.name} ({p.quality})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col xxl={3}>
                                            <Form.Control
                                                type="number"
                                                min={1}
                                                placeholder="Qty"
                                                value={entry.quantity}
                                                onChange={(e) => updatePalletEntry(index, "quantity", Number(e.target.value))}
                                            />
                                        </Col>
                                        <Col xxl={2}>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => removePalletEntry(index)}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                {form.pallets.length === 0 && (
                                    <p className="text-muted small">No pallets added yet.</p>
                                )}
                            </div>

                            {/* Sellers */}
                            <div>
                                <span className="fw-semibold d-block mb-2">Invite sellers</span>
                                <div className="d-flex flex-wrap gap-2">
                                    {sellers.map((s) => (
                                        <Form.Check
                                            key={s.id}
                                            type="checkbox"
                                            label={s.title}
                                            checked={form.sellerIds.includes(s.id)}
                                            onChange={() => toggleSeller(s.id)}
                                        />
                                    ))}
                                    {sellers.length === 0 && (
                                        <p className="text-muted small">No sellers available.</p>
                                    )}
                                </div>
                            </div>

                            {showAlertFail && (
                                <p className="text-danger mb-0">Something went wrong. Please try again.</p>
                            )}
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
                                <Button variant="success" className="w-100" onClick={handleCreate}>
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ── Edit Request Modal ── */}
                <Modal centered show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header className="justify-content-center">
                        <Modal.Title>Edit request</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex flex-column gap-3 p-2">
                            <FloatingLabel label="Deadline">
                                <Form.Control
                                    type="datetime-local"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                />
                            </FloatingLabel>
                            <Form.Check
                                type="switch"
                                label="Delivery request"
                                checked={editIsDelivery}
                                onChange={(e) => setEditIsDelivery(e.target.checked)}
                            />
                            <Form.Check
                                type="switch"
                                label="Closed"
                                checked={editIsClosed}
                                onChange={(e) => setEditIsClosed(e.target.checked)}
                            />
                            {showAlertFail && (
                                <p className="text-danger mb-0">Something went wrong. Please try again.</p>
                            )}
                        </div>
                    </Modal.Body>
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
                        <Toast.Body className="text-white">Request created successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastEditSuccess} autohide delay={3000} onClose={() => setShowToastEditSuccess(false)}>
                        <Toast.Body className="text-white">Request updated successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="success" show={showToastDeleteSuccess} autohide delay={3000} onClose={() => setShowToastDeleteSuccess(false)}>
                        <Toast.Body className="text-white">Request deleted successfully.</Toast.Body>
                    </Toast>
                    <Toast bg="danger" show={showToastDeleteFail} autohide delay={3000} onClose={() => setShowToastDeleteFail(false)}>
                        <Toast.Body className="text-white">Failed to delete request.</Toast.Body>
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