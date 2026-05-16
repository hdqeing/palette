import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Container, Row, Col, Spinner, Badge, Card,
    Toast, ToastContainer, Button,
} from "react-bootstrap";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Order Details – Palletly" },
        { name: "description", content: "Order details" },
    ];
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Company = {
    id: number;
    title: string;
    city: string;
    postalCode: string;
    street: string;
    houseNumber: string;
    homepage: string;
    vat: string;
    verified: boolean;
};

type Query = {
    id: number;
    deadline: string;
    deliveryRequest: boolean;
    isClosed: boolean;
    buyer: Company;
};

type Order = {
    id: number;
    query: Query;
    seller: Company;
    buyer: Company;
    totalPrice: number;
    createdAt: string;
    deliveryDate: string | null;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    deliveryAddress: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    Order["status"],
    { label: string; variant: string; icon: React.ReactNode }
> = {
    PENDING:   { label: "Pending",   variant: "warning", icon: <AccessTimeIcon fontSize="small" /> },
    CONFIRMED: { label: "Confirmed", variant: "info",    icon: <CheckCircleOutlinedIcon fontSize="small" /> },
    SHIPPED:   { label: "Shipped",   variant: "primary", icon: <LocalShippingIcon fontSize="small" /> },
    DELIVERED: { label: "Delivered", variant: "success", icon: <CheckCircleOutlinedIcon fontSize="small" /> },
    CANCELLED: { label: "Cancelled", variant: "danger",  icon: <CancelOutlinedIcon fontSize="small" /> },
};

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("de-DE", {
        day: "2-digit", month: "long", year: "numeric",
    });
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <Row className="mb-2">
            <Col xs={5} className="text-muted small fw-semibold">{label}</Col>
            <Col xs={7} className="small">{value}</Col>
        </Row>
    );
}

function CompanyCard({ title, company }: { title: string; company: Company }) {
    return (
        <Card className="border-0 bg-light h-100">
            <Card.Body>
                <div className="text-muted small fw-semibold text-uppercase mb-2">{title}</div>
                <div className="fw-bold mb-1">{company.title}</div>
                <div className="text-muted small">
                    {company.street} {company.houseNumber}<br />
                    {company.postalCode} {company.city}
                </div>
                {company.homepage && (
                    <a
                        href={company.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small d-block mt-1"
                    >
                        {company.homepage}
                    </a>
                )}
                <div className="text-muted small mt-1">VAT: {company.vat}</div>
                {company.verified && (
                    <Badge bg="success" className="mt-2">Verified</Badge>
                )}
            </Card.Body>
        </Card>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuyerOrderDetailPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; variant: string } | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/v1/buyer/orders/${id}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    setOrder(await res.json());
                } else if (res.status === 403) {
                    setToast({ message: "Access denied.", variant: "danger" });
                } else if (res.status === 404) {
                    setToast({ message: "Order not found.", variant: "danger" });
                } else {
                    setToast({ message: "Failed to load order.", variant: "danger" });
                }
            } catch {
                setToast({ message: "Network error. Please try again.", variant: "danger" });
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchOrder();
    }, [apiUrl, id]);

    // ─── Loading ──────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (!order) {
        return (
            <Container className="py-5 text-center text-muted">
                <p>Order could not be loaded.</p>
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                    <ArrowBackIcon fontSize="small" className="me-1" />
                    Go back
                </Button>
            </Container>
        );
    }

    const statusCfg = STATUS_CONFIG[order.status];

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Container className="py-4">

            {/* Back + title */}
            <Row className="mb-4 align-items-center">
                <Col xs="auto">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </Button>
                </Col>
                <Col>
                    <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                        <ReceiptLongIcon />
                        Order #{order.id}
                    </h4>
                </Col>
                <Col xs="auto">
                    <Badge
                        bg={statusCfg.variant}
                        className="d-flex align-items-center gap-1 px-3 py-2 fs-6"
                    >
                        {statusCfg.icon}
                        {statusCfg.label}
                    </Badge>
                </Col>
            </Row>

            {/* Summary card */}
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Row>
                        <Col xs={12} md={6}>
                            <div className="text-muted small fw-semibold text-uppercase mb-3">
                                Order Summary
                            </div>
                            <InfoRow label="Order ID" value={`#${order.id}`} />
                            <InfoRow label="Query" value={`#${order.query.id}`} />
                            <InfoRow
                                label="Created"
                                value={
                                    <span className="d-flex align-items-center gap-1">
                                        <CalendarTodayIcon style={{ fontSize: 14 }} />
                                        {formatDate(order.createdAt)}
                                    </span>
                                }
                            />
                            <InfoRow
                                label="Delivery date"
                                value={
                                    <span className="d-flex align-items-center gap-1">
                                        <CalendarTodayIcon style={{ fontSize: 14 }} />
                                        {formatDate(order.deliveryDate)}
                                    </span>
                                }
                            />
                            <InfoRow
                                label="Delivery type"
                                value={
                                    order.query.deliveryRequest ? (
                                        <Badge bg="secondary" className="d-flex align-items-center gap-1" style={{ width: "fit-content" }}>
                                            <LocalShippingIcon fontSize="small" />
                                            Delivery
                                        </Badge>
                                    ) : (
                                        "Pick-up"
                                    )
                                }
                            />
                            {order.deliveryAddress && (
                                <InfoRow
                                    label="Delivery address"
                                    value={
                                        <span className="d-flex align-items-center gap-1">
                                            <LocationOnOutlinedIcon style={{ fontSize: 14 }} />
                                            {order.deliveryAddress}
                                        </span>
                                    }
                                />
                            )}
                        </Col>

                        <Col xs={12} md={6} className="d-flex flex-column justify-content-between mt-4 mt-md-0">
                            <div>
                                <div className="text-muted small fw-semibold text-uppercase mb-3">
                                    Financials
                                </div>
                                <div className="display-6 fw-bold">
                                    {formatCurrency(order.totalPrice)}
                                </div>
                                <div className="text-muted small mt-1">Total order value</div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Buyer & Seller cards */}
            <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                    <div className="text-muted small fw-semibold text-uppercase mb-2 d-flex align-items-center gap-1">
                        <ShoppingBagIcon fontSize="small" />
                        Buyer
                    </div>
                    <CompanyCard title="" company={order.buyer} />
                </Col>
                <Col xs={12} md={6}>
                    <div className="text-muted small fw-semibold text-uppercase mb-2 d-flex align-items-center gap-1">
                        <StorefrontIcon fontSize="small" />
                        Seller
                    </div>
                    <CompanyCard title="" company={order.seller} />
                </Col>
            </Row>

            {/* Toast */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast
                    show={!!toast}
                    onClose={() => setToast(null)}
                    delay={4000}
                    autohide
                    bg={toast?.variant}
                >
                    <Toast.Body className="text-white">{toast?.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}