import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Spinner,
  Alert,
  Badge,
  Button,
  Form,
  Table,
  Image,
  FloatingLabel,
  Row,
  Col,
  Container,
  Card,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router";
import { Cancel, Check, Help, ArrowBack } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Query, QueryItem } from "~/type";

const API_URL = import.meta.env.VITE_API_URL;

export default function QueryDetailPage() {
  const { t } = useTranslation();
  const { queryId } = useParams<{ queryId: string }>();
  const navigate    = useNavigate();

  const [query,   setQuery]   = useState<Query | null>(null);
  const [quotes,  setQuotes]  = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/v1/seller/queries`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const all: Query[] = await res.json();
        const found = all.find((q) => String(q.queryId) === queryId);
        if (!found) throw new Error("Query not found");
        setQuery(found);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [queryId]);

  function handleQuoteChange(palletId: number, value: string) {
    setQuotes((prev) => ({ ...prev, [palletId]: value }));
  }

  function getTotalPrice(): number {
    if (!query) return 0;
    return query.pallets?.reduce((sum, item) => {
      const price = Number(quotes[item.pallet.id] ?? "0");
      return sum + item.quantity * price;
    }, 0) ?? 0;
  }

  async function handleSubmitQuote() {
    if (!query) return;
    setSubmitting(true);
    const payload = {
      quotes: Object.entries(quotes).map(([palletId, price]) => ({
        palletId,
        price,
      })),
    };
    try {
      const res = await fetch(`${API_URL}/v1/query/${query.queryId}/quotes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Quote failed: ${res.status}`);
      setSubmitSuccess(true);
      // Refresh query data to reflect new quotedPrice values
      const refreshRes = await fetch(`${API_URL}/v1/seller/queries`, {
        credentials: "include",
      });
      if (refreshRes.ok) {
        const all: Query[] = await refreshRes.json();
        const updated = all.find((q) => String(q.queryId) === queryId);
        if (updated) setQuery(updated);
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to submit quote");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleIgnore() {
    if (!query) return;
    if (!window.confirm(t("confirm_ignore_request"))) return;
    try {
      const res = await fetch(
        `${API_URL}/v1/query/${query.queryId}/ignore`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error(`Ignore failed: ${res.status}`);
      navigate("/queries");
    } catch (err: any) {
      setError(err.message ?? "Failed to ignore request");
    }
  }

  // ── Loading / error ──
  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;
  if (error)   return <div className="p-4"><Alert variant="danger">{error}</Alert></div>;
  if (!query)  return null;

  const statusIcon = query.accepted
    ? <Check color="success" />
    : query.rejected
    ? <Cancel color="error" />
    : <Help color="warning" />;

  const allQuoted = query.pallets?.every(
    (item) => item.quotedPrice !== null && item.quotedPrice !== undefined
  );

  const hasUnsavedQuotes = Object.keys(quotes).length > 0;

  return (
    <Container fluid className="px-4 pb-5">
      <Breadcrumb className="pt-3 pb-2">
        <Breadcrumb.Item href="/">{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate("/queries")} style={{ cursor: "pointer" }}>
          {t("request_for_quote")}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>#{query.queryId}</Breadcrumb.Item>
      </Breadcrumb>

      {/* ── Page header ── */}
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <Button
            variant="link"
            className="p-0 text-muted"
            onClick={() => navigate("/queries")}
          >
            <ArrowBack fontSize="small" />
          </Button>
        </Col>
        <Col>
          <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
            {statusIcon}
            {query.buyer?.title ?? t("unknown_buyer")}
          </h5>
          <small className="text-muted">
            {query.buyer?.postalCode} {query.buyer?.city}
            {query.buyer?.homepage && (
              <> · <a href={query.buyer.homepage} target="_blank" rel="noreferrer">{query.buyer.homepage}</a></>
            )}
          </small>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          {query.buyer?.verified && (
            <Badge bg="success">{t("verified_customer")}</Badge>
          )}
          {query.deliveryRequest && (
            <Badge bg="warning" text="dark">{t("delivery_requested")}</Badge>
          )}
          {query.isClosed && (
            <Badge bg="secondary">{t("closed")}</Badge>
          )}
        </Col>
      </Row>

      {submitSuccess && (
        <Alert variant="success" onClose={() => setSubmitSuccess(false)} dismissible>
          {t("quote_submitted_success")}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {/* ── Quote form ── */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-0">
          <Form onSubmit={(e) => { e.preventDefault(); handleSubmitQuote(); }}>
            <Table bordered className="mb-0" responsive>
              <thead className="table-light">
                <tr>
                  <th style={{ width: 80 }}></th>
                  <th>{t("pallet")}</th>
                  <th className="text-center">{t("quality")}</th>
                  <th className="text-center">{t("quantity")}</th>
                  <th className="text-center" style={{ width: 180 }}>{t("price_per_unit")}</th>
                  <th className="text-end">{t("line_total")}</th>
                </tr>
              </thead>

              <tbody>
                {query.pallets?.map((item: QueryItem) => {
                  const unitPrice = item.quotedPrice !== null && item.quotedPrice !== undefined
                    ? item.quotedPrice
                    : Number(quotes[item.pallet.id] ?? 0);
                  const lineTotal = item.quantity * unitPrice;

                  return (
                    <tr key={item.queryPalletId}>
                      <td>
                        <Image
                          src={item.pallet?.url}
                          alt={item.pallet?.name}
                          thumbnail
                          style={{ width: 56, height: 56, objectFit: "contain" }}
                        />
                      </td>
                      <td className="align-middle fw-semibold" style={{ fontSize: "0.88rem" }}>
                        {t(item.pallet?.name) ?? "Unknown"}
                      </td>
                      <td className="text-center align-middle">
                        <Badge bg="light" text="dark" className="border">
                          {t(item.pallet?.quality) ?? "N/A"}
                        </Badge>
                      </td>
                      <td className="text-center align-middle">{item.quantity}</td>
                      <td className="align-middle">
                        {item.quotedPrice !== null && item.quotedPrice !== undefined ? (
                          <span className="fw-semibold">€{item.quotedPrice.toFixed(2)}</span>
                        ) : (
                          <Form.Control
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            size="sm"
                            value={quotes[item.pallet.id] ?? ""}
                            onChange={(e) => handleQuoteChange(item.pallet.id, e.target.value)}
                            placeholder="0.00"
                            disabled={query.isClosed}
                          />
                        )}
                      </td>
                      <td className="text-end align-middle" style={{ fontSize: "0.88rem" }}>
                        {lineTotal > 0 ? `€${lineTotal.toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "—"}
                      </td>
                    </tr>
                  );
                })}

                {/* Total row */}
                <tr className="table-light fw-bold">
                  <td colSpan={5} className="text-end">{t("total_price")}</td>
                  <td className="text-end">
                    {(() => {
                      const total = allQuoted ? query.sum : getTotalPrice();
                      return total > 0
                        ? `€${total.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`
                        : "—";
                    })()}
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* ── Footer ── */}
            <div className="p-3">
              <Row className="align-items-center g-3">
                <Col xs={12} md={4}>
                  <FloatingLabel label={t("deadline")}>
                    <Form.Control
                      readOnly
                      value={new Date(query.deadline).toLocaleDateString()}
                    />
                  </FloatingLabel>
                </Col>

                <Col xs={12} md={8}>
                  {query.isClosed ? (
                    <Alert variant="danger" className="mb-0 py-2">
                      {t("rfq_closed_message")}
                    </Alert>
                  ) : query.accepted ? (
                    <Alert variant="success" className="mb-0 py-2">
                      {t("quote_accepted_message")}
                    </Alert>
                  ) : query.rejected ? (
                    <Alert variant="danger" className="mb-0 py-2">
                      {t("quote_rejected_message")}
                    </Alert>
                  ) : allQuoted && !hasUnsavedQuotes ? (
                    <Alert variant="warning" className="mb-0 py-2">
                      {t("quote_pending_buyer_message")}
                    </Alert>
                  ) : (
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="outline-danger"
                        onClick={handleIgnore}
                        disabled={submitting}
                      >
                        {t("ignore_request")}
                      </Button>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting
                          ? <><Spinner size="sm" animation="border" className="me-1" />{t("submitting")}</>
                          : t("submit_quote")}
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}