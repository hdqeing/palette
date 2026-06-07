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
import { Cancel, Check, Help } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Query } from "~/type";

const API_URL = import.meta.env.VITE_API_URL;

type Filter = "all" | "open" | "closed";

export default function QueriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [queries,  setQueries]  = useState<Query[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState<Filter>("all");
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/v1/seller/queries`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setQueries(await res.json());
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = queries
    .filter((q) => {
      if (filter === "open")   return !q.isClosed;
      if (filter === "closed") return  q.isClosed;
      return true;
    })
    .filter((q) =>
      search.trim() === "" ||
      q.buyer?.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.buyer?.city?.toLowerCase().includes(search.toLowerCase())
    );

  const openCount   = queries.filter((q) => !q.isClosed).length;
  const closedCount = queries.filter((q) =>  q.isClosed).length;

  return (
    <Container fluid className="px-4 pb-4">
      <Breadcrumb className="pt-3 pb-2">
        <Breadcrumb.Item href="/">{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("request_for_quote")}</Breadcrumb.Item>
      </Breadcrumb>

      {/* ── Toolbar ── */}
      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} md={5}>
          <Form.Control
            size="sm"
            placeholder={t("search_by_buyer")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs="auto" className="ms-md-auto">
          <div className="d-flex gap-2">
            {(["all", "open", "closed"] as Filter[]).map((f) => (
              <Badge
                key={f}
                role="button"
                bg={filter === f ? "primary" : "secondary"}
                style={{ cursor: "pointer", fontSize: "0.78rem", padding: "0.4em 0.75em" }}
                onClick={() => setFilter(f)}
              >
                {f === "all"    && `${t("all")} (${queries.length})`}
                {f === "open"   && `${t("open")} (${openCount})`}
                {f === "closed" && `${t("closed")} (${closedCount})`}
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
          {t("no_queries")}
        </Alert>
      )}

      {!loading && !error && filtered.length > 0 && (
        <ListGroup variant="flush" className="border rounded">
          {filtered.map((query) => {
            const statusIcon = query.accepted
              ? <Check fontSize="small" color="success" />
              : query.rejected
              ? <Cancel fontSize="small" color="error" />
              : <Help fontSize="small" color="warning" />;

            const palletSummary = query.pallets
              ?.map((p) => `${p.quantity}× ${t(p.pallet.name)}`)
              .join(", ") ?? "";

            return (
              <ListGroup.Item
                key={query.queryId}
                action
                onClick={() => navigate(`/queries/${query.queryId}`)}
                className="py-3 px-3"
                style={{ cursor: "pointer" }}
              >
                <Row className="align-items-center g-2">

                  {/* Icon */}
                  <Col xs="auto">{statusIcon}</Col>

                  {/* Buyer info */}
                  <Col xs={12} md={4}>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      {query.buyer?.title ?? t("unknown_buyer")}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                      {query.buyer?.postalCode} {query.buyer?.city}
                    </div>
                  </Col>

                  {/* Pallet summary */}
                  <Col xs={12} md={4}>
                    <div
                      className="text-muted text-truncate"
                      style={{ fontSize: "0.78rem" }}
                      title={palletSummary}
                    >
                      {palletSummary}
                    </div>
                  </Col>

                  {/* Badges + deadline */}
                  <Col xs={12} md="auto" className="ms-md-auto d-flex gap-2 align-items-center flex-wrap">
                    {query.buyer?.verified && (
                      <Badge bg="success" style={{ fontSize: "0.68rem" }}>
                        {t("verified_customer")}
                      </Badge>
                    )}
                    {query.deliveryRequest && (
                      <Badge bg="warning" text="dark" style={{ fontSize: "0.68rem" }}>
                        {t("delivery_requested")}
                      </Badge>
                    )}
                    {query.sum > 0 && (
                      <Badge bg="info" text="dark" style={{ fontSize: "0.68rem" }}>
                        €{query.sum.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                      </Badge>
                    )}
                    {query.isClosed && (
                      <Badge bg="secondary" style={{ fontSize: "0.68rem" }}>
                        {t("closed")}
                      </Badge>
                    )}
                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {new Date(query.deadline).toLocaleDateString()}
                    </span>
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