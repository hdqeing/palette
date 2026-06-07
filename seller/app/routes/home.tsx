import { useState, useEffect, useRef } from "react";
import {
  Button,
  Alert,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  Container,
  Card,
  Stack,
  Badge,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import * as Chart from "chart.js";

const API_URL = import.meta.env.VITE_API_URL;

// ── Types ────────────────────────────────────────────────────────────────────

interface PalletSort {
  id: number;
  name: string;
}

interface Pallet {
  id: number;
  palletSort: PalletSort;
  boards: number;
  nails: number;
  blocks: number;
  length: number;
  width: number;
  height: number;
  name: string;
  safeWorkingLoad: number;
  weight: number;
  quality: string;
  url: string;
  description: string | null;
  custom: boolean;
  owner: string | null;
}

interface QueryPalletEntry {
  queryPalletId: number;
  pallet: Pallet;
  quantity: number;
  quotedPrice: number;
}

interface Buyer {
  id: number;
  title: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  homepage: string;
  vat: string;
  verified: boolean;
  seller: boolean;
}

interface SellerQuery {
  queryId: number;
  deadline: string;
  isClosed: boolean;
  buyer: Buyer;
  pallets: QueryPalletEntry[];
  accepted: boolean;
  rejected: boolean;
  sum: number;
  deliveryRequest: boolean;
}

interface Order {
  id: number;
  queryId: number;
  sellerId: number;
  sellerTitle: string;
  buyerId: number;
  buyerTitle: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryDate: string | null;
  deliveryAddress: string;
}

interface OrderItem {
  pallet: Pallet;
  quantity: number;
  pricePerItem: number;
}

interface OrderDetail {
  id: number;
  queryId: number | null;
  buyer: Buyer;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryDate: string | null;
  deliveryAddress: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function queryStatus(q: SellerQuery): { label: string; bg: string } {
  if (q.rejected) return { label: "rejected", bg: "danger" };
  if (q.accepted) return { label: "accepted", bg: "success" };
  if (q.isClosed) return { label: "closed",   bg: "secondary" };
  return               { label: "open",       bg: "primary" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(deadline: string) {
  return !isNaN(Date.parse(deadline)) && new Date(deadline) < new Date();
}

const ORDER_STATUS_STYLE: Record<string, { bg: string; headerBg: string; headerBorder: string; leftBorder: string; footerBg?: string; opacity: number }> = {
  PENDING:   { bg: "#ffffff",  headerBg: "#fff8e1", headerBorder: "#ffe082", leftBorder: "#ffc107", footerBg: undefined, opacity: 1    },
  CONFIRMED: { bg: "#ffffff",  headerBg: "#e8f5e9", headerBorder: "#a5d6a7", leftBorder: "#28a745", footerBg: undefined, opacity: 1    },
  SHIPPED:   { bg: "#ffffff",  headerBg: "#e3f2fd", headerBorder: "#90caf9", leftBorder: "#0d6efd", footerBg: undefined, opacity: 1    },
  DELIVERED: { bg: "#f8f9fa",  headerBg: "#e9ecef", headerBorder: "#dee2e6", leftBorder: "#adb5bd", footerBg: "#e9ecef", opacity: 0.72 },
  CANCELLED: { bg: "#fff5f5",  headerBg: "#fce4e4", headerBorder: "#f5c6c6", leftBorder: "#dc3545", footerBg: "#fce4e4", opacity: 0.72 },
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  PENDING:   "warning",
  CONFIRMED: "success",
  SHIPPED:   "primary",
  DELIVERED: "secondary",
  CANCELLED: "danger",
};

// ── Pie Chart ────────────────────────────────────────────────────────────────

Chart.Chart.register(
  Chart.PieController,
  Chart.ArcElement,
  Chart.Tooltip,
  Chart.Legend
);

const CHART_COLORS = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac",
];

type Interval = "7" | "30" | "90";

const INTERVALS: { value: Interval; labelKey: string }[] = [
  { value: "7",  labelKey: "last_week"         },
  { value: "30", labelKey: "last_month"        },
  { value: "90", labelKey: "last_3_months"     },
];

function getCutoff(interval: Interval): Date {
  const d = new Date();
  d.setDate(d.getDate() - Number(interval));
  return d;
}

const PalletPieChart = ({
  orderDetails,
  orders,
  queries,
  loading,
}: {
  orderDetails: OrderDetail[];
  orders: Order[];
  queries: SellerQuery[];
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart.Chart | null>(null);
  const [interval, setInterval] = useState<Interval>("30");

  const cutoff = getCutoff(interval);

  // ── Derived KPIs filtered by interval ──
  const activeQueryCount    = queries.filter((q) => !q.isClosed && new Date(q.deadline) >= cutoff).length;
  const confirmedOrderCount = orders.filter(
    (o) => o.status === "CONFIRMED" && new Date(o.createdAt) >= cutoff
  ).length;

  // ── Chart data ──
  useEffect(() => {
    if (loading || !canvasRef.current) return;

    const cutoffForEffect = getCutoff(interval);
    const totals: Record<string, number> = {};
    for (const order of orderDetails) {
      if (new Date(order.createdAt) < cutoffForEffect) continue;
      for (const item of order.items) {
        const label = t(item.pallet.name);
        totals[label] = (totals[label] ?? 0) + item.quantity;
      }
    }

    const labels = Object.keys(totals);
    const data   = Object.values(totals);

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (labels.length === 0) return;

    chartRef.current = new Chart.Chart(canvasRef.current, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: CHART_COLORS.slice(0, labels.length),
          borderWidth: 2,
          borderColor: "#fff",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12, padding: 14, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const value = ctx.parsed as number;
                const pct   = ((value / total) * 100).toFixed(1);
                return ` ${value.toLocaleString()} units (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [orderDetails, loading, interval, t]);

  const hasChartData = !loading && orderDetails.some(
    (o) => new Date(o.createdAt) >= cutoff && o.items.length > 0
  );

  return (
    <div className="border rounded p-3 mb-4">

      {/* ── Row header with interval selector ── */}
      <Row className="align-items-center mb-3">
        <Col>
          <h5 className="mb-0 fw-semibold">{t("overview")}</h5>
        </Col>
        <Col xs="auto">
          <Form.Select
            size="sm"
            value={interval}
            onChange={(e) => setInterval(e.target.value as Interval)}
            style={{ fontSize: "0.8rem", width: "auto" }}
          >
            {INTERVALS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row className="align-items-stretch g-0">

        {/* ── Pie chart – 1/3 width ── */}
        <Col xs={4} className="pe-3" style={{ borderRight: "1px solid #dee2e6" }}>
          <small className="text-muted d-block mb-2">{t("pallet_breakdown")}</small>

          {loading ? (
            <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
          ) : !hasChartData ? (
            <p className="text-muted text-center py-3 mb-0" style={{ fontSize: "0.85rem" }}>
              {t("no_orders_in_period")}
            </p>
          ) : (
            <div style={{ height: "180px" }}>
              <canvas ref={canvasRef} />
            </div>
          )}
        </Col>

        {/* ── KPI cards – remaining 2/3 ── */}
        <Col xs={8} className="ps-3 d-flex align-items-center gap-3">

          <div
            className="flex-fill rounded p-3 text-center"
            style={{ background: "#e8f0fe", border: "1px solid #c2d4fb" }}
          >
            <div className="fw-bold" style={{ fontSize: "2.8rem", lineHeight: 1, color: "#0d6efd" }}>
              {loading ? <Spinner animation="border" size="sm" /> : activeQueryCount}
            </div>
            <div className="text-muted mt-1" style={{ fontSize: "0.8rem" }}>{t("active_requests")}</div>
          </div>

          <div
            className="flex-fill rounded p-3 text-center"
            style={{ background: "#e8f5e9", border: "1px solid #a5d6a7" }}
          >
            <div className="fw-bold" style={{ fontSize: "2.8rem", lineHeight: 1, color: "#28a745" }}>
              {loading ? <Spinner animation="border" size="sm" /> : confirmedOrderCount}
            </div>
            <div className="text-muted mt-1" style={{ fontSize: "0.8rem" }}>{t("confirmed_orders")}</div>
          </div>

        </Col>
      </Row>
    </div>
  );
};

// ── Order Card ────────────────────────────────────────────────────────────────

const OrderCard = ({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const style = ORDER_STATUS_STYLE[order.status] ?? ORDER_STATUS_STYLE.PENDING;
  const badgeBg = ORDER_STATUS_BADGE[order.status] ?? "secondary";
  const isActive = order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "SHIPPED";

  return (
    <Card
      onClick={onClick}
      className="h-100"
      style={{
        cursor: "pointer",
        width: "100%",
        transition: "box-shadow 0.15s, opacity 0.15s",
        opacity: style.opacity,
        backgroundColor: style.bg,
        borderLeft: `3px solid ${style.leftBorder}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.13)";
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.opacity = String(style.opacity);
      }}
    >
      <Card.Header
        className="d-flex justify-content-between align-items-center py-2"
        style={{ backgroundColor: style.headerBg, borderBottom: `1px solid ${style.headerBorder}` }}
      >
        <span className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>
          #{order.id} · Q{order.queryId}
        </span>
        <Badge
          bg={badgeBg}
          text={badgeBg === "warning" ? "dark" : undefined}
          style={{ fontSize: "0.68rem" }}
        >
          {t(order.status.toLowerCase())}
        </Badge>
      </Card.Header>

      <Card.Body className="py-2 px-3">
        <Card.Title
          className="mb-0 text-truncate"
          style={{ fontSize: "0.9rem" }}
          title={order.buyerTitle}
        >
          {order.buyerTitle}
        </Card.Title>
        <Card.Subtitle
          className="text-muted mb-2 text-truncate"
          style={{ fontSize: "0.75rem" }}
          title={order.deliveryAddress}
        >
          {order.deliveryAddress}
        </Card.Subtitle>

        <div
          className="fw-bold text-end"
          style={{ fontSize: "0.88rem", borderTop: "1px solid #dee2e6", paddingTop: "0.35rem" }}
        >
          €{order.totalPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
        </div>
      </Card.Body>

      <Card.Footer
        className="d-flex justify-content-between align-items-center py-2"
        style={{ backgroundColor: style.footerBg }}
      >
        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
          {order.deliveryDate
            ? `${t("delivery")}: ${formatDate(order.deliveryDate)}`
            : t("no_delivery_date")}
        </small>
        <Button
          size="sm"
          variant={isActive ? "outline-primary" : "outline-secondary"}
          style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem" }}
        >
          {t("view")}
        </Button>
      </Card.Footer>
    </Card>
  );
};

// ── Query Card ───────────────────────────────────────────────────────────────

const QueryCard = ({
  query,
  onClick,
}: {
  query: SellerQuery;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const status = queryStatus(query);
  const overdue = isOverdue(query.deadline) && !query.isClosed;
  const closed = query.isClosed;

  return (
    <Card
      onClick={onClick}
      className="h-100"
      style={{
        cursor: "pointer",
        width: "100%",
        transition: "box-shadow 0.15s, opacity 0.15s",
        opacity: closed ? 0.72 : 1,
        backgroundColor: closed ? "#f8f9fa" : "#ffffff",
        borderLeft: closed ? "3px solid #adb5bd" : "3px solid #0d6efd",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.13)";
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.opacity = closed ? "0.72" : "1";
      }}
    >
      <Card.Header
        className="d-flex justify-content-between align-items-center py-2"
        style={{
          backgroundColor: closed ? "#e9ecef" : "#e8f0fe",
          borderBottom: closed ? "1px solid #dee2e6" : "1px solid #c2d4fb",
        }}
      >
        <span className="fw-semibold text-muted" style={{ fontSize: "0.78rem" }}>
          #{query.queryId}
        </span>
        <Stack direction="horizontal" gap={1}>
          {query.deliveryRequest && (
            <Badge bg="info" text="dark" style={{ fontSize: "0.68rem" }}>
              {t("delivery")}
            </Badge>
          )}
          <Badge bg={status.bg} style={{ fontSize: "0.68rem" }}>
            {t(status.label)}
          </Badge>
        </Stack>
      </Card.Header>

      <Card.Body className="py-2 px-3">
        <Card.Title
          className="mb-0 text-truncate"
          style={{ fontSize: "0.9rem" }}
          title={query.buyer.title}
        >
          {query.buyer.title}
        </Card.Title>
        <Card.Subtitle
          className="text-muted mb-2"
          style={{ fontSize: "0.75rem" }}
        >
          {query.buyer.city}
        </Card.Subtitle>

        {/* Pallet list */}
        <Stack gap={1} className="mb-2">
          {query.pallets.map((entry) => (
            <div
              key={entry.queryPalletId}
              className="d-flex justify-content-between align-items-center"
              style={{ fontSize: "0.78rem" }}
            >
              <span
                className="text-truncate me-2"
                style={{ maxWidth: "58%" }}
                title={`${t(entry.pallet.name)} (${t(entry.pallet.quality)})`}
              >
                {t(entry.pallet.name)}{" "}
                <span className="text-muted">({t(entry.pallet.quality)})</span>
              </span>
              <span className="text-muted text-nowrap">
                {entry.quantity}×{" "}
                {entry.quotedPrice > 0 && (
                  <span className="fw-semibold text-dark">
                    €{entry.quotedPrice.toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          ))}
        </Stack>

        {/* Sum */}
        {query.sum > 0 && (
          <div
            className="text-end fw-bold"
            style={{ fontSize: "0.88rem", borderTop: "1px solid #dee2e6", paddingTop: "0.35rem" }}
          >
            €{query.sum.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
          </div>
        )}
      </Card.Body>

      <Card.Footer
        className="d-flex justify-content-between align-items-center py-2"
        style={{ backgroundColor: closed ? "#e9ecef" : undefined }}
      >
        <small className={overdue ? "text-danger fw-semibold" : "text-muted"} style={{ fontSize: "0.75rem" }}>
          {overdue ? "⚠ " : ""}
          {t("deadline")}: {formatDate(query.deadline)}
        </small>
        <Button size="sm" variant={closed ? "outline-secondary" : "outline-primary"} style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem" }}>
          {t("view")}
        </Button>
      </Card.Footer>
    </Card>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const SellerHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [queries, setQueries] = useState<SellerQuery[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/seller/queries`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setQueries(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingQueries(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/seller/orders`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setOrders(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/v1/seller/orders/details`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setOrderDetails(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoadingOrderDetails(false);
      }
    };

    fetchQueries();
    fetchOrders();
    fetchOrderDetails();
  }, []);

  // Queries: active first, then closed — soonest deadline first within each group
  const sortedQueries = [...queries].sort((a, b) => {
    if (a.isClosed !== b.isClosed) return a.isClosed ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const openCount   = queries.filter((q) => !q.isClosed).length;
  const closedCount = queries.filter((q) =>  q.isClosed).length;

  // Orders: active statuses first, then completed/cancelled — newest createdAt first within each group
  const activeStatuses = new Set(["PENDING", "CONFIRMED", "SHIPPED"]);
  const sortedOrders = [...orders].sort((a, b) => {
    const aActive = activeStatuses.has(a.status);
    const bActive = activeStatuses.has(b.status);
    if (aActive !== bActive) return aActive ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeOrderCount   = orders.filter((o) => activeStatuses.has(o.status)).length;
  const inactiveOrderCount = orders.filter((o) => !activeStatuses.has(o.status)).length;

  return (
    <>
      <Breadcrumb className="p-3 mb-0">
        <BreadcrumbItem>Palletly</BreadcrumbItem>
        <BreadcrumbItem active>{t("dashboard")}</BreadcrumbItem>
      </Breadcrumb>

      <Container fluid className="px-4 pb-4">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {t("error_loading_queries")}: {error}
          </Alert>
        )}

        {/* ── Pallet breakdown pie chart ── */}
        <PalletPieChart
          orderDetails={orderDetails}
          orders={orders}
          queries={queries}
          loading={loadingOrderDetails || loadingOrders || loadingQueries}
        />

        <div className="border rounded p-3">
          {/* Header */}
          <Row className="align-items-center mb-3">
            <Col>
              <h5 className="mb-0 fw-semibold">{t("request_for_quotes")}</h5>
              {!loadingQueries && (
                <small className="text-muted">
                  {openCount} {t("open")}
                  {closedCount > 0 && ` · ${closedCount} ${t("closed")}`}
                </small>
              )}
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/seller/queries")}
              >
                {t("view_all")}
              </Button>
            </Col>
          </Row>

          {/* Scrollable card strip – always 4 cards visible, scroll if more */}
          {loadingQueries ? (
            <div className="text-center py-5">
              <Spinner animation="border" size="sm" />
            </div>
          ) : sortedQueries.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">
              {t("no_queries")}
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
              }}
            >
              {sortedQueries.map((q, idx) => {
                const prevOpen = idx > 0 && !sortedQueries[idx - 1].isClosed;
                const thisClosed = q.isClosed;
                return (
                  <div
                    key={q.queryId}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexBasis: "calc(25% - 0.5625rem)",
                      flexShrink: 0,
                      flexGrow: 0,
                    }}
                  >
                    {prevOpen && thisClosed && (
                      <div
                        style={{
                          width: "1px",
                          alignSelf: "stretch",
                          background: "#dee2e6",
                          marginRight: "0.25rem",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <QueryCard
                        query={q}
                        onClick={() => navigate(`/seller/queries/${q.queryId}`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          {!loadingQueries && sortedQueries.length > 0 && (
            <div className="d-flex gap-3 mt-2" style={{ fontSize: "0.75rem", color: "#6c757d" }}>
              <span>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#0d6efd", marginRight: 4 }} />
                {t("active")}
              </span>
              <span>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, backgroundColor: "#adb5bd", marginRight: 4 }} />
                {t("closed")}
              </span>
            </div>
          )}
        </div>

        {/* ── Orders ── */}
        <div className="border rounded p-3 mt-4">
          <Row className="align-items-center mb-3">
            <Col>
              <h5 className="mb-0 fw-semibold">{t("orders")}</h5>
              {!loadingOrders && (
                <small className="text-muted">
                  {activeOrderCount} {t("active")}
                  {inactiveOrderCount > 0 && ` · ${inactiveOrderCount} ${t("closed")}`}
                </small>
              )}
            </Col>
            <Col className="d-flex justify-content-end">
              <Button variant="link" size="sm" onClick={() => navigate("/seller/orders")}>
                {t("view_all")}
              </Button>
            </Col>
          </Row>

          {loadingOrders ? (
            <div className="text-center py-5">
              <Spinner animation="border" size="sm" />
            </div>
          ) : sortedOrders.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">{t("no_orders")}</p>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                overflowX: "auto",
                paddingBottom: "0.5rem",
              }}
            >
              {sortedOrders.map((o, idx) => {
                const prevActive = idx > 0 && activeStatuses.has(sortedOrders[idx - 1].status);
                const thisInactive = !activeStatuses.has(o.status);
                return (
                  <div
                    key={o.id}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexBasis: "calc(25% - 0.5625rem)",
                      flexShrink: 0,
                      flexGrow: 0,
                    }}
                  >
                    {prevActive && thisInactive && (
                      <div
                        style={{
                          width: "1px",
                          alignSelf: "stretch",
                          background: "#dee2e6",
                          marginRight: "0.25rem",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <OrderCard
                        order={o}
                        onClick={() => navigate(`/seller/orders/${o.id}`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Order status legend */}
          {!loadingOrders && sortedOrders.length > 0 && (
            <div className="d-flex gap-3 mt-2" style={{ fontSize: "0.75rem", color: "#6c757d" }}>
              {(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((s) => (
                <span key={s}>
                  <span style={{
                    display: "inline-block", width: 10, height: 10, borderRadius: 2,
                    backgroundColor: ORDER_STATUS_STYLE[s].leftBorder, marginRight: 4,
                  }} />
                  {t(s.toLowerCase())}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default SellerHome;