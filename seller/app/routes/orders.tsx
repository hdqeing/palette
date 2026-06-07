import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Spinner,
  Alert,
  Badge,
  ListGroup,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { Check, FireTruck, Cancel, HourglassEmpty } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Order } from "~/type";

const API_URL = import.meta.env.VITE_API_URL;

type Filter = "all" | "active" | "done";

const STATUS_BADGE: Record<string, { bg: string; text?: string }> = {
  PENDING:   { bg: "warning", text: "dark" },
  CONFIRMED: { bg: "success" },
  SHIPPED:   { bg: "primary" },
  DELIVERED: { bg: "secondary" },
  CANCELLED: { bg: "danger" },
};

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED", "SHIPPED"]);

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "CONFIRMED": return <Check fontSize="small" color="success" />;
    case "SHIPPED":   return <FireTruck fontSize="small" color="primary" />;
    case "DELIVERED": return <Check fontSize="small" color="disabled" />;
    case "CANCELLED": return <Cancel fontSize="small" color="error" />;
    default:          return <HourglassEmpty fontSize="small" color="warning" />;
  }
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState<Filter>("all");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/v1/seller/orders`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setOrders(await res.json());
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = orders
    .filter((o) => {
      if (filter === "active") return ACTIVE_STATUSES.has(o.status);
      if (filter === "done")   return !ACTIVE_STATUSES.has(o.status);
      return true;
    })
    .filter((o) =>
      search.trim() === "" ||
      o.buyerTitle?.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
    );

  const activeCount = orders.filter((o) => ACTIVE_STATUSES.has(o.status)).length;
  const doneCount   = orders.filter((o) => !ACTIVE_STATUSES.has(o.status)).length;

  return (
    <Container fluid className="px-4 pb-4">
      <Breadcrumb className="pt-3 pb-2">
        <Breadcrumb.Item href="/">{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("orders")}</Breadcrumb.Item>
      </Breadcrumb>

      {/* ── Toolbar ── */}
      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} md={5}>
          <Form.Control
            size="sm"
            placeholder={t("search_by_buyer_or_address")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs="auto" className="ms-md-auto">
          <div className="d-flex gap-2">
            {([
              { key: "all",    label: `${t("all")} (${orders.length})` },
              { key: "active", label: `${t("active")} (${activeCount})` },
              { key: "done",   label: `${t("done")} (${doneCount})` },
            ] as { key: Filter; label: string }[]).map(({ key, label }) => (
              <Badge
                key={key}
                role="button"
                bg={filter === key ? "primary" : "secondary"}
                style={{ cursor: "pointer", fontSize: "0.78rem", padding: "0.4em 0.75em" }}
                onClick={() => setFilter(key)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>

      {/* ── Content ── */}
      {loading && <div className="py-5 text-center"><Spinner animation="border" /></div>}
      {error   && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filtered.length === 0 && (
        <Alert variant="light" className="text-center text-muted">
          {t("no_orders")}
        </Alert>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ListGroup variant="flush" className="border rounded">
          {filtered.map((order) => {
            const badge = STATUS_BADGE[order.status] ?? { bg: "secondary" };
            return (
              <ListGroup.Item
                key={order.id}
                action
                onClick={() => navigate(`/orders/${order.id}`)}
                className="py-3 px-3"
                style={{
                  cursor: "pointer",
                  opacity: ACTIVE_STATUSES.has(order.status) ? 1 : 0.72,
                  borderLeft: `3px solid var(--bs-${badge.bg === "warning" ? "warning" : badge.bg})`,
                }}
              >
                <Row className="align-items-center g-2">

                  {/* Status icon */}
                  <Col xs="auto">
                    <StatusIcon status={order.status} />
                  </Col>

                  {/* Buyer + address */}
                  <Col xs={12} md={4}>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      {order.buyerTitle}
                    </div>
                    <div
                      className="text-muted text-truncate"
                      style={{ fontSize: "0.78rem", maxWidth: 280 }}
                      title={order.deliveryAddress}
                    >
                      {order.deliveryAddress}
                    </div>
                  </Col>

                  {/* Total price */}
                  <Col xs={12} md={3}>
                    <span className="fw-semibold" style={{ fontSize: "0.88rem" }}>
                      €{order.totalPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                    </span>
                  </Col>

                  {/* Status badge + dates */}
                  <Col xs={12} md="auto" className="ms-md-auto d-flex gap-2 align-items-center flex-wrap">
                    <Badge bg={badge.bg} text={badge.text} style={{ fontSize: "0.68rem" }}>
                      {t(`order_status.${order.status}`)}
                    </Badge>

                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {t("created")}: {new Date(order.createdAt).toLocaleDateString()}
                    </span>

                    {order.deliveryDate && (
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {t("delivery")}: {new Date(order.deliveryDate).toLocaleDateString()}
                      </span>
                    )}
                  </Col>

                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
}