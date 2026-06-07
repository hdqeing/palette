import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Spinner,
  Alert,
  Badge,
  Button,
  FloatingLabel,
  Form,
  Row,
  Col,
  Container,
  Card,
  Stack,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { ArrowBack, Check, FireTruck, Cancel, HourglassEmpty } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { OrderStatus, type Order } from "~/type";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "#ffc107",
  CONFIRMED: "#28a745",
  SHIPPED:   "#0d6efd",
  DELIVERED: "#adb5bd",
  CANCELLED: "#dc3545",
};

const STATUS_BADGE: Record<string, { bg: string; text?: string }> = {
  PENDING:   { bg: "warning", text: "dark" },
  CONFIRMED: { bg: "success" },
  SHIPPED:   { bg: "primary" },
  DELIVERED: { bg: "secondary" },
  CANCELLED: { bg: "danger" },
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "CONFIRMED": return <Check color="success" />;
    case "SHIPPED":   return <FireTruck color="primary" />;
    case "DELIVERED": return <Check color="disabled" />;
    case "CANCELLED": return <Cancel color="error" />;
    default:          return <HourglassEmpty color="warning" />;
  }
}

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate    = useNavigate();

  const [order,      setOrder]      = useState<Order | null>(null);
  const [status,     setStatus]     = useState<string>("");
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/v1/seller/orders`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const all: Order[] = await res.json();
        const found = all.find((o) => String(o.id) === orderId);
        if (!found) throw new Error("Order not found");
        setOrder(found);
        setStatus(found.status);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  async function handleSave() {
    if (!order) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${API_URL}/v1/seller/orders/${order.id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      setOrder((prev) => prev ? { ...prev, status } : prev);
      setSaveSuccess(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;
  if (error && !order) return <div className="p-4"><Alert variant="danger">{error}</Alert></div>;
  if (!order) return null;

  const badge = STATUS_BADGE[order.status] ?? { bg: "secondary" };
  const accentColor = STATUS_COLORS[order.status] ?? "#adb5bd";
  const isDirty = status !== order.status;
  const isFinal = order.status === "DELIVERED" || order.status === "CANCELLED";

  return (
    <Container fluid className="px-4 pb-5">
      <Breadcrumb className="pt-3 pb-2">
        <Breadcrumb.Item href="/">{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/orders")} style={{ cursor: "pointer" }}>
          {t("orders")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>#{order.id}</Breadcrumb.Item>
      </Breadcrumb>

      {/* ── Page header ── */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <Button variant="link" className="p-0 text-muted" onClick={() => navigate("/orders")}>
            <ArrowBack fontSize="small" />
          </Button>
        </Col>
        <Col>
          <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
            <StatusIcon status={order.status} />
            {order.buyerTitle}
          </h5>
          <small className="text-muted">{order.deliveryAddress}</small>
        </Col>
        <Col xs="auto">
          <Badge bg={badge.bg} text={badge.text}>
            {t(`order_status.${order.status}`)}
          </Badge>
        </Col>
      </Row>

      {saveSuccess && (
        <Alert variant="success" onClose={() => setSaveSuccess(false)} dismissible>
          {t("order_status_updated")}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Row className="g-4">

        {/* ── Left: order details ── */}
        <Col xs={12} md={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div
                className="fw-semibold mb-3 pb-2"
                style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${accentColor}` }}
              >
                {t("order_details")}
              </div>

              <Stack gap={3}>
                {/* Buyer */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("buyer")}</Col>
                  <Col className="fw-semibold" style={{ fontSize: "0.85rem" }}>{order.buyerTitle}</Col>
                </Row>

                {/* Order ID */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("order_id")}</Col>
                  <Col style={{ fontSize: "0.85rem" }}>#{order.id}</Col>
                </Row>

                {/* Linked query */}
                {order.queryId && (
                  <Row>
                    <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("linked_query")}</Col>
                    <Col style={{ fontSize: "0.85rem" }}>
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate(`/queries/${order.queryId}`)}
                      >
                        #{order.queryId}
                      </span>
                    </Col>
                  </Row>
                )}

                {/* Total */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("total_price")}</Col>
                  <Col className="fw-bold" style={{ fontSize: "0.85rem" }}>
                    €{order.totalPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </Col>
                </Row>

                {/* Created */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("created")}</Col>
                  <Col style={{ fontSize: "0.85rem" }}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </Col>
                </Row>

                {/* Delivery date */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("delivery_date")}</Col>
                  <Col style={{ fontSize: "0.85rem" }}>
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString(undefined, {
                          day: "2-digit", month: "short", year: "numeric",
                        })
                      : <span className="text-muted">—</span>
                    }
                  </Col>
                </Row>

                {/* Delivery address */}
                <Row>
                  <Col xs={4} className="text-muted" style={{ fontSize: "0.85rem" }}>{t("delivery_address")}</Col>
                  <Col style={{ fontSize: "0.85rem" }}>{order.deliveryAddress}</Col>
                </Row>
              </Stack>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Right: status update ── */}
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div
                className="fw-semibold mb-3 pb-2"
                style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `2px solid ${accentColor}` }}
              >
                {t("update_status")}
              </div>

              {isFinal ? (
                <Alert variant={order.status === "DELIVERED" ? "success" : "danger"} className="mb-0 py-2" style={{ fontSize: "0.85rem" }}>
                  {order.status === "DELIVERED"
                    ? t("order_delivered_message")
                    : t("order_cancelled_message")}
                </Alert>
              ) : (
                <Stack gap={3}>
                  <FloatingLabel label={t("status")}>
                    <Form.Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {Object.values(OrderStatus)
                        .filter((v) => typeof v === "string")
                        .map((s) => (
                          <option key={s} value={s}>
                            {t(`order_status.${s}`)}
                          </option>
                        ))}
                    </Form.Select>
                  </FloatingLabel>

                  <Button
                    variant="success"
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                    className="w-100"
                  >
                    {saving
                      ? <><Spinner size="sm" animation="border" className="me-1" />{t("saving")}</>
                      : t("save")}
                  </Button>

                  {!isDirty && (
                    <small className="text-muted text-center">{t("no_changes")}</small>
                  )}
                </Stack>
              )}
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  );
}