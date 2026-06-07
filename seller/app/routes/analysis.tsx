import { useState, useEffect, useRef } from "react";
import {
  Breadcrumb, BreadcrumbItem, Container, Row, Col,
  Card, Spinner, Alert, Form,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as Chart from "chart.js";

const API_URL = import.meta.env.VITE_API_URL;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pallet {
  id: number;
  name: string;
  quality: string;
}

interface Buyer {
  id: number;
  title: string;
  city: string;
}

interface OrderItem {
  pallet: Pallet;
  quantity: number;
  pricePerItem: number;
}

interface OrderDetail {
  id: number;
  buyer: Buyer;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryDate: string | null;
}

interface SellerQuery {
  queryId: number;
  deadline: string;
  isClosed: boolean;
  buyer: Buyer;
  accepted: boolean;
  rejected: boolean;
}

// ── Chart.js registration ─────────────────────────────────────────────────────

Chart.Chart.register(
  Chart.PieController,
  Chart.DoughnutController,
  Chart.BarController,
  Chart.LineController,
  Chart.ArcElement,
  Chart.BarElement,
  Chart.LineElement,
  Chart.PointElement,
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.Tooltip,
  Chart.Legend,
  Chart.Filler,
);

// ── Colour palette ─────────────────────────────────────────────────────────────

const PALETTE = [
  "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f",
  "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type Range = "3" | "6" | "12";

function getCutoff(months: Range): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - Number(months));
  return d;
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(key: string): string {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString(undefined, {
    month: "short", year: "2-digit",
  });
}

function fmt(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Reusable canvas chart hook ────────────────────────────────────────────────

function useChart(
  build: (canvas: HTMLCanvasElement) => Chart.Chart,
  deps: unknown[],
) {
  const ref  = useRef<HTMLCanvasElement>(null);
  const inst = useRef<Chart.Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    inst.current?.destroy();
    inst.current = build(ref.current);
    return () => { inst.current?.destroy(); inst.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

const KpiCard = ({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color: string }) => (
  <Card className="h-100 border-0 shadow-sm">
    <Card.Body className="p-3">
      <div className="text-muted mb-1" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div className="fw-bold" style={{ fontSize: "2rem", lineHeight: 1, color }}>
        {value}
      </div>
      {sub && <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>{sub}</div>}
    </Card.Body>
    <div style={{ height: 3, background: color, borderRadius: "0 0 4px 4px" }} />
  </Card>
);

// ── Pallet Revenue & Units Pie Charts ────────────────────────────────────────

const PalletPieCharts = ({ orders, range }: { orders: OrderDetail[]; range: Range }) => {
  const cutoff = getCutoff(range);
  const filtered = orders.filter(
    (o) => new Date(o.createdAt) >= cutoff && o.status !== "CANCELLED"
  );

  const revenueByPallet: Record<string, number> = {};
  const volumeByPallet:  Record<string, number> = {};

  filtered.forEach((o) =>
    o.items.forEach((item) => {
      const name = item.pallet.name;
      revenueByPallet[name] = (revenueByPallet[name] ?? 0) + item.pricePerItem * item.quantity;
      volumeByPallet[name]  = (volumeByPallet[name]  ?? 0) + item.quantity;
    })
  );

  const labels = Object.keys(revenueByPallet).sort(
    (a, b) => revenueByPallet[b] - revenueByPallet[a]
  );
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  const revCanvasRef = useChart((canvas) => new Chart.Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: labels.map((l) => revenueByPallet[l]), backgroundColor: colors, borderWidth: 2, borderColor: "#fff" }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 11, font: { size: 10 }, padding: 10 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` €${fmt(ctx.parsed)} (${pct}%)`;
            },
          },
        },
      },
    },
  }), [orders, range]);

  const volCanvasRef = useChart((canvas) => new Chart.Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: labels.map((l) => volumeByPallet[l]), backgroundColor: colors, borderWidth: 2, borderColor: "#fff" }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 11, font: { size: 10 }, padding: 10 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ` ${ctx.parsed.toLocaleString()} units (${pct}%)`;
            },
          },
        },
      },
    },
  }), [orders, range]);

  if (labels.length === 0) {
    return (
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body>
          <div className="fw-semibold mb-3" style={{ fontSize: "0.9rem" }}>Revenue vs Units by Pallet Type</div>
          <p className="text-muted text-center py-4 mb-0" style={{ fontSize: "0.85rem" }}>No data for this period</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="fw-semibold mb-3" style={{ fontSize: "0.9rem" }}>Revenue vs Units by Pallet Type</div>
        <Row className="g-2">
          <Col xs={6}>
            <div className="text-center text-muted mb-1" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>
              Revenue
            </div>
            <div style={{ height: 220 }}><canvas ref={revCanvasRef} /></div>
          </Col>
          <Col xs={6}>
            <div className="text-center text-muted mb-1" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>
              Units Sold
            </div>
            <div style={{ height: 220 }}><canvas ref={volCanvasRef} /></div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

// ── Monthly Requests & Orders Bar Chart ──────────────────────────────────────

const MonthlyActivityChart = ({
  orders, queries, range,
}: {
  orders:  OrderDetail[];
  queries: SellerQuery[];
  range:   Range;
}) => {
  // Build a complete month grid for the range (no gaps even if no data)
  const monthCount = Number(range);
  const months: string[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push(monthKey(d.toISOString()));
  }

  const ordersByMonth:  Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));
  const queriesByMonth: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]));

  const cutoff = getCutoff(range);

  orders
    .filter((o) => new Date(o.createdAt) >= cutoff)
    .forEach((o) => {
      const m = monthKey(o.createdAt);
      if (m in ordersByMonth) ordersByMonth[m]++;
    });

  queries
    .filter((q) => new Date(q.deadline) >= cutoff)
    .forEach((q) => {
      const m = monthKey(q.deadline);
      if (m in queriesByMonth) queriesByMonth[m]++;
    });

  const canvasRef = useChart((canvas) => new Chart.Chart(canvas, {
    type: "bar",
    data: {
      labels: months.map((m) => {
        const [y, mo] = m.split("-");
        return new Date(Number(y), Number(mo) - 1).toLocaleDateString(undefined, { month: "short" });
      }),
      datasets: [
        {
          label: "Requests (RFQ)",
          data: months.map((m) => queriesByMonth[m]),
          backgroundColor: "rgba(78,121,167,0.8)",
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: "Orders",
          data: months.map((m) => ordersByMonth[m]),
          backgroundColor: "rgba(89,161,79,0.8)",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: { boxWidth: 12, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} ${ctx.dataset.label}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0 },
          grid: { color: "#f0f0f0" },
        },
      },
    },
  }), [orders, queries, range]);

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="fw-semibold mb-3" style={{ fontSize: "0.9rem" }}>
          Monthly Requests & Orders
        </div>
        <div style={{ height: 260 }}>
          <canvas ref={canvasRef} />
        </div>
      </Card.Body>
    </Card>
  );
};

// ── Top Buyers Bar Chart ──────────────────────────────────────────────────────

const TopBuyersChart = ({ orders, range }: { orders: OrderDetail[]; range: Range }) => {
  const cutoff = getCutoff(range);
  const filtered = orders.filter(
    (o) => new Date(o.createdAt) >= cutoff && o.status !== "CANCELLED"
  );

  const revenueByBuyer: Record<string, number> = {};
  filtered.forEach((o) => {
    revenueByBuyer[o.buyer.title] = (revenueByBuyer[o.buyer.title] ?? 0) + o.totalPrice;
  });

  const sorted = Object.entries(revenueByBuyer)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const canvasRef = useChart((canvas) => new Chart.Chart(canvas, {
    type: "bar",
    data: {
      labels: sorted.map(([k]) => k),
      datasets: [{
        label: "Revenue (€)",
        data: sorted.map(([, v]) => v),
        backgroundColor: sorted.map((_, i) => PALETTE[i % PALETTE.length]),
        borderRadius: 4,
      }],
    },
    options: {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ` €${fmt(ctx.parsed.x)}` } },
      },
      scales: {
        x: { ticks: { callback: (v) => `€${(v as number / 1000).toFixed(1)}k` }, grid: { color: "#f0f0f0" } },
        y: { ticks: { font: { size: 11 } } },
      },
    },
  }), [orders, range]);

  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="fw-semibold mb-3" style={{ fontSize: "0.9rem" }}>Top Buyers by Revenue</div>
        {sorted.length === 0
          ? <p className="text-muted text-center py-4 mb-0" style={{ fontSize: "0.85rem" }}>No data for this period</p>
          : <div style={{ height: Math.max(180, sorted.length * 36) }}><canvas ref={canvasRef} /></div>
        }
      </Card.Body>
    </Card>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalysisPage() {
  const { t } = useTranslation();

  const [orders,  setOrders]  = useState<OrderDetail[]>([]);
  const [queries, setQueries] = useState<SellerQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [range,   setRange]   = useState<Range>("6");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${API_URL}/v1/seller/orders/details`, { credentials: "include" });
      if (!res.ok) throw new Error(`Orders: HTTP ${res.status}`);
      setOrders(await res.json());
    };
    const fetchQueries = async () => {
      const res = await fetch(`${API_URL}/v1/seller/queries`, { credentials: "include" });
      if (!res.ok) throw new Error(`Queries: HTTP ${res.status}`);
      setQueries(await res.json());
    };

    Promise.all([fetchOrders(), fetchQueries()])
      .catch((err) => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  // ── KPI derivations ──
  const cutoff = getCutoff(range);
  const inRange = orders.filter(
    (o) => new Date(o.createdAt) >= cutoff && o.status !== "CANCELLED"
  );

  const totalRevenue  = inRange.reduce((s, o) => s + o.totalPrice, 0);
  const totalOrders   = inRange.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalUnits    = inRange.reduce(
    (s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0
  );

  const RANGE_OPTIONS: { value: Range; label: string }[] = [
    { value: "3",  label: "Last 3 months" },
    { value: "6",  label: "Last 6 months" },
    { value: "12", label: "Last 12 months" },
  ];

  return (
    <>
      <Breadcrumb className="p-3 mb-0">
        <BreadcrumbItem>Palletly</BreadcrumbItem>
        <BreadcrumbItem active>Analysis</BreadcrumbItem>
      </Breadcrumb>

      <Container fluid className="px-4 pb-5">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            Failed to load data: {error}
          </Alert>
        )}

        {/* ── Page header + range selector ── */}
        <Row className="align-items-center mb-4">
          <Col>
            <h4 className="mb-0 fw-semibold">Business Overview</h4>
            <small className="text-muted">Based on your fulfilled and active orders</small>
          </Col>
          <Col xs="auto">
            <Form.Select
              size="sm"
              value={range}
              onChange={(e) => setRange(e.target.value as Range)}
              style={{ fontSize: "0.82rem" }}
            >
              {RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* ── KPI Row ── */}
            <Row xs={2} md={4} className="g-3 mb-4">
              <Col>
                <KpiCard label="Total Revenue"    value={`€${fmt(totalRevenue)}`}          color="#4e79a7" />
              </Col>
              <Col>
                <KpiCard label="Orders"           value={totalOrders}  sub="excl. cancelled" color="#59a14f" />
              </Col>
              <Col>
                <KpiCard label="Avg Order Value"  value={`€${fmt(avgOrderValue)}`}          color="#b07aa1" />
              </Col>
              <Col>
                <KpiCard label="Units Sold"       value={totalUnits.toLocaleString()}       color="#f28e2b" />
              </Col>
            </Row>

            {/* ── Monthly Requests & Orders ── */}
            <Row className="g-3 mb-3">
              <Col xs={12}>
                <MonthlyActivityChart orders={orders} queries={queries} range={range} />
              </Col>
            </Row>

            {/* ── Pallet pies + top buyers ── */}
            <Row className="g-3">
              <Col md={8}>
                <PalletPieCharts orders={orders} range={range} />
              </Col>
              <Col md={4}>
                <TopBuyersChart orders={orders} range={range} />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}