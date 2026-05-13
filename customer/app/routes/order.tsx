import { useEffect, useState, useCallback } from "react";
import {
    Container, Row, Col, Spinner, Badge, Card,
    Toast, ToastContainer,
} from "react-bootstrap";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { Route } from "./+types/home";
import { CheckCircleOutlineOutlined } from "@mui/icons-material";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "My Orders – Palletly" },
        { name: "description", content: "View your pallet orders" },
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
    PENDING: {
        label: "Pending",
        variant: "warning",
        icon: <AccessTimeIcon fontSize="small" />,
    },
    CONFIRMED: {
        label: "Confirmed",
        variant: "info",
        icon: <CheckCircleOutlineOutlined fontSize="small" />,
    },
    SHIPPED: {
        label: "Shipped",
        variant: "primary",
        icon: <LocalShippingIcon fontSize="small" />,
    },
    DELIVERED: {
        label: "Delivered",
        variant: "success",
        icon: <CheckCircleOutlineOutlined fontSize="small" />,
    },
    CANCELLED: {
        label: "Cancelled",
        variant: "danger",
        icon: <CancelOutlinedIcon fontSize="small" />,
    },
};

function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuyerOrdersPage() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; variant: string } | null>(null);

    // ─── Fetch ────────────────────────────────────────────────────────────────

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/v1/buyer/orders`, {
                credentials: "include",
            });
            if (res.ok) {
                setOrders(await res.json());
            } else {
                setToast({ message: "Failed to load orders.", variant: "danger" });
            }
        } catch {
            setToast({ message: "Network error. Please try again.", variant: "danger" });
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Container className="py-4">
            {/* Header */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                        <ReceiptLongIcon />
                        My Orders
                    </h4>
                    <p className="text-muted small mb-0 mt-1">
                        {orders.length} order{orders.length !== 1 ? "s" : ""} found
                    </p>
                </Col>
            </Row>

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {/* Empty state */}
            {!loading && orders.length === 0 && (
                <div className="text-center py-5 text-muted">
                    <Inventory2Icon style={{ fontSize: 48, opacity: 0.3 }} />
                    <p className="mt-3">No orders yet.</p>
                </div>
            )}

            {/* Order cards */}
            {!loading && orders.length > 0 && (
                <Row className="g-3">
                    {orders.map((order) => {
                        const statusCfg = STATUS_CONFIG[order.status];
                        return (
                            <Col xs={12} key={order.id}>
                                <Card className="shadow-sm border-0">
                                    <Card.Body>
                                        <Row className="align-items-start">
                                            {/* Left: order info */}
                                            <Col xs={12} md={8}>
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span className="fw-semibold">
                                                        Order #{order.id}
                                                    </span>
                                                    <Badge
                                                        bg={statusCfg.variant}
                                                        className="d-flex align-items-center gap-1"
                                                    >
                                                        {statusCfg.icon}
                                                        {statusCfg.label}
                                                    </Badge>
                                                    {order.query.deliveryRequest && (
                                                        <Badge bg="secondary" className="d-flex align-items-center gap-1">
                                                            <LocalShippingIcon fontSize="small" />
                                                            Delivery
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="text-muted small mb-1">
                                                    <strong>Seller:</strong>{" "}
                                                    {order.seller.title},{" "}
                                                    {order.seller.postalCode} {order.seller.city}
                                                </div>

                                                {order.deliveryAddress && (
                                                    <div className="text-muted small mb-1">
                                                        <strong>Delivery address:</strong>{" "}
                                                        {order.deliveryAddress}
                                                    </div>
                                                )}

                                                <div className="text-muted small">
                                                    <strong>Query:</strong> #{order.query.id}
                                                    {" · "}
                                                    <strong>Created:</strong>{" "}
                                                    {formatDate(order.createdAt)}
                                                    {order.deliveryDate && (
                                                        <>
                                                            {" · "}
                                                            <strong>Delivery:</strong>{" "}
                                                            {formatDate(order.deliveryDate)}
                                                        </>
                                                    )}
                                                </div>
                                            </Col>

                                            {/* Right: total price */}
                                            <Col
                                                xs={12}
                                                md={4}
                                                className="text-md-end mt-3 mt-md-0"
                                            >
                                                <div className="fw-bold fs-5">
                                                    {formatCurrency(order.totalPrice)}
                                                </div>
                                                <div className="text-muted small">Total price</div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

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